import json
from types import SimpleNamespace
from sqlalchemy import select,exists,or_
from ...auth import Problem
from ...models import FileAsset
from ..ingestion.models import SourceRecordVersion,EvidenceItem
from .models import KnowledgeSource


def source_text(version):
    return json.dumps(version.effective_fields,ensure_ascii=False,sort_keys=True)


def check_quotes(claim,evidence_map,required=False):
    ids=set(claim.evidence_ids)
    if not ids or not ids<=set(evidence_map):raise Problem(422,'INVALID_EVIDENCE_REFERENCE','施工要点引用了不属于固定来源范围的证据。')
    quotes=claim.source_quotes
    if required and (not quotes or {q.evidence_id for q in quotes}!=ids):raise Problem(422,'SOURCE_QUOTE_REQUIRED','每个来源证据都必须提供可核对的原文摘录。')
    for quote in quotes:
        if quote.evidence_id not in ids:raise Problem(422,'INVALID_QUOTE_REFERENCE','原文摘录与引用证据不对应。')
        version=evidence_map[quote.evidence_id]
        if quote.text not in source_text(version):raise Problem(422,'SOURCE_QUOTE_MISMATCH','模型提供的原文摘录在固定来源中不存在，已拒绝候选。')


def evidence_map(db,evidence):
    return {e.id:db.get(SourceRecordVersion,e.record_version_id) for e in evidence if hasattr(e,'record_version_id')}


def extra_available_sql(item):
    return ~exists(select(KnowledgeSource.id).join(SourceRecordVersion,SourceRecordVersion.id==KnowledgeSource.record_version_id)
        .outerjoin(FileAsset,FileAsset.id==SourceRecordVersion.provenance['input_asset_id'].astext)
        .where(KnowledgeSource.item_id==item.id,or_(FileAsset.id.is_(None),FileAsset.availability!='available',FileAsset.project_id!=item.project_id)))
