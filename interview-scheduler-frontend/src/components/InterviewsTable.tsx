import { useState } from 'react';
import type { Interview } from '../api/types';
import { statusColors } from '../api/types';
import { useInterviewsQuery } from '../hooks/queries';
import { InterviewDetailModal } from './InterviewDetailModal';

export function InterviewsTable() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const { data: interviews = [], isLoading } = useInterviewsQuery(statusFilter);

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    });

  return (
    <div>
      <div className="flex items-center justify-end mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="mt-2 text-sm text-slate-500">Loading interviews...</p>
          </div>
        ) : interviews.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-10 h-10 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <p className="text-sm text-slate-500">No interviews found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Candidate</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Recruiter</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Start</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">End</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map((iv) => (
                  <tr key={iv.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">{iv.candidate_name ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{iv.recruiter_name}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDateTime(iv.start_time)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDateTime(iv.end_time)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${statusColors[iv.status] ?? 'bg-slate-100 text-slate-600'}`}>
                        {iv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedInterview(iv)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-xs transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <InterviewDetailModal
        open={!!selectedInterview}
        onClose={() => setSelectedInterview(null)}
        interview={selectedInterview}
      />
    </div>
  );
}
