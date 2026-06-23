import { InterviewStatus } from './generated';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phonenumber?: string | null;
  experience: number;
  skills?: string[];
  createdat?: string;
  modifiedat?: string;
}

export interface Interview {
  id: string;
  candidate_id: string;
  candidate_name?: string;
  recruiter_name: string;
  start_time: string;
  end_time: string;
  status: string;
  createdat?: string;
  modifiedat?: string;
}

export const statusColors: Record<string, string> = {
  Scheduled: 'bg-amber-100 text-amber-700',
  Completed: 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export interface AuditLog {
  id: string;
  interview_id: string;
  previous_status: string | null;
  new_status: string;
  changed_by: string | null;
  changed_at: string;
}

export const validTransitions: Record<string, InterviewStatus[]> = {
  Scheduled: [InterviewStatus.COMPLETED, InterviewStatus.CANCELLED],
  Completed: [],
  Cancelled: [],
};
