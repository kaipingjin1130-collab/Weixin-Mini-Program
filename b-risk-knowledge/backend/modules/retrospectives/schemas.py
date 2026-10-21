from typing import Literal
from pydantic import Field, model_validator
from ..knowledge.schemas import Strict, VersionAction


class Create(Strict):
    mode: Literal['task_process', 'historical_case']
    task_package_id: str | None = Field(default=None, max_length=36)
    record_version_ids: list[str] = Field(default_factory=list, max_length=20)
    template_version: Literal['process-review-v1'] = 'process-review-v1'

    @model_validator(mode='after')
    def source_choice(self):
        if self.mode == 'task_process' and (not self.task_package_id or self.record_version_ids):
            raise ValueError('task source required')
        if self.mode == 'historical_case' and (self.task_package_id or not self.record_version_ids or len(set(self.record_version_ids)) != len(self.record_version_ids)):
            raise ValueError('historical sources required')
        return self


class Finding(Strict):
    id: str = Field(min_length=1, max_length=128)
    type: str = Field(min_length=1, max_length=64)
    text: str = Field(min_length=1, max_length=4000)
    claim_kind: Literal['fact', 'inference', 'suggestion']
    event_refs: list[str] = Field(default_factory=list, max_length=100)
    evidence_refs: list[str] = Field(default_factory=list, max_length=100)
    review_state: Literal['unconfirmed', 'confirmed'] = 'unconfirmed'
    record_status: Literal['有记录', '缺记录', '不适用'] | None = None


class Draft(VersionAction):
    summary: str = Field(min_length=1, max_length=4000)
    findings: list[Finding] = Field(min_length=1, max_length=100)
    suggestions: list[Finding] = Field(default_factory=list, max_length=100)


class Convert(VersionAction):
    type: Literal['case_card', 'checkpoint_card'] = 'case_card'
