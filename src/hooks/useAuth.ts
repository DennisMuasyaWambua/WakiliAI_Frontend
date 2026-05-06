import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import {
  RegisterRequest,
  LoginRequest,
  LoginVerifyRequest,
  ResetPasswordRequest,
  ResetPasswordConfirmRequest,
} from '@/types/auth.types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || 'Registration successful! Please login.');
        router.push('/login');
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || 'OTP sent to your email');
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    },
  });
};

export const useLoginVerify = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginVerifyRequest) => authService.loginVerify(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Login successful!');
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        router.push('/dashboard');
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'OTP verification failed';
      toast.error(message);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || 'Password reset link sent to your email');
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Password reset request failed';
      toast.error(message);
    },
  });
};

export const useResetPasswordConfirm = (uid: string, token: string) => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ResetPasswordConfirmRequest) =>
      authService.resetPasswordConfirm(uid, token, data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Password reset successful! Please login.');
        router.push('/login');
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error(message);
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
      toast.success('Logged out successfully');
      router.push('/login');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Logout failed';
      toast.error(message);
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authService.getCurrentUser(),
    enabled: authService.isAuthenticated(),
    staleTime: 5 * 60 * 1000,
  });
};
