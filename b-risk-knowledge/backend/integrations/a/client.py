"""Service-side A client; no session references are stored or sent on background reads."""
import hashlib
import json
import re
from urllib.parse import quote
import httpx

MAX_JSON = 5 * 1024 * 1024
MAX_ATTACHMENT = 10 * 1024 * 1024


class AClientError(Exception):
    def __init__(self, status, code):
        self.status, self.code = status, code
        super().__init__(code)


class AClient:
    def __init__(self, base, key, *, transport=None):
        self.base = base.rstrip('/')
        self.client = httpx.Client(headers={'Authorization': 'Bearer ' + key}, transport=transport,
                                   timeout=httpx.Timeout(60.0), follow_redirects=False, trust_env=False)

    def close(self):
        self.client.close()

    @staticmethod
    def _id(value):
        if not isinstance(value, str) or not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9_.:-]{0,127}', value):
            raise AClientError(422, 'INVALID_REFERENCE')
        return quote(value, safe='')

    def _get(self, path, limit, params=None):
        try:
            with self.client.stream('GET', self.base + path, params=params) as response:
                if response.status_code != 200:
                    status = response.status_code
                    if status not in (401, 403, 404, 410, 413, 422, 429):
                        status = 503
                    raise AClientError(status, 'A_HTTP_ERROR')
                content = bytearray()
                for chunk in response.iter_bytes():
                    if len(content) + len(chunk) > limit:
                        raise AClientError(413, 'A_RESPONSE_TOO_LARGE')
                    content.extend(chunk)
                return bytes(content)
        except httpx.HTTPError as exc:
            raise AClientError(503, 'A_UNAVAILABLE') from exc

    def metadata(self, delivery_id, *, org_id, project_id, task_id, version):
        raw = self._get('/api/work/delivery-meta/' + self._id(delivery_id), MAX_JSON)
        try:
            value = json.loads(raw.decode('utf-8'))
            required = ('source_system', 'org_id', 'project_id', 'task_id', 'delivery_id', 'delivery_version',
                        'eligible', 'ineligible_reason', 'withdrawn', 'withdrawn_at', 'withdraw_reason', 'is_demo')
            if not isinstance(value, dict) or any(k not in value for k in required):
                raise ValueError()
            if any(type(value[k]) is not bool for k in ('eligible', 'withdrawn', 'is_demo')):
                raise ValueError()
            if type(value['delivery_version']) is not int or value['delivery_version'] < 1:
                raise ValueError()
            if any(value[k] is not None and not isinstance(value[k], str) for k in ('ineligible_reason', 'withdrawn_at', 'withdraw_reason')):
                raise ValueError()
        except (ValueError, UnicodeError, TypeError):
            raise AClientError(503, 'A_INVALID_METADATA')
        if (value['source_system'], value['org_id'], value['project_id'], value['task_id'], value['delivery_id'], value['delivery_version']) != ('a', org_id, project_id, task_id, delivery_id, version):
            raise AClientError(409, 'A_REFERENCE_MISMATCH')
        if value['withdrawn']:
            raise AClientError(410, 'A_WITHDRAWN')
        if not value['eligible']:
            raise AClientError(422, 'A_NOT_ELIGIBLE')
        return value

    def snapshot(self, delivery_id):
        return self._get('/api/work/snapshot/' + self._id(delivery_id), MAX_JSON)

    def prepare(self, delivery_id, *, org_id, project_id, task_id, version):
        """Validate metadata before and after fetching; caller must still persist atomically."""
        from .offline import _json
        from .mapping import convert
        scope = dict(org_id=org_id, project_id=project_id, task_id=task_id, version=version)
        first = self.metadata(delivery_id, **scope)
        raw = self.snapshot(delivery_id)
        try:
            source = _json(raw)
            task = source['task']
            if (task['id'] != task_id or source['version'] != version or
                not any(d.get('id') == delivery_id and d.get('version') == version
                        for d in task.get('deliveries', []))):
                raise AClientError(409, 'A_REFERENCE_MISMATCH')
            result = convert(raw, source, org_id=org_id, project_id=project_id, is_demo=first['is_demo'])
        except (KeyError, TypeError, ValueError) as exc:
            raise AClientError(422, 'A_INVALID_SNAPSHOT') from exc
        second = self.metadata(delivery_id, **scope)
        if first != second:
            raise AClientError(409, 'A_METADATA_CHANGED')
        return raw, result, second

    def attachment(self, delivery_id, evidence):
        self._id(delivery_id)
        evidence_id = self._id(evidence['id'])
        if type(evidence.get('size')) is not int or not 0 <= evidence['size'] <= MAX_ATTACHMENT:
            raise AClientError(413, 'A_ATTACHMENT_TOO_LARGE')
        if not isinstance(evidence.get('sha256'), str) or not re.fullmatch(r'[0-9a-f]{64}', evidence['sha256']):
            raise AClientError(422, 'A_INVALID_HASH')
        params = {'deliveryId': delivery_id}
        # Metadata is fetched with the same delivery reference and must match the frozen list.
        try:
            meta = json.loads(self._get('/api/work/evidence-meta/' + evidence_id, MAX_JSON, params).decode('utf-8'))
            if any(meta.get(k) != evidence.get(k) for k in ('id', 'name', 'mime', 'size', 'sha256')):
                raise AClientError(409, 'A_ATTACHMENT_METADATA_MISMATCH')
        except (ValueError, UnicodeError, AttributeError):
            raise AClientError(503, 'A_INVALID_ATTACHMENT_METADATA')
        raw = self._get('/api/work/evidence/' + evidence_id, MAX_ATTACHMENT, params)
        if len(raw) != evidence['size'] or hashlib.sha256(raw).hexdigest() != evidence['sha256']:
            raise AClientError(409, 'A_ATTACHMENT_HASH_MISMATCH')
        return raw
