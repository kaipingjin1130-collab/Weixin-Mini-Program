from typing import Literal
from pydantic import BaseModel, ConfigDict, Field


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class CreateRun(StrictModel):
    title: str = Field(default="演示资料完整性检查", min_length=1, max_length=200)
    project_id: Literal["demo-airport", "demo-metro"]
    scenario: Literal["success", "fail_once", "manual_failure"] = "success"
    duration_seconds: int = Field(default=6, ge=1, le=60)


class RetryRun(StrictModel):
    row_version: int = Field(ge=1)


class CreateBinding(StrictModel):
    user_id: str = Field(min_length=1, max_length=36)
    project_id: Literal["demo-airport", "demo-metro"]
    role: Literal["processor", "reviewer", "teacher", "learner"]


class DeleteBinding(StrictModel):
    row_version: int = Field(ge=1)
