import React from 'react';
import { Patient } from '../types';
import { StatusBadge } from './StatusBadge';
import {
  X,
  Calendar,
  Building2,
  Stethoscope,
  User,
  HeartPulse,
  Edit2,
  LogOut,
  Bed,
} from 'lucide-react';

interface PatientDetailsModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (patient: Patient) => void;
  onDischarge: (patient: Patient) => void;
}

export const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({
  patient,
  isOpen,
  onClose,
  onEdit,
  onDischarge,
}) => {
  if (!isOpen || !patient) return null;

  const isAdmitted = patient.status === 'ADMITTED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header Banner */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
              {patient.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{patient.name}</h2>
                <StatusBadge status={patient.status} />
              </div>
              <p className="text-xs font-mono font-medium text-slate-500 mt-1">
                Medical Record #{patient.patientCode}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Details Grid */}
        <div className="p-6 space-y-5 text-sm">
          <div className="grid grid-cols-2 gap-4">
            {/* Age & Gender */}
            <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-200/80">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
                <User className="w-3.5 h-3.5 text-blue-600" />
                Demographics
              </span>
              <p className="font-semibold text-slate-800">
                {patient.age} years old • {patient.gender}
              </p>
            </div>

            {/* Admission Date */}
            <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-200/80">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Admission Date
              </span>
              <p className="font-semibold text-slate-800">{patient.admissionDate}</p>
            </div>

            {/* Department */}
            <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-200/80">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                Department
              </span>
              <p className="font-semibold text-slate-800">{patient.departmentName}</p>
            </div>

            {/* Ward */}
            <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-200/80">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
                <Bed className="w-3.5 h-3.5 text-blue-600" />
                Ward Allocation
              </span>
              <p className="font-semibold text-slate-800">{patient.wardName}</p>
            </div>
          </div>

          {/* Assigned Doctor */}
          <div className="p-3.5 bg-blue-50/40 rounded-lg border border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 block">
                  Attending Physician
                </span>
                <span className="font-bold text-slate-900">{patient.doctorName}</span>
              </div>
            </div>
          </div>

          {/* Diagnosis / Notes */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
              <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
              Clinical Diagnosis
            </span>
            <p className="text-slate-800 font-medium">
              {patient.diagnosis || 'Standard inpatient care and observation'}
            </p>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(patient);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            {isAdmitted && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDischarge(patient);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Mark as Discharged</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
