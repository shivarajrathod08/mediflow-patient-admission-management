import React, { useState, useEffect, useCallback } from 'react';
import { Department, Doctor, FilterState, Patient, Ward } from '../types';
import { PatientService, ReferenceDataService } from '../services/api';
import { PatientTable } from '../components/PatientTable';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { PatientFormModal } from '../components/PatientFormModal';
import { PatientDetailsModal } from '../components/PatientDetailsModal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import {
  Search,
  Plus,
  RotateCcw,
  AlertCircle,
  FileDown,
} from 'lucide-react';

interface PatientsPageProps {
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
  externalTriggerAdd?: boolean;
  onClearExternalTriggerAdd?: () => void;
  selectedPatientForView?: Patient | null;
  onClearViewPatient?: () => void;
}

export const PatientsPage: React.FC<PatientsPageProps> = ({
  onShowToast,
  externalTriggerAdd = false,
  onClearExternalTriggerAdd,
  selectedPatientForView = null,
  onClearViewPatient,
}) => {
  // Reference data
  const [departments, setDepartments] = useState<Department[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  // Patient table state
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    wardId: '',
    departmentId: '',
    doctorId: '',
    status: '',
    page: 0,
    size: 10,
  });

  const [searchInput, setSearchInput] = useState('');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // Details modal
  const [detailsPatient, setDetailsPatient] = useState<Patient | null>(null);

  // Confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    patient: Patient | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    patient: null,
    isLoading: false,
  });

  // Load reference data
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const [depts, wds, docs] = await Promise.all([
          ReferenceDataService.getDepartments(),
          ReferenceDataService.getWards(),
          ReferenceDataService.getDoctors(),
        ]);
        setDepartments(depts);
        setWards(wds);
        setDoctors(docs);
      } catch (err: any) {
        console.error('Failed to load reference data', err);
      }
    };
    loadReferenceData();
  }, []);

  // Sync external add trigger from header/sidebar
  useEffect(() => {
    if (externalTriggerAdd) {
      setFormMode('add');
      setSelectedPatient(null);
      setIsFormOpen(true);
      onClearExternalTriggerAdd?.();
    }
  }, [externalTriggerAdd, onClearExternalTriggerAdd]);

  // Sync external view trigger from dashboard
  useEffect(() => {
    if (selectedPatientForView) {
      setDetailsPatient(selectedPatientForView);
      onClearViewPatient?.();
    }
  }, [selectedPatientForView, onClearViewPatient]);

  // Fetch patients based on active filters
  const fetchPatients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await PatientService.getPatients({
        search: filters.search.trim() || undefined,
        wardId: filters.wardId ? parseInt(filters.wardId, 10) : undefined,
        departmentId: filters.departmentId
          ? parseInt(filters.departmentId, 10)
          : undefined,
        doctorId: filters.doctorId ? parseInt(filters.doctorId, 10) : undefined,
        status: filters.status || undefined,
        page: filters.page,
        size: filters.size,
      });
      setPatients(data.content);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Failed to load patient records. Please check backend connectivity.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Debounced search handling
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: searchInput,
        page: 0, // reset to page 0 on search
      }));
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 0, // reset to first page on filter change
    }));
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setFilters({
      search: '',
      wardId: '',
      departmentId: '',
      doctorId: '',
      status: '',
      page: 0,
      size: 10,
    });
  };

  // Form submission handler
  const handleFormSubmit = async (formData: any) => {
    setIsFormSubmitting(true);
    try {
      if (formMode === 'add') {
        const created = await PatientService.createPatient(formData);
        onShowToast(
          'success',
          `Patient ${created.name} (#${created.patientCode}) admitted successfully!`
        );
      } else if (formMode === 'edit' && selectedPatient) {
        const updated = await PatientService.updatePatient(
          selectedPatient.id,
          formData
        );
        onShowToast(
          'success',
          `Patient ${updated.name} (#${updated.patientCode}) updated successfully!`
        );
      }
      setIsFormOpen(false);
      fetchPatients();
    } catch (err: any) {
      throw err; // let modal display validation errors
    } finally {
      setIsFormSubmitting(false);
    }
  };

  // Discharge handler
  const handleDischargePatient = async (patient: Patient) => {
    try {
      const discharged = await PatientService.dischargePatient(patient.id);
      onShowToast(
        'success',
        `Patient ${discharged.name} (#${discharged.patientCode}) has been marked as DISCHARGED.`
      );
      fetchPatients();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to discharge patient.';
      onShowToast('error', msg);
    }
  };

  // Delete handler
  const confirmDeletePatient = async () => {
    if (!deleteDialog.patient) return;

    setDeleteDialog((prev) => ({ ...prev, isLoading: true }));
    try {
      await PatientService.deletePatient(deleteDialog.patient.id);
      onShowToast(
        'success',
        `Patient ${deleteDialog.patient.name} (#${deleteDialog.patient.patientCode}) record deleted.`
      );
      setDeleteDialog({ isOpen: false, patient: null, isLoading: false });
      fetchPatients();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to delete patient.';
      onShowToast('error', msg);
      setDeleteDialog((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Doctors filtered by selected department filter in the filter bar
  const doctorsForFilter = doctors.filter(
    (d) => !filters.departmentId || String(d.departmentId) === filters.departmentId
  );

  const hasActiveFilters =
    Boolean(searchInput.trim()) ||
    Boolean(filters.wardId) ||
    Boolean(filters.departmentId) ||
    Boolean(filters.doctorId) ||
    Boolean(filters.status);

  // CSV export function
  const handleExportCSV = () => {
    if (patients.length === 0) {
      onShowToast('info', 'No patient records to export');
      return;
    }
    const headers = [
      'Patient Code',
      'Name',
      'Age',
      'Gender',
      'Ward',
      'Department',
      'Doctor',
      'Admission Date',
      'Status',
      'Diagnosis',
    ];
    const rows = patients.map((p) => [
      p.patientCode,
      `"${p.name}"`,
      p.age,
      p.gender,
      `"${p.wardName}"`,
      `"${p.departmentName}"`,
      `"${p.doctorName}"`,
      p.admissionDate,
      p.status,
      `"${p.diagnosis || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mediflow_patients_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('success', 'Patient records exported to CSV');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Patient Management
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {totalElements} Patients
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Search, filter, allocate beds, and manage patient admission lifecycles
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
            title="Export CSV"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => {
              setFormMode('add');
              setSelectedPatient(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-all focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Patient</span>
          </button>
        </div>
      </div>

      {/* Filter Bar Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Live Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by patient name, ID..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Ward filter */}
          <div>
            <select
              value={filters.wardId}
              onChange={(e) => handleFilterChange('wardId', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="">All Wards</option>
              {wards.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          {/* Department filter */}
          <div>
            <select
              value={filters.departmentId}
              onChange={(e) => handleFilterChange('departmentId', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor filter */}
          <div>
            <select
              value={filters.doctorId}
              onChange={(e) => handleFilterChange('doctorId', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="">All Doctors</option>
              {doctorsForFilter.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="ADMITTED">ADMITTED</option>
              <option value="DISCHARGED">DISCHARGED</option>
            </select>
          </div>
        </div>

        {/* Filter status row & Clear */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <span>
              {hasActiveFilters ? (
                <span className="text-blue-700 font-medium">Filters applied</span>
              ) : (
                'Showing all records'
              )}
            </span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Backend error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchPatients}
            className="text-xs font-semibold underline hover:text-rose-950"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Table or Loading/Empty State */}
      {isLoading ? (
        <TableSkeleton />
      ) : patients.length === 0 ? (
        <EmptyState
          title="No patients found"
          description={
            hasActiveFilters
              ? 'No patient records match your active search or filter options.'
              : 'No patient admissions have been registered yet.'
          }
          actionLabel={hasActiveFilters ? 'Reset Filters' : 'Admit First Patient'}
          onAction={
            hasActiveFilters
              ? handleClearFilters
              : () => {
                  setFormMode('add');
                  setSelectedPatient(null);
                  setIsFormOpen(true);
                }
          }
        />
      ) : (
        <PatientTable
          patients={patients}
          totalElements={totalElements}
          currentPage={filters.page}
          pageSize={filters.size}
          totalPages={totalPages}
          onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
          onView={(p) => setDetailsPatient(p)}
          onEdit={(p) => {
            setSelectedPatient(p);
            setFormMode('edit');
            setIsFormOpen(true);
          }}
          onDischarge={handleDischargePatient}
          onDelete={(p) =>
            setDeleteDialog({ isOpen: true, patient: p, isLoading: false })
          }
        />
      )}

      {/* Add / Edit Patient Modal */}
      <PatientFormModal
        isOpen={isFormOpen}
        mode={formMode}
        initialData={selectedPatient}
        departments={departments}
        wards={wards}
        doctors={doctors}
        isLoading={isFormSubmitting}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Patient Details Modal */}
      <PatientDetailsModal
        isOpen={Boolean(detailsPatient)}
        patient={detailsPatient}
        onClose={() => setDetailsPatient(null)}
        onEdit={(p) => {
          setSelectedPatient(p);
          setFormMode('edit');
          setIsFormOpen(true);
        }}
        onDischarge={handleDischargePatient}
      />

      {/* Delete Confirmation Alert */}
      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Patient Record?"
        message={`Are you sure you want to permanently delete patient ${
          deleteDialog.patient?.name
        } (#${deleteDialog.patient?.patientCode})? This action cannot be reversed.`}
        confirmLabel="Yes, Delete Patient"
        isLoading={deleteDialog.isLoading}
        onConfirm={confirmDeletePatient}
        onCancel={() =>
          setDeleteDialog({ isOpen: false, patient: null, isLoading: false })
        }
      />
    </div>
  );
};
