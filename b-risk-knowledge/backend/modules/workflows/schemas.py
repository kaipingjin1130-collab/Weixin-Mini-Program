from datetime import date
from typing import Annotated, Literal
from pydantic import Field, StringConstraints, model_validator
from ..knowledge.schemas import Strict

Label = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=200)]
Text = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=12000)]
Kind = Literal['taxonomy', 'hazard', 'compilation', 'guide', 'question']


class Evidence(Strict):
    kind: Literal['asset', 'record', 'standard', 'work']
    id: str = Field(min_length=1, max_length=128)
    quote: Text
    locator: Label


class Category(Strict):
    code: Label
    name: Label
    parent: str | None = None
    positive_examples: list[Text] = Field(min_length=1, max_length=20)
    negative_examples: list[Text] = Field(min_length=1, max_length=20)


class Taxonomy(Strict):
    kind: Literal['taxonomy'] = 'taxonomy'
    categories: list[Category] = Field(min_length=1, max_length=500)
    rule: Text

    @model_validator(mode='after')
    def tree(self):
        parents = {c.code: c.parent for c in self.categories}
        if len(parents) != len(self.categories):
            raise ValueError('分类编码重复')
        for code in parents:
            seen = set()
            while code is not None:
                if code not in parents or code in seen:
                    raise ValueError('分类父子关系无效')
                seen.add(code)
                code = parents[code]
        return self


class Observation(Strict):
    record_key: Label
    kind: Literal['inspection', 'rectification', 'reinspection']
    date: date
    text: Text
    evidence: list[Evidence] = Field(min_length=1, max_length=20)


class Hazard(Strict):
    kind: Literal['hazard'] = 'hazard'
    description: Text
    occurred_on: date
    stage: Label
    object_name: Label
    taxonomy_id: str = Field(min_length=1, max_length=36)
    category: Label
    subcategory: str = Field(default='', max_length=200)
    tags: list[Label] = Field(default_factory=list, max_length=30)
    classification_reason: Text
    original_risk: Label
    reviewed_risk: Label
    risk_reason: Text
    status: Literal['open', 'rectifying', 'closed', 'unverified'] = 'unverified'
    nature: Literal['observed_hazard', 'potential_source'] = 'observed_hazard'
    split_reason: Text
    relation: Literal['independent', 'recurrence', 'possible_duplicate'] = 'independent'
    related_event_id: str | None = Field(default=None, max_length=36)
    records: list[Observation] = Field(min_length=1, max_length=200)

    @model_validator(mode='after')
    def consistency(self):
        keys = [(x.record_key, x.kind) for x in self.records]
        if len(keys) != len(set(keys)):
            raise ValueError('事件内检查记录重复')
        if self.relation != 'independent' and not self.related_event_id:
            raise ValueError('关联关系须选择已有事件')
        if not any(r.kind == 'inspection' for r in self.records):
            raise ValueError('事件必须有检查记录')
        if self.status == 'closed' and not all(any(r.kind == k for r in self.records) for k in ('rectification', 'reinspection')):
            raise ValueError('闭环必须有整改和复查证据')
        if any(r.date < self.occurred_on for r in self.records):
            raise ValueError('记录不能早于事件日期')
        rectified = [r.date for r in self.records if r.kind == 'rectification']
        if self.status == 'closed' and max(r.date for r in self.records if r.kind == 'reinspection') < max(rectified):
            raise ValueError('闭环复查不能早于最后整改')
        return self


class Claim(Strict):
    text: Text
    nature: Literal['fact', 'source_conclusion', 'analysis', 'hypothesis']
    evidence: list[Evidence] = Field(default_factory=list, max_length=30)

    @model_validator(mode='after')
    def grounded(self):
        if self.nature in {'fact', 'source_conclusion'} and not self.evidence:
            raise ValueError('事实/已有结论须有证据')
        return self


