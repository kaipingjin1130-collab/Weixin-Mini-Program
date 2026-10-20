from typing import Literal
from pydantic import BaseModel, ConfigDict, Field


class Strict(BaseModel):
    model_config = ConfigDict(extra='forbid')


class Claim(Strict):
    text: str = Field(min_length=1, max_length=4000)
    evidence_ids: list[str] = Field(min_length=1, max_length=10)
    source_kind: Literal['source_effective', 'human_annotation'] = 'source_effective'


class Standard(Strict):
    name: str = Field(min_length=1, max_length=500)
    clause: str | None = Field(default=None, max_length=500)
    edition: str | None = Field(default=None, max_length=100)
    origin: Literal['source_unverified', 'system_supplement']
    verification_status: Literal['pending_verification', 'not_used'] = 'pending_verification'


class Card(Strict):
    title: str = Field(min_length=1, max_length=200)
    type: Literal['case_card', 'checkpoint_card']
    facts: list[Claim] = Field(min_length=1, max_length=30)
    suggestions: list[str] = Field(default_factory=list, max_length=30)
    standards: list[Standard] = Field(default_factory=list, max_length=20)
    project_name: str = Field(max_length=200)
    occurred_on: str | None = Field(default=None, max_length=10)
    is_mock: Literal[True] = True


class GenerateInput(Strict):
    record_version_ids: list[str] = Field(min_length=1, max_length=20)
    type: Literal['case_card', 'checkpoint_card']
    template_version: Literal['mock-v1'] = 'mock-v1'
    mock_scenario: Literal['normal', 'bad_evidence', 'unverified_standard'] = 'normal'


class PatchDraft(Strict):
    row_version: int = Field(ge=1)
    revision_id: str = Field(max_length=36)
    content: Card
    reason: str = Field(min_length=1, max_length=2000)


class VersionAction(Strict):
    row_version: int = Field(ge=1)
    revision_id: str = Field(max_length=36)
    reason: str = Field(min_length=1, max_length=2000)
    evidence_checked: bool = False


class PatchIssue(Strict):
    row_version: int = Field(ge=1)
    status: Literal['open', 'resolved', 'ignored']
    reason: str = Field(min_length=1, max_length=2000)
    annotation: str | None = Field(default=None, max_length=4000)
