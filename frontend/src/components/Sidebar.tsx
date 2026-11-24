import React from 'react';
import { LayoutDashboard, Users, Activity, Settings, Plus, Stethoscope } from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'patients';
  onTabChange: (tab: 'dashboard' | 'patients') => void;
  onQuickAddPatient: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onQuickAddPatient,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patients', icon: Users },
  ] as const;

  const content = (
    <div className="h-full flex flex-col justify-between bg-[#0f172a] text-slate-300 w-64 border-r border-slate-800 shadow-sm">
      {/* Brand Header */}
      <div>
        <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-800/80">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
            <Activity className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-lg tracking-tight leading-none">
              MediFlow
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 mt-0.5">
              Clinical SaaS
            </span>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="p-4">
          <button
            onClick={() => {
              onQuickAddPatient();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0f172a]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Admit Patient</span>
          </button>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-2">
          <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Workspace
          </span>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-white font-semibold shadow-2xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Static contextual links */}
            <div className="pt-4">
              <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Hospital System
              </span>
              <div className="mt-2 space-y-1">
                <button
                  onClick={() => onTabChange('patients')}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
                >
                  <Stethoscope className="w-4 h-4 text-slate-400" />
                  <span>Wards & Units</span>
                </button>
                <div className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed">
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Hospital Settings</span>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Staff Profile Placeholder */}
      <div className="p-3 m-3 bg-[#0b1222] rounded-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-900/60 border border-blue-400/30 flex items-center justify-center font-bold text-xs text-blue-200">
            SJ
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate leading-tight">
              Dr. Sarah Jenkins
            </p>
            <p className="text-[11px] text-slate-400 truncate">Chief Medical Officer</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 z-30 w-64">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-64 z-50 transform transition-transform duration-300">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
