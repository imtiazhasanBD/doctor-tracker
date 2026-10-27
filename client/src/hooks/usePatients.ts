import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Patient, PatientsResponse, PatientFiltersResponse } from '@/types/api';
import { PatientFormData } from '@/schemas';

interface PatientQueryParams {
  page?: number;
  limit?: number;
  q?: string;
  doctorId?: string;
  condition?: string;
  status?: string;
  from?: string;
  to?: string;
}

export function usePatients(params?: PatientQueryParams) {
  return useQuery<PatientsResponse>({
    queryKey: ['patients', params],
    queryFn: async () => {
      const res = await api.get('/patients', { params });
      return res.data;
    },
  });
}

export function useDoctorPatients(doctorId: string, page = 1, limit = 10) {
  return useQuery<PatientsResponse>({
    queryKey: ['doctor-patients', doctorId, page, limit],
    queryFn: async () => {
      const res = await api.get(`/doctors/${doctorId}/patients`, {
        params: { page, limit },
      });
      return res.data;
    },
    enabled: Boolean(doctorId),
  });
}

export function usePatientFilters() {
  return useQuery<PatientFiltersResponse>({
    queryKey: ['patients', 'filters'],
    queryFn: async () => {
      const res = await api.get('/patients/filters');
      return res.data.data;
    },
    staleTime: 1000 * 60 * 30, // 30 mins
  });
}

export function usePatientMutations() {
  const queryClient = useQueryClient();

  const createPatient = useMutation({
    mutationFn: async ({
      doctorId,
      data,
    }: {
      doctorId: string;
      data: Omit<PatientFormData, 'doctorId'>;
    }) => {
      const res = await api.post(`/doctors/${doctorId}/patients`, data);
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['doctor-patients', variables.doctorId] });
      queryClient.invalidateQueries({ queryKey: ['doctor', variables.doctorId] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });

  const updatePatient = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PatientFormData> }) => {
      const res = await api.patch(`/patients/${id}`, data);
      return res.data.data;
    },
    onSuccess: (updatedPatient: Patient) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      if (typeof updatedPatient?.doctorId === 'string') {
        queryClient.invalidateQueries({ queryKey: ['doctor-patients', updatedPatient.doctorId] });
      } else if (updatedPatient?.doctorId?._id) {
        queryClient.invalidateQueries({ queryKey: ['doctor-patients', updatedPatient.doctorId._id] });
      }
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });

  const deletePatient = useMutation({
    mutationFn: async ({ id, doctorId }: { id: string; doctorId?: string }) => {
      if (doctorId) {
        const res = await api.delete(`/doctors/${doctorId}/patients/${id}`);
        return res.data;
      } else {
        const res = await api.delete(`/patients/${id}`);
        return res.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['doctor-patients'] });
      queryClient.invalidateQueries({ queryKey: ['doctor'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });

  return {
    createPatient,
    updatePatient,
    deletePatient,
  };
}
