import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Modal } from './Modal';
import { CandidatesService } from '../api';

interface AddCandidateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  email: string;
  phonenumber: string;
  experience: number;
  skills: string;
}

export function AddCandidateModal({ open, onClose, onSuccess }: AddCandidateModalProps) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await CandidatesService.createCandidateCandidatesPost({
        name: data.name.trim(),
        email: data.email.trim(),
        phonenumber: data.phonenumber?.trim() || null,
        experience: Number(data.experience),
        skills: data.skills
          ? data.skills.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      });
      toast.success('Candidate created successfully!');
      reset();
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create candidate';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Add Candidate">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="candidate-name" className="block text-sm font-medium text-slate-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="candidate-name"
            type="text"
            placeholder="John Doe"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="candidate-email" className="block text-sm font-medium text-slate-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="candidate-email"
            type="email"
            placeholder="john@example.com"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
            })}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="candidate-phone" className="block text-sm font-medium text-slate-700 mb-1">
            Phone Number
          </label>
          <input
            id="candidate-phone"
            type="text"
            placeholder="+1 234 567 8900"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            {...register('phonenumber')}
          />
        </div>

        <div>
          <label htmlFor="candidate-experience" className="block text-sm font-medium text-slate-700 mb-1">
            Experience (years) <span className="text-red-500">*</span>
          </label>
          <input
            id="candidate-experience"
            type="number"
            step="0.5"
            min="0"
            placeholder="3"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            {...register('experience', {
              required: 'Experience is required',
              min: { value: 0, message: 'Must be 0 or greater' },
              valueAsNumber: true,
            })}
          />
          {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>}
        </div>

        <div>
          <label htmlFor="candidate-skills" className="block text-sm font-medium text-slate-700 mb-1">
            Skills
          </label>
          <input
            id="candidate-skills"
            type="text"
            placeholder="React, TypeScript, Node.js"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            {...register('skills')}
          />
          <p className="mt-1 text-xs text-slate-400">Comma-separated list of skills</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-2 px-4 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? 'Creating...' : 'Add Candidate'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
