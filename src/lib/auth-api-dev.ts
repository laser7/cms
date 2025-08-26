import { apiClientDev } from './api-client-dev';

export interface LoginResponse {
  code: number;
  data: {
    token: string;
    admin: {
      id: number;
      username: string;
      role: string;
      status: number;
    };
  };
  msg: string;
}

export interface LogoutResponse {
  code: number;
  data: string;
  msg: string;
}

export const loginUserDev = async (username: string, password: string): Promise<{ success: boolean; data?: LoginResponse; error?: string }> => {
  return apiClientDev<LoginResponse>('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
};

export const logoutUserDev = async (): Promise<{ success: boolean; data?: LogoutResponse; error?: string }> => {
  return apiClientDev<LogoutResponse>('/admin/logout', {
    method: 'POST',
  });
};

export const getUserProfileDev = async (): Promise<{ success: boolean; data?: unknown; error?: string }> => {
  return apiClientDev('/admin/profile');
};
