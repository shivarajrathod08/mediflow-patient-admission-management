import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  badgeText?: string;
  badgeType?: 'success' | 'warning' | 'info' | 'neutral';
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  badgeText,
  badgeType = 'info',
  icon: Icon,
  iconBgColor = 'bg-blue-50',
  iconColor = 'text-blue-600',
}) => {
  const badgeClasses = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  }[badgeType];

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:shadow-sm transition-all duration-200">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`w-9 h-9 rounded-lg ${iconBgColor} flex items-center justify-center ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline justify-between mb-2">
        <span className="text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
        {badgeText && (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeClasses}`}>
            {badgeText}
          </span>
        )}
      </div>

      <div className="pt-1 text-xs text-slate-500 font-medium">
        {subtitle}
      </div>
    </div>
  );
};
