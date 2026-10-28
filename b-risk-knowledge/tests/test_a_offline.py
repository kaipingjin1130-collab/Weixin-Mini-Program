import copy
import hashlib
import io
import json
from pathlib import Path
import zipfile

import pytest
from backend.integrations.a.offline import read_export
from backend.integrations.a.mapping import convert

EXAMPLES = Path(__file__).resolve().parent / 'fixtures/a-export'


def mapped(raw, source):
    return convert(raw, source, org_id='demo-org', project_id=source['project']['id'], is_demo=True)


def encoded(source):
    return json.dumps(source, ensure_ascii=False).encode('utf-8')


def test_actual_json_and_zip_are_stable_and_verified():
    raw, source, verified = read_export(EXAMPLES / 'completed-task-demo.zip')
    raw2, source2, none = read_export(EXAMPLES / 'completed-task-demo.json')
    assert raw == raw2 and source == source2 and not none
    assert verified == [source['evidence'][0]['id']]
    first = mapped(raw, source)
    assert first == mapped(raw2, source2)
    assert first['raw_sha256'] == hashlib.sha256(raw).hexdigest()
    assert first['package']['events'][0]['occurred_at'] is None
    assert first['package']['events'][0]['payload']['source_event'] == source['task']['events'][0]


def test_empty_issues_and_unlinked_person_are_not_invented():
    raw, source, _ = read_export(EXAMPLES / 'completed-task-demo.json')
    source = copy.deepcopy(source)
    source['task']['issues'] = []
    source['task']['events'][0]['actor'] = 'manual-person'
    source['task']['events'][0]['action'] = 'unrecognized-action'
    result = mapped(encoded(source), source)['package']
    assert result['issues'] == [] and result['data_completeness']['issues'] == 'complete'
    assert result['events'][0]['actor_id'] is None
    assert result['events'][0]['payload']['source_event']['actor'] == 'manual-person'
    assert result['events'][0]['event_type'] == 'a_unrecognized_action'


def test_reference_and_limits_are_rejected():
    raw, source, _ = read_export(EXAMPLES / 'completed-task-demo.json')
    bad = copy.deepcopy(source)
    bad['task']['issues'][0]['evidence'] = ['not-in-snapshot']
    with pytest.raises(ValueError, match='dangling_evidence'):
        mapped(encoded(bad), bad)
    bad = copy.deepcopy(source)
    bad['task']['events'] *= 46
    with pytest.raises(ValueError, match='limit'):
        mapped(encoded(bad), bad)
    with pytest.raises(ValueError, match='project reference'):
        convert(raw, source, org_id='demo-org', project_id='other', is_demo=True)


def test_legacy_date_precision_and_raw_binding():
    raw, source, _ = read_export(EXAMPLES / 'completed-task-demo.json')
    source['task']['records'][0]['sourceReportId'] = 'legacy-1'
    source['task']['records'][0]['occurredAt'] = '2026-01-01T00:00:00+08:00'
    with pytest.raises(ValueError, match='raw bytes'):
        mapped(raw, source)
    result = mapped(encoded(source), source)
    assert result['record_time_precision'][0]['precision'] == 'date'
    assert result['record_time_precision'][0]['original'] == '2026-01-01T00:00:00+08:00'
    assert result['record_time_precision'][1]['precision'] == 'unknown'


def test_zip_rejects_traversal_and_bad_hash():
    raw, source, _ = read_export(EXAMPLES / 'completed-task-demo.json')
    for malicious in (True, False):
        buffer = io.BytesIO()
        with zipfile.ZipFile(buffer, 'w') as z:
            z.writestr('task.json', raw)
            z.writestr('../escape' if malicious else source['evidence'][0]['packagePath'], b'bad')
        buffer.seek(0)
        with pytest.raises(ValueError):
            read_export(buffer)
