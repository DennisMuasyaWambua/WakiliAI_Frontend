import apiClient, { tokenManager } from '@/lib/api/client';
import {
  RegisterRequest,
  LoginRequest,
  LoginVerifyRequest,
  ResetPasswordRequest,
  ResetPasswordConfirmRequest,
  AuthResponse,
  ApiResponse,
} from '@/types/auth.types';

export const authService = {
  register: async (data: RegisterRequest): Promise<ApiResponse> => {
    const response = await apiClient.post('auth/register/', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<ApiResponse> => {
    const response = await apiClient.post('auth/login/', data);
    return response.data;
  },

  loginVerify: async (data: LoginVerifyRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('auth/login/verify/', {
      email: data.email,
      password: data.password,
      otp: Number(data.otp),
    });
    
    if (response.data.success && response.data.data.tokens) {
      tokenManager.setTokens(response.data.data.tokens);
      tokenManager.setUser(response.data.data.user);
    }
    
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse> => {
    const response = await apiClient.post('auth/reset-password/', data);
    return response.data;
  },

  resetPasswordConfirm: async (
    uid: string,
    token: string,
    data: ResetPasswordConfirmRequest
  ): Promise<ApiResponse> => {
    const response = await apiClient.post(
      `auth/reset-password/confirm/${uid}/${token}/`,
      data
    );
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const refreshToken = tokenManager.getRefreshToken();
    if (refreshToken) {
      try {
        const response = await apiClient.post('auth/logout/', {
          refresh: refreshToken,
        });
        return response.data;
      } finally {
        tokenManager.clearTokens();
      }
    }
    tokenManager.clearTokens();
    return { success: true, message: 'Logged out successfully' };
  },

  getCurrentUser: () => {
    return tokenManager.getUser();
  },

  isAuthenticated: (): boolean => {
    return !!tokenManager.getAccessToken();
  },
};
