export interface User {
  id: string;
  email: string;
}

export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  patientCount: number;
  activePatients?: number;
  dischargedPatients?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  _id: string;
  doctorId: string | Doctor;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
  condition: string;
  status: 'active' | 'discharged';
  visitDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DoctorsResponse {
  data: Doctor[];
  pagination: Pagination;
}

export interface PatientsResponse {
  data: Patient[];
  pagination: Pagination;
}

export interface DoctorFiltersResponse {
  specializations: string[];
  hospitals: string[];
}

export interface PatientFiltersResponse {
  conditions: string[];
  statuses: string[];
}

export interface TopDoctor {
  doctorId?: string;
  name: string;
  specialization?: string;
  hospital?: string;
  count: number;
}

export interface ConditionStat {
  condition: string;
  count: number;
  percentage?: number;
}

export interface DashboardDoctor {
  id: string;
  _id?: string;
  name: string;
  specialization: string;
  hospital?: string;
  patients: number;
  count?: number;
  status: string;
}

export interface DashboardPatient {
  id: string;
  _id?: string;
  name: string;
  age: number;
  condition: string;
  status: string;
  addedDate: string;
  createdAt?: string;
  doctor: string;
  doctorId?: string;
}

export interface DashboardStats {
  totals: {
    doctors: number;
    patients: number;
    thisMonthPatients?: number;
    todayPatients?: number;
    activePatients?: number;
    dischargedPatients?: number;
    avgPatientsPerDoctor?: number;
    newPatients?: {
      days: number;
      count: number;
    };
  };
  growth?: {
    doctorsPctMonth?: number;
    doctorsGrowthText?: string;
    patientsPctMonth?: number;
    patientsGrowthText?: string;
    thisMonthPct?: number;
    thisMonthGrowthText?: string;
    todayPctYesterday?: number;
    todayGrowthText?: string;
    conditionsPctMonth?: number;
    conditionsGrowthText?: string;
  };
  patientsPerDoctor: TopDoctor[];
  doctorDirectory?: DashboardDoctor[];
  conditions: ConditionStat[];
  recentPatients?: DashboardPatient[];
  timezone?: string;
  generatedAt?: string;
}

