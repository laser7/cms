import { apiClient, ApiResponse } from './api-client';



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

export const loginUser = async (username: string, password: string): Promise<ApiResponse<LoginResponse>> => {
  return apiClient<LoginResponse>('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
};

export const loginUserAlt = async (username: string, password: string): Promise<ApiResponse<LoginResponse>> => {
  return apiClient<LoginResponse>('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
};

export const logoutUser = async (): Promise<ApiResponse<LogoutResponse>> => {
  return apiClient<LogoutResponse>('/admin/logout', {
    method: 'POST',
  });
};



export const getUserProfile = async (): Promise<ApiResponse> => {
  return apiClient('/admin/profile');
};
