import axios from 'axios';
import {
  ApiResponse,
  CreatePatientInput,
  DashboardSummary,
  Department,
  Doctor,
  PageResponse,
  Patient,
  UpdatePatientInput,
  Ward,
} from '../types';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const normalizedBase = rawBaseUrl.replace(/\/+$/, '');
const API_BASE_URL = normalizedBase.endsWith('/api') ? normalizedBase : `${normalizedBase}/api`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const PatientService = {
  getPatients: async (params: {
    search?: string;
    wardId?: number;
    departmentId?: number;
    doctorId?: number;
    status?: string;
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<PageResponse<Patient>> => {
    const res = await apiClient.get<ApiResponse<PageResponse<Patient>>>('/patients', {
      params,
    });
    return res.data.data;
  },

  getPatientById: async (id: number): Promise<Patient> => {
    const res = await apiClient.get<ApiResponse<Patient>>(`/patients/${id}`);
    return res.data.data;
  },

  createPatient: async (data: CreatePatientInput): Promise<Patient> => {
    const res = await apiClient.post<ApiResponse<Patient>>('/patients', data);
    return res.data.data;
  },

  updatePatient: async (id: number, data: UpdatePatientInput): Promise<Patient> => {
    const res = await apiClient.put<ApiResponse<Patient>>(`/patients/${id}`, data);
    return res.data.data;
  },

  deletePatient: async (id: number): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/patients/${id}`);
  },

  dischargePatient: async (id: number): Promise<Patient> => {
    const res = await apiClient.patch<ApiResponse<Patient>>(`/patients/${id}/discharge`);
    return res.data.data;
  },
};

export const DashboardApiService = {
  getSummary: async (): Promise<DashboardSummary> => {
    const res = await apiClient.get<ApiResponse<DashboardSummary>>('/dashboard/summary');
    return res.data.data;
  },
};

export const ReferenceDataService = {
  getDepartments: async (): Promise<Department[]> => {
    const res = await apiClient.get<ApiResponse<Department[]>>('/departments');
    return res.data.data;
  },

  getWards: async (): Promise<Ward[]> => {
    const res = await apiClient.get<ApiResponse<Ward[]>>('/wards');
    return res.data.data;
  },

  getDoctors: async (departmentId?: number): Promise<Doctor[]> => {
    const res = await apiClient.get<ApiResponse<Doctor[]>>('/doctors', {
      params: departmentId ? { departmentId } : {},
    });
    return res.data.data;
  },
};
