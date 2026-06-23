import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useCreateInterviewMutation } from '../hooks/queries';
import { Modal } from './Modal';

interface ScheduleInterviewModalProps {
  open: boolean;
  onClose: () => void;
  candidateId: string;
  candidateName: string;
  recruiterName: string;
}

interface FormData {
  start_time: string;
  end_time: string;
}

export function ScheduleInterviewModal({
  open,
  onClose,
  candidateId,
  candidateName,
  recruiterName,
}: ScheduleInterviewModalProps) {
  const mutation = useCreateInterviewMutation();
  const { register, handleSubmit, reset, getValues, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      {
        candidate_id: candidateId,
        recruiter_name: recruiterName,
        start_time: new Date(data.start_time).toISOString(),
        end_time: new Date(data.end_time).toISOString(),
      },
      {
        onSuccess: () => {
          toast.success('Interview scheduled successfully!');
          reset();
          onClose();
        },
        onError: (err) => {
          const message = err instanceof Error ? err.message : 'Failed to schedule interview';
          toast.error(message);
        },
      },
    );
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Schedule Interview">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-xs font-medium text-slate-500 mb-1">Candidate</p>
          <p className="text-sm font-medium text-slate-900">{candidateName}</p>
        </div>

        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-xs font-medium text-slate-500 mb-1">Recruiter</p>
          <p className="text-sm font-medium text-slate-900">{recruiterName}</p>
        </div>

        <div>
          <label htmlFor="start_time" className="block text-sm font-medium text-slate-700 mb-1">
            Start Time <span className="text-red-500">*</span>
          </label>
          <input
            id="start_time"
            type="datetime-local"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            {...register('start_time', {
              required: 'Start time is required',
              validate: (value) => {
                if (!value) return true;
                return new Date(value) > new Date() || 'Start time must be in the future';
              },
            })}
          />
          {errors.start_time && <p className="mt-1 text-sm text-red-600">{errors.start_time.message}</p>}
        </div>

        <div>
          <label htmlFor="end_time" className="block text-sm font-medium text-slate-700 mb-1">
            End Time <span className="text-red-500">*</span>
          </label>
          <input
            id="end_time"
            type="datetime-local"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            {...register('end_time', {
              required: 'End time is required',
              validate: (value) => {
                if (!value) return true;
                const start = getValues('start_time');
                if (start && new Date(value) <= new Date(start)) {
                  return 'End time must be after start time';
                }
                if (new Date(value) <= new Date()) {
                  return 'End time must be in the future';
                }
                const durationMs = new Date(value).getTime() - new Date(start).getTime();
                const durationMin = durationMs / 60000;
                if (durationMin < 30) {
                  return 'Duration must be at least 30 minutes';
                }
                if (durationMin > 120) {
                  return 'Duration must not exceed 2 hours';
                }
                return true;
              },
            })}
          />
          {errors.end_time && <p className="mt-1 text-sm text-red-600">{errors.end_time.message}</p>}
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
            disabled={mutation.isPending}
            className="flex-1 py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {mutation.isPending ? 'Scheduling...' : 'Schedule Interview'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
