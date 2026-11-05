"""Exact, original-backed exceptions for reviewed cells; not global guessing rules."""
import hashlib,json
from ...storage import asset_path

def review_path(sha):
    if len(sha)!=64 or any(c not in '0123456789abcdef' for c in sha):raise ValueError('Invalid source hash')
    return asset_path(f'history/reviewed-mappings/{sha}.json')

def clean_locator(loc):return {k:v for k,v in loc.items() if k!='locator_space'}

class CellReview:
    def __init__(self,item):
        self.data={};self.sha=item['sha256'];path=review_path(self.sha)
        if path.is_file():
            raw=path.read_bytes()
            assert hashlib.sha256(raw).hexdigest()==item.get('context',{}).get('mapping_review_sha256')
            self.data=json.loads(raw.decode('utf-8'));assert self.data['source_sha256']==self.sha

    def split(self,u,label,ev):
        for spec in self.data.get('sections',[]):
            if clean_locator(spec['original_location'])==u['locator']:
                assert u['text']==spec['quote'] and label==spec['original_label']
                return []  # Verified merged heading, no actual problem or inferred category.
        for spec in self.data.get('splits',[]):
            if clean_locator(spec['original_location'])!=u['locator']:continue
            assert u['text']==spec['quote'] and label==spec['original_label']
            fields=[]
            for part in spec['split_fields']:
                assert part['field_key'] in {'problem_description','basis_or_clause','rectification_advice','rectification_requirement'}
                assert u['text'][slice(*part['span'])]==part['value']
                e=ev(part['field_key'],u,part['source_label'],part['span'])
                e['method']='original_cell_segments_reviewed';e['details']['review_method']='assistant_original_xml_readback'
                e['details']['user_confirmation']=False;fields.append(e)
            assert sum(e['field_key']=='problem_description' for e in fields)==1
            return fields
        return None

    def correct_fields(self,fields,loc,units,ev):
        corrections=[s for s in self.data.get('conflicts',[]) if clean_locator(s['record_locator'])==loc]
        if not corrections:return fields
        keys={s['proposed_field'] for s in corrections};assert keys<= {'problem_description','source_category','basis_or_clause'}
        corrected=[e for e in fields if e['field_key'] not in keys]
        for spec in corrections:
            found=[u for u in units if u['locator']==clean_locator(spec['evidence_locator'])]
            assert len(found)==1 and found[0]['text']==spec['quote']
            assert spec['quote'][slice(*spec['span'])]==spec['value']
            e=ev(spec['proposed_field'],found[0],spec['source_field_label'],spec['span'])
            e['method']='original_physical_column_reviewed';e['details'].update(review_method='assistant_original_xml_readback',user_confirmation=False)
            corrected.append(e)
        return corrected
