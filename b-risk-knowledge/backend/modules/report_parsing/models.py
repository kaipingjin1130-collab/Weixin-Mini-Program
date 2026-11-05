"""Additive provenance tables; existing B identities/assets/records remain authoritative."""
from sqlalchemy import Column,String,Text,Integer,DateTime,ForeignKey,UniqueConstraint,CheckConstraint,Boolean
from sqlalchemy.dialects.postgresql import JSONB
from ...db import Base
from ...models import utcnow,new_id

class FileOrigin(Base):
    __tablename__='report_file_origins'
    id=Column(String(36),primary_key=True,default=new_id)
    asset_id=Column(ForeignKey('file_assets.id'),nullable=False,index=True)
    source_path=Column(Text,nullable=False)
    source_key=Column(String(64),nullable=False,unique=True)
    source_group=Column(Text,nullable=False)
    sha256=Column(String(64),nullable=False)
    size=Column(Integer,nullable=False)
    observed_at=Column(DateTime(timezone=True),default=utcnow,nullable=False)

class ReportVersion(Base):
    __tablename__='report_versions'
    id=Column(String(36),primary_key=True,default=new_id)
    document_id=Column(ForeignKey('source_documents.id'),nullable=False,index=True)
    version_no=Column(Integer,nullable=False)
    original_asset_id=Column(ForeignKey('file_assets.id'),nullable=False)
    sha256=Column(String(64),nullable=False)
    original_name=Column(Text,nullable=False)
    source_format=Column(String(16),nullable=False)
    created_at=Column(DateTime(timezone=True),default=utcnow,nullable=False)
    __table_args__=(UniqueConstraint('document_id','version_no'),CheckConstraint('version_no > 0'))

class ReportParseFile(Base):
    __tablename__='report_parse_files'
    id=Column(String(36),primary_key=True,default=new_id)
    report_version_id=Column(ForeignKey('report_versions.id'),nullable=False,index=True)
    run_id=Column(ForeignKey('processing_runs.id'),nullable=False)
    parser_version=Column(String(80),nullable=False)
    config_hash=Column(String(64),nullable=False)
    status=Column(String(24),nullable=False,default='queued',index=True)
    counts=Column(JSONB,nullable=False,default=dict)
    errors=Column(JSONB,nullable=False,default=list)
    result_key=Column(Text)
    output_hash=Column(String(64))
    completed_at=Column(DateTime(timezone=True))
    __table_args__=(UniqueConstraint('report_version_id','parser_version','config_hash'),
        CheckConstraint("status IN ('queued','running','succeeded','partial','failed','not_report')"))

class ReportEvidenceUnit(Base):
    __tablename__='report_evidence_units'
    id=Column(String(36),primary_key=True,default=new_id)
    parse_file_id=Column(ForeignKey('report_parse_files.id'),nullable=False,index=True)
    report_version_id=Column(ForeignKey('report_versions.id'),nullable=False,index=True)
    unit_key=Column(String(100),nullable=False)
    kind=Column(String(32),nullable=False)
    quote_text=Column(Text,nullable=False)
    locator=Column(JSONB,nullable=False)
    method=Column(String(24),nullable=False)
    source_sha256=Column(String(64),nullable=False)
    __table_args__=(UniqueConstraint('parse_file_id','unit_key'),)

class ReportRecordOrigin(Base):
    __tablename__='report_record_origins'
    id=Column(String(36),primary_key=True,default=new_id)
    parse_file_id=Column(ForeignKey('report_parse_files.id'),nullable=False,index=True)
    record_version_id=Column(ForeignKey('source_record_versions.id'),nullable=False,unique=True)
    report_version_id=Column(ForeignKey('report_versions.id'),nullable=False)
    locator=Column(JSONB,nullable=False)
    source_ordinal=Column(Text)
    section_path=Column(JSONB,nullable=False,default=list)

class ReportFieldDefinition(Base):
    __tablename__='report_field_definitions'
    key=Column(String(64),primary_key=True)
    display_name=Column(Text,nullable=False)
    aliases=Column(JSONB,nullable=False)
    registry_version=Column(String(80),nullable=False)

