from __future__ import annotations
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlmodel import Session, select
from datetime import datetime
from typing import Optional
import uuid

from models import Interview, InterviewCreate, InterviewUpdate, InterviewStatusUpdate, InterviewStatus, Candidate
from database import get_session

router = APIRouter(prefix="/interviews", tags=["interviews"])

VALID_TRANSITIONS = {
    InterviewStatus.SCHEDULED: {InterviewStatus.COMPLETED, InterviewStatus.CANCELLED},
    InterviewStatus.COMPLETED: set(),
    InterviewStatus.CANCELLED: set(),
}


@router.post("/")
def create_interview(interview: InterviewCreate, session: Session = Depends(get_session)):
    candidate = session.get(Candidate, interview.candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    db_interview = Interview(
        candidate_id=interview.candidate_id,
        recruiter_name=interview.recruiter_name,
        start_time=interview.start_time,
        end_time=interview.end_time,
        status=InterviewStatus.SCHEDULED,
        createdat=datetime.utcnow(),
        modifiedat=datetime.utcnow(),
    )
    session.add(db_interview)
    session.commit()
    session.refresh(db_interview)
    return db_interview


@router.patch("/{interview_id}/status")
def update_interview_status(
    interview_id: uuid.UUID,
    body: InterviewStatusUpdate,
    session: Session = Depends(get_session),
):
    interview = session.get(Interview, interview_id)
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    allowed = VALID_TRANSITIONS.get(interview.status, set())
    if body.status not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot transition from '{interview.status.value}' to '{body.status.value}'",
        )

    interview.status = body.status
    interview.modifiedat = datetime.utcnow()
    session.add(interview)
    session.commit()
    session.refresh(interview)
    return interview


@router.get("/")
def get_interviews(
    session: Session = Depends(get_session),
    limit: int = Query(default=10, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    candidate_id: Optional[uuid.UUID] = Query(default=None, description="Filter by candidate ID"),
    status: Optional[InterviewStatus] = Query(default=None, description="Filter by status"),
):
    query = select(Interview)

    if candidate_id:
        query = query.where(Interview.candidate_id == candidate_id)

    if status:
        query = query.where(Interview.status == status)

    interviews = session.exec(query.offset(offset).limit(limit)).all()
    return {"interviews": interviews, "limit": limit, "offset": offset}


@router.get("/{interview_id}")
def get_interview(interview_id: uuid.UUID, session: Session = Depends(get_session)):
    interview = session.get(Interview, interview_id)
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    return interview
