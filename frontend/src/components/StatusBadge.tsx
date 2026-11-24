import React from 'react';

interface StatusBadgeProps {
  status: 'ADMITTED' | 'DISCHARGED' | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isAdmitted = status === 'ADMITTED';

  if (isAdmitted) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        ADMITTED
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      DISCHARGED
    </span>
  );
};
