import { getAuthToken } from './auth';

// Use proxy in development, direct URL in production
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? '' // Use relative path for proxy
  : 'https://dev.guara.fun';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ErrorResponse {
  code: number;
  data: string;
  msg: string;
}

// Core API client for making authenticated requests
export const apiClient = async <T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const token = getAuthToken();
    const url = process.env.NODE_ENV === 'development' 
      ? `/api${endpoint}` // Use proxy in development
      : `${API_BASE_URL}${endpoint}`; // Use direct URL in production
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('API Request with token:', token.substring(0, 20) + '...');
    } else {
      console.log('API Request without token');
    }

    console.log('Making API request to:', url);
    console.log('Request headers:', headers);
    console.log('Request method:', options.method || 'GET');

    const response = await fetch(url, {
      ...options,
      headers,
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

    if (!response.ok) {
      if (response.status === 401) {
        if (endpoint === '/admin/login') {
          const errorResponse = responseData as ErrorResponse;
          return {
            success: false,
            error: errorResponse.msg || '用户名或密码错误',
          };
        }
        
        // Clear auth data and redirect for other requests
        if (typeof window !== 'undefined') {
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('userData');
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return {
          success: false,
          error: 'Unauthorized - Please login again',
        };
      }

      const errorResponse = responseData as ErrorResponse;
      return {
        success: false,
        error: errorResponse.msg || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    // For logout requests, check the code field to determine success
    if (endpoint === '/admin/logout') {
      const logoutResponse = responseData as ErrorResponse;
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
    }

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    console.error('API Client Error:', error);
    
    // Handle CORS errors specifically
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      // Check if it's a CORS issue
      if (endpoint === '/admin/logout') {
        console.log('CORS error detected for logout, attempting fallback...');
        // For logout, we can still proceed with local cleanup even if API fails
        return {
          success: false,
          error: 'CORS error - proceeding with local logout',
        };
      }
      
      return {
        success: false,
        error: 'CORS error - please check server configuration',
      };
    }
    
    // Handle other network errors
    if (error instanceof TypeError) {
      return {
        success: false,
        error: 'Network error - please check your connection',
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
};
