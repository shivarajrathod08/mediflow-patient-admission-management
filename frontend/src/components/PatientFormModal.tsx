import React, { useState, useEffect } from 'react';
import { Department, Doctor, Patient, Ward } from '../types';
import { X, AlertCircle } from 'lucide-react';

interface PatientFormModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialData?: Patient | null;
  departments: Department[];
  wards: Ward[];
  doctors: Doctor[];
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
}

export const PatientFormModal: React.FC<PatientFormModalProps> = ({
  isOpen,
  mode,
  initialData,
  departments,
  wards,
  doctors,
  isLoading = false,
  onClose,
  onSubmit,
}) => {
  const isEdit = mode === 'edit';

  const [name, setName] = useState('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState('Male');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [doctorId, setDoctorId] = useState<string>('');
  const [wardId, setWardId] = useState<string>('');
  const [admissionDate, setAdmissionDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [status, setStatus] = useState<'ADMITTED' | 'DISCHARGED'>('ADMITTED');
  const [diagnosis, setDiagnosis] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset or populate fields
  useEffect(() => {
    if (initialData && isEdit) {
      setName(initialData.name);
      setAge(String(initialData.age));
      setGender(initialData.gender);
      setDepartmentId(String(initialData.departmentId));
      setDoctorId(String(initialData.doctorId));
      setWardId(String(initialData.wardId));
      setAdmissionDate(initialData.admissionDate);
      setStatus(initialData.status);
      setDiagnosis(initialData.diagnosis || '');
    } else {
      setName('');
      setAge('');
      setGender('Male');
      setDepartmentId(departments.length > 0 ? String(departments[0].id) : '');
      setDoctorId('');
      setWardId(wards.length > 0 ? String(wards[0].id) : '');
      setAdmissionDate(new Date().toISOString().split('T')[0]);
      setStatus('ADMITTED');
      setDiagnosis('');
    }
    setErrors({});
  }, [initialData, isEdit, isOpen, departments, wards]);

  // When department changes, filter doctor options or auto-select
  const availableDoctors = doctors.filter(
    (doc) => !departmentId || String(doc.departmentId) === String(departmentId)
  );

  useEffect(() => {
    if (availableDoctors.length > 0) {
      const match = availableDoctors.find((d) => String(d.id) === doctorId);
      if (!match) {
        setDoctorId(String(availableDoctors[0].id));
      }
    } else {
      setDoctorId('');
    }
  }, [departmentId, availableDoctors]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!name.trim()) {
      errs.name = 'Patient name is required';
    } else if (!/^[\p{L} .'-]+$/u.test(name.trim())) {
      errs.name = 'Patient name must contain only letters and allowed separators';
    } else if (name.trim().length < 2 || name.trim().length > 100) {
      errs.name = 'Patient name must be between 2 and 100 characters';
    }

    const numAge = parseInt(age, 10);
    if (!age || isNaN(numAge)) {
      errs.age = 'Age is required and must be a number';
    } else if (numAge < 0 || numAge > 120) {
      errs.age = 'Age must be between 0 and 120';
    }

    if (!gender) {
      errs.gender = 'Gender is required';
    }

    if (!departmentId) {
      errs.departmentId = 'Department is required';
    }

    if (!doctorId) {
      errs.doctorId = 'Attending doctor is required';
    }

    if (!wardId) {
      errs.wardId = 'Ward is required';
    }

    if (!admissionDate) {
      errs.admissionDate = 'Admission date is required';
    } else {
      const today = new Date().toISOString().split('T')[0];
      if (admissionDate > today) {
        errs.admissionDate = 'Admission date cannot be in the future';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload: any = {
        name: name.trim(),
        age: parseInt(age, 10),
        gender,
        wardId: parseInt(wardId, 10),
        departmentId: parseInt(departmentId, 10),
        doctorId: parseInt(doctorId, 10),
        admissionDate,
        diagnosis: diagnosis.trim() || undefined,
      };

      if (isEdit) {
        payload.status = status;
      }

      await onSubmit(payload);
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setErrors({ general: err.response.data.message });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isEdit ? `Edit Patient Record (${initialData?.patientCode})` : 'New Patient Admission'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter patient demographic and admission allocation details
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Patient Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Eleanor Vance"
                className={`w-full px-3.5 py-2 rounded-lg border text-sm text-slate-900 focus:outline-hidden focus:ring-2 transition-all ${
                  errors.name
                    ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                    : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {errors.name ? (
                <p className="mt-1 text-xs text-rose-600">{errors.name}</p>
              ) : (
                <p className="mt-1 text-[11px] text-slate-400">Letters and spaces only</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Age <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 54"
                className={`w-full px-3.5 py-2 rounded-lg border text-sm text-slate-900 focus:outline-hidden focus:ring-2 transition-all ${
                  errors.age
                    ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                    : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {errors.age && <p className="mt-1 text-xs text-rose-600">{errors.age}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Gender <span className="text-rose-500">*</span>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Department <span className="text-rose-500">*</span>
              </label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-lg border text-sm text-slate-900 focus:outline-hidden focus:ring-2 transition-all bg-white ${
                  errors.departmentId ? 'border-rose-300' : 'border-slate-300 focus:ring-blue-500'
                }`}
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              {errors.departmentId && (
                <p className="mt-1 text-xs text-rose-600">{errors.departmentId}</p>
              )}
            </div>

            {/* Doctor (Filtered by selected Department) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Attending Doctor <span className="text-rose-500">*</span>
              </label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-lg border text-sm text-slate-900 focus:outline-hidden focus:ring-2 transition-all bg-white ${
                  errors.doctorId ? 'border-rose-300' : 'border-slate-300 focus:ring-blue-500'
                }`}
              >
                <option value="">Select Doctor</option>
                {availableDoctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} {doc.specialization ? `(${doc.specialization})` : ''}
                  </option>
                ))}
              </select>
              {errors.doctorId ? (
                <p className="mt-1 text-xs text-rose-600">{errors.doctorId}</p>
              ) : (
                <p className="mt-1 text-[11px] text-slate-400">
                  Assigned physicians in selected department
                </p>
              )}
            </div>

            {/* Ward */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Ward Allocation <span className="text-rose-500">*</span>
              </label>
              <select
                value={wardId}
                onChange={(e) => setWardId(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-lg border text-sm text-slate-900 focus:outline-hidden focus:ring-2 transition-all bg-white ${
                  errors.wardId ? 'border-rose-300' : 'border-slate-300 focus:ring-blue-500'
                }`}
              >
                <option value="">Select Ward</option>
                {wards.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} (Cap: {w.capacity})
                  </option>
                ))}
              </select>
              {errors.wardId && <p className="mt-1 text-xs text-rose-600">{errors.wardId}</p>}
            </div>

            {/* Admission Date */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Admission Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                max={new Date().toISOString().split('T')[0]}
                value={admissionDate}
                onChange={(e) => setAdmissionDate(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-lg border text-sm text-slate-900 focus:outline-hidden focus:ring-2 transition-all ${
                  errors.admissionDate
                    ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                    : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {errors.admissionDate && (
                <p className="mt-1 text-xs text-rose-600">{errors.admissionDate}</p>
              )}
            </div>

            {/* Status (Edit mode only) */}
            {isEdit && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Admission Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                >
                  <option value="ADMITTED">ADMITTED</option>
                  <option value="DISCHARGED">DISCHARGED</option>
                </select>
              </div>
            )}

            {/* Diagnosis / Notes */}
            <div className={isEdit ? '' : 'sm:col-span-2'}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Primary Diagnosis / Notes
              </label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Acute Coronary Syndrome"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-all focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                'Save Changes'
              ) : (
                'Admit Patient'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