class Compilation(Strict):
    kind: Literal['compilation'] = 'compilation'
    mode: Literal['single', 'category', 'project']
    event_ids: list[str] = Field(min_length=1, max_length=100)
    background: Text
    claims: list[Claim] = Field(min_length=1, max_length=100)
    differences: Text
    limitations: list[Text] = Field(min_length=1, max_length=30)
    missing: list[Label] = Field(default_factory=list, max_length=30)


class Parameter(Strict):
    name: Label
    value: str | None = Field(default=None, max_length=1000)
    evidence: list[Evidence] = Field(default_factory=list, max_length=10)

    @model_validator(mode='after')
    def grounded(self):
        if self.value and not self.evidence:
            raise ValueError('关键参数必须有来源')
        return self


class Step(Strict):
    number: Label
    title: Label
    operation: Text
    risks: list[Text] = Field(min_length=1, max_length=20)
    measures: list[Text] = Field(min_length=1, max_length=20)
    checks: list[Text] = Field(min_length=1, max_length=20)
    evidence: list[Evidence] = Field(min_length=1, max_length=20)


class Guide(Strict):
    kind: Literal['guide'] = 'guide'
    conditions: dict[str, Label] = Field(min_length=1, max_length=30)
    required_conditions: list[Label] = Field(min_length=1, max_length=30)
    preparation: Text
    implementation: Text
    risk_control: Text
    acceptance: Text
    emergency: Text
    steps: list[Step] = Field(min_length=1, max_length=100)
    parameters: list[Parameter] = Field(default_factory=list, max_length=100)
    missing: list[Label] = Field(default_factory=list, max_length=30)
    conflicts: list[Text] = Field(default_factory=list, max_length=30)

    @model_validator(mode='after')
    def unique_steps(self):
        if len({s.number for s in self.steps}) != len(self.steps):
            raise ValueError('步骤编号重复')
        return self


class Question(Strict):
    kind: Literal['question'] = 'question'
    guide_id: str = Field(min_length=1, max_length=36)
    chapter: Label
    role: Label
    step: Label
    risk: Label
    point: Label
    cognitive_level: Literal['recall', 'sequence', 'scenario', 'case']
    difficulty: Literal['easy', 'medium', 'hard']
    type: Literal['single', 'multiple', 'judgment', 'case']
    stem: Text
    options: dict[str, Label] = Field(default_factory=dict, max_length=8)
    answer: list[Label] = Field(min_length=1, max_length=8)
    explanation: Text
    rubric: list[Text] = Field(default_factory=list, max_length=20)
    evidence: list[Evidence] = Field(min_length=1, max_length=20)
    historical_case_ids: list[str] = Field(default_factory=list, max_length=20)

    @model_validator(mode='after')
    def answers(self):
        if len(self.answer) != len(set(self.answer)):
            raise ValueError('答案重复')
        if self.type in {'single', 'multiple'}:
            if len(self.options) < 2 or not set(self.answer) <= self.options.keys():
                raise ValueError('答案必须属于选项')
            if len(set(self.options.values())) != len(self.options):
                raise ValueError('选项重复')
        if self.type in {'single', 'judgment'} and len(self.answer) != 1:
            raise ValueError('必须有唯一答案')
        if self.type == 'multiple' and len(self.answer) < 2:
            raise ValueError('多选题至少两个答案')
        if self.type == 'judgment' and (self.answer[0] not in {'true', 'false'} or self.options):
            raise ValueError('判断题使用true/false答案')
        if self.type == 'case' and not self.rubric:
            raise ValueError('案例题必须有评分要点')
        return self


Content = Annotated[Taxonomy | Hazard | Compilation | Guide | Question, Field(discriminator='kind')]


class Draft(Strict):
    project_id: str = Field(min_length=1, max_length=128)
    series: str = Field(min_length=1, max_length=128, pattern=r'^\S(?:.*\S)?$')
    expected_version: int = Field(ge=0)
    title: str = Field(min_length=1, max_length=300)
    reason: Label
    content: Content


class Action(Strict):
    action: Literal['submit', 'approve', 'request_changes', 'publish', 'withdraw']
    row_version: int = Field(ge=1)
    reason: Text = Field(max_length=2000)
    evidence_checked: bool = False
