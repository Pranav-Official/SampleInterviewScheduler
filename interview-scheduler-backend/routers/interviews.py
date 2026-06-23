from fastapi import APIRouter, HTTPException
from models import Interview

router = APIRouter(prefix="/interviews", tags=["interviews"])

interviews: list[Interview] = []
next_id = 1


@router.get("/")
def get_interviews():
    return {"interviews": interviews}


@router.post("/")
def create_interview(interview: Interview):
    global next_id
    interview.id = next_id
    next_id += 1
    interviews.append(interview)
    return interview


@router.get("/{interview_id}")
def get_interview(interview_id: int):
    for interview in interviews:
        if interview.id == interview_id:
            return interview
    raise HTTPException(status_code=404, detail="Interview not found")


@router.put("/{interview_id}")
def update_interview(interview_id: int, updated_interview: Interview):
    for i, interview in enumerate(interviews):
        if interview.id == interview_id:
            updated_interview.id = interview_id
            interviews[i] = updated_interview
            return updated_interview
    raise HTTPException(status_code=404, detail="Interview not found")


@router.delete("/{interview_id}")
def delete_interview(interview_id: int):
    for i, interview in enumerate(interviews):
        if interview.id == interview_id:
            interviews.pop(i)
            return {"message": "Interview deleted"}
    raise HTTPException(status_code=404, detail="Interview not found")
