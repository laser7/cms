import { getAuthToken } from './auth';

// Development API client that uses Next.js proxy to avoid CORS issues
export const apiClientDev = async <T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> => {
  try {
    const token = getAuthToken();
    // Use the proxy URL for development
    const url = `/api${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('Dev API Request with token:', token.substring(0, 20) + '...');
    } else {
      console.log('Dev API Request without token');
    }

    console.log('Making dev API request to:', url);
    console.log('Request headers:', headers);
    console.log('Request method:', options.method || 'GET');

    const response = await fetch(url, {
      ...options,
      headers,
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
          return {
            success: false,
            error: responseData.msg || '用户名或密码错误',
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

      return {
        success: false,
        error: responseData.msg || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    // For logout requests, check the code field to determine success
    if (endpoint === '/admin/logout') {
      if (responseData.code === 0) {
        return {
          success: true,
          data: responseData,
        };
      } else {
        return {
          success: false,
          error: responseData.msg || 'Logout failed',
        };
      }
    }

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    console.error('Dev API Client Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
};
