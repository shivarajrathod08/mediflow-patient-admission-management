import React, { useEffect, useState } from 'react';
import { DashboardSummary, Patient } from '../types';
import { DashboardApiService } from '../services/api';
import { StatCard } from '../components/StatCard';
import { CardSkeleton, TableSkeleton } from '../components/LoadingSkeleton';
import { StatusBadge } from '../components/StatusBadge';
import {
  Users,
  Bed,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  RefreshCw,
  AlertCircle,
  Building2,
  Eye,
} from 'lucide-react';

interface DashboardPageProps {
  onAdmitPatient: () => void;
  onNavigateToPatients: () => void;
  onViewPatient: (patient: Patient) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onAdmitPatient,
  onNavigateToPatients,
  onViewPatient,
}) => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await DashboardApiService.getSummary();
      setSummary(data);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Failed to load dashboard metrics. Ensure backend is running.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (isLoading && !summary) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Hospital Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time patient census, bed allocation, and department workloads
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchSummary}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
            title="Refresh statistics"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Refresh</span>
          </button>
          <button
            onClick={onAdmitPatient}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Admit Patient</span>
          </button>
        </div>
      </div>

      {/* Error state alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchSummary}
            className="text-xs font-semibold underline hover:text-rose-950"
          >
            Retry
          </button>
        </div>
      )}

      {/* 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Patients"
          value={summary?.totalPatients ?? 0}
          subtitle="All recorded patient records"
          badgeText="Active & Archive"
          badgeType="info"
          icon={Users}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />

        <StatCard
          title="Currently Admitted"
          value={summary?.admittedPatients ?? 0}
          subtitle="Inpatients occupying hospital beds"
          badgeText="Active Beds"
          badgeType="success"
          icon={Bed}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <StatCard
          title="Discharged Patients"
          value={summary?.dischargedPatients ?? 0}
          subtitle="Safe hospital discharge benchmark"
          badgeText="Clean Exit"
          badgeType="neutral"
          icon={CheckCircle2}
          iconBgColor="bg-slate-100"
          iconColor="text-slate-600"
        />

        <StatCard
          title="Admissions Today"
          value={summary?.admissionsToday ?? 0}
          subtitle="New admissions logged today"
          badgeText="24h Window"
          badgeType="warning"
          icon={Clock}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* Main Grid: Left Recent Admissions (8 cols) + Right Analytics Widgets (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Recent Patient Admissions */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Recent Patient Admissions
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Latest inpatient arrivals and bed allocations
                </p>
              </div>
              <button
                onClick={onNavigateToPatients}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <span>View Full List</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Table or Empty */}
            {(!summary?.recentAdmissions || summary.recentAdmissions.length === 0) ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No patient admissions logged yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                      <th className="py-2.5 px-4">Patient Code</th>
                      <th className="py-2.5 px-4">Name</th>
                      <th className="py-2.5 px-3">Ward</th>
                      <th className="py-2.5 px-3">Doctor</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {summary.recentAdmissions.map((patient) => (
                      <tr
                        key={patient.id}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono text-xs font-semibold text-slate-600">
                          #{patient.patientCode}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {patient.name}
                        </td>
                        <td className="py-3 px-3 text-slate-600 text-xs">
                          {patient.wardName}
                        </td>
                        <td className="py-3 px-3 text-slate-600 text-xs">
                          {patient.doctorName}
                        </td>
                        <td className="py-3 px-3">
                          <StatusBadge status={patient.status} />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => onViewPatient(patient)}
                            className="p-1 text-slate-400 hover:text-blue-600 rounded-md transition-colors"
                            title="View Patient Record"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Ward Occupancy & Department Distribution */}
        <div className="lg:col-span-4 space-y-6">
          {/* Ward Occupancy Rates */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Ward Occupancy Rates
                </h3>
                <p className="text-[11px] text-slate-500">Live facility utilization</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                {summary?.admittedPatients ?? 0} Admitted
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {summary?.wardOccupancy?.map((ward) => {
                const isHigh = ward.occupancyRate >= 80;
                return (
                  <div key={ward.wardId} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700 truncate max-w-[170px]">
                        {ward.wardName}
                      </span>
                      <span
                        className={`font-semibold ${
                          isHigh ? 'text-amber-600' : 'text-slate-600'
                        }`}
                      >
                        {ward.admittedCount}/{ward.totalCapacity} ({ward.occupancyRate}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isHigh ? 'bg-amber-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${Math.min(ward.occupancyRate, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Department Distribution */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Department Workload
                </h3>
                <p className="text-[11px] text-slate-500">
                  Inpatients by clinical specialty
                </p>
              </div>
              <Building2 className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-2.5 pt-1">
              {summary?.departmentDistribution?.map((dept) => (
                <div
                  key={dept.departmentId}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50/70 border border-slate-100 text-xs"
                >
                  <span className="font-medium text-slate-800">{dept.departmentName}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{dept.patientCount}</span>
                    <span className="text-[11px] text-slate-500">
                      ({dept.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
