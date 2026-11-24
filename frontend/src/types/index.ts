export interface Patient {
  id: number;
  patientCode: string;
  name: string;
  age: number;
  gender: string;
  wardId: number;
  wardName: string;
  departmentId: number;
  departmentName: string;
  doctorId: number;
  doctorName: string;
  admissionDate: string;
  status: 'ADMITTED' | 'DISCHARGED';
  diagnosis?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePatientInput {
  name: string;
  age: number;
  gender: string;
  wardId: number;
  departmentId: number;
  doctorId: number;
  admissionDate: string;
  diagnosis?: string;
}

export interface UpdatePatientInput {
  name: string;
  age: number;
  gender: string;
  wardId: number;
  departmentId: number;
  doctorId: number;
  admissionDate: string;
  status?: string;
  diagnosis?: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
}

export interface Ward {
  id: number;
  name: string;
  code: string;
  capacity: number;
}

export interface Doctor {
  id: number;
  name: string;
  departmentId: number;
  departmentName: string;
  specialization?: string;
}

export interface DepartmentStat {
  departmentId: number;
  departmentName: string;
  patientCount: number;
  percentage: number;
}

export interface WardOccupancy {
  wardId: number;
  wardName: string;
  admittedCount: number;
  totalCapacity: number;
  occupancyRate: number;
}

export interface DashboardSummary {
  totalPatients: number;
  admittedPatients: number;
  dischargedPatients: number;
  admissionsToday: number;
  departmentDistribution: DepartmentStat[];
  wardOccupancy: WardOccupancy[];
  recentAdmissions: Patient[];
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string>;
}

export interface FilterState {
  search: string;
  wardId: string;
  departmentId: string;
  doctorId: string;
  status: string;
  page: number;
  size: number;
}
