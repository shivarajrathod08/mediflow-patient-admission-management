import React from 'react';

export const TableSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="h-12 bg-slate-100 border-b border-slate-200" />
      <div className="divide-y divide-slate-100">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-1/4">
              <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-slate-200 rounded-sm w-3/4" />
                <div className="h-2.5 bg-slate-100 rounded-sm w-1/2" />
              </div>
            </div>
            <div className="h-3.5 bg-slate-200 rounded-sm w-16" />
            <div className="h-3.5 bg-slate-200 rounded-sm w-20" />
            <div className="h-3.5 bg-slate-200 rounded-sm w-24" />
            <div className="h-6 bg-slate-200 rounded-full w-20" />
            <div className="h-7 bg-slate-100 rounded-lg w-20" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-3 bg-slate-200 rounded-sm w-24" />
        <div className="w-8 h-8 rounded-lg bg-slate-100" />
      </div>
      <div className="h-8 bg-slate-200 rounded-sm w-16" />
      <div className="h-3 bg-slate-100 rounded-sm w-32" />
    </div>
  );
};
