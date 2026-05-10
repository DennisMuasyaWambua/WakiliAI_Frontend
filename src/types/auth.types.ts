export interface RegisterRequest {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  mobile_number: string;
  id_number: string;
  firm_type: 'big_law' | 'mid_size';
  role: string[];
  password: string;
  confirm_password: string;
  firm_name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginVerifyRequest {
  email: string;
  password: string;
  otp: number;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordConfirmRequest {
  new_password: string;
  confirm_password: string;
}

export interface LogoutRequest {
  refresh: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  username: string;
  mobile_number: string;
  id_number: string;
  firm_type: string;
  role: string[];
  roles?: string[];
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens: AuthTokens;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
