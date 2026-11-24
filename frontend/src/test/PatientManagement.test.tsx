import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StatusBadge } from '../components/StatusBadge';
import { StatCard } from '../components/StatCard';
import { EmptyState } from '../components/EmptyState';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { PatientTable } from '../components/PatientTable';
import { Users } from 'lucide-react';
import { Patient } from '../types';

const mockPatient: Patient = {
  id: 1,
  patientCode: 'PAT-1001',
  name: 'Eleanor Vance',
  age: 54,
  gender: 'Female',
  wardId: 1,
  wardName: 'Ward 4B - Cardiology',
  departmentId: 1,
  departmentName: 'Cardiology',
  doctorId: 1,
  doctorName: 'Dr. Sarah Jenkins',
  admissionDate: '2024-10-24',
  status: 'ADMITTED',
  diagnosis: 'Acute Coronary Syndrome',
};

describe('MediFlow Frontend Component Tests', () => {
  it('renders ADMITTED and DISCHARGED status badges correctly', () => {
    const { rerender } = render(<StatusBadge status="ADMITTED" />);
    expect(screen.getByText('ADMITTED')).toBeInTheDocument();

    rerender(<StatusBadge status="DISCHARGED" />);
    expect(screen.getByText('DISCHARGED')).toBeInTheDocument();
  });

  it('renders StatCard with value and subtitle', () => {
    render(
      <StatCard
        title="Total Patients"
        value={128}
        subtitle="Active & archive records"
        icon={Users}
        badgeText="+12%"
      />
    );
    expect(screen.getByText('Total Patients')).toBeInTheDocument();
    expect(screen.getByText('128')).toBeInTheDocument();
    expect(screen.getByText('+12%')).toBeInTheDocument();
  });

  it('renders EmptyState and triggers action', () => {
    const onReset = vi.fn();
    render(
      <EmptyState
        title="No records found"
        description="Try adjusting your search criteria"
        actionLabel="Reset"
        onAction={onReset}
      />
    );
    expect(screen.getByText('No records found')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Reset'));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('renders ConfirmationDialog and calls onConfirm and onCancel', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    const { rerender } = render(
      <ConfirmationDialog
        isOpen={true}
        title="Delete Patient Record?"
        message="Are you sure you want to delete this patient?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    expect(screen.getByText('Delete Patient Record?')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Delete'));
    expect(onConfirm).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);

    rerender(
      <ConfirmationDialog
        isOpen={false}
        title="Delete Patient Record?"
        message="Are you sure?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );
    expect(screen.queryByText('Delete Patient Record?')).not.toBeInTheDocument();
  });

  it('renders PatientTable with patient rows and triggers action callbacks', () => {
    const onView = vi.fn();
    const onEdit = vi.fn();
    const onDischarge = vi.fn();
    const onDelete = vi.fn();
    const onPageChange = vi.fn();

    render(
      <PatientTable
        patients={[mockPatient]}
        totalElements={1}
        currentPage={0}
        pageSize={10}
        totalPages={1}
        onPageChange={onPageChange}
        onView={onView}
        onEdit={onEdit}
        onDischarge={onDischarge}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText('Eleanor Vance')).toBeInTheDocument();
    expect(screen.getByText('#PAT-1001')).toBeInTheDocument();
    expect(screen.getByText('Cardiology')).toBeInTheDocument();
    expect(screen.getByText('Dr. Sarah Jenkins')).toBeInTheDocument();

    // Click view
    fireEvent.click(screen.getByTitle('View Patient Details'));
    expect(onView).toHaveBeenCalledWith(mockPatient);

    // Click edit
    fireEvent.click(screen.getByTitle('Edit Record'));
    expect(onEdit).toHaveBeenCalledWith(mockPatient);

    // Click discharge
    fireEvent.click(screen.getByTitle('Mark as Discharged'));
    expect(onDischarge).toHaveBeenCalledWith(mockPatient);

    // Click delete
    fireEvent.click(screen.getByTitle('Delete Record'));
    expect(onDelete).toHaveBeenCalledWith(mockPatient);
  });
});
