from __future__ import annotations
from sqlmodel import SQLModel, Field, Column
from datetime import datetime
from typing import Optional, List
from enum import Enum
import uuid
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB


class InterviewStatus(str, Enum):
    SCHEDULED = "Scheduled"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"


class Candidate(SQLModel, table=True):
    __tablename__ = "candidates"

    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    email: str = Field(unique=True, index=True)
    phonenumber: Optional[str] = None
    experience: float
    skills: List[str] = Field(default=[], sa_column=Column(JSONB))
    createdat: datetime = Field(default_factory=datetime.utcnow)
    modifiedat: datetime = Field(default_factory=datetime.utcnow)


class Interview(SQLModel, table=True):
    __tablename__ = "interviews"

    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    candidate_id: uuid.UUID = Field(foreign_key="candidates.id", index=True)
    recruiter_name: str
    start_time: datetime
    end_time: datetime
    status: InterviewStatus = Field(default=InterviewStatus.SCHEDULED)
    createdat: datetime = Field(default_factory=datetime.utcnow)
    modifiedat: datetime = Field(default_factory=datetime.utcnow)


class CandidateCreate(SQLModel):
    name: str
    email: str
    phonenumber: Optional[str] = None
    experience: float
    skills: list[str] = []


class CandidateUpdate(SQLModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phonenumber: Optional[str] = None
    experience: Optional[float] = None
    skills: Optional[list[str]] = None


class InterviewCreate(SQLModel):
    candidate_id: uuid.UUID
    recruiter_name: str
    start_time: datetime
    end_time: datetime


class InterviewUpdate(SQLModel):
    recruiter_name: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None


class InterviewStatusUpdate(SQLModel):
    status: InterviewStatus
    changed_by: Optional[str] = None


class InterviewAuditLog(SQLModel, table=True):
    __tablename__ = "interview_audit_logs"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    interview_id: uuid.UUID = Field(foreign_key="interviews.id", index=True)
    previous_status: Optional[InterviewStatus] = None
    new_status: InterviewStatus
    changed_by: Optional[str] = None
    changed_at: datetime = Field(default_factory=datetime.utcnow)
