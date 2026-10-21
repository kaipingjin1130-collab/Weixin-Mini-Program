from typing import Literal
from pydantic import BaseModel, ConfigDict, Field, field_validator


class Strict(BaseModel):
    model_config = ConfigDict(extra='forbid', str_strip_whitespace=True)


class CreateRelease(Strict):
    project_id: str = Field(min_length=1, max_length=128)
    revision_ids: list[str] = Field(min_length=1, max_length=100)
    embedding_model: Literal['mock-hash-64', 'mock-hash-96'] = 'mock-hash-64'
    mock_scenario: Literal['normal', 'index_failure'] = 'normal'

    @field_validator('revision_ids')
    @classmethod
    def unique_ids(cls, value):
        if len(value) != len(set(value)):
            raise ValueError('Duplicate revision IDs')
        return value


class Activation(Strict):
    row_version: int = Field(ge=1)
    expected_active_id: str | None  # Required CAS across different releases.


class Withdrawal(Strict):
    row_version: int = Field(ge=1)
    reason: str = Field(min_length=1, max_length=2000)


class SearchInput(Strict):
    project_id: str = Field(min_length=1, max_length=128)
    question: str = Field(min_length=1, max_length=4000)
    scene_code: str = Field(default='generic', pattern=r'^[a-z][a-z0-9_]{0,63}$')
    object_type: str | None = Field(default=None, max_length=64)
    stage: Literal['preparation', 'execution', 'review', 'training'] | None = None
    conditions: dict[str, str | float | bool | None] = Field(default_factory=dict, max_length=32)
    card_type: Literal['case_card', 'checkpoint_card'] | None = None
    limit: int = Field(default=5, ge=1, le=20)
    answer_mode: Literal['extractive', 'simulate_timeout'] = 'extractive'


class Feedback(Strict):
    rating: Literal['useful', 'irrelevant', 'incorrect']
    comment: str = Field(default='', max_length=1000)
