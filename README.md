# Sample Interview Scheduling Platform

A full-stack interview scheduling platform with a **React + Vite** frontend and a **Python FastAPI** backend, backed by **PostgreSQL** (hosted on [Neon](https://neon.tech)).

## Tech Stack

### Backend (`interview-scheduler-backend/`)
| Technology | Purpose |
|---|---|
| **FastAPI** | Python async REST framework with auto-generated OpenAPI docs |
| **SQLModel** | ORM (SQLAlchemy core + Pydantic validation) |
| **PostgreSQL** | Relational database (Neon serverless Postgres) |
| **Alembic** | Database schema migrations |
| **Resend** | Transactional email (confirmation + status change notifications) |

### Frontend (`interview-scheduler-frontend/`)
| Technology | Purpose |
|---|---|
| **Vite** | Build tool & dev server with API proxy |
| **React 19** | UI framework with functional components & hooks |
| **TypeScript 6** | Type-safe development |
| **Tailwind CSS v4** | Utility-first CSS (CSS-first config, no `tailwind.config.*`) |
| **TanStack React Query v5** | Server-state management, query caching, automatic refetching |
| **OpenAPI TypeScript Codegen** | Auto-generates typed API client from backend OpenAPI spec |
| **React Hook Form** | Form state management & validation |
| **React Big Calendar** | Month-view interview calendar with color-coded statuses |
| **React Hot Toast** | Toast notifications |

---


## Features

### Calander view
![](image.png)

### Interview Status Audit Logging
![alt text](image-2.png)
- Every status transition records an entry in `interview_audit_logs` with:
  - Previous status, new status, who changed it, timestamp
  - Viewable per interview via the interview detail modal

### Email Notifications (Resend)
- **On interview schedule**: confirmation email sent to the candidate with date/time details
- **On status change** (Completed / Cancelled): notification email sent to the candidate
- Both are dispatched via FastAPI **BackgroundTasks** — non-blocking, fire-and-forget
- If `RESEND_API_KEY` is missing or the API call fails, the error is logged without breaking the API response

> **Production consideration:** For a production workload, we can replace FastAPI `BackgroundTasks` with a dedicated task queue like **Celery** backed by **Redis** (or RabbitMQ). we cal also Set up a **dead letter queue** (DLQ) for failed email deliveries so they can be inspected, retried, or manually re-queued. This gives you retry policies, rate limiting, and operational visibility beyond what background tasks provide.

---

## API Client Generation (OpenAPI → TypeScript)

The frontend API client is **auto-generated** from the backend's live OpenAPI spec using `openapi-typescript-codegen`. This eliminates manual typing and keeps the client in sync with the backend.

```bash
# 1. Ensure backend is running on :8000
# 2. Pull the OpenAPI spec
cd interview-scheduler-frontend
npm run fetch-openapi        # fetches openapi.json from http://localhost:8000/openapi.json

# 3. Generate typed TypeScript client
npm run generate:api         # outputs to src/api/generated/
```

Generated output (`src/api/generated/`):
- `services/` — static classes: `CandidatesService`, `InterviewsService`, `DashboardService`
- `models/` — TypeScript types: `CandidateCreate`, `InterviewCreate`, `InterviewStatusUpdate`, etc.
- `core/` — HTTP request machinery, error classes, `CancelablePromise`

The generated services are re-exported from `src/api/index.ts` and consumed by React Query hooks in `src/hooks/queries.ts`.

### React Query Usage

All API calls go through TanStack React Query hooks, providing:

| Feature | Benefit |
|---|---|
| **Query caching** | Avoids redundant network requests; cached data served instantly on tab switches |
| **Automatic refetching** | Data stays fresh when window refocuses or after mutations |
| **Cache invalidation** | Mutations call `queryClient.invalidateQueries()` to refetch related data (e.g., scheduling an interview invalidates `['interviews']` and `['dashboard']`) |
| **Conditional queries** | Audit logs only fetched when modal is open (`enabled: !!interviewId`) |
| **Error handling** | Failed queries surface via toast notifications |

```ts
// src/hooks/queries.ts — React Query custom hooks

useInterviewsQuery(status?, startTime?, endTime?)   // GET /interviews with filters
useCandidatesQuery(name?, skills?, experience?)      // GET /candidates with filters
useDashboardMetricsQuery()                           // GET /dashboard aggregate counts
useInterviewAuditLogsQuery(interviewId)              // GET /interviews/:id/audit-logs

useCreateCandidateMutation()                         // POST /candidates → invalidates candidates + dashboard
useCreateInterviewMutation()                         // POST /interviews → invalidates interviews + dashboard
useUpdateInterviewStatusMutation()                   // PATCH /interviews/:id/status → invalidates all three
```

---

## API Endpoints

### Candidates (`/candidates`)
| Method | Path | Description |
|---|---|---|
| `GET` | `/candidates/` | List with `limit`, `offset`, `name` (ILIKE), `skills` (JSONB contains), `experience` (max) |
| `POST` | `/candidates/` | Create candidate |
| `GET` | `/candidates/{id}` | Get single candidate |
| `PUT` | `/candidates/{id}` | Partial update |

### Interviews (`/interviews`)
| Method | Path | Description |
|---|---|---|
| `GET` | `/interviews/` | List with `limit`, `offset`, `candidate_id`, `status`, `start_time`, `end_time` filters |
| `POST` | `/interviews/` | Schedule interview (overlap check + email) |
| `GET` | `/interviews/{id}` | Get single interview (includes candidate name) |
| `PATCH` | `/interviews/{id}/status` | Update status (validated transition + email + audit log) |
| `GET` | `/interviews/{id}/audit-logs` | Get audit trail for an interview |

### Dashboard (`/dashboard`)
| Method | Path | Description |
|---|---|---|
| `GET` | `/dashboard/` | Aggregate counts: `total_candidates`, `total_scheduled_interviews`, `total_completed_interviews` |

OpenAPI docs available at `http://localhost:8000/docs` when the backend is running.

---

## Getting Started

### Prerequisites
- **Python 3.10+** with `pip`
- **Node.js 18+** with `npm`
- A **PostgreSQL** database (local or cloud — this project uses [Neon](https://neon.tech) serverless Postgres)
- A [Resend](https://resend.com) account (free tier works) and API key for email notifications

### Backend Setup

```bash
cd interview-scheduler-backend

# Create virtual environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env     # or create your own .env
# Edit .env with your:
#   PG_CONNECTION_STRING="postgresql://user:pass@host/db?sslmode=require"
#   RESEND_API_KEY="re_xxxxxxxx"

# Run migrations
alembic upgrade head

# Start dev server
uvicorn main:app --reload
# Backend running at http://localhost:8000
# API docs at http://localhost:8000/docs
```

### Frontend Setup

```bash
cd interview-scheduler-frontend

# Install dependencies
npm install

# Generate API client (backend must be running on :8000)
npm run fetch-openapi
npm run generate:api

# Start dev server
npm run dev
# Frontend running at http://localhost:5173
```

### Full Setup Flow (after first clone)

```bash
# Terminal 1 — Backend
cd interview-scheduler-backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --reload

# Terminal 2 — Frontend (after backend is up)
cd interview-scheduler-frontend
npm install
npm run fetch-openapi
npm run generate:api
npm run dev
```

---

## Migrations

```bash
cd interview-scheduler-backend

# Create a new migration after model changes
alembic revision --autogenerate -m "description of changes"

# Apply pending migrations
alembic upgrade head
```

---

## Directory Structure

```
SampleInterviewScheduler/
├── interview-scheduler-backend/
│   ├── main.py                     # FastAPI app entrypoint
│   ├── models.py                   # SQLModel tables + Pydantic DTOs
│   ├── database.py                 # Engine config, session dependency
│   ├── email_service.py            # Resend email integration
│   ├── requirements.txt
│   ├── routers/
│   │   ├── candidates.py           # Candidate CRUD with filters
│   │   ├── interviews.py           # Interview CRUD + overlap detection + audit
│   │   └── dashboard.py            # Aggregate metrics
│   └── alembic/                    # Schema migrations
│
├── interview-scheduler-frontend/
│   ├── src/
│   │   ├── main.tsx                # React entry, QueryClientProvider
│   │   ├── App.tsx                 # Router: WelcomePage → DashboardPage
│   │   ├── index.css               # @import "tailwindcss" (v4)
│   │   ├── api/
│   │   │   ├── index.ts            # OpenAPI client config + re-exports
│   │   │   ├── types.ts            # Manual TS interfaces + status helpers
│   │   │   └── generated/          # Auto-generated TS client (openapi-typescript-codegen)
│   │   ├── hooks/
│   │   │   ├── queries.ts          # All React Query hooks
│   │   │   ├── useLocalStorage.ts
│   │   │   └── useDebounce.ts
│   │   └── components/
│   │       ├── WelcomePage.tsx
│   │       ├── DashboardPage.tsx
│   │       ├── CandidatesListPage.tsx
│   │       ├── AddCandidateModal.tsx
│   │       ├── CandidateDetailModal.tsx
│   │       ├── ScheduleInterviewModal.tsx
│   │       ├── InterviewsTable.tsx
│   │       ├── InterviewCalendar.tsx
│   │       ├── InterviewDetailModal.tsx
│   │       └── Modal.tsx
│   ├── vite.config.ts
│   └── package.json
└── README.md
```


## AI use disclosure
### Tools used
- OpenCode with OpenCode Go subscription to opensource models (deepseek, mimo etc)
- ChatGPT used for brainstorming.

### Development
- Majority of code was written in Agent assisted coding worflow of - Plan -> Review -> Implement -> Review -> Feedback.