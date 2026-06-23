import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { AddCandidateModal } from './AddCandidateModal';
import { CandidatesListPage } from './CandidatesListPage';
import { InterviewsTable } from './InterviewsTable';
import { DashboardService } from '../api';

interface DashboardPageProps {
  recruiterName: string;
  onLogout: () => void;
}

const defaultMetrics = [
  { label: 'Total Candidates', value: '—', icon: 'users', color: 'bg-indigo-100 text-indigo-600' },
  { label: 'Interviews Scheduled', value: '—', icon: 'calendar', color: 'bg-amber-100 text-amber-600' },
  { label: 'Interviews Completed', value: '—', icon: 'check', color: 'bg-emerald-100 text-emerald-600' },
];

function MetricIcon({ icon }: { icon: string }) {
  if (icon === 'users') {
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    );
  }
  if (icon === 'calendar') {
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    );
  }
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export function DashboardPage({ recruiterName, onLogout }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'candidates'>('dashboard');
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [metrics, setMetrics] = useState(defaultMetrics);
  const fetched = useRef(false);

  if (!fetched.current) {
    fetched.current = true;
    DashboardService.dashboardDashboardGet().then((result) => {
      const data = result as {
        total_candidates: number;
        total_scheduled_interviews: number;
        total_completed_interviews: number;
      };
      setMetrics([
        { label: 'Total Candidates', value: String(data.total_candidates ?? 0), icon: 'users', color: 'bg-indigo-100 text-indigo-600' },
        { label: 'Interviews Scheduled', value: String(data.total_scheduled_interviews ?? 0), icon: 'calendar', color: 'bg-amber-100 text-amber-600' },
        { label: 'Interviews Completed', value: String(data.total_completed_interviews ?? 0), icon: 'check', color: 'bg-emerald-100 text-emerald-600' },
      ]);
    }).catch(() => {
      toast.error('Failed to load dashboard metrics');
    });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-slate-900">Interview Scheduler</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">Welcome, <span className="font-medium text-slate-700">{recruiterName}</span></span>
            <button
              onClick={onLogout}
              className="text-sm text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'dashboard'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'candidates'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Candidates
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'dashboard' ? (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Dashboard</h2>
              <p className="text-sm text-slate-500">Overview of your interview pipeline</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {metrics.map((m) => (
                <div key={m.label} className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${m.color}`}>
                    <MetricIcon icon={m.icon} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{m.value}</p>
                    <p className="text-sm text-slate-500">{m.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Quick Actions</h3>
              <p className="text-sm text-slate-500">Manage candidates and interviews</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setShowAddCandidate(true)}
                className="bg-white rounded-xl border border-slate-200 p-5 text-left hover:border-indigo-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                    </svg>
                  </div>
                  <span className="font-medium text-slate-900">Add a Candidate</span>
                </div>
                <p className="text-sm text-slate-500">Register a new candidate into the system</p>
              </button>

              <div className="bg-white rounded-xl border border-slate-200 p-5 text-left opacity-60 cursor-not-allowed">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                  <span className="font-medium text-slate-900">Schedule an Interview</span>
                  <span className="ml-auto text-xs font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Coming soon</span>
                </div>
                <p className="text-sm text-slate-500">Book an interview slot with a candidate</p>
              </div>
            </div> */}

            <InterviewsTable />
          </>
        ) : (
          <CandidatesListPage />
        )}
      </main>

      <AddCandidateModal
        open={showAddCandidate}
        onClose={() => setShowAddCandidate(false)}
        onSuccess={() => {}}
      />
    </div>
  );
}
