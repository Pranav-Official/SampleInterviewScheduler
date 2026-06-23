from sqlmodel import SQLModel, Session, create_engine
from dotenv import load_dotenv
import os

load_dotenv()

PG_CONNECTION_STRING = os.getenv("PG_CONNECTION_STRING")

# Ensure we use psycopg (v3) driver
if PG_CONNECTION_STRING and PG_CONNECTION_STRING.startswith("postgresql://"):
    PG_CONNECTION_STRING = PG_CONNECTION_STRING.replace("postgresql://", "postgresql+psycopg://", 1)
elif PG_CONNECTION_STRING and PG_CONNECTION_STRING.startswith("postgres://"):
    PG_CONNECTION_STRING = PG_CONNECTION_STRING.replace("postgres://", "postgresql+psycopg://", 1)

engine = create_engine(
    PG_CONNECTION_STRING,
    echo=True,
    pool_pre_ping=True,
    pool_recycle=300,
)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
