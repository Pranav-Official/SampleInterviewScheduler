from __future__ import annotations
from sqlmodel import SQLModel, Field, Column
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
import uuid
import sqlalchemy as sa


class Candidate(SQLModel, table=True):
    __tablename__ = "candidates"

    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    email: str = Field(unique=True, index=True)
    phonenumber: Optional[str] = None
    experience: float
    skills: List[str] = Field(default=[], sa_column=Column(sa.JSON))
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


class Interview(BaseModel):
    id: Optional[int] = None
    candidate_name: str
    interviewer_name: str
    scheduled_time: datetime
    position: str
    status: str = "scheduled"
