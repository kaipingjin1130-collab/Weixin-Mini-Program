from concurrent.futures import ThreadPoolExecutor
from copy import deepcopy
from uuid import uuid4
from io import BytesIO
from zipfile import ZipFile
import pytest
from fastapi.testclient import TestClient
from backend.app import app
from backend.db import Session
from backend.models import FileAsset
from backend.modules.workflows.models import WorkRevision
from test_standard_library import headers, source, client

BASE = '/api/v1/workflows'


def draft(content, **changes):
    return {'project_id':'demo-airport', 'series':uuid4().hex, 'expected_version':0,
        'title':'软件验收样例（非现场使用）', 'reason':'测试录入', 'content':content, **changes}


def create(client, data, role='admin', key=None):
    return client.post(BASE, headers=headers(role, key or uuid4().hex), json=data)


def act(client, row, action, role='admin', checked=True):
    return client.post(BASE+'/'+row['id']+'/actions', headers=headers(role), json={
        'action':action, 'row_version':row['row_version'], 'reason':'测试核验', 'evidence_checked':checked})


def publish(client, data):
    r = create(client, data)
    assert r.status_code == 201, r.text
    row = r.json()
    for step in ('submit','approve','publish'):
        r = act(client, row, step)
        assert r.status_code == 200, r.text
        row = r.json()
    return row


def taxonomy(client):
    return publish(client, draft({'kind':'taxonomy','rule':'测试分类规则', 'categories':[
        {'code':'test','name':'测试类','parent':None,'positive_examples':['测试对象缺损'],'negative_examples':['对象已完好']},
        {'code':'sub','name':'测试子类','parent':'test','positive_examples':['测试细项'],'negative_examples':['非此细项']}]}))


def evidence(client):
    ident, _ = source(client, text='检查发现测试问题。已完成测试整改。测试复查合格。' + uuid4().hex)
    return {'kind':'asset','id':ident,'quote':'检查发现测试问题。','locator':'第一段'}


def hazard(client, tax=None, ev=None, **changes):
    return {'kind':'hazard','description':'测试对象问题', 'occurred_on':'2026-10-01','stage':'测试阶段','object_name':'测试对象',
        'taxonomy_id':(tax or taxonomy(client))['id'],'category':'test','subcategory':'sub','tags':['测试标签'],
        'classification_reason':'测试规则命中','original_risk':'待核实','reviewed_risk':'待核实','risk_reason':'证据有限',
        'status':'open','nature':'observed_hazard','split_reason':'原记录问题一','relation':'independent','related_event_id':None,
        'records':[{'record_key':uuid4().hex,'kind':'inspection','date':'2026-10-01','text':'测试检查','evidence':[ev or evidence(client)]}], **changes}


def guide(client):
    ev = evidence(client)
    return {'kind':'guide','conditions':{'项目类型':'测试'},'required_conditions':['项目类型'],
        'preparation':'准备测试','implementation':'实施测试','risk_control':'风险控制测试','acceptance':'检查测试','emergency':'异常停工测试',
        'steps':[{'number':'1','title':'测试步骤','operation':'核对测试对象','risks':['测试风险'], 'measures':['核对测试'],
                  'checks':['检查记录'],'evidence':[ev]}], 'parameters':[], 'missing':[], 'conflicts':[]}


def question(client, g):
    return {'kind':'question','guide_id':g['id'],'chapter':'准备','role':'测试岗位','step':'1','risk':'测试风险',
        'point':'测试考点','cognitive_level':'recall','difficulty':'easy','type':'single','stem':'测试应执行什么？'+uuid4().hex,
        'options':{'a':'核对测试对象','b':'无依据跳过'},'answer':['a'],'explanation':'来源说明核对对象','rubric':[],
        'evidence':[{'kind':'work','id':g['id'],'quote':'核对测试对象','locator':'步骤1'}], 'historical_case_ids':[]}


def test_event_stats_distinct_grains_and_drilldown(client):
    tax, ev = taxonomy(client), evidence(client)
    h = hazard(client,tax,ev)
    a = publish(client,draft(h))
    b = publish(client,draft({**h,'split_reason':'原记录问题二'}))
    c = publish(client,draft({**h,'nature':'potential_source'}))
    stats = client.get(BASE+'/hazards/statistics', params={'project_id':'demo-airport'}, headers=headers()).json()
    rows = client.get(BASE+'/hazards/drilldown', params={'project_id':'demo-airport','limit':100}, headers=headers()).json()['items']
    assert stats['event_count'] == len(rows)
    assert {a['id'],b['id']} <= {r['id'] for r in rows} and c['id'] not in {r['id'] for r in rows}
    assert stats['inspection_record_count'] < stats['event_count']
    assert stats['ranking'] is None
    filtered = client.get(BASE+'/hazards/statistics', params={'project_id':'demo-airport','tag':'不存在标签'}, headers=headers()).json()
    assert filtered['event_count']==0 and filtered['inspection_record_count']==0


