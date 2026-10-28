import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { User } from '@/types/api';
import { LoginFormData } from '@/schemas';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const userQuery = useQuery<User | null>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        const res = await api.get('/auth/me');
        if (typeof document !== 'undefined') {
          document.cookie = 'dt_auth=1; path=/; max-age=2592000; SameSite=Lax';
        }
        return res.data.data;
      } catch (err: any) {
        if (err.response?.status === 401) {
          if (typeof document !== 'undefined') {
            document.cookie = 'dt_auth=; path=/; max-age=0; SameSite=Lax';
          }
          return null;
        }
        throw err;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 10,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      const res = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });
      return res.data.data;
    },
    onSuccess: (userData) => {
      if (typeof document !== 'undefined') {
        document.cookie = 'dt_auth=1; path=/; max-age=2592000; SameSite=Lax';
      }
      queryClient.setQueryData(['auth', 'me'], userData);
      router.push('/dashboard');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout');
    },
    onSuccess: () => {
      if (typeof document !== 'undefined') {
        document.cookie = 'dt_auth=; path=/; max-age=0; SameSite=Lax';
      }
      queryClient.setQueryData(['auth', 'me'], null);
      queryClient.clear();
      router.push('/login');
    },
  });

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    isError: userQuery.isError,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
}
