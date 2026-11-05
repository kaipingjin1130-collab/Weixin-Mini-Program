"""Frozen, resumable real-provider acceptance; no approval or publication side effects.

Run from b-risk-knowledge. Inputs and outputs stay under ignored .local.
This verifies structure/evidence/adapter behavior, not human business accuracy.
"""
import hashlib
import json
import math
import sys
import time
from collections import defaultdict
from pathlib import Path
from types import SimpleNamespace
from uuid import NAMESPACE_URL, uuid5

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from backend.modules.extraction import llm
from backend.modules.extraction.schemas import Output
from backend.modules.extraction.tasks import SYSTEM
from backend.modules.extraction.grounding import check_quotes, source_text
from backend.modules.extraction.generation import retrospective_suggestions, training_question
from backend.modules.ingestion.adapters import normalize, TEMPLATES
from backend.modules.retrieval.adapters import OpenAIEmbedding
from backend.modules.training.service import validate

INPUT = ROOT/'.local/governance-acceptance'
OUT = ROOT/'.local/real-model-acceptance'
OUT.mkdir(parents=True, exist_ok=True)


def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True).encode()).hexdigest()


def write(path, value):
    temp = path.with_suffix('.writing')
    temp.write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding='utf-8')
    temp.replace(path)


def main():
    manifest = json.loads((INPUT/'manifest.json').read_text(encoding='utf-8'))
    for path, expected in [(manifest['source'],manifest['source_sha256']), (manifest['taxonomy_source'],manifest['taxonomy_sha256'])]:
        assert hashlib.sha256(Path(path).read_bytes()).hexdigest()==expected, 'Source snapshot changed'
    records=json.loads((INPUT/'acceptance-governance.json').read_text(encoding='utf-8'))['records']
    categories=json.loads((INPUT/'taxonomy.json').read_text(encoding='utf-8'))['categories']
    config=llm.require_config()
    code_hash=digest({str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest()
        for p in [ROOT/'backend/modules/extraction/tasks.py',ROOT/'backend/modules/extraction/generation.py',
                  ROOT/'backend/modules/extraction/grounding.py',ROOT/'backend/modules/extraction/llm.py',
                  ROOT/'backend/modules/training/service.py',ROOT/'backend/modules/retrieval/adapters.py']})
    report={'source_sha256':manifest['source_sha256'],'taxonomy_sha256':manifest['taxonomy_sha256'],
        'input_sha256':digest(records),'code_sha256':code_hash,'model':config.model,
        'checks':[],'human_business_acceptance':'pending','publication_performed':False,
        'limits':['治理候选未人工核实；不自动审批或发布','查询是独立编写的工程探针，不是人工标注的准确率评测',
                  '仅验证文本；现场图片与真实项目映射仍需业务确认']}
    prior_report=json.loads((OUT/'report.json').read_text(encoding='utf-8')) if (OUT/'report.json').exists() else {}
    def call(name, payload, fn):
        key=digest({'payload':payload,'model':llm.metadata(config),'code':code_hash})
        path=OUT/(name+'.json')
        cached=json.loads(path.read_text(encoding='utf-8')) if path.exists() else {}
        # Unrelated question-schema changes must not repeat successful extraction
        # calls. Validate the old request identity and every output claim again.
        if name.startswith('extraction-') and cached.get('status')=='passed' and cached.get('input_hash')==digest({
                'payload':payload,'model':llm.metadata(config),'code':prior_report.get('code_sha256')}):
            candidate=Output.model_validate(cached['result']['output'])
            evidence={x['evidence_id']:SimpleNamespace(effective_fields=json.loads(x['text'])) for x in payload['sources']}
            allowed={c['code'] for c in payload['categories']}
            assert len({c.category_code for c in candidate.cards})==len(candidate.cards)
            for card in candidate.cards:
                assert card.category_code in allowed and card.construction_points
                for fact in card.facts:check_quotes(fact,evidence,required=True)
                for point in card.construction_points:check_quotes(point,evidence,required=point.claim_kind=='source_summary')
            cached['input_hash']=key;cached['revalidated_code_hash']=code_hash;write(path,cached)
        if cached.get('input_hash')==key and cached.get('status')=='passed':
            report['checks'].append({'name':name,'status':'passed','reused':True,'seconds':cached['seconds']})
            print(name+': verified cached result',flush=True)
            return cached['result']
        started=time.monotonic()
        try:
            transient=[]
            for attempt in range(3):
                try:
                    result=fn()
                    break
                except llm.Problem as exc:
                    if exc.code not in {'MODEL_NETWORK_ERROR','MODEL_CONNECT_TIMEOUT','MODEL_RESPONSE_TIMEOUT'} or attempt==2:
                        raise
                    transient.append(exc.code)
                    print(name+': transient network failure, retry '+str(attempt+1),flush=True)
                    time.sleep(2)
            state={'input_hash':key,'status':'passed','seconds':round(time.monotonic()-started,3),'result':result,'transient_failures':transient}
            write(path,state)
            report['checks'].append({'name':name,'status':'passed','seconds':state['seconds']})
            print(name+': passed',flush=True)
            return result
        except Exception as exc:
            code=getattr(exc,'code',type(exc).__name__)
            report['checks'].append({'name':name,'status':'failed','error_code':code})
            write(OUT/'report.json',report)
            print(name+': FAILED '+code,flush=True)
            raise
        finally:
            write(OUT/'report.json',report)
    groups=defaultdict(list)
    for row in records:groups[row['raw_fields']['source_group_id']].append(row)
    cards=[]; total_usage=defaultdict(int)
    for group, rows in groups.items():
        evidence={}
        for row in rows:
            raw=row['raw_fields']; norm=normalize(raw,row.get('effective_fields',{}),TEMPLATES['governance-v1'],'demo-airport')
            assert not norm['errors']
            ident=str(uuid5(NAMESPACE_URL,raw['record_id']))
            evidence[ident]=SimpleNamespace(effective_fields=norm['effective'])
        payload={'categories':categories,'sources':[{'evidence_id':k,'text':source_text(v)} for k,v in evidence.items()],
                 'instructions':'验收资料，未经人工核实，只生成候选。每类最多一张卡；不同来源组不合并。'}
        def extract():
            output,meta=llm.structured(Output,SYSTEM,payload)
            allowed={c['code'] for c in categories}
            assert len({c.category_code for c in output.cards})==len(output.cards)
            for card in output.cards:
                assert card.category_code in allowed and card.construction_points
                card.is_mock=False;card.generation_mode='llm'
                for fact in card.facts:check_quotes(fact,evidence,required=True)
                for point in card.construction_points:check_quotes(point,evidence,required=point.claim_kind=='source_summary')
            return {'output':output.model_dump(),'meta':meta,'source_ids':list(evidence)}
        try:result=call('extraction-'+group,payload,extract)
        except llm.Problem:continue
        cards.extend(result['output']['cards'])
        for k,v in result['meta']['usage'].items():total_usage[k]+=v
    source=next((c for c in cards if len(c['facts'])>=2),cards[0])
    for kind in ['single_choice','multiple_choice','case_answer']:
        def question():
            content,meta=training_question(kind,source)
            validate(content,kind)
            return {'content':content.model_dump(),'meta':meta}
        result=call('question-'+kind,{'source':source,'kind':kind},question)
        for k,v in result['meta']['usage'].items():total_usage[k]+=v
    facts={str(n):r['raw_fields']['description'] for n,r in enumerate(records[:3])}
    def retro():
        suggestions,meta=retrospective_suggestions(facts,[])
        return {'suggestions':[s.model_dump() for s in suggestions],'meta':meta}
    result=call('retrospective',facts,retro)
    for k,v in result['meta']['usage'].items():total_usage[k]+=v
    def grade():
        score,explanation,model=llm.grade_case('应核对巡视记录与现场实际条件，不能凭记录断定现场状态。',
            [{'point':'核对巡视记录与现场实际条件','points':100,'keywords':['巡视记录','现场']}])
        assert 0<=score<=100 and explanation
        return {'score':score,'explanation':explanation,'model':model,'confirmed':False}
    call('grading',{'version':'grounded-grading-probe-v1'},grade)
    # Independent questions fixed before retrieval. No semantic hit-rate is
    # claimed without human relevance labels.
    queries=['现场洞口防护被拆除后应重点核查什么？','模板支撑水平杆缺失时怎样核对？','灭火器插销缺失应关注什么？']
    corpus=[c['title']+'\n'+'\n'.join(f['text'] for f in c['facts']) for c in cards]
    adapter=OpenAIEmbedding()
    vectors=[]
    for n,body in enumerate(corpus):
        vectors.append(call('embedding-'+str(n),body,lambda body=body:adapter.embed(body)))
    retrieval=[]
    for n,query in enumerate(queries):
        q=call('query-'+str(n),query,lambda query=query:adapter.embed(query))
        def cosine(v):return sum(a*b for a,b in zip(q,v))/(math.sqrt(sum(x*x for x in q))*math.sqrt(sum(x*x for x in v)))
        ranked=sorted(range(len(vectors)),key=lambda i:cosine(vectors[i]),reverse=True)[:3]
        retrieval.append({'query':query,'top3':[{'title':cards[i]['title'],'similarity':round(cosine(vectors[i]),5)} for i in ranked]})
    report.update(status='engineering_passed' if all(x['status']=='passed' for x in report['checks']) else 'incomplete',source_records=len(records),source_groups=len(groups),categories=len(categories),
        cards=len(cards),structured_usage= dict(total_usage),retrieval_probes=retrieval,
        cost_note='已记录结构化调用返回的 token；费用以供应商账单为准。此数不含失败请求、评分及向量调用，不作为完整账单。')
    write(OUT/'report.json',report)
    print(json.dumps({k:report[k] for k in ['status','source_records','source_groups','categories','cards','structured_usage']},ensure_ascii=False),flush=True)


if __name__=='__main__':
    try:main()
    except llm.Problem as exc:
        print(json.dumps({'code':exc.code,'message':exc.message},ensure_ascii=False),flush=True)
        sys.exit(1)
