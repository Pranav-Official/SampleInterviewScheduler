"""add_interview_audit_logs

Revision ID: bccc2b952a46
Revises: 9bf5abacab26
Create Date: 2026-06-23 20:55:46.620714

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bccc2b952a46'
down_revision: Union[str, None] = '9bf5abacab26'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
        CREATE TABLE interview_audit_logs (
            id UUID PRIMARY KEY,
            interview_id UUID NOT NULL REFERENCES interviews(id),
            previous_status interviewstatus,
            new_status interviewstatus NOT NULL,
            changed_by VARCHAR,
            changed_at TIMESTAMP NOT NULL
        )
    """)
    op.create_index(op.f('ix_interview_audit_logs_interview_id'), 'interview_audit_logs', ['interview_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_interview_audit_logs_interview_id'), table_name='interview_audit_logs')
    op.drop_table('interview_audit_logs')
