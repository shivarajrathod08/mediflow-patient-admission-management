import React from 'react';
import { Calendar, Bell, Menu, Plus } from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onAdmitPatient: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onAdmitPatient,
}) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle + Date */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>{currentDate}</span>
        </div>
      </div>

      {/* Right: Notification & Admit Action */}
      <div className="flex items-center gap-3">
        <div className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer rounded-lg hover:bg-slate-50">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </div>

        <button
          onClick={onAdmitPatient}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-all focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Admit Patient</span>
        </button>
      </div>
    </header>
  );
};
