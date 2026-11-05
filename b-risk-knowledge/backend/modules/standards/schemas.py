from datetime import date
from typing import Annotated, Literal
from pydantic import Field, StringConstraints, model_validator
from ..knowledge.schemas import Strict

Label = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=200)]
Text = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=12000)]


class Scope(Strict):
    project_types: list[Label] = Field(default_factory=list, max_length=30)
    regions: list[Label] = Field(default_factory=list, max_length=30)
    object_types: list[Label] = Field(default_factory=list, max_length=30)
    stages: list[Label] = Field(default_factory=list, max_length=30)


class Clause(Strict):
    number: str = Field(min_length=1, max_length=100, pattern=r'^\S(?:.*\S)?$')
    text: Text
    chapter: Label
    parent_number: str | None = Field(default=None, min_length=1, max_length=100)
    page: int | None = Field(default=None, ge=1, le=100000)
    locator: str = Field(default='', max_length=500)
    preconditions: list[Text] = Field(default_factory=list, max_length=20)
    exceptions: list[Text] = Field(default_factory=list, max_length=20)
    tables: list[Text] = Field(default_factory=list, max_length=20)
    notes: list[Text] = Field(default_factory=list, max_length=20)
    references: list[Label] = Field(default_factory=list, max_length=30)

    @model_validator(mode='after')
    def has_locator(self):
        if self.page is None and not self.locator.strip():
            raise ValueError('每条原文必须提供页码或可核对的位置。')
        return self


class Draft(Strict):
    project_id: str = Field(min_length=1, max_length=128)
    code: str = Field(min_length=1, max_length=128, pattern=r'^\S(?:.*\S)?$')
    edition: str = Field(min_length=1, max_length=100, pattern=r'^\S(?:.*\S)?$')
    expected_version: int = Field(ge=0)
    title: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=300)]
    source_asset_id: str = Field(min_length=1, max_length=36)
    valid_from: date
    # Exclusive upper bound: a replacement starting this day cannot overlap.
    valid_until: date | None = None
    scope: Scope = Field(default_factory=Scope)
    maintainer: Label
    reason: Label
    clauses: list[Clause] = Field(min_length=1, max_length=200)

    @model_validator(mode='after')
    def consistency(self):
        if self.valid_until is not None and self.valid_until <= self.valid_from:
            raise ValueError('废止日期必须晚于生效日期。')
        parents = {c.number: c.parent_number for c in self.clauses}
        if len(parents) != len(self.clauses):
            raise ValueError('同一版本内条号不能重复。')
        for number in parents:
            seen = set()
            while number is not None:
                if number not in parents or number in seen:
                    raise ValueError('父条文必须属于当前版本，且层级不能循环。')
                seen.add(number)
                number = parents[number]
        return self


class Transition(Strict):
    row_version: int = Field(ge=1)
    action: Literal['submit', 'approve', 'request_changes', 'publish', 'withdraw']
    reason: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=2000)]
    evidence_checked: bool = False


class Applicability(Strict):
    # This is a metadata check, not semantic matching or a professional decision.
    purpose: Literal['current_rectification', 'historical_review']
    event_date: date | None = None
    project_type: str | None = Field(default=None, max_length=200)
    region: str | None = Field(default=None, max_length=200)
    object_type: str | None = Field(default=None, max_length=200)
    stage: str | None = Field(default=None, max_length=200)
