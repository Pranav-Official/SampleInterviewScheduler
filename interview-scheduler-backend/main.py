from fastapi import FastAPI
from routers import interviews, candidates
from database import engine
from sqlmodel import SQLModel

app = FastAPI(title="Interview Scheduler API", version="1.0.0")

app.include_router(interviews.router)
app.include_router(candidates.router)


@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)


@app.get("/")
def root():
    return {"message": "Interview Scheduler API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
