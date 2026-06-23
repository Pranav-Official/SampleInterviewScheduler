from __future__ import annotations
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlmodel import Session, select, and_, or_
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


def _has_overlap(
    session: Session,
    exclude_id: uuid.UUID | None,
    candidate_id: uuid.UUID | None,
    recruiter_name: str | None,
    start_time: datetime,
    end_time: datetime,
) -> str | None:
    """Return an error message if an overlap is found, else None."""
    query = select(Interview).where(
        Interview.status == InterviewStatus.SCHEDULED,
        Interview.start_time < end_time,
        Interview.end_time > start_time,
    )
    if exclude_id:
        query = query.where(Interview.id != exclude_id)

    overlapping = session.exec(query).all()

    for iv in overlapping:
        if candidate_id and iv.candidate_id == candidate_id:
            return f"Candidate already has a scheduled interview from {iv.start_time.isoformat()} to {iv.end_time.isoformat()}"
        if recruiter_name and iv.recruiter_name.lower() == recruiter_name.lower():
            return f"Recruiter '{recruiter_name}' already has a scheduled interview from {iv.start_time.isoformat()} to {iv.end_time.isoformat()}"

    return None


@router.post("/")
def create_interview(interview: InterviewCreate, session: Session = Depends(get_session)):
    candidate = session.get(Candidate, interview.candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    if interview.start_time >= interview.end_time:
        raise HTTPException(status_code=400, detail="start_time must be before end_time")

    conflict = _has_overlap(
        session=session,
        exclude_id=None,
        candidate_id=interview.candidate_id,
        recruiter_name=interview.recruiter_name,
        start_time=interview.start_time,
        end_time=interview.end_time,
    )
    if conflict:
        raise HTTPException(status_code=409, detail=conflict)

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
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    candidate_id: Optional[uuid.UUID] = Query(default=None, description="Filter by candidate ID"),
    status: Optional[InterviewStatus] = Query(default=None, description="Filter by status"),
    start_time: Optional[datetime] = Query(default=None, description="Filter interviews with start_time >= value"),
    end_time: Optional[datetime] = Query(default=None, description="Filter interviews with end_time <= value"),
):
    query = (
        select(
            Interview.id,
            Interview.candidate_id,
            Candidate.name.label("candidate_name"),
            Interview.recruiter_name,
            Interview.start_time,
            Interview.end_time,
            Interview.status,
            Interview.createdat,
            Interview.modifiedat,
        )
        .join(Candidate, Interview.candidate_id == Candidate.id)
    )

    if candidate_id:
        query = query.where(Interview.candidate_id == candidate_id)

    if status:
        query = query.where(Interview.status == status)

    if start_time:
        query = query.where(Interview.start_time >= start_time)

    if end_time:
        query = query.where(Interview.end_time <= end_time)

    rows = session.exec(query.offset(offset).limit(limit)).all()
    return {"interviews": [dict(row._mapping) for row in rows], "limit": limit, "offset": offset}


@router.get("/{interview_id}")
def get_interview(interview_id: uuid.UUID, session: Session = Depends(get_session)):
    row = session.exec(
        select(
            Interview.id,
            Interview.candidate_id,
            Candidate.name.label("candidate_name"),
            Interview.recruiter_name,
            Interview.start_time,
            Interview.end_time,
            Interview.status,
            Interview.createdat,
            Interview.modifiedat,
        )
        .join(Candidate, Interview.candidate_id == Candidate.id)
        .where(Interview.id == interview_id)
    ).first()

    if not row:
        raise HTTPException(status_code=404, detail="Interview not found")

    return dict(row._mapping)
