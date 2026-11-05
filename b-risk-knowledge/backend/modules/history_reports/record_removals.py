"""Reviewed duplicate-row deletion policy; no business values are inferred here."""
import hashlib,json
from ...storage import asset_path

def removal_path(sha):
    assert len(sha)==64 and all(c in '0123456789abcdef' for c in sha)
    return asset_path(f'history/record-removals/{sha}.json')

def filter_result(result,item,context):
    path=removal_path(item['sha256'])
    if not path.is_file():return result
    raw=path.read_bytes();assert hashlib.sha256(raw).hexdigest()==context.get('record_removals_sha256')
    data=json.loads(raw.decode('utf-8'));assert data['source_sha256']==item['sha256']
    bykey={r['source_key']:r for r in data['records']};removed=set()
    for r in result['records']:
        if r['key'] not in bykey:continue
        proof=bykey[r['key']]
        assert r['locator']==proof['source_locator']
        # New evidence on a deleted row invalidates approval rather than silently erasing it.
        assert all(r['values'].get(k)==v for k,v in proof['source_fields_snapshot'].items()),'Deleted row facts changed; review coverage again'
        removed.add(r['key'])
    result['records']=[r for r in result['records'] if r['key'] not in removed]
    result['issues']=[i for i in result['issues'] if i.get('record_key') not in removed]
    result['counts']['findings']=len(result['records']);result['counts']['issues']=len(result['issues'])
    result['counts']['removed_duplicate_findings']=len(removed)
    return result
