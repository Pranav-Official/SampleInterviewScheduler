import { useState } from 'react';
import toast from 'react-hot-toast';
import { Modal } from './Modal';
import { InterviewsService, InterviewStatus } from '../api';

interface Interview {
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

interface InterviewDetailModalProps {
  open: boolean;
  onClose: () => void;
  interview: Interview | null;
  onStatusUpdated: () => void;
}

const statusColors: Record<string, string> = {
  Scheduled: 'bg-amber-100 text-amber-700',
  Completed: 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const validTransitions: Record<string, InterviewStatus[]> = {
  Scheduled: [InterviewStatus.COMPLETED, InterviewStatus.CANCELLED],
  Completed: [],
  Cancelled: [],
};

export function InterviewDetailModal({ open, onClose, interview, onStatusUpdated }: InterviewDetailModalProps) {
  const [updating, setUpdating] = useState(false);

  if (!interview) return null;

  const handleStatusUpdate = async (newStatus: InterviewStatus) => {
    setUpdating(true);
    try {
      await InterviewsService.updateInterviewStatusInterviewsInterviewIdStatusPatch(interview.id, { status: newStatus });
      toast.success(`Interview marked as ${newStatus}`);
      onStatusUpdated();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update status';
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  };

  const transitions = validTransitions[interview.status] ?? [];

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    });

  return (
    <Modal open={open} onClose={onClose} title="Interview Details">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">Status</p>
            <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${statusColors[interview.status] ?? 'bg-slate-100 text-slate-600'}`}>
              {interview.status}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-slate-500 mb-1">Interview ID</p>
            <p className="text-xs text-slate-400 font-mono">{interview.id.slice(0, 8)}...</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs font-medium text-slate-500 mb-1">Recruiter</p>
            <p className="text-sm font-medium text-slate-900">{interview.recruiter_name}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs font-medium text-slate-500 mb-1">Candidate ID</p>
            <p className="text-xs text-slate-700 font-mono truncate">{interview.candidate_id}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs font-medium text-slate-500 mb-1">Start</p>
            <p className="text-sm text-slate-900">{formatDateTime(interview.start_time)}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs font-medium text-slate-500 mb-1">End</p>
            <p className="text-sm text-slate-900">{formatDateTime(interview.end_time)}</p>
          </div>
        </div>

        {interview.createdat && (
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Created</p>
              <p className="text-xs text-slate-600">{formatDateTime(interview.createdat)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Last Modified</p>
              <p className="text-xs text-slate-600">{formatDateTime(interview.modifiedat || interview.createdat)}</p>
            </div>
          </div>
        )}

        {transitions.length > 0 && (
          <div className="pt-2 border-t border-slate-200">
            <p className="text-xs font-medium text-slate-500 mb-2">Update Status</p>
            <div className="flex gap-2">
              {transitions.map((status) => (
                <button
                  key={status}
                  disabled={updating}
                  onClick={() => handleStatusUpdate(status)}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 ${
                    status === InterviewStatus.COMPLETED
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {updating ? 'Updating...' : `Mark ${status}`}
                </button>
              ))}
            </div>
          </div>
        )}

        {transitions.length === 0 && (
          <p className="text-xs text-slate-400 text-center pt-2 border-t border-slate-200">
            This interview is {interview.status.toLowerCase()} — no further status changes allowed.
          </p>
        )}

        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors text-sm"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
