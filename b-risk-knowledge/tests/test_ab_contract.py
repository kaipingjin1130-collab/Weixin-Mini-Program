import json
from pathlib import Path
from jsonschema import Draft202012Validator


def test_b_contract_examples():
    root = Path(__file__).resolve().parents[1] / 'contracts'
    schema = json.loads((root / 'ab-integration-v1.schema.json').read_text(encoding='utf-8'))
    examples = json.loads((root / 'ab-integration-v1.examples.json').read_text(encoding='utf-8'))
    for case in examples['cases']:
        definition = {'$schema': schema['$schema'], '$defs': schema['$defs'],
                      '$ref': '#/$defs/' + case['schema']}
        errors = list(Draft202012Validator(definition).iter_errors(case['data']))
        assert bool(errors) != case['valid'], case['name']
