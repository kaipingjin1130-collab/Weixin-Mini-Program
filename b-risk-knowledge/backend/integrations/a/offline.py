"""Read A's offline exports. This does not establish online eligibility or authority."""
import hashlib
import io
import json
from pathlib import PurePosixPath
import zipfile

MAX_JSON = 5 * 1024 * 1024
MAX_FILE = 10 * 1024 * 1024
MAX_ARCHIVE = 110 * 1024 * 1024
MAX_ENTRIES = 103


def _json(data):
    if len(data) > MAX_JSON:
        raise ValueError('snapshot exceeds 5 MiB')
    def pairs(items):
        result = {}
        for key, value in items:
            if key in result:
                raise ValueError('duplicate JSON key')
            result[key] = value
        return result
    return json.loads(data.decode('utf-8'), object_pairs_hook=pairs,
                      parse_constant=lambda _: (_ for _ in ()).throw(ValueError('invalid number')))


def read_export(path):
    """Return snapshot bytes, parsed JSON and verified attachment IDs; never extract files."""
    if hasattr(path, 'read'):
        data = path.read(MAX_ARCHIVE + 1)
    else:
        with open(path, 'rb') as source:
            data = source.read(MAX_ARCHIVE + 1)
    if len(data) > MAX_ARCHIVE:
        raise ValueError('input exceeds archive limit')
    if not zipfile.is_zipfile(io.BytesIO(data)):
        return data, _json(data), []
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        infos = archive.infolist()
        if len(infos) > MAX_ENTRIES or sum(i.file_size for i in infos) > MAX_ARCHIVE:
            raise ValueError('archive exceeds limits')
        names = set()
        for item in infos:
            name = item.filename
            p = PurePosixPath(name)
            if (not name or '\\' in name or p.is_absolute() or '..' in p.parts or
                    ':' in name or name in names or item.flag_bits & 1):
                raise ValueError('unsafe or duplicate archive member')
            names.add(name)
            if item.file_size > (MAX_JSON if name == 'task.json' else MAX_FILE):
                raise ValueError('archive member exceeds limit')
        raw = archive.read('task.json')
        snapshot = _json(raw)
        verified = []
        for entry in snapshot.get('evidence', []):
            name = entry.get('packagePath')
            if not isinstance(name, str) or name not in names:
                raise ValueError('missing attachment: ' + str(entry.get('id')))
            content = archive.read(name)
            if len(content) != entry.get('size') or hashlib.sha256(content).hexdigest() != entry.get('sha256'):
                raise ValueError('attachment size or hash mismatch: ' + str(entry.get('id')))
            verified.append(entry['id'])
        return raw, snapshot, verified
