import pytest
from sqlalchemy import select
from backend.db import Session
from backend.auth import Actor, Problem
from backend.modules.task_packages.models import TaskPackage
from backend.modules.ingestion.models import SourceRecord, SourceRecordVersion, ImportBatch, EvidenceItem
from backend.modules.ingestion.package_projection import project_package
from backend.modules.knowledge.service import source_context
import test_task_packages as packages

client = packages.client


def test_task_risks_are_versioned_selectable_and_revocable(client):
    body = packages.data()
    accepted = packages.accepted(client, body)
    ident = accepted['receipt_id']
    packages.wait(client, ident)
    actor = Actor('review', 'review', 'review', {'demo-airport'}, {'demo-airport': {'admin'}})
    with Session.begin() as db:
        package = db.get(TaskPackage, ident)
        batch = db.scalar(select(ImportBatch).where(ImportBatch.run_id == package.run_id))
        assert batch and batch.status == 'succeeded'
        assert project_package(db, package).id == batch.id
        version = db.scalar(select(SourceRecordVersion).where(SourceRecordVersion.batch_id == batch.id))
        assert version and version.provenance['task_package_id'] == ident
        version_id = version.id
        row = db.get(SourceRecord, version.record_id)
        assert row.external_record_id == body['issues'][0]['issue_id']
        assert source_context(db, version.id, actor)[0].id == version.id
        pictures = db.scalars(select(EvidenceItem).where(EvidenceItem.record_version_id == version.id, EvidenceItem.evidence_type == 'site_photo')).all()
        assert pictures and pictures[0].asset_id
    options = client.get('/api/v1/knowledge/source-options?project_id=demo-airport&limit=100', headers=packages.h('admin'))
    assert options.status_code == 200
    assert any(v['record_version_id'] == version_id for v in options.json()['items'])
    with Session.begin() as db:
        db.get(TaskPackage, ident).state = 'withdrawn'
    with Session() as db:
        with pytest.raises(Problem) as exc: source_context(db, version_id, actor)
        assert exc.value.status == 410
    options = client.get('/api/v1/knowledge/source-options?project_id=demo-airport&limit=100', headers=packages.h('admin'))
    assert not any(v['record_version_id'] == version_id for v in options.json()['items'])


def test_removed_risk_does_not_survive_latest_task_snapshot(client):
    body=packages.data();first=packages.accepted(client,body)['receipt_id'];packages.wait(client,first)
    with Session() as db:
        batch=db.scalar(select(ImportBatch).where(ImportBatch.run_id==db.get(TaskPackage,first).run_id))
        old=db.scalar(select(SourceRecordVersion).where(SourceRecordVersion.batch_id==batch.id)).id
    newer=packages.accepted(client,packages.data('v2',body['task_id']))['receipt_id'];packages.wait(client,newer)
    # Isolate the read guard against a ready newer snapshot without this issue.
    with Session.begin() as db:
        latest=db.get(TaskPackage,newer);latest.snapshot={**latest.snapshot,'issues':[]}
    actor=Actor('review','review','review',{'demo-airport'},{'demo-airport':{'admin'}})
    with Session() as db:
        with pytest.raises(Problem) as exc:source_context(db,old,actor)
        assert exc.value.code=='SOURCE_RECORD_REMOVED'
