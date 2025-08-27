import { apiClient } from './api-client';

export interface YijingContent {
  id: number;
  title: string;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
}

export interface YijingListParams {
  page?: number;
  page_size?: number;
  search?: string;
}

export interface YijingListResponse {
  total: number;
  items: YijingContent[];
}

export interface ApiResponse<T> {
  code: number;
  data: T;
  error: string;
  msg: string;
}

// Get Yijing contents list with query parameters
export const getYijingContents = async (params: YijingListParams = {}): Promise<ApiResponse<YijingListResponse>> => {
  const queryParams = new URLSearchParams();
  
  if (params.page !== undefined) {
    queryParams.append('page', params.page.toString());
  }
  if (params.page_size !== undefined) {
    queryParams.append('page_size', params.page_size.toString());
  }
  if (params.search) {
    queryParams.append('search', params.search);
  }

  const endpoint = `/admin/yijing-contents${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await apiClient<YijingListResponse>(endpoint, {
    method: 'GET',
  });

  if (response.success && response.data) {
    // The API response structure is { code: 0, data: YijingListResponse, error: string, msg: string }
    const apiResponse = response.data as any;
    
          if (apiResponse.code === 0 && apiResponse.data) {
        return {
          code: 0,
          data: apiResponse.data,
          error: '',
          msg: 'Success'
        };
      } else {
        return {
          code: apiResponse.code || 1,
          data: { total: 0, items: [] },
          error: apiResponse.msg || 'Failed to fetch Yijing contents',
          msg: apiResponse.msg || 'Failed to fetch Yijing contents'
        };
      }
    } else {
      return {
        code: 1,
        data: { total: 0, items: [] },
        error: response.error || 'Failed to fetch Yijing contents',
        msg: response.error || 'Failed to fetch Yijing contents'
      };
    }
};
