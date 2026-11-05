"""Extract original image bytes where possible, and link only explicit locations."""
import hashlib,io,json,mimetypes,os,posixpath,re,shutil,subprocess,tempfile,zipfile
from pathlib import Path
from xml.etree import ElementTree as E
from PIL import Image
from sqlalchemy import select
from ...db import Session
from ...models import FileAsset,new_id
from ...storage import asset_path
from ...auth import Problem
from .models import HistoryDocument,HistoryImport,HistoryFinding,HistoryEvidence
from .media_models import HistoryImage,HistoryImageOccurrence,HistoryImageLink,HistoryMediaRun
from .service import document_in,digest,lock
from .engine import hash_json

MEDIA_VERSION='report-images-20261102-v3'
W='{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
A='{http://schemas.openxmlformats.org/drawingml/2006/main}'
R='{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
V='{urn:schemas-microsoft-com:vml}'

def package_images(path,issues):
    with zipfile.ZipFile(path) as z:
        names=set(z.namelist())
        parts=[n for n in names if n=='word/document.xml' or re.fullmatch(r'word/(header|footer)\d+\.xml',n) or re.fullmatch(r'ppt/slides/slide\d+\.xml',n) or re.fullmatch(r'xl/drawings/drawing\d+\.xml',n)]
        for part in sorted(parts):
            root=E.fromstring(z.read(part));parents={child:node for node in root.iter() for child in node}
            folder=posixpath.dirname(part);relpart=folder+'/_rels/'+posixpath.basename(part)+'.rels'
            if relpart not in names:continue
            relationships={n.attrib['Id']:n.attrib for n in E.fromstring(z.read(relpart))}
            tables={id(t):i for i,t in enumerate(root.iter(W+'tbl'),1)}
            nodes=[n for n in root.iter() if n.tag in (A+'blip',V+'imagedata')]
            for n,node in enumerate(nodes,1):
                title='{urn:schemas-microsoft-com:office:office}title'
                if node.tag==V+'imagedata' and set(node.attrib)<={title} and not node.attrib.get(title,'') and not len(node) and not (node.text or '').strip():
                    # Empty VML layout placeholder: there is no image reference to retrieve.
                    continue
                rid=node.attrib.get(R+'embed') or node.attrib.get(R+'id')
                if not rid:
                    # Some Office drawings contain only the SVG extension, with
                    # no raster fallback on the parent a:blip.
                    svg=node.find('.//{http://schemas.microsoft.com/office/drawing/2016/SVG/main}svgBlip')
                    if svg is not None:rid=svg.attrib.get(R+'embed')
                rel=relationships.get(rid,{})
                if not rel or rel.get('TargetMode')=='External':
                    issues.append({'code':'EXTERNAL_OR_MISSING_IMAGE','part':part,'relationship_id':rid});continue
                target=rel.get('Target','');member=target.lstrip('/') if target.startswith('/') else posixpath.normpath(folder+'/'+target)
                if member not in names:
                    issues.append({'code':'IMAGE_PART_MISSING','part':part,'member':member});continue
                locator={'part':part,'embedded_part':member,'relationship_id':rid,'image_ordinal':n}
                ancestors=[];p=node
                while p in parents:p=parents[p];ancestors.append(p)
                cell=next((p for p in ancestors if p.tag==W+'tc'),None)
                row=next((p for p in ancestors if p.tag==W+'tr'),None)
                table=next((p for p in ancestors if p.tag==W+'tbl'),None)
                if cell is not None and row is not None and table is not None:
                    locator.update(table=tables[id(table)],row=list(table.findall(W+'tr')).index(row)+1,cell=list(row.findall(W+'tc')).index(cell)+1)
                if part.startswith('ppt/'):
                    locator['slide']=int(re.search(r'slide(\d+)',part)[1])
                floating=any(p.tag.endswith('}anchor') for p in ancestors)
                locator['floating_anchor']=floating
                try:data=z.read(member)
                except (zipfile.BadZipFile,RuntimeError,OSError) as exc:
                    issues.append({'code':'IMAGE_BYTES_UNREADABLE','locator':locator,'error':type(exc).__name__,'reason':str(exc)[:200]})
                    continue
                yield {'data':data,'suffix':Path(member).suffix.lower(),'locator':locator,
                    'method':'package_original_bytes','kind':'embedded_image','allow_row_link':not floating and part=='word/document.xml'}