def test_immutable_concurrent_and_roles(client):
    data, key = draft(hazard(client)), uuid4().hex
    with ThreadPoolExecutor(2) as pool:
        responses = list(pool.map(lambda _: create(client,data,key=key),range(2)))
    assert sorted(r.status_code for r in responses)==[200,201]
    row = responses[0].json()
    assert create(client,{**data,'title':'changed'},key=key).status_code==409
    assert client.get(BASE+'/'+row['id'],headers=headers('learner')).status_code==403
    assert act(client,row,'approve',role='processor').status_code==403
    second = create(client,{**data,'expected_version':1,'title':'修订'}).json()
    assert act(client,row,'submit').status_code==409
    assert second['version']==2
    assert client.get(BASE+'/'+row['id'],headers=headers('outsider')).status_code==403


@pytest.mark.parametrize('change',[{'status':'closed'},{'category':'不存在'}, {'subcategory':'不存在'},
    {'relation':'recurrence','related_event_id':None}])
def test_invalid_event_rejected(client,change):
    assert create(client,draft(hazard(client,**change))).status_code==422


def test_cross_project_and_quote_rejected(client):
    h = hazard(client)
    h['records'][0]['evidence'][0]['quote']='原文不存在的结论'
    assert create(client,draft(h)).status_code==422
    h['records'][0]['evidence'][0]=evidence(client)
    with Session.begin() as db:
        db.get(FileAsset,h['records'][0]['evidence'][0]['id']).org_id='other-org'
    assert create(client,draft(h)).status_code==403


def test_revocation_and_transitive_impact(client):
    g = publish(client,draft(guide(client)))
    q = publish(client,draft(question(client,g)))
    asset_id = g['content']['steps'][0]['evidence'][0]['id']
    with Session.begin() as db:
        db.get(FileAsset,asset_id).availability='withdrawn'
    assert client.get(BASE+'/'+g['id'],headers=headers()).status_code==410
    assert client.get(BASE+'/'+q['id'],headers=headers()).status_code==410
    report = client.get(BASE+'/impacts',params={'project_id':'demo-airport','source_kind':'asset','source_id':asset_id},headers=headers()).json()
    assert {i['id'] for i in report['items']} == {g['id'],q['id']}
    assert all(i['impact']=='needs_review' for i in report['items'])
    assert act(client,g,'withdraw').status_code==200


def test_guide_missing_parameter_blocks_approval_and_export(client):
    data=guide(client)
    data['parameters']=[{'name':'测试参数','value':None,'evidence':[]}]
    row=create(client,draft(data)).json()
    row=act(client,row,'submit').json()
    assert act(client,row,'approve').status_code==422
    response=client.get(BASE+'/'+row['id']+'/export',headers=headers())
    assert response.status_code==200
    with ZipFile(BytesIO(response.content)) as z:
        xml=z.read('word/document.xml').decode('utf-8')
    assert '不得用于现场' in xml and '测试参数' in xml and '待填' in xml


def test_questions_answer_review_and_invalidation(client):
    g=publish(client,draft(guide(client)))
    q=question(client,g)
    assert create(client,draft({**q,'answer':['a','b']})).status_code==422
    assert create(client,draft(q),role='processor').status_code==403
    first=publish(client,draft(q))
    duplicate=create(client,draft(q)).json()
    duplicate=act(client,duplicate,'submit').json()
    assert act(client,duplicate,'approve').status_code==422
    assert client.get(BASE+'/'+first['id'],headers=headers('learner')).status_code==403
    act(client,g,'withdraw')
    assert client.get(BASE+'/'+first['id'],headers=headers('teacher')).status_code==409


def test_taxonomy_upgrade_preserves_manual_content(client):
    tax=taxonomy(client)
    event=publish(client,draft(hazard(client,tax)))
    updated=publish(client,draft(tax['content'],series=tax['series'],expected_version=1))
    assert updated['version']==2
    assert client.get(BASE+'/'+event['id'],headers=headers()).status_code==409
    with Session() as db:
        old=db.get(WorkRevision,event['id'])
        assert old.state=='published' and old.content['classification_reason']=='测试规则命中'


def test_reinspection_not_new_event(client):
    h=hazard(client)
    for kind in ('rectification','reinspection'):
        h['records'].append({**h['records'][0],'kind':kind,'record_key':uuid4().hex,'date':'2026-10-02'})
    h['status']='closed'
    row=publish(client,draft(h))
    assert len(row['content']['records'])==3 and row['content']['status']=='closed'
