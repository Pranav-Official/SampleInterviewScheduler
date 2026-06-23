import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CandidatesService, InterviewsService, DashboardService, InterviewStatus } from '../api';
import type { Candidate, Interview, AuditLog } from '../api/types';

// ---- Query keys ----
export const queryKeys = {
  interviews: (filters?: Record<string, unknown>) => ['interviews', filters ?? {}] as const,
  candidates: (filters?: Record<string, unknown>) => ['candidates', filters ?? {}] as const,
  dashboard: () => ['dashboard'] as const,
  auditLogs: (interviewId: string) => ['auditLogs', interviewId] as const,
};

// ---- Interviews ----
export function useInterviewsQuery(status?: string, startTime?: string, endTime?: string) {
  const filters: Record<string, unknown> = {};
  if (status) filters.status = status;
  if (startTime) filters.startTime = startTime;
  if (endTime) filters.endTime = endTime;

  return useQuery({
    queryKey: queryKeys.interviews(filters),
    queryFn: async () => {
      try {
        const statusEnum = status ? (status as InterviewStatus) : undefined;
        const result = await InterviewsService.getInterviewsInterviewsGet(100, 0, undefined, statusEnum, startTime, endTime);
        return (result as { interviews: Interview[] }).interviews ?? [];
      } catch {
        toast.error('Failed to load interviews');
        return [];
      }
    },
  });
}

export function useInterviewAuditLogsQuery(interviewId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.auditLogs(interviewId ?? ''),
    queryFn: async () => {
      if (!interviewId) return [];
      const result = await InterviewsService.getInterviewAuditLogsInterviewsInterviewIdAuditLogsGet(interviewId);
      return (result as { audit_logs: AuditLog[] }).audit_logs ?? [];
    },
    enabled: !!interviewId,
  });
}

// ---- Dashboard metrics ----
export function useDashboardMetricsQuery() {
  return useQuery({
    queryKey: queryKeys.dashboard(),
    queryFn: async () => {
      const result = await DashboardService.dashboardDashboardGet();
      return result as {
        total_candidates: number;
        total_scheduled_interviews: number;
        total_completed_interviews: number;
      };
    },
  });
}

// ---- Candidates ----
export function useCandidatesQuery(name?: string, skills?: string, experience?: string) {
  const filters: Record<string, unknown> = {};
  if (name) filters.name = name;
  if (skills) filters.skills = skills;
  if (experience) filters.experience = experience;

  return useQuery({
    queryKey: queryKeys.candidates(filters),
    queryFn: async () => {
      try {
        const exp = experience ? Number(experience) : undefined;
        const skillList = skills
          ? skills.split(',').map((s) => s.trim()).filter(Boolean)
          : undefined;
        const n = name?.trim() || undefined;
        const result = await CandidatesService.getCandidatesCandidatesGet(50, 0, n, skillList, exp);
        return (result as { candidates: Candidate[] }).candidates ?? [];
      } catch {
        toast.error('Failed to load candidates');
        return [];
      }
    },
  });
}

// ---- Mutations ----
export function useCreateCandidateMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      phonenumber: string | null;
      experience: number;
      skills: string[];
    }) => CandidatesService.createCandidateCandidatesPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useCreateInterviewMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      candidate_id: string;
      recruiter_name: string;
      start_time: string;
      end_time: string;
    }) => InterviewsService.createInterviewInterviewsPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateInterviewStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ interviewId, status, changedBy }: { interviewId: string; status: InterviewStatus; changedBy?: string }) =>
      InterviewsService.updateInterviewStatusInterviewsInterviewIdStatusPatch(interviewId, {
        status,
        changed_by: changedBy,
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.auditLogs(variables.interviewId) });
    },
  });
}
