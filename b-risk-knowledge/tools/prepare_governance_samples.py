"""Read verified G07 candidates; prepare isolated acceptance inputs, never edit the hub."""
import argparse
import hashlib
import json
from pathlib import Path
from collections import Counter


def prepare(config_path, output, per_group=3):
    config = json.loads(Path(config_path).read_text(encoding='utf-8'))
    root = Path(config['results_path'])
    verification = json.loads((root/'verification.json').read_text(encoding='utf-8'))
    source = root/'b-governed-candidates.jsonl'
    expected = next(r['sha256'] for r in verification['result_files'] if Path(r['path']).name == source.name)
    digest = hashlib.sha256(source.read_bytes()).hexdigest()
    if digest != expected or verification['full_readback'] != 'passed':
        raise ValueError('Governance snapshot verification failed; no export written')
    taxonomy_path = root.parents[1]/'G03/结果/taxonomy-draft.json'
    taxonomy = json.loads(taxonomy_path.read_text(encoding='utf-8'))
    counts, chosen, records = Counter(), Counter(), []
    with source.open(encoding='utf-8') as handle:
        for line in handle:
            row = json.loads(line); group = row['source_group_id']; counts[group] += 1
            if chosen[group] >= per_group or not row['finding']['raw_text'].strip():continue
            # Local acceptance scope is intentionally NOT asserted to be a real
            # project identity. Production requires confirmed project mapping.
            raw = {'record_id':row['record_key'], 'report_id':row['raw_record'].get('report_id') or 'unresolved:'+row['record_key'],
                   'project_id':'demo-airport', 'description':row['finding']['raw_text'], 'record_kind':'detail',
                   'inspection_date':None, 'images':[], 'governance_review_required':True,
                   'original_record_kind_candidate':row['record_type_candidate'], 'source_group_id':group,
                   'source_version':row['source_version'], 'source_project':row['project'],
                   'source_category':row['category'], 'source_documents':row['evidence']['documents'],
                   'source_images':row['images'], 'quarantine_patches':row['quarantine_patches'],
                   'source_evaluation':row['evaluation'], 'acceptance_only':True}
            records.append({'raw_fields':raw,'effective_fields':{},'source_id':group,'revision':row['rule_version'],
                            'field_provenance':{'snapshot_sha256':digest,'record_sha256':row['raw_record_sha256']}})
            chosen[group] += 1
    categories = [{'code':n['code'].lower(),'name':n['label'],'focus':'核对原始风险记录，形成施工检查要点；分类仍待业务确认。',
                   'keywords':n.get('aliases',[])[:30]} for n in taxonomy['nodes']]
    output = Path(output); output.mkdir(parents=True,exist_ok=True)
    def write(name,value):(output/name).write_text(json.dumps(value,ensure_ascii=False,indent=2),encoding='utf-8')
    write('acceptance-governance.json',{'format':'governance-export-v1','records':records})
    write('taxonomy.json',{'source_version':taxonomy['version'],'state':'draft','categories':categories})
    manifest = {'source':str(source),'source_sha256':digest,'source_rows':sum(counts.values()),'source_groups':dict(counts),
                'selected_rows':len(records),'selected_per_group':dict(chosen),'taxonomy_source':str(taxonomy_path),
                'taxonomy_sha256':hashlib.sha256(taxonomy_path.read_bytes()).hexdigest(),
                'purpose':'isolated_engineering_acceptance_only','human_reviewed':False,'real_model_verified':False,
                'limitations':['项目身份未映射到生产项目','类型未核实，不计入正式隐患统计','图片保留原引用，未导入附件','不作为人工金标或效果准确率样本']}
    write('manifest.json',manifest)
    return {'source_rows':manifest['source_rows'],'groups':len(counts),'selected_rows':len(records),'categories':len(categories)}


if __name__ == '__main__':
    parser=argparse.ArgumentParser(); parser.add_argument('--config',required=True); parser.add_argument('--output',required=True)
    parser.add_argument('--per-group',type=int,default=3); args=parser.parse_args()
    if not 1<=args.per_group<=20:parser.error('per-group must be 1..20')
    print(json.dumps(prepare(args.config,args.output,args.per_group),ensure_ascii=False))
