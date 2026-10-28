import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ConditionStat, DashboardStats, TopDoctor } from '@/types/api';

export const TIMEFRAME_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
  { value: 'all', label: 'All Time' },
] as const;

export type TimeframeOption = (typeof TIMEFRAME_OPTIONS)[number]['value'];

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const res = await api.get('/dashboard/stats');
      return res.data.data;
    },
    refetchInterval: 1000 * 60 * 5,
  });
}

export function usePatientsPerDoctor(timeframe: string, initialData?: TopDoctor[]) {
  return useQuery<TopDoctor[]>({
    queryKey: ['dashboard', 'patients-per-doctor', timeframe],
    queryFn: async () => {
      const res = await api.get('/dashboard/patients-per-doctor', {
        params: { timeframe },
      });
      return res.data.data;
    },
    initialData: timeframe === 'month' && initialData && initialData.length > 0 ? initialData : undefined,
    staleTime: 1000 * 60,
  });
}

export interface PatientsByConditionResult {
  conditions: ConditionStat[];
  total: number;
}

export function usePatientsByCondition(
  timeframe: string,
  initialData?: { conditions: ConditionStat[]; total?: number }
) {
  return useQuery<PatientsByConditionResult>({
    queryKey: ['dashboard', 'patients-by-condition', timeframe],
    queryFn: async () => {
      const res = await api.get('/dashboard/patients-by-condition', {
        params: { timeframe },
      });
      return {
        conditions: res.data.data,
        total: res.data.total ?? 0,
      };
    },
    initialData:
      timeframe === 'month' && initialData && initialData.conditions && initialData.conditions.length > 0
        ? {
            conditions: initialData.conditions,
            total: initialData.total ?? initialData.conditions.reduce((acc, c) => acc + c.count, 0),
          }
        : undefined,
    staleTime: 1000 * 60,
  });
}
