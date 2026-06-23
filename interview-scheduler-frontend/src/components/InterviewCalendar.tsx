import { useState } from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import type { Interview } from '../api/types';
import { useInterviewsQuery } from '../hooks/queries';
import { InterviewDetailModal } from './InterviewDetailModal';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './InterviewCalendar.css';

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: string;
}

function CalendarToolbar({ label, onNavigate }: { label: string; onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY' | 'DATE') => void }) {
  return (
    <div className="flex items-center justify-between mb-4 px-1">
      <button
        onClick={() => onNavigate('PREV')}
        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
        aria-label="Previous month"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h4 className="text-base font-semibold text-slate-900">{label}</h4>
      <button
        onClick={() => onNavigate('NEXT')}
        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
        aria-label="Next month"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

function eventPropGetter(event: CalendarEvent) {
  const bg =
    event.status === 'Scheduled'
      ? '#6366f1'
      : event.status === 'Completed'
        ? '#10b981'
        : event.status === 'Cancelled'
          ? '#f87171'
          : '#94a3b8';
  return {
    style: {
      backgroundColor: bg,
      border: 'none',
      borderRadius: '6px',
      padding: '2px 6px',
      fontSize: '0.75rem',
      color: '#fff',
      fontWeight: 500,
      display: 'block',
    },
  };
}

export function InterviewCalendar() {
  const [date, setDate] = useState(new Date());
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);

  const start = moment(date).startOf('month').toISOString();
  const end = moment(date).endOf('month').toISOString();
  const { data: interviews = [], isLoading } = useInterviewsQuery(undefined, start, end);

  const events: CalendarEvent[] = interviews.map((iv) => ({
    id: iv.id,
    title: iv.candidate_name ?? 'Unknown',
    start: new Date(iv.start_time),
    end: new Date(iv.end_time),
    status: iv.status,
  }));

  return (
    <div className="mt-8">
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!isLoading && (
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView="month"
            views={['month']}
            date={date}
            onNavigate={(d: Date) => setDate(d)}
            eventPropGetter={eventPropGetter}
            components={{ toolbar: CalendarToolbar }}
            onSelectEvent={(event: CalendarEvent) => {
              const iv = interviews.find((i) => i.id === event.id);
              if (iv) setSelectedInterview(iv);
            }}
            style={{ height: 600 }}
          />
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
