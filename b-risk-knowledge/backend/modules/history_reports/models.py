from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey, UniqueConstraint, CheckConstraint
from sqlalchemy.dialects.postgresql import JSONB
from ...db import Base
from ...models import new_id, utcnow


class HistoryDocument(Base):
    __tablename__ = 'history_documents'
    id = Column(String(36), primary_key=True, default=new_id)
    org_id = Column(String(128), nullable=False)
    scope_id = Column(String(128), nullable=False, index=True)
    asset_id = Column(ForeignKey('file_assets.id'), nullable=False)
    sha256 = Column(String(64), nullable=False)
    original_name = Column(Text, nullable=False)
    source_format = Column(String(16), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    __table_args__ = (UniqueConstraint('org_id', 'scope_id', 'sha256'),)


class HistoryOrigin(Base):
    __tablename__ = 'history_origins'
    id = Column(String(36), primary_key=True, default=new_id)
    document_id = Column(ForeignKey('history_documents.id'), nullable=False, index=True)
    origin_key = Column(String(64), nullable=False)
    provenance = Column(JSONB, nullable=False)
    __table_args__ = (UniqueConstraint('document_id', 'origin_key'),)


class HistoryImport(Base):
    __tablename__ = 'history_imports'
    id = Column(String(36), primary_key=True, default=new_id)
    document_id = Column(ForeignKey('history_documents.id'), nullable=False, index=True)
    config_hash = Column(String(64), nullable=False)
    parser_version = Column(String(80), nullable=False)
    dictionary_version = Column(String(80), nullable=False)
    status = Column(String(32), nullable=False)
    counts = Column(JSONB, nullable=False, default=dict)
    context = Column(JSONB, nullable=False, default=dict)
    created_by = Column(String(128), nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, default=utcnow)
    __table_args__ = (UniqueConstraint('document_id', 'config_hash'),)


class HistoryFinding(Base):
    __tablename__ = 'history_findings'
    id = Column(String(36), primary_key=True, default=new_id)
    import_id = Column(ForeignKey('history_imports.id'), nullable=False, index=True)
    source_key = Column(String(64), nullable=False)
    locator = Column(JSONB, nullable=False)
    review_state = Column(String(32), nullable=False, default='source_extracted')
    # Exactly 14 canonical business fields; no synonym columns or per-empty-field rows.
    project_name = Column(Text)
    engineering_project_name = Column(Text)
    inspection_date = Column(Text)
    inspection_location = Column(Text)
    problem_description = Column(Text, nullable=False)
    source_category = Column(Text)
    source_grade = Column(Text)
    basis_or_clause = Column(Text)
    rectification_requirement = Column(Text)
    rectification_advice = Column(Text)
    rectification_deadline = Column(Text)
    reported_response = Column(Text)
    reinspection_conclusion = Column(Text)
    hazard_category = Column(Text)
    __table_args__ = (UniqueConstraint('import_id', 'source_key'),
        CheckConstraint("length(trim(problem_description)) > 0"),)


class HistoryEvidence(Base):
    __tablename__ = 'history_evidence'
    id = Column(String(36), primary_key=True, default=new_id)
    finding_id = Column(ForeignKey('history_findings.id'), nullable=False, index=True)
    field_key = Column(String(64), nullable=False)
    source_label = Column(Text)
    quote = Column(Text, nullable=False)
    locator = Column(JSONB, nullable=False)
    source_kind = Column(String(32), nullable=False)
    method = Column(String(64), nullable=False)
    details = Column(JSONB, nullable=False, default=dict)


class HistoryIssue(Base):
    __tablename__ = 'history_issues'
    id = Column(String(36), primary_key=True, default=new_id)
    import_id = Column(ForeignKey('history_imports.id'), nullable=False, index=True)
    finding_id = Column(ForeignKey('history_findings.id'), index=True)
    kind = Column(String(32), nullable=False, index=True)
    code = Column(String(80), nullable=False, index=True)
    source_label = Column(Text)
    target_field = Column(String(64))
    reason = Column(Text, nullable=False)
    quote = Column(Text)
    locator = Column(JSONB, nullable=False, default=dict)


TABLES = [HistoryDocument.__table__, HistoryOrigin.__table__, HistoryImport.__table__,
          HistoryFinding.__table__, HistoryEvidence.__table__, HistoryIssue.__table__]
