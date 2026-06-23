from __future__ import annotations
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlmodel import Session, select, col
from typing import Optional, List
from datetime import datetime
import uuid

from models import Candidate, CandidateCreate, CandidateUpdate
from database import get_session

router = APIRouter(prefix="/candidates", tags=["candidates"])


@router.post("/")
def create_candidate(candidate: CandidateCreate, session: Session = Depends(get_session)):
    db_candidate = Candidate(
        name=candidate.name,
        email=candidate.email,
        phonenumber=candidate.phonenumber,
        experience=candidate.experience,
        skills=candidate.skills,
        createdat=datetime.utcnow(),
        modifiedat=datetime.utcnow(),
    )
    session.add(db_candidate)
    session.commit()
    session.refresh(db_candidate)
    return db_candidate


@router.put("/{candidate_id}")
def update_candidate(
    candidate_id: uuid.UUID,
    candidate: CandidateUpdate,
    session: Session = Depends(get_session),
):
    db_candidate = session.get(Candidate, candidate_id)
    if not db_candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    candidate_data = candidate.model_dump(exclude_unset=True)
    for key, value in candidate_data.items():
        setattr(db_candidate, key, value)

    db_candidate.modifiedat = datetime.utcnow()
    session.add(db_candidate)
    session.commit()
    session.refresh(db_candidate)
    return db_candidate


@router.get("/")
def get_candidates(
    session: Session = Depends(get_session),
    limit: int = Query(default=10, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    name: Optional[str] = Query(default=None, description="Filter by name (partial match)"),
    skills: Optional[List[str]] = Query(default=None, description="Filter by skills (multi-select)"),
    experience: Optional[float] = Query(default=None, description="Filter by experience (<= value)"),
):
    query = select(Candidate)

    if name:
        query = query.where(col(Candidate.name).ilike(f"%{name}%"))

    if skills:
        for skill in skills:
            query = query.where(Candidate.skills.contains([skill]))

    if experience is not None:
        query = query.where(Candidate.experience <= experience)

    candidates = session.exec(query.offset(offset).limit(limit)).all()
    return {"candidates": candidates, "limit": limit, "offset": offset}


@router.get("/{candidate_id}")
def get_candidate(candidate_id: uuid.UUID, session: Session = Depends(get_session)):
    candidate = session.get(Candidate, candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate
