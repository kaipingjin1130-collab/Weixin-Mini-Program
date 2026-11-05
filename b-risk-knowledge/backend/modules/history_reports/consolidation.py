"""One source-backed hazard with multiple occurrences; raw imports remain auditable."""
from sqlalchemy import Column,String,Text,ForeignKey,DateTime,UniqueConstraint,select
from sqlalchemy.dialects.postgresql import JSONB
from ...db import Base
from ...models import utcnow
from ..report_parsing.fields import FIELDS

class HistoryFindingConsolidation(Base):
    __tablename__='history_finding_consolidations'
    id=Column(String(64),primary_key=True)
    canonical_document_id=Column(ForeignKey('history_documents.id'),nullable=False)
    canonical_source_key=Column(String(64),nullable=False)
    payload=Column(JSONB,nullable=False)
    created_at=Column(DateTime(timezone=True),nullable=False,default=utcnow)
    __table_args__=(UniqueConstraint('canonical_document_id','canonical_source_key'),)

class HistoryFindingConsolidationMember(Base):
    __tablename__='history_finding_consolidation_members'
    group_id=Column(ForeignKey('history_finding_consolidations.id'),primary_key=True)
    document_id=Column(ForeignKey('history_documents.id'),primary_key=True)
    source_key=Column(String(64),primary_key=True)
    expected_fields=Column(JSONB,nullable=False)
    __table_args__=(UniqueConstraint('document_id','source_key'),)

TABLES=[HistoryFindingConsolidation.__table__,HistoryFindingConsolidationMember.__table__]

def choose_fields(canonical,source_fields,source_evidence):
    """Only fill from explicit original-report evidence; preserve conflicting variants."""
    chosen={k:None for k in FIELDS};variants={};evidence=[]
    for field in FIELDS:
        options=[]
        for key,values in source_fields.items():
            value=values.get(field)
            if value is None:continue
            proofs=[e for e in source_evidence.get(key,[]) if e['field_key']==field]
            assert proofs,('Missing original evidence',key,field)
            options.append((key,value,proofs))
        if not options:continue
        # Keep categories exactly as printed. Longer descriptions are chosen only within
        # an already semantically confirmed same-event group, never by similarity alone.
        options.sort(key=lambda x:(x[0]!=canonical,))
        if field in {'problem_description','basis_or_clause','reported_response'}:
            options.sort(key=lambda x:-len(x[1]))
        chosen[field]=options[0][1]
        unique=[]
        for key,value,proofs in options:
            evidence.extend(proofs)
            if value not in [v['value'] for v in unique]:unique.append({'value':value,'source_ref':key})
        if len(unique)>1:variants[field]=unique
    assert chosen['problem_description']
    return chosen,variants,evidence

def view_sql():
    # Invalidated/stale membership fails open: show the raw rows again, never hide them.
    fields=','.join("'%s',f.%s"%(k,k) for k in FIELDS)
    selected=','.join("CASE WHEN g.id IS NULL THEN f.%s ELSE g.payload->'fields'->>'%s' END AS %s"%(k,k,k) for k in FIELDS)
    return f'''CREATE OR REPLACE VIEW history_current_consolidated_findings AS
      WITH latest AS (SELECT DISTINCT ON (document_id) id,document_id,created_at FROM history_imports
          ORDER BY document_id,created_at DESC,id DESC),
      current_rows AS (SELECT f.*,l.document_id,l.created_at AS parsed_at FROM latest l JOIN history_findings f ON f.import_id=l.id),
      valid_groups AS (SELECT g.* FROM history_finding_consolidations g WHERE EXISTS
          (SELECT 1 FROM history_finding_consolidation_members m WHERE m.group_id=g.id)
          AND NOT EXISTS (SELECT 1 FROM history_finding_consolidation_members m
             LEFT JOIN current_rows f ON f.document_id=m.document_id AND f.source_key=m.source_key
             WHERE m.group_id=g.id AND (f.id IS NULL OR jsonb_build_object({fields}) IS DISTINCT FROM m.expected_fields)))
      SELECT f.id,f.import_id,f.source_key,f.document_id,f.parsed_at,f.locator,f.review_state,
          {selected},g.id AS consolidation_id,g.payload AS consolidation
      FROM current_rows f LEFT JOIN history_finding_consolidation_members m ON m.document_id=f.document_id AND m.source_key=f.source_key
      LEFT JOIN valid_groups g ON g.id=m.group_id
      WHERE g.id IS NULL OR (f.document_id=g.canonical_document_id AND f.source_key=g.canonical_source_key)'''
