import React from 'react';
import { Patient } from '../types';
import { StatusBadge } from './StatusBadge';
import { Eye, Edit2, LogOut, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

interface PatientTableProps {
  patients: Patient[];
  totalElements: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onView: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
  onDischarge: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

export const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  totalElements,
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
  onView,
  onEdit,
  onDischarge,
  onDelete,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-100 text-blue-700',
      'bg-indigo-100 text-indigo-700',
      'bg-emerald-100 text-emerald-700',
      'bg-teal-100 text-teal-700',
      'bg-amber-100 text-amber-700',
      'bg-rose-100 text-rose-700',
      'bg-purple-100 text-purple-700',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const startRecord = totalElements > 0 ? currentPage * pageSize + 1 : 0;
  const endRecord = Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 h-11 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Patient Name</th>
              <th className="py-3 px-4 font-semibold">Patient ID</th>
              <th className="py-3 px-3 font-semibold">Age</th>
              <th className="py-3 px-3 font-semibold">Gender</th>
              <th className="py-3 px-4 font-semibold">Ward</th>
              <th className="py-3 px-4 font-semibold">Department</th>
              <th className="py-3 px-4 font-semibold">Doctor</th>
              <th className="py-3 px-4 font-semibold">Admission Date</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {patients.map((patient) => {
              const isAdmitted = patient.status === 'ADMITTED';
              return (
                <tr
                  key={patient.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Name + Avatar */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarColor(
                          patient.name
                        )}`}
                      >
                        {getInitials(patient.name)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span
                          onClick={() => onView(patient)}
                          className="font-semibold text-slate-900 group-hover:text-blue-600 cursor-pointer transition-colors leading-tight"
                        >
                          {patient.name}
                        </span>
                        <span className="text-xs text-slate-500 truncate max-w-[180px]">
                          {patient.diagnosis || 'General Inpatient'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Patient ID */}
                  <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-600 whitespace-nowrap">
                    #{patient.patientCode}
                  </td>

                  {/* Age */}
                  <td className="py-3.5 px-3 text-slate-700 whitespace-nowrap">
                    {patient.age}y
                  </td>

                  {/* Gender */}
                  <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                    {patient.gender}
                  </td>

                  {/* Ward */}
                  <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                    {patient.wardName}
                  </td>

                  {/* Department */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {patient.departmentName}
                    </span>
                  </td>

                  {/* Doctor */}
                  <td className="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                    {patient.doctorName}
                  </td>

                  {/* Admission Date */}
                  <td className="py-3.5 px-4 text-xs font-medium text-slate-500 whitespace-nowrap">
                    {patient.admissionDate}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={patient.status} />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1 text-slate-400">
                      {/* View */}
                      <button
                        type="button"
                        onClick={() => onView(patient)}
                        className="p-1.5 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="View Patient Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => onEdit(patient)}
                        className="p-1.5 rounded-lg hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        title="Edit Record"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Discharge */}
                      <button
                        type="button"
                        onClick={() => isAdmitted && onDischarge(patient)}
                        disabled={!isAdmitted}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isAdmitted
                            ? 'hover:text-emerald-700 hover:bg-emerald-50 text-slate-400'
                            : 'opacity-30 cursor-not-allowed'
                        }`}
                        title={isAdmitted ? 'Mark as Discharged' : 'Already Discharged'}
                      >
                        <LogOut className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => onDelete(patient)}
                        className="p-1.5 rounded-lg hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 bg-slate-50/50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Showing <span className="font-semibold text-slate-800">{startRecord}</span> to{' '}
          <span className="font-semibold text-slate-800">{endRecord}</span> of{' '}
          <span className="font-semibold text-slate-800">{totalElements}</span> patients
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, idx) => {
            // Keep pagination controls compact if many pages
            if (
              totalPages > 7 &&
              idx !== 0 &&
              idx !== totalPages - 1 &&
              Math.abs(idx - currentPage) > 1
            ) {
              if (idx === 1 || idx === totalPages - 2) {
                return (
                  <span key={idx} className="px-1 text-slate-400">
                    ...
                  </span>
                );
              }
              return null;
            }

            const isActive = idx === currentPage;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onPageChange(idx)}
                className={`min-w-[28px] h-7 px-2 rounded-lg font-semibold text-xs transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
