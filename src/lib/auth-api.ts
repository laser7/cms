import { apiClient, ApiResponse } from './api-client';

// Use proxy in development, direct URL in production
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? '' // Use relative path for proxy
  : 'https://dev.guara.fun';

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

// Fallback logout function without Authorization header for CORS issues
export const logoutUserWithoutAuth = async (): Promise<ApiResponse<LogoutResponse>> => {
  try {
    const url = process.env.NODE_ENV === 'development' 
      ? `/api/admin/logout` // Use proxy in development
      : `${API_BASE_URL}/admin/logout`; // Use direct URL in production
    
    console.log('Attempting logout without Authorization header...');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
    });

    const responseText = await response.text();
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      return {
        success: false,
        error: `Server returned invalid JSON: ${responseText.substring(0, 100)}...`,
      };
    }

    if (response.ok) {
      const logoutResponse = responseData as LogoutResponse;
      if (logoutResponse.code === 0) {
        return {
          success: true,
          data: responseData,
        };
      } else {
        return {
          success: false,
          error: logoutResponse.msg || 'Logout failed',
        };
      }
    } else {
      return {
        success: false,
        error: responseData.msg || `HTTP ${response.status}: ${response.statusText}`,
      };
    }
  } catch (error) {
    console.error('Fallback logout error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
};

export const getUserProfile = async (): Promise<ApiResponse> => {
  return apiClient('/admin/profile');
};
