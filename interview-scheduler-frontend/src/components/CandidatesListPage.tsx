import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { CandidatesService } from '../api';
import { CandidateDetailModal } from './CandidateDetailModal';
import { AddCandidateModal } from './AddCandidateModal';
import { ScheduleInterviewModal } from './ScheduleInterviewModal';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phonenumber?: string | null;
  experience: number;
  skills?: string[];
  createdat?: string;
  modifiedat?: string;
}

export function CandidatesListPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [nameFilter, setNameFilter] = useState('');
  const [skillsFilter, setSkillsFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [scheduleCandidate, setScheduleCandidate] = useState<Candidate | null>(null);
  const recruiterName = localStorage.getItem('recruiter_name')
    ? JSON.parse(localStorage.getItem('recruiter_name')!)
    : '';

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const experience = experienceFilter ? Number(experienceFilter) : undefined;
      const skills = skillsFilter
        ? skillsFilter.split(',').map((s) => s.trim()).filter(Boolean)
        : undefined;
      const name = nameFilter.trim() || undefined;

      const result = await CandidatesService.getCandidatesCandidatesGet(
        50,
        0,
        name,
        skills,
        experience,
      );
      const data = result as { candidates: Candidate[] };
      setCandidates(data.candidates ?? []);
    } catch {
      toast.error('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  }, [nameFilter, skillsFilter, experienceFilter]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Candidates</h2>
          <p className="text-sm text-slate-500">Browse and filter your candidate pool</p>
        </div>
        <button
          onClick={() => setShowAddCandidate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Candidate
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor="filter-name" className="block text-xs font-medium text-slate-500 mb-1">
              Name
            </label>
            <input
              id="filter-name"
              type="text"
              placeholder="Search by name..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="filter-skills" className="block text-xs font-medium text-slate-500 mb-1">
              Skills
            </label>
            <input
              id="filter-skills"
              type="text"
              placeholder="e.g. React, Python"
              value={skillsFilter}
              onChange={(e) => setSkillsFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="filter-exp" className="block text-xs font-medium text-slate-500 mb-1">
              Max Experience (years)
            </label>
            <input
              id="filter-exp"
              type="number"
              min="0"
              placeholder="e.g. 5"
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="mt-2 text-sm text-slate-500">Loading candidates...</p>
          </div>
        ) : candidates.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-10 h-10 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            <p className="text-sm text-slate-500">No candidates found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Phone</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Exp</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Skills</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((c) => (
                  <tr key={c.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">{c.name}</td>
                    <td className="px-4 py-3 text-slate-600">{c.email}</td>
                    <td className="px-4 py-3 text-slate-600">{c.phonenumber || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{c.experience}y</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(c.skills ?? []).slice(0, 3).map((s) => (
                          <span key={s} className="px-2 py-0.5 text-xs bg-indigo-50 text-indigo-700 rounded-full">
                            {s}
                          </span>
                        ))}
                        {(c.skills ?? []).length > 3 && (
                          <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-500 rounded-full">
                            +{(c.skills ?? []).length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedCandidate(c)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-xs transition-colors mr-3"
                      >
                        View
                      </button>
                      <button
                        onClick={() => setScheduleCandidate(c)}
                        className="text-emerald-600 hover:text-emerald-800 font-medium text-xs transition-colors"
                      >
                        Schedule
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CandidateDetailModal
        open={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        candidate={selectedCandidate}
      />

      <AddCandidateModal
        open={showAddCandidate}
        onClose={() => setShowAddCandidate(false)}
        onSuccess={fetchCandidates}
      />

      <ScheduleInterviewModal
        open={!!scheduleCandidate}
        onClose={() => setScheduleCandidate(null)}
        onSuccess={() => {}}
        candidateId={scheduleCandidate?.id ?? ''}
        candidateName={scheduleCandidate?.name ?? ''}
        recruiterName={recruiterName}
      />
    </div>
  );
}
