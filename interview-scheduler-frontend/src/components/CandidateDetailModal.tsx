import { Modal } from './Modal';

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

interface CandidateDetailModalProps {
  open: boolean;
  onClose: () => void;
  candidate: Candidate | null;
}

export function CandidateDetailModal({ open, onClose, candidate }: CandidateDetailModalProps) {
  if (!candidate) return null;

  return (
    <Modal open={open} onClose={onClose} title="Candidate Details">
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-semibold text-indigo-600">
              {candidate.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{candidate.name}</h3>
            <p className="text-sm text-slate-500">{candidate.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs font-medium text-slate-500 mb-1">Phone</p>
            <p className="text-sm text-slate-900">{candidate.phonenumber || '—'}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs font-medium text-slate-500 mb-1">Experience</p>
            <p className="text-sm text-slate-900">{candidate.experience} years</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-500 mb-2">Skills</p>
          {candidate.skills && candidate.skills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-block px-2.5 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No skills listed</p>
          )}
        </div>

        {candidate.createdat && (
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Created</p>
              <p className="text-sm text-slate-700">
                {new Date(candidate.createdat).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Last Modified</p>
              <p className="text-sm text-slate-700">
                {new Date(candidate.modifiedat || candidate.createdat).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric',
                })}
              </p>
            </div>
          </div>
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