def pdf_images(path,issues):
    from pypdf import PdfReader
    from .pdf_compat import open_pdf_layout
    reader=PdfReader(str(path))
    with open_pdf_layout(path) as layout:
        for pi,page in enumerate(reader.pages,1):
            lp=None
            try:
                try:
                    lp=layout.pages[pi-1];boxes=lp.images;page_area=lp.width*lp.height
                except Exception as exc:
                    boxes=[];page_area=0
                    issues.append({'code':'PDF_IMAGE_LAYOUT_UNAVAILABLE','physical_page':pi,'error':type(exc).__name__,
                        'reason':'图片可提取，但版式读取器未提供可靠页框；仅挂接报告，不匹配问题行。'})
                for key in page.images.keys():
                    try:
                        img=page.images[key];name=(key[-1] if isinstance(key,(list,tuple)) else key).lstrip('/')
                        positions=[b for b in boxes if b.get('name','').lstrip('/')==name]
                        # Duplicate short names inside different Form XObjects are not a reliable positional match.
                        if isinstance(key,(list,tuple)) and len(key)>1 and len(positions)>1:positions=[]
                        for position in positions or [None]:
                            loc={'physical_page':pi,'image_object':key,'units':'pt','origin':'top_left'}
                            kind='embedded_image'
                            if position:
                                box=[position['x0'],position['top'],position['x1'],position['bottom']];loc['bbox']=box
                                if (box[2]-box[0])*(box[3]-box[1])>=.7*page_area:kind='page_image'
                            yield {'data':img.data,'suffix':Path(img.name).suffix.lower(),'locator':loc,
                                'method':'pdf_embedded_decode','kind':kind,'allow_row_link':kind!='page_image' and position is not None}
                    except Exception as exc:issues.append({'code':'PDF_IMAGE_FAILED','physical_page':pi,'image_object':str(key),'error':type(exc).__name__})
            except Exception as exc:issues.append({'code':'PDF_PAGE_IMAGES_FAILED','physical_page':pi,'error':type(exc).__name__})
            finally:
                if lp is not None:lp.close()

def images_from(path,suffix,issues):
    if suffix in ('.docx','.pptx','.xlsx'):yield from package_images(path,issues)
    elif suffix=='.pdf':yield from pdf_images(path,issues)
    elif suffix in ('.doc','.wps','.xls'):
        wrapper=Path('D:/脚本/脚本/Convert-LibreOfficeIsolated.ps1');fmt='xlsx' if suffix=='.xls' else 'docx'
        with tempfile.TemporaryDirectory(prefix='history-images-') as temp:
            output=Path(temp)/'converted';output.mkdir()
            if wrapper.exists():cmd=['powershell.exe','-NoProfile','-ExecutionPolicy','Bypass','-File',str(wrapper),'-SourcePath',str(path),'-OutputDir',str(output),'-ConvertTo',fmt,'-TimeoutSeconds','120']
            else:
                exe=shutil.which('libreoffice') or shutil.which('soffice')
                if not exe:issues.append({'code':'IMAGE_CONVERTER_UNAVAILABLE'});return
                cmd=[exe,'-env:UserInstallation='+(Path(temp)/'profile').as_uri(),'--headless','--convert-to',fmt,'--outdir',str(output),str(path)]
            try:
                process=subprocess.run(cmd,capture_output=True,timeout=150);converted=list(output.glob('*.'+fmt))
                if process.returncode or len(converted)!=1:issues.append({'code':'IMAGE_CONVERSION_FAILED'});return
                for image in package_images(converted[0],issues):
                    image['locator']['locator_space']='converted_'+fmt;image['method']='converted_package_image'
                    yield image
            except subprocess.TimeoutExpired:issues.append({'code':'IMAGE_CONVERSION_TIMEOUT'})

def problem_cell_evidence(db,records):
    """Use original problem cells, not row boxes enlarged by merged metadata."""
    ids=[r.id for r in records]
    result={}
    if not ids:return result
    rows=db.scalars(select(HistoryEvidence).where(HistoryEvidence.finding_id.in_(ids),
        HistoryEvidence.field_key=='problem_description',HistoryEvidence.source_kind=='report'))
    by_id={r.id:r for r in records}
    for evidence in rows:
        loc=evidence.locator;record=by_id[evidence.finding_id];base=record.locator
        if (loc.get('kind')=='pdf_cell' and len(loc.get('bbox',[]))==4
                and all(loc.get(k)==base.get(k) for k in ('physical_page','table','row','locator_space'))):
            if loc not in result.setdefault(evidence.finding_id,[]):result[evidence.finding_id].append(loc)
    return result


