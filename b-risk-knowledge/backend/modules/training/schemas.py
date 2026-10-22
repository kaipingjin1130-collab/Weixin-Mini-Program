from typing import Literal
from pydantic import Field, model_validator
from ..knowledge.schemas import Strict, VersionAction


class Generate(Strict):
    knowledge_revision_ids: list[str] = Field(min_length=1, max_length=10)
    types: list[Literal['single_choice', 'multiple_choice', 'case_answer']] = Field(min_length=1, max_length=3)


class Option(Strict):
    id: str = Field(pattern=r'^[a-z]$')
    text: str = Field(min_length=1, max_length=2000)


class Rubric(Strict):
    point: str = Field(min_length=1, max_length=2000)
    keywords: list[str] = Field(min_length=1, max_length=10)
    points: float = Field(gt=0, le=100)


class Content(Strict):
    stem: str = Field(min_length=1, max_length=4000)
    options: list[Option] = Field(default_factory=list, max_length=8)
    answer: dict = Field(default_factory=dict)
    rubric: list[Rubric] = Field(default_factory=list, max_length=10)


class Draft(VersionAction):
    content: Content


class Package(Strict):
    title: str = Field(min_length=1, max_length=200)
    package_key: str = Field(pattern=r'^[A-Za-z0-9_.:-]{1,128}$')
    version: int = Field(ge=1)
    project_id: str = Field(max_length=128)
    question_revision_ids: list[str] = Field(min_length=1, max_length=30)
    role_scope: list[Literal['learner', 'teacher', 'admin', 'processor', 'reviewer']] = Field(default_factory=lambda: ['learner','admin'], min_length=1, max_length=5)


class Publish(Strict):
    row_version: int = Field(ge=1)
    reason: str = Field(min_length=1, max_length=2000)


class Start(Strict):
    package_version_id: str = Field(max_length=36)
    grading_mode: Literal['rules', 'llm', 'simulate_failure'] = 'rules'


class Answer(Strict):
    row_version: int = Field(ge=0)
    selected: list[str] = Field(default_factory=list, max_length=8)
    text: str = Field(default='', max_length=8000)


class ScoreReview(Strict):
    row_version: int = Field(ge=1)
    score: float = Field(ge=0, le=100)
    reason: str = Field(min_length=1, max_length=2000)


class Feedback(Strict):
    rating: Literal['useful', 'unclear', 'incorrect']
    comment: str = Field(default='', max_length=2000)


class LearnerQuestion(Strict):
    """This schema deliberately has no answer/rubric/source knowledge body fields."""
    question_id: str
    revision_id: str
    type: str
    stem: str
    options: list[Option]
    max_score: float
    position: int
