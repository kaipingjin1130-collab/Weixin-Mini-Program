from typing import Literal
from pydantic import Field, SecretStr
from ..knowledge.schemas import Strict


class Settings(Strict):
    enabled: bool = False
    deepseek_api_key: SecretStr = SecretStr('')
    model: str = Field(default='deepseek-v4-flash', min_length=1, max_length=128, pattern=r'^[A-Za-z0-9_.-]+$')
    external_calls_enabled: bool = False
    max_seconds: int = Field(default=180, ge=15, le=900)
    max_tokens: int = Field(default=4096, ge=256, le=16000)
    max_records: int = Field(default=20, ge=1, le=50)


class Reference(Strict):
    kind: Literal['asset','record','standard','work']
    id: str = Field(min_length=1, max_length=128)


class Submit(Strict):
    project_id: str = Field(min_length=1, max_length=128)
    kind: Literal['parse','extract','agent']
    title: str = Field(min_length=1, max_length=200)
    prompt: str = Field(default='', max_length=12000)
    references: list[Reference] = Field(min_length=1, max_length=50)
    allow_external: bool = False


class Control(Strict):
    row_version: int = Field(ge=1)
    action: Literal['cancel','resume']
    answer: str = Field(default='', max_length=8000)


class ToolCall(Strict):
    name: Literal['query_hazards','aggregate_hazards','search_cases','search_clauses','read_evidence','submit_extraction_job','get_job_status','save_draft','validate_questions']
    arguments: dict = Field(default_factory=dict, max_length=20)
