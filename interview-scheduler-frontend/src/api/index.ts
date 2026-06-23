import { OpenAPI, CandidatesService, InterviewsService, InterviewStatus } from './generated';

// Configure the API base URL
OpenAPI.BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Example: Get all candidates
export async function getCandidates(limit = 10, offset = 0) {
  return CandidatesService.getCandidatesCandidatesGet(limit, offset);
}

// Example: Create a candidate
export async function createCandidate(data: {
  name: string;
  email: string;
  phonenumber: string;
  experience: number;
  skills: string[];
}) {
  return CandidatesService.createCandidateCandidatesPost(data);
}

// Example: Get all interviews
export async function getInterviews(limit = 10, offset = 0) {
  return InterviewsService.getInterviewsInterviewsGet(limit, offset);
}

// Example: Create an interview
export async function createInterview(data: {
  candidate_id: string;
  recruiter_name: string;
  start_time: string;
  end_time: string;
}) {
  return InterviewsService.createInterviewInterviewsPost(data);
}

// Example: Update interview status
export async function updateInterviewStatus(
  interviewId: string,
  status: InterviewStatus
) {
  return InterviewsService.updateInterviewStatusInterviewsInterviewIdStatusPatch(
    interviewId,
    { status }
  );
}