def relation(image,record,problem_cells=None):
    a=image['locator'];b=record.locator
    if not image.get('allow_row_link'):return None
    if a.get('association')=='unlinked' or a.get('kind')=='reviewed_unlinked_region':return None
    if a.get('kind')=='consolidated_photo_region':return None
    if a.get('kind')=='reviewed_photo_region':
        explicit_association=a.get('association_method') in ('confirmed_numbered_attachment','confirmed_continuous_row') and a.get('association_evidence')
        if (a.get('review_method')=='assistant_visual_readback' and (a.get('source_problem_evidence') or explicit_association)
                and a.get('reviewed_finding_source_key')==getattr(record,'source_key',None)):
            return 'reviewed_same_problem_photo'
        return None
    if a.get('locator_space')!=b.get('locator_space'):return None
    if a.get('part')=='word/document.xml' and a.get('table')==b.get('table') and a.get('row')==b.get('row'):
        return 'same_table_row'
    if a.get('physical_page') and a.get('physical_page')==b.get('physical_page') and a.get('bbox') and b.get('bbox'):
        x=a['bbox'];y=b['bbox'];area=max(0,x[2]-x[0])*max(0,x[3]-x[1])
        if problem_cells:
            # Image and description occupy different columns. Keep the original
            # table row's horizontal extent but the actual description cell's
            # vertical extent. Ambiguous candidates remain unresolved upstream.
            for cell in problem_cells:
                cb=cell['bbox'];bounded=[y[0],cb[1],y[2],cb[3]]
                overlap=max(0,min(x[2],bounded[2])-max(x[0],bounded[0]))*max(0,min(x[3],bounded[3])-max(x[1],bounded[1]))
                if area>0 and overlap/area>=.8:return 'same_pdf_problem_cell_row'
            return None
        overlap=max(0,min(x[2],y[2])-max(x[0],y[0]))*max(0,min(x[3],y[3])-max(x[1],y[1]))
        if area>0 and overlap/area>=.8:return 'same_pdf_table_row'
    return None

