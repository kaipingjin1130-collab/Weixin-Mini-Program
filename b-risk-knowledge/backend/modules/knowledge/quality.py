from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from ...db import Session
from ...models import new_id, utcnow
from ..ingestion.models import SourceRecord, SourceRecordVersion
from .models import QualityIssue


def ensure_issues(db, version):
    for n, message in enumerate(version.issues):
        rule, field, severity = f'SOURCE_WARNING_{n}', 'source', 'warning'
        for token, code, column in [('日期', 'INVALID_DATE', 'occurred_on'), ('images', 'INVALID_IMAGES', 'images'),
                                   ('后备身份', 'FALLBACK_ID', 'record_id'), ('描述', 'MISSING_DESCRIPTION', 'description')]:
            if token in message:
                rule, field = code, column
                break
        if rule == 'MISSING_DESCRIPTION':
            severity = 'error'
        db.execute(insert(QualityIssue).values(id=new_id(), record_version_id=version.id, rule_code=rule, field=field,
                   severity=severity, message=message, status='open', row_version=1, created_at=utcnow())
                   .on_conflict_do_nothing(index_elements=['record_version_id', 'rule_code']))
    reference = version.raw_fields.get('standard_reference')
    if reference:
        db.execute(insert(QualityIssue).values(id=new_id(), record_version_id=version.id, rule_code='UNVERIFIED_STANDARD',
                   field='standard_reference', severity='warning', message='来源标准引用尚未独立核验，不作为有效标准。',
                   status='open', row_version=1, created_at=utcnow()).on_conflict_do_nothing(index_elements=['record_version_id', 'rule_code']))


def backfill():
    with Session.begin() as db:
        versions = db.scalars(select(SourceRecordVersion).join(SourceRecord,
            (SourceRecord.id == SourceRecordVersion.record_id) & (SourceRecord.current_version == SourceRecordVersion.version))).all()
        for version in versions:
            ensure_issues(db, version)
