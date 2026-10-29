from sqlalchemy import select,text
from pydantic import ValidationError
from ...queue import queue_app
from ...db import Session
from ...auth import Problem
from ...models import ProcessingRun,utcnow
from ...job_service import fingerprint
from ..knowledge.tasks import actor_for
from ..knowledge.models import KnowledgeItem,KnowledgeRevision
from ..knowledge.service import link_claims,validate_card,item_source
from .models import ExtractionRun,KnowledgeSource
from .schemas import Generate,Output
from .service import prepare
from .grounding import check_quotes
from .llm import structured

SYSTEM='''你是工程检查知识加工助手。将多条历史检查记录按给定类别分类、合并、去重，提炼可复用的施工要点，而不是逐条改写隐患。
每张卡含类别、简洁事实摘要和至少一个施工要点。每个要点必须描述准备/实施/复核中的检查关注点，分别填写content、inspection_method、common_mistakes。
材料明确支持的内容标source_summary并逐证据提供真实source_quotes；超出材料的改进方法标suggestion，不能写成已执行或有效标准。
每个事实和要点引用提供的evidence_id并摘录原文连续片段。不得编造项目事实、整改结果、规范条款。standards保持为空，除非确有原文且标pending_verification。
类别只能从categories选择，每类最多一张卡；来源不足写missing_information。只输出给定结构JSON。generation_mode为llm，is_mock表示演示资料，不表示是否调用模型。'''


def mock_output(payload):
    categories=payload['categories'];groups={c['code']:[] for c in categories}
    for source in payload['sources']:
        category=next((c for c in categories if any(k in source['text'] for k in c.get('keywords',[]))),categories[0])
        groups[category['code']].append(source)
    cards=[]
    for c in categories:
        rows=groups[c['code']]
        if not rows:continue
        chosen=rows[:10]
        facts=[{'text':'来源记录：'+r['text'][:1000],'evidence_ids':[r['evidence_id']],'source_quotes':[{'evidence_id':r['evidence_id'],'text':r['text'][:1000]}]} for r in chosen]
        cards.append({'title':c['name']+' · 施工检查要点（模拟示例）','type':'checkpoint_card','project_name':'模拟项目',
            'generation_mode':'mock','category_code':c['code'],'category_name':c['name'],'facts':facts,
            'construction_points':[{'title':c['name']+'的现场核查','stage':'execution','content':'模拟建议：围绕所选类别归集共性问题，检查前查看来源记录，现场逐项核对并留存证据。',
                'inspection_method':'模拟建议：对照来源位置与现场状态，不能仅凭文字推定措施有效。','common_mistakes':'模拟建议：避免把缺少记录等同未执行。','claim_kind':'suggestion','evidence_ids':[r['evidence_id'] for r in chosen]}],
            'suggestions':['当前为模板示例，未调用大模型，知识归纳质量需另行评测。']})
    return Output.model_validate({'cards':cards}),{'model_ref':'local-construction-mock-v1','usage':{}}


@queue_app.task(name='b07.knowledge_extraction',queue='b01')
def extract(run_id:str):
    with Session.begin() as db:
        run=db.get(ProcessingRun,run_id)
        if not run or run.status=='succeeded':return
        run.status='running';run.error=None;run.attempts+=1;run.row_version+=1;run.progress=10
    try:
        with Session() as db:
            run=db.get(ProcessingRun,run_id);actor=actor_for(db,run.actor_id,run);data=Generate.model_validate(run.payload)
            job=db.scalar(select(ExtractionRun).where(ExtractionRun.run_id==run_id))
            _,_,payload,_=prepare(db,data,actor);config_hash=job.config_fingerprint
        output,meta=structured(Output,SYSTEM,payload,config_hash) if data.mode=='llm' else mock_output(payload)
        with Session.begin() as db:
            run=db.get(ProcessingRun,run_id);actor=actor_for(db,run.actor_id,run)
            taxonomy,rows,_,evidence=prepare(db,data,actor)
            allowed={c['code']:c['name'] for c in taxonomy.categories}
            if len({c.category_code for c in output.cards})!=len(output.cards):raise Problem(422,'DUPLICATE_CATEGORY_CARD','模型须按类别合并，不接受同类别重复卡。')
            for card in output.cards:
                if card.category_code not in allowed or not card.construction_points:raise Problem(422,'INVALID_EXTRACTION_CATEGORY','模型须使用已配置类别并输出施工要点。')
                card.category_name=allowed[card.category_code];card.generation_mode=data.mode;card.is_mock=True
                for fact in card.facts:check_quotes(fact,evidence,required=True)
                for point in card.construction_points:check_quotes(point,evidence,required=point.claim_kind=='source_summary')
            result=[]
            for card in output.cards:
                template='extract-'+fingerprint({'knowledge.process':run.input_hash,'category':card.category_code})[:40]
                refs={ident for f in card.facts for ident in f.evidence_ids}|{ident for p in card.construction_points for ident in p.evidence_ids}
                versions=sorted({evidence[e].id for e in refs});anchor=versions[0]
                db.execute(text('SELECT pg_advisory_xact_lock(hashtextextended(:k,0))'),{'k':'extracted:'+run.project_id+':'+template})
                item=db.scalar(select(KnowledgeItem).where(KnowledgeItem.record_version_id==anchor,KnowledgeItem.type=='checkpoint_card',KnowledgeItem.template_version==template))
                if item:
                    item_source(db,item,actor);result.append({'item_id':item.id,'outcome':'reused'});continue
                item=KnowledgeItem(record_version_id=anchor,project_id=run.project_id,type='checkpoint_card',title=card.title,template_version=template,
                    scope={'project_id':run.project_id,'category_code':card.category_code})
                db.add(item);db.flush()
                for version_id in versions:db.add(KnowledgeSource(item_id=item.id,record_version_id=version_id))
                db.flush();source,_,_=item_source(db,item,actor);validate_card(db,card,source,actor)
                revision=KnowledgeRevision(item_id=item.id,version=1,content=card.model_dump(),schema_version='knowledge-card-v2',template_version=template,model_ref=meta['model_ref'],state='draft')
                db.add(revision);db.flush();link_claims(db,revision,card);result.append({'item_id':item.id,'outcome':'created'})
            job=db.scalar(select(ExtractionRun).where(ExtractionRun.run_id==run_id));job.result={'items':result,'missing_information':output.missing_information,'model':meta,'generation_mode':data.mode}
            run.status='succeeded';run.progress=100;run.row_version+=1;run.updated_at=utcnow()
    except Exception as exc:
        with Session.begin() as db:
            run=db.get(ProcessingRun,run_id);run.status='failed';run.row_version+=1;run.updated_at=utcnow()
            run.error=exc.message if isinstance(exc,Problem) else '知识萃取中断或输出不符合结构，未自动发布任何内容。'
        raise
