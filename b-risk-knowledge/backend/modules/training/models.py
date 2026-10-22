from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, UniqueConstraint, Float
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column
from ...db import Base
from ...models import new_id, utcnow


class TrainingQuestion(Base):
    __tablename__ = 'training_questions'
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    generation_key: Mapped[str] = mapped_column(String(64), unique=True)
    project_id: Mapped[str] = mapped_column(String(128), index=True)
    type: Mapped[str] = mapped_column(String(32))
    scene_code: Mapped[str] = mapped_column(String(64))
    current_revision: Mapped[int] = mapped_column(Integer, default=1)
    row_version: Mapped[int] = mapped_column(Integer, default=1)
    scope: Mapped[dict] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)


class QuestionRevision(Base):
    __tablename__ = 'question_revisions'
    __table_args__ = (UniqueConstraint('question_id', 'version'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    question_id: Mapped[str] = mapped_column(ForeignKey('training_questions.id'), index=True)
    version: Mapped[int] = mapped_column(Integer)
    stem: Mapped[str] = mapped_column(String(4000))
    options: Mapped[list] = mapped_column(JSONB)
    answer: Mapped[dict] = mapped_column(JSONB)
    rubric: Mapped[list] = mapped_column(JSONB)
    source_versions: Mapped[list] = mapped_column(JSONB)
    state: Mapped[str] = mapped_column(String(32), default='draft', index=True)
    model_ref: Mapped[str] = mapped_column(String(128))
    scoring_version: Mapped[str] = mapped_column(String(64), default='training-rules-v1')
    row_version: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class LearningPackage(Base):
    __tablename__ = 'learning_packages'
    __table_args__ = (UniqueConstraint('package_key', 'version'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    package_key: Mapped[str] = mapped_column(String(128))
    version: Mapped[int] = mapped_column(Integer)
    title: Mapped[str] = mapped_column(String(200))
    project_id: Mapped[str] = mapped_column(String(128), index=True)
    role_scope: Mapped[list] = mapped_column(JSONB)
    state: Mapped[str] = mapped_column(String(32), default='draft')
    row_version: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)


class LearningPackageItem(Base):
    __tablename__ = 'learning_package_items'
    __table_args__ = (UniqueConstraint('package_version_id', 'position'), UniqueConstraint('package_version_id', 'question_revision_id'))
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    package_version_id: Mapped[str] = mapped_column(ForeignKey('learning_packages.id'), index=True)
    question_revision_id: Mapped[str] = mapped_column(ForeignKey('question_revisions.id'))
    position: Mapped[int] = mapped_column(Integer)


class TrainingAttempt(Base):
    __tablename__ = 'training_attempts'
    __table_args__ = (UniqueConstraint('learner_id', 'idempotency_key'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    learner_id: Mapped[str] = mapped_column(ForeignKey('user_links.id'), index=True)
    package_version_id: Mapped[str] = mapped_column(ForeignKey('learning_packages.id'), index=True)
    idempotency_key: Mapped[str] = mapped_column(String(128))
    state: Mapped[str] = mapped_column(String(32), default='in_progress')
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    result_state: Mapped[str] = mapped_column(String(32), default='not_submitted')
    grading_mode: Mapped[str] = mapped_column(String(32), default='rules')


class TrainingAnswer(Base):
    __tablename__ = 'training_answers'
    __table_args__ = (UniqueConstraint('attempt_id', 'question_revision_id'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    attempt_id: Mapped[str] = mapped_column(ForeignKey('training_attempts.id'), index=True)
    question_revision_id: Mapped[str] = mapped_column(ForeignKey('question_revisions.id'))
    answer: Mapped[dict] = mapped_column(JSONB)
    suggested_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    confirmed_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    feedback: Mapped[dict] = mapped_column(JSONB, default=dict)
    score_kind: Mapped[str] = mapped_column(String(32), default='not_scored')
    scoring_version: Mapped[str] = mapped_column(String(64), default='training-rules-v1')
    model_ref: Mapped[str] = mapped_column(String(128), default='none')
    row_version: Mapped[int] = mapped_column(Integer, default=1)


class TrainingScoreReview(Base):
    __tablename__ = 'training_score_reviews'
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    answer_id: Mapped[str] = mapped_column(ForeignKey('training_answers.id'), index=True)
    reviewer_id: Mapped[str] = mapped_column(ForeignKey('user_links.id'))
    before_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    after_score: Mapped[float] = mapped_column(Float)
    reason: Mapped[str] = mapped_column(String(2000))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
