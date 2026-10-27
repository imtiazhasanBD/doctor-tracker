import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Doctor, DoctorsResponse, DoctorFiltersResponse } from '@/types/api';
import { DoctorFormData } from '@/schemas';

interface DoctorQueryParams {
  page?: number;
  limit?: number;
  q?: string;
  specialization?: string;
  hospital?: string;
}

export function useDoctors(params?: DoctorQueryParams) {
  return useQuery<any>({
    queryKey: ['doctors', params],
    queryFn: async () => {
      const p: Record<string, any> = { ...params };
      if (p.q && !p.search) {
        p.search = p.q;
      }
      delete p.q;
      const res = await api.get('/doctors', { params: p });
      return res.data;
    },
  });
}

export function useDoctorFilters() {
  return useQuery<DoctorFiltersResponse>({
    queryKey: ['doctors', 'filters'],
    queryFn: async () => {
      const res = await api.get('/doctors/filters');
      return res.data.data;
    },
    staleTime: 1000 * 60 * 30, // 30 mins
  });
}

export function useDoctor(id: string) {
  return useQuery<Doctor>({
    queryKey: ['doctor', id],
    queryFn: async () => {
      const res = await api.get(`/doctors/${id}`);
      return res.data.data;
    },
    enabled: Boolean(id),
  });
}

export function useDoctorMutations() {
  const queryClient = useQueryClient();

  const createDoctor = useMutation({
    mutationFn: async (data: DoctorFormData) => {
      const res = await api.post('/doctors', data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });

  const deleteDoctor = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/doctors/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });

  const updateDoctor = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<DoctorFormData> }) => {
      const res = await api.patch(`/doctors/${id}`, data);
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['doctor', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });

  return {
    createDoctor,
    updateDoctor,
    deleteDoctor,
  };
}