class ReportFieldValue(Base):
    __tablename__='report_field_values'
    id=Column(String(36),primary_key=True,default=new_id)
    record_version_id=Column(ForeignKey('source_record_versions.id'),nullable=False,index=True)
    field_key=Column(ForeignKey('report_field_definitions.key'),nullable=False,index=True)
    candidate_key=Column(String(100),nullable=False)
    source_label=Column(Text)
    raw_text=Column(Text)
    normalized_value=Column(JSONB)
    value_state=Column(String(24),nullable=False)
    extraction_method=Column(String(24),nullable=False)
    verification_state=Column(String(24),nullable=False,default='pending')
    rule_version=Column(String(80),nullable=False)
    __table_args__=(UniqueConstraint('record_version_id','field_key','candidate_key'),
        CheckConstraint("value_state IN ('extracted','source_blank','not_observed','not_applicable','report_missing','locator_pending','unreadable','conflict')"),
        CheckConstraint("value_state != 'extracted' OR (raw_text IS NOT NULL AND length(trim(raw_text)) > 0)"))

class ReportFieldEvidence(Base):
    __tablename__='report_field_evidence'
    field_value_id=Column(ForeignKey('report_field_values.id'),primary_key=True)
    evidence_unit_id=Column(ForeignKey('report_evidence_units.id'),primary_key=True)
    role=Column(String(24),primary_key=True,default='value')

class ReportConfirmationArchive(Base):
    __tablename__='report_confirmation_archive'
    id=Column(String(36),primary_key=True,default=new_id)
    source_key=Column(String(64),unique=True,nullable=False)
    legacy_record_key=Column(String(128),nullable=False,index=True)
    source_path=Column(Text,nullable=False)
    source_sha256=Column(String(64),nullable=False)
    source_locator=Column(JSONB,nullable=False)
    original_decision=Column(JSONB,nullable=False)
    origin_kind=Column(String(32),nullable=False)
    record_id=Column(ForeignKey('source_records.id'),index=True)
    match_state=Column(String(24),nullable=False,default='unmatched')
    match_evidence=Column(JSONB,nullable=False,default=dict)

class ReportFieldDecision(Base):
    __tablename__='report_field_decisions'
    id=Column(String(36),primary_key=True,default=new_id)
    record_id=Column(ForeignKey('source_records.id'),nullable=False,index=True)
    record_version_id=Column(ForeignKey('source_record_versions.id'),nullable=False)
    field_key=Column(ForeignKey('report_field_definitions.key'),nullable=False)
    action=Column(String(32),nullable=False)
    decision_value=Column(JSONB)
    selected_candidate_id=Column(ForeignKey('report_field_values.id'))
    source_confirmation_id=Column(ForeignKey('report_confirmation_archive.id'))
    actor_id=Column(String(36))
    reason=Column(Text,nullable=False)
    created_at=Column(DateTime(timezone=True),default=utcnow,nullable=False)

class ReportFieldHead(Base):
    __tablename__='report_field_heads'
    record_id=Column(ForeignKey('source_records.id'),primary_key=True)
    field_key=Column(ForeignKey('report_field_definitions.key'),primary_key=True)
    decision_id=Column(ForeignKey('report_field_decisions.id'),nullable=False)
    row_version=Column(Integer,nullable=False,default=1)

class ReportQualityIssue(Base):
    __tablename__='report_parse_issues'
    id=Column(String(36),primary_key=True,default=new_id)
    parse_file_id=Column(ForeignKey('report_parse_files.id'),nullable=False,index=True)
    record_version_id=Column(ForeignKey('source_record_versions.id'))
    code=Column(String(64),nullable=False,index=True)
    detail=Column(JSONB,nullable=False)
    status=Column(String(24),nullable=False,default='open')

TABLE_NAMES=['report_file_origins','report_versions','report_parse_files','report_evidence_units','report_record_origins',
 'report_field_definitions','report_field_values','report_field_evidence','report_confirmation_archive','report_field_decisions',
 'report_field_heads','report_parse_issues']
