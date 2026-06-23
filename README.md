# Sample Interview Scheduling Platform

## Tech Stack

### Backend (`interview-scheduler-backend/`)
- **FastAPI** - Python web framework
- **SQLModel** - ORM (SQLAlchemy + Pydantic)
- **PostgreSQL** - Database
- **Alembic** - Database migrations
- **Psycopg** - PostgreSQL driver

### Frontend (`interview-scheduler-frontend/`)
- **Vite** - Build tool
- **React** - UI framework

## Getting Started

### Backend
```bash
cd interview-scheduler-backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --reload
```

API docs: `http://localhost:8000/docs`

### Frontend
```bash
cd interview-scheduler-frontend
npm install
npm run dev
```

## Migrations
```bash
cd interview-scheduler-backend
alembic revision --autogenerate -m "description"
alembic upgrade head
```
