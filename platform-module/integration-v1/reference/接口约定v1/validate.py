"""Validate contract shapes and positive/negative examples; never calls A or B."""
import json
from pathlib import Path
from jsonschema import Draft202012Validator, FormatChecker

ROOT = Path(__file__).resolve().parent
schema = json.loads((ROOT / 'schemas.json').read_text(encoding='utf-8'))
examples = json.loads((ROOT / 'examples.json').read_text(encoding='utf-8'))
Draft202012Validator.check_schema(schema)
failures = []
for case in examples['cases']:
    selected = {**schema, '$ref': '#/$defs/' + case['schema']}
    validator = Draft202012Validator(selected, format_checker=FormatChecker())
    errors = list(validator.iter_errors(case['data']))
    if (not errors) != case['valid']:
        failures.append(case['name'] + ': ' + ('; '.join(e.message for e in errors) or 'invalid fixture unexpectedly accepted'))
if failures:
    raise SystemExit('\n'.join(failures))
print(f"PASS: {len(schema['$defs'])} schemas; {len(examples['cases'])} positive/negative shape cases")
print('Scope: JSON shapes only; no HTTP, authorization, idempotency, browser or business validation performed.')
