"""Fill the retained company notice template using only the standard library.

The logo/header/styles remain the original package bytes. Only document slots,
image relationships and content types change for each export.
"""
import io
from pathlib import Path
import re
import zipfile
from xml.dom import minidom

TEMPLATE = Path(__file__).parent / 'templates' / 'hazard-notice.docx'
W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
REL = 'http://schemas.openxmlformats.org/package/2006/relationships'


def children(node, name):
    return [c for c in node.childNodes if c.nodeType == c.ELEMENT_NODE and c.tagName == name]


def nodes(node, name):
    return list(node.getElementsByTagName(name))


def content(node):
    return ''.join(t.firstChild.data if t.firstChild else '' for t in nodes(node, 'w:t'))


def set_text(node, value):
    """Plain text with real Word line breaks; retain the placeholder run style."""
    value = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', str(value or ''))
    parent = node.parentNode
    for index, line in enumerate(value.split('\n')):
        if index:
            parent.insertBefore(node.ownerDocument.createElementNS(W, 'w:br'), node)
        t = node.ownerDocument.createElementNS(W, 'w:t')
        t.setAttribute('xml:space', 'preserve')
        t.appendChild(node.ownerDocument.createTextNode(line))
        parent.insertBefore(t, node)
    parent.removeChild(node)


def fill(node, values):
    # Single pass: user text resembling a placeholder is never interpreted again.
    for t in nodes(node, 'w:t'):
        token = t.firstChild.data if t.firstChild else ''
        if token.startswith('{{') and token.endswith('}}') and token[2:-2] in values:
            set_text(t, values[token[2:-2]])


def render(report, read_image, dimensions):
    with zipfile.ZipFile(TEMPLATE) as source:
        parts = {n: source.read(n) for n in source.namelist()}
    doc = minidom.parseString(parts['word/document.xml'])
    rels = minidom.parseString(parts['word/_rels/document.xml.rels'])
    types = minidom.parseString(parts['[Content_Types].xml'])
    tables = nodes(doc, 'w:tbl')
    rows = children(tables[0], 'w:tr')
    metadata = report.get('notice') or {}
    issues = report.get('issues') or []
    values = {k: metadata.get(k, '') for k in ('noticeNumber', 'projectName', 'progress', 'client',
        'developer', 'contractor', 'supervisor', 'inspectionDate', 'subject', 'recipient', 'recipientDate')}
    # Legacy reports lacking notice metadata keep their own recorded project/date.
    if not metadata:
        values.update(noticeNumber=report.get('number', ''), projectName=report.get('project', ''),
                      inspectionDate=report.get('date', ''))
    values['inspector'] = report.get('inspector', '')
    values['summary'] = report.get('scope', '').strip()
    if report.get('noHazard'):
        values['summary'] = '\n'.join(filter(None, [values['summary'], '本次在上述检查范围内未发现隐患。']))
    elif issues and not values['summary']:
        values['summary'] = '根据本次检查情况，现场记录的隐患问题如下。'

    section = children(rows[6], 'w:tc')[0]
    issue_template = next(p for p in children(section, 'w:p') if '{{issueText}}' in content(p))
    for index, issue in enumerate(issues, 1):
        p = issue_template.cloneNode(True)
        # Do not present risk level as a category; only use entered classifications.
        category = ' / '.join(filter(None, [issue.get('category', ''), issue.get('subcategory', '')]))
        fill(p, {'issueText': f'{index}、' + issue.get('description', ''),
                 'issueCategory': '（' + category + '）' if category else ''})
        section.insertBefore(p, issue_template)
    section.removeChild(issue_template)
    if not issues:
        for p in list(children(section, 'w:p')):
            if content(p) in ('隐患问题：', '后附隐患问题清单。') or content(p).startswith('本次检查基于'):
                section.removeChild(p)

    image_number = 0
    existing_ids = {el.getAttribute('Id') for el in nodes(rels, 'Relationship')}
    def picture(mid, max_width=3150000, max_height=2400000):
        nonlocal image_number
        data, mime = read_image(mid)
        width, height = dimensions(data)
        if width <= 0 or height <= 0:
            raise ValueError('图片尺寸无效')
        scale = min(max_width / width, max_height / height)
        cx, cy = max(1, int(width * scale)), max(1, int(height * scale))
        image_number += 1
        rid = f'noticePhoto{image_number}'
        assert rid not in existing_ids
        ext = 'png' if mime == 'image/png' else 'jpeg'
        target = f'media/notice-photo-{image_number}.{ext}'
        parts['word/' + target] = data
        relationship = rels.createElementNS(REL, 'Relationship')
        for key, value in [('Id', rid), ('Type', R + '/image'), ('Target', target)]:
            relationship.setAttribute(key, value)
        rels.documentElement.appendChild(relationship)
        if ext not in {e.getAttribute('Extension') for e in nodes(types, 'Default')}:
            default = types.createElementNS(types.documentElement.namespaceURI, 'Default')
            default.setAttribute('Extension', ext); default.setAttribute('ContentType', mime)
            types.documentElement.appendChild(default)
        xml = f'''<w:r xmlns:w="{W}" xmlns:r="{R}" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="{cx}" cy="{cy}"/><wp:docPr id="{200000000+image_number}" name="照片{image_number}"/><wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="{200000000+image_number}" name="照片{image_number}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="{rid}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="{cx}" cy="{cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>'''
        return doc.importNode(minidom.parseString(xml).documentElement, True)

    def add_pictures(cell, ids, signature=False):
        prototype = children(cell, 'w:p')[0]
        for p in list(children(cell, 'w:p')): cell.removeChild(p)
        if not ids:
            fill(prototype, {'photos': '', 'signatures': ''})
            cell.appendChild(prototype)
        for mid in ids:
            p = prototype.cloneNode(True)
            for child in list(p.childNodes):
                if child.nodeType != child.ELEMENT_NODE or child.tagName != 'w:pPr': p.removeChild(child)
            p.appendChild(picture(mid, 1100000, 380000) if signature else picture(mid))
            cell.appendChild(p)

    # Fill the metadata before appending user issue rows to avoid recursive slot replacement.
    fill(doc, values)
    annex = tables[1]
    prototype = children(annex, 'w:tr')[1]
    for index, issue in enumerate(issues, 1):
        row = prototype.cloneNode(True)
        details = '\n'.join([issue.get('description', '')] + [label + '：' + issue[k]
            for k, label in [('location', '部位'), ('category', '类别'), ('subcategory', '子分类'),
                             ('risk', '风险等级'), ('reference', '规范依据'), ('suggestion', '整改建议')]
            if issue.get(k)])
        fill(row, {'sequence': str(index), 'description': details})
        add_pictures(children(row, 'w:tc')[2], issue.get('photos', []))
        annex.insertBefore(row, prototype)
    if not issues:
        fill(prototype, {'sequence': '', 'description': '', 'photos': ''})
    else:
        annex.removeChild(prototype)
    signatures = [s['signature'] for s in report.get('signatures', []) if s.get('signature')]
    add_pictures(children(rows[7], 'w:tc')[1], signatures, signature=True)

    parts['word/document.xml'] = doc.toxml(encoding='UTF-8')
    parts['word/_rels/document.xml.rels'] = rels.toxml(encoding='UTF-8')
    parts['[Content_Types].xml'] = types.toxml(encoding='UTF-8')
    out = io.BytesIO()
    with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as result:
        for name, data in parts.items(): result.writestr(name, data)
    return out.getvalue()
