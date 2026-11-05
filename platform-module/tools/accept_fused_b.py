"""Real sample HTTP acceptance, restricted to the loopback fusion fixture.

Keeps imported governance candidates and model drafts for user review. Does not
approve sources, publish knowledge, or alter source governance files.
"""
import base64
import json
import time
from pathlib import Path
from uuid import uuid4
from accept_fusion import Client, version

ROOT=Path(__file__).resolve().parents[2]
INPUT=ROOT/'b-risk-knowledge/.local/governance-acceptance'
STATE=ROOT/'.local/fusion-integration/b-real-acceptance.json'


def main():
    c=Client();c.http.timeout=180
    c.http.headers['Origin']='http://127.0.0.1:18771'
    health=c.b('GET','/health')
    assert health['environment']=='development' and health['auth_mode']=='a' and health['worker_online']
    state=json.loads(STATE.read_text(encoding='utf-8')) if STATE.exists() else {'checks':[]}
    def save():STATE.write_text(json.dumps(state,ensure_ascii=False,indent=2),encoding='utf-8')
    def wait(path,field,expected):
        end=time.monotonic()+240
        while time.monotonic()<end:
            result=c.b('GET',path)
            if result[field]==expected:return result
            if result[field]=='failed':raise RuntimeError(result.get('error','Job failed'))
            time.sleep(1)
        raise RuntimeError('Local job timed out; retained state for inspection')
    me=c.b('GET','/me')
    # These are fixture projects from the existing local fusion acceptance.
    project=state.setdefault('project_id',me['projects'][0]['id'])
    assert project in {p['id'] for p in me['projects']}
    original=json.loads((INPUT/'acceptance-governance.json').read_text(encoding='utf-8'))
    for row in original['records']:row['raw_fields']['project_id']=project
    if not state.get('source_id'):
        source=c.b('POST','/sources',{'name':'指定治理样本 · 仅本地验收候选','namespace':'real-acceptance-'+uuid4().hex,
            'project_id':project,'kind':'governance_export','mapping_template':'governance-v1'},expect=201)
        state['source_id']=source['id'];save()
    if not state.get('asset_id'):
        uploaded=c.b('POST','/platform-inputs',{'project_id':project,'name':'治理候选-验收41条.json','kind':'governance_export',
            'base64':base64.b64encode(json.dumps(original,ensure_ascii=False).encode()).decode()},expect=201)
        state['asset_id']=uploaded['asset_id'];save()
    if not state.get('batch_id'):
        body={'source_id':state['source_id'],'input_asset_id':state['asset_id']}
        preview=c.b('POST','/imports/preview',body)
        batch=c.b('POST','/imports',{**body,'input_hash':preview['input_hash']},expect=202,key=str(uuid4()))
        state['batch_id']=batch['id'];save()
    batch=wait('/imports/'+state['batch_id'],'status','completed')
    state['import_counts']=batch['counts'];save()
    assert batch['counts']['failed']==0 and batch['counts']['total']==41
    print('PASS fused governance import: 41 records',flush=True)
    records=c.b('GET','/records?source_id='+state['source_id']+'&limit=100')['items']
    assert len(records)==41
    first_ids={r['raw_fields']['record_id'] for r in original['records'][:3]}
    selected=[r for r in records if r['external_record_id'] in first_ids]
    options=c.b('GET','/knowledge/source-options?project_id='+project+'&limit=100')['items']
    versions=[r['record_version_id'] for r in options if r['id'] in {x['id'] for x in selected}]
    assert len(versions)==3
    if not state.get('taxonomy_id'):
        categories=json.loads((INPUT/'taxonomy.json').read_text(encoding='utf-8'))['categories']
        prior=c.b('GET','/knowledge/taxonomies?project_id='+project)['items']
        taxonomy=c.b('POST','/knowledge/taxonomies',{'project_id':project,'expected_version':prior[0]['version'] if prior else 0,'categories':categories})
        state['taxonomy_id']=taxonomy['id'];save()
    if not state.get('extraction_job'):
        job=c.b('POST','/knowledge/extraction-jobs',{'record_version_ids':versions,'taxonomy_id':state['taxonomy_id'],'mode':'llm'},expect=202,key=str(uuid4()))
        state['extraction_job']=job['job_id'];save()
    job=wait('/knowledge/extraction-jobs/'+state['extraction_job'],'status','succeeded')
    state['extraction']=job['result'];save()
    assert job['result']['generation_mode']=='llm' and job['result']['items']
    for item in job['result']['items']:
        card=c.b('GET','/knowledge/'+item['item_id'])
        assert card['content']['generation_mode']=='llm'
        if card['state']=='draft':
            c.b('POST','/knowledge/'+card['id']+'/submit-review',version(card))
            card=c.b('GET','/knowledge/'+card['id'])
        assert card['state']=='pending_review'
        refusal=c.b('POST','/reviews/'+card['revision_id']+'/approve',version(card,evidence_checked=True),expect=422)
        assert refusal['code'] in {'BLOCKING_QUALITY_ISSUE','STANDARD_UNVERIFIED'}
    state['checks']=['融合共享身份与项目权限','指定41条治理候选导入','指定46分类固定版本','真实模型后台萃取','候选待审与未核实来源审批拦截']
    state['status']='engineering_passed';state['business_review']='pending';save()
    print('PASS fused cloud extraction and review gate; no publication',flush=True)


if __name__=='__main__':main()
