import json
from contracts.tools.contract_rules import validate, content_hash, load_json, ROOT as CONTRACT_ROOT
from ...auth import authorize, Problem

LIMITS = load_json(CONTRACT_ROOT / 'limits.json')
KNOWN_EVENTS = {e['code'] for e in load_json(CONTRACT_ROOT / 'event-types.json')['items']}


def strict_json(content):
    def pairs(items):
        result = {}
        for key, value in items:
            if key in result:
                raise ValueError('Duplicate key')
            result[key] = value
        return result
    try:
        return json.loads(content.decode('utf-8'), object_pairs_hook=pairs,
                          parse_constant=lambda _: (_ for _ in ()).throw(ValueError('Nonfinite')))
    except (ValueError, UnicodeError, RecursionError):
        raise Problem(422, 'INVALID_JSON', 'JSON含重复键、非法数值、编码或结构错误。')


async def body_json(request):
    body = bytearray()
    async for chunk in request.stream():
        if len(body) + len(chunk) > LIMITS['request_bytes']:
            raise Problem(413, 'PACKAGE_TOO_LARGE', '任务包超过B00合同正文上限。')
        body.extend(chunk)
    return strict_json(bytes(body))


def scope(actor, data, action='package_receive'):
    if not isinstance(data, dict) or not all(isinstance(data.get(k), str) for k in ('project_id', 'org_id', 'producer')):
        raise Problem(422, 'INVALID_PACKAGE_ENVELOPE', '缺少有效的项目、组织或来源标识。')
    authorize(actor, action, data['project_id'])
    # Explicit local mock source registry. No grants are derived from request data.
    if data['org_id'] != actor.org_id or data['producer'] != 'a-demo':
        raise Problem(403, 'SOURCE_SCOPE_DENIED', '来源或组织不属于当前可信身份范围。')
    if actor.is_service and data['producer'] not in actor.producers:
        raise Problem(403, 'PRODUCER_DENIED', '服务身份不能代表此来源系统。')


def validate_package(data, actor):
    scope(actor, data)
    try:
        errors, warnings = validate('task-package.schema.json', data)
    except (RecursionError, ValueError, UnicodeError, TypeError):
        raise Problem(422, 'VALIDATION_ERROR', '任务包不符合B00结构、数值或引用约束。')
    if errors:
        raise Problem(422, 'VALIDATION_ERROR', '任务包不符合B00结构、时间、引用或完整性约束。')
    if data['is_demo'] is not True:
        raise Problem(422, 'DEMO_ONLY', '当前仅接收明确标注is_demo=true的模拟任务包。')
    return content_hash(data), warnings


def contract_response(schema, value):
    # Reuse B00 semantics, including lifecycle and evidence-reference constraints.
    errors, _ = validate(schema, value)
    if errors:
        raise Problem(503, 'RESPONSE_CONTRACT_ERROR', '响应未通过B00合同校验。')
    return value
