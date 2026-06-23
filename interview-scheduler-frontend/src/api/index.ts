import { OpenAPI } from './generated';

OpenAPI.BASE = import.meta.env.VITE_API_URL || '';

export { CandidatesService } from './generated';
export { InterviewsService } from './generated';
export { DashboardService } from './generated';
export { InterviewStatus } from './generated';
export type { CandidateCreate } from './generated';
export type { CandidateUpdate } from './generated';
export type { InterviewCreate } from './generated';
