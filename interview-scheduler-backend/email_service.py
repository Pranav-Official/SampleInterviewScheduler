import os
import logging
import resend
from dotenv import load_dotenv

load_dotenv()
resend.api_key = os.getenv("RESEND_API_KEY", "")

logger = logging.getLogger(__name__)


def send_interview_confirmation(
    to_email: str,
    candidate_name: str,
    recruiter_name: str,
    start_time: str,
    end_time: str,
) -> bool:
    if not resend.api_key:
        logger.warning("RESEND_API_KEY not set; skipping email to %s", to_email)
        return False

    try:
        resend.Emails.send({
            "from": "onboarding@resend.dev",
            "to": to_email,
            "subject": f"Interview Scheduled - {candidate_name}",
            "html": (
                f"<p>Hello {candidate_name},</p>"
                f"<p>Your interview has been scheduled with <strong>{recruiter_name}</strong>.</p>"
                f"<p><strong>Start:</strong> {start_time}<br/>"
                f"<strong>End:</strong> {end_time}</p>"
                f"<p>Please be available at the scheduled time.</p>"
            ),
        })
        logger.info("Sent interview confirmation to %s", to_email)
        return True
    except Exception as e:
        logger.error("Failed to send interview confirmation email to %s: %s", to_email, e)
        return False


def send_status_change_notification(
    to_email: str,
    candidate_name: str,
    recruiter_name: str,
    new_status: str,
    start_time: str,
    end_time: str,
) -> bool:
    if not resend.api_key:
        logger.warning("RESEND_API_KEY not set; skipping status change email to %s", to_email)
        return False

    try:
        resend.Emails.send({
            "from": "onboarding@resend.dev",
            "to": to_email,
            "subject": f"Interview {new_status} - {candidate_name}",
            "html": (
                f"<p>Hello {candidate_name},</p>"
                f"<p>Your interview with <strong>{recruiter_name}</strong> has been <strong>{new_status.lower()}</strong>.</p>"
                f"<p><strong>Start:</strong> {start_time}<br/>"
                f"<strong>End:</strong> {end_time}</p>"
            ),
        })
        logger.info("Sent status change notification (%s) to %s", new_status, to_email)
        return True
    except Exception as e:
        logger.error("Failed to send status change email to %s: %s", to_email, e)
        return False