def extract_document_images(ident,actor):
    with Session.begin() as db:
        doc=document_in(db,ident,actor,'knowledge.process');lock(db,'media:'+ident)
        run=db.scalar(select(HistoryImport).where(HistoryImport.document_id==ident).order_by(HistoryImport.created_at.desc(),HistoryImport.id.desc()))
        if not run:raise Problem(409,'PARSE_REQUIRED','请先创建本报告的解析批次。')
        previous=db.scalar(select(HistoryMediaRun).where(HistoryMediaRun.import_id==run.id,HistoryMediaRun.version==MEDIA_VERSION))
        if previous:return {'document_id':ident,'reused':True,'status':previous.status,'counts':previous.counts}
        asset=db.get(FileAsset,doc.asset_id);path=asset_path(asset.storage_key)
        if digest(path)!=doc.sha256:raise Problem(409,'ORIGINAL_CORRUPTED','原件哈希不符，未提取照片。')
        records=list(db.scalars(select(HistoryFinding).where(HistoryFinding.import_id==run.id)))
        problem_cells=problem_cell_evidence(db,records)
        existing={r.sha256:r for r in db.scalars(select(HistoryImage).where(HistoryImage.document_id==ident))}
        issues=[];seen_occurrences=set();links=0;occurrences=0;page_images=0
        for image in images_from(path,doc.source_format,issues):
            data=image['data'];sha=hashlib.sha256(data).hexdigest();suffix=image['suffix']
            if not re.fullmatch(r'\.[a-zA-Z0-9]{1,6}',suffix):suffix='.bin'
            key=f'history/images/{sha[:2]}/{sha}{suffix}';dest=asset_path(key);dest.parent.mkdir(parents=True,exist_ok=True)
            if not dest.exists():
                if shutil.disk_usage(dest.parent).free<len(data)+1024**3:raise Problem(507,'STORAGE_LOW','图片存储可用空间不足，未覆盖原件。')
                fd,tmp=tempfile.mkstemp(dir=dest.parent,suffix='.pending')
                try:
                    with os.fdopen(fd,'wb') as stream:stream.write(data)
                    os.replace(tmp,dest)
                finally:Path(tmp).unlink(missing_ok=True)
            elif digest(dest)!=sha:raise Problem(409,'IMAGE_CORRUPTED','已存图片校验失败。')
            model=existing.get(sha)
            if not model:
                width=height=None
                try:
                    with Image.open(io.BytesIO(data)) as pil:width,height=pil.size
                except Exception:pass
                a=FileAsset(storage_key=key,sha256=sha,mime_type=mimetypes.guess_type('picture'+suffix)[0] or 'application/octet-stream',size=len(data),org_id=doc.org_id,project_id=doc.scope_id,availability='available')
                db.add(a);db.flush();model=HistoryImage(document_id=ident,asset_id=a.id,sha256=sha,width=width,height=height);db.add(model);db.flush();existing[sha]=model
            source_key=hash_json(image['locator']);pair=(sha,source_key)
            if pair in seen_occurrences:continue
            seen_occurrences.add(pair);occurrences+=1;page_images+=image['kind']=='page_image'
            occurrence=db.scalar(select(HistoryImageOccurrence).where(HistoryImageOccurrence.image_id==model.id,HistoryImageOccurrence.source_key==source_key))
            if not occurrence and image['locator'].get('bbox') and image['locator'].get('physical_page'):
                # Upgrade only a uniquely identified prior unpositioned PDF
                # occurrence; retain its ID and avoid counting the same image
                # twice after page-tree compatibility recovery.
                old=list(db.scalars(select(HistoryImageOccurrence).where(HistoryImageOccurrence.image_id==model.id)))
                old=[o for o in old if not o.locator.get('bbox') and all(o.locator.get(k)==image['locator'].get(k) for k in ('physical_page','image_object'))]
                if len(old)==1:
                    occurrence=old[0];occurrence.source_key=source_key;occurrence.locator=image['locator'];occurrence.kind=image['kind'];occurrence.method=image['method']
            if not occurrence:
                occurrence=HistoryImageOccurrence(image_id=model.id,source_key=source_key,locator=image['locator'],method=image['method'],kind=image['kind']);db.add(occurrence);db.flush()
            candidates=[(finding,relation(image,finding,problem_cells.get(finding.id))) for finding in records]
            candidates=[(finding,matched) for finding,matched in candidates if matched]
            if len(candidates)>1:
                issues.append({'code':'IMAGE_ROW_AMBIGUOUS','locator':image['locator'],'candidate_findings':[f.id for f,_ in candidates]})
                candidates=[]
            for finding,matched in candidates:
                if matched:
                    if not db.scalar(select(HistoryImageLink.id).where(HistoryImageLink.occurrence_id==occurrence.id,HistoryImageLink.finding_id==finding.id)):
                        db.add(HistoryImageLink(occurrence_id=occurrence.id,finding_id=finding.id,relation=matched));db.flush()
                    links+=1
        # Explicitly reviewed photo regions can be on a different page from the
        # canonical problem text. Keep those stable links on later full extraction.
        by_source_key={r.source_key:r for r in records}
        reviewed=db.scalars(select(HistoryImageOccurrence).join(HistoryImage,HistoryImage.id==HistoryImageOccurrence.image_id)
            .where(HistoryImage.document_id==ident,HistoryImageOccurrence.kind=='reviewed_photo_region'))
        for occurrence in reviewed:
            loc=occurrence.locator;finding=by_source_key.get(loc.get('reviewed_finding_source_key'))
            if finding is None or loc.get('source_sha256')!=doc.sha256:continue
            matched=relation({'locator':loc,'allow_row_link':True},finding)
            if not matched:continue
            if not db.scalar(select(HistoryImageLink.id).where(HistoryImageLink.occurrence_id==occurrence.id,HistoryImageLink.finding_id==finding.id)):
                db.add(HistoryImageLink(occurrence_id=occurrence.id,finding_id=finding.id,relation=matched));db.flush()
            links+=1;occurrences+=1
        counts={'images':len(existing),'occurrences':occurrences,'finding_links':links,'page_images':page_images,'errors':len(issues)}
        status='partial' if issues else 'extracted'
        db.add(HistoryMediaRun(import_id=run.id,version=MEDIA_VERSION,status=status,counts=counts,issues=issues))
        return {'document_id':ident,'reused':False,'status':status,'counts':counts}
