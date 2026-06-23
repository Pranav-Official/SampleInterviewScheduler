from __future__ import annotations
from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func

from models import Candidate, Interview, InterviewStatus
from database import get_session

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/")
def dashboard(session: Session = Depends(get_session)):
    total_candidates = session.exec(select(func.count(Candidate.id))).one()
    total_completed = session.exec(
        select(func.count(Interview.id)).where(Interview.status == InterviewStatus.COMPLETED)
    ).one()
    total_scheduled = session.exec(
        select(func.count(Interview.id)).where(Interview.status == InterviewStatus.SCHEDULED)
    ).one()

    return {
        "total_candidates": total_candidates,
        "total_completed_interviews": total_completed,
        "total_scheduled_interviews": total_scheduled,
    }
