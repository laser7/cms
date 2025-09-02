import { apiClient } from './api-client';
import { 
  AI,
  AIListParams, 
  AIListResponse, 
  ApiResponse,
  RawApiResponse,
  CreateAIData
} from '../types';

/**
 * Get list of AI features with pagination and filtering
 * @param params - Query parameters for pagination and filtering
 * @returns Promise with AI list response
 */
export const getAIList = async (
  params: AIListParams = {}
): Promise<ApiResponse<AIListResponse>> => {
  const {
    page = 1,
    page_size = 10,
    search = '',
    page_filter = ''
  } = params;

  // Build query string
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('page_size', page_size.toString());
  
  if (search) {
    queryParams.append('search', search);
  }
  
  if (page_filter) {
    queryParams.append('page_filter', page_filter);
  }

  const endpoint = `/admin/ais?${queryParams.toString()}`;
  
  try {
    const response = await apiClient<RawApiResponse<AIListResponse>>(endpoint);
    
    if (response.success && response.data) {
      // Check if the actual API response indicates success
      if (response.data.code === 200 || response.data.code === 0) {
        return {
          code: 0,
          data: response.data.data, // Extract the actual data from the nested structure
          error: '',
          msg: response.data.msg || 'Success'
        };
      } else {
        return {
          code: 1,
          data: {} as AIListResponse,
          error: response.data.msg || 'Failed to fetch AI list',
          msg: 'Error'
        };
      }
    } else {
      return {
        code: 1,
        data: {} as AIListResponse,
        error: response.error || 'Failed to fetch AI list',
        msg: 'Error'
      };
    }
  } catch (error) {
    console.error('Error fetching AI list:', error);
    return {
      code: 1,
      data: {} as AIListResponse,
      error: error instanceof Error ? error.message : 'Unknown error',
      msg: 'Error'
    };
  }
};

/**
 * Get a single AI feature by ID
 * @param id - AI ID
 * @returns Promise with AI data
 */
export const getAIById = async (id: number): Promise<ApiResponse<AI>> => {
  try {
    const response = await apiClient<RawApiResponse<AI>>(`/admin/ais/${id}`);
    
    if (response.success && response.data) {
      // Check if the actual API response indicates success
      if (response.data.code === 200 || response.data.code === 0) {
        return {
          code: 0,
          data: response.data.data, // Extract the actual data from the nested structure
          error: '',
          msg: response.data.msg || 'Success'
        };
      } else {
        return {
          code: 1,
          data: {} as AI,
          error: response.data.msg || 'Failed to fetch AI',
          msg: 'Error'
        };
      }
    } else {
      return {
        code: 1,
        data: {} as AI,
        error: response.error || 'Failed to fetch AI',
        msg: 'Error'
      };
    }
  } catch (error) {
    console.error('Error fetching AI:', error);
    return {
      code: 1,
      data: {} as AI,
      error: error instanceof Error ? error.message : 'Unknown error',
      msg: 'Error'
    };
  }
};

/**
 * Create a new AI feature
 * @param aiData - AI data to create
 * @returns Promise with created AI
 */
export const createAI = async (
  aiData: CreateAIData
): Promise<ApiResponse<AI>> => {
  try {
    const response = await apiClient<RawApiResponse<AI>>('/admin/ais', {
      method: 'POST',
      body: JSON.stringify(aiData)
    });
    
    if (response.success && response.data) {
      // Check if the actual API response indicates success
      if (response.data.code === 200 || response.data.code === 0) {
        return {
          code: 0,
          data: response.data.data, // Extract the actual data from the nested structure
          error: '',
          msg: response.data.msg || 'Success'
        };
      } else {
        return {
          code: 1,
          data: {} as AI,
          error: response.data.msg || 'Failed to create AI',
          msg: 'Error'
        };
      }
    } else {
      return {
        code: 1,
        data: {} as AI,
        error: response.error || 'Failed to create AI',
        msg: 'Error'
      };
    }
  } catch (error) {
    console.error('Error creating AI:', error);
    return {
      code: 1,
      data: {} as AI,
      error: error instanceof Error ? error.message : 'Unknown error',
      msg: 'Error'
    };
  }
};

/**
 * Update an existing AI feature
 * @param id - AI ID
 * @param aiData - Updated AI data
 * @returns Promise with updated AI
 */
export const updateAI = async (
  id: number,
  aiData: Partial<CreateAIData>
): Promise<ApiResponse<AI>> => {
  try {
    const response = await apiClient<RawApiResponse<AI>>(`/admin/ais/${id}`, {
      method: 'PUT',
      body: JSON.stringify(aiData)
    });
    
    if (response.success && response.data) {
      // Check if the actual API response indicates success
      if (response.data.code === 200 || response.data.code === 0) {
        return {
          code: 0,
          data: response.data.data, // Extract the actual data from the nested structure
          error: '',
          msg: response.data.msg || 'Success'
        };
      } else {
        return {
          code: 1,
          data: {} as AI,
          error: response.data.msg || 'Failed to update AI',
          msg: 'Error'
        };
      }
    } else {
      return {
        code: 1,
        data: {} as AI,
        error: response.error || 'Failed to update AI',
        msg: 'Error'
      };
    }
  } catch (error) {
    console.error('Error updating AI:', error);
    return {
      code: 1,
      data: {} as AI,
      error: error instanceof Error ? error.message : 'Unknown error',
      msg: 'Error'
    };
  }
};

/**
 * Delete an AI feature
 * @param id - AI ID
 * @returns Promise with deletion result
 */
export const deleteAI = async (id: number): Promise<ApiResponse<string>> => {
  try {
    const response = await apiClient<RawApiResponse<string>>(`/admin/ais/${id}`, {
      method: 'DELETE'
    });
    
    if (response.success && response.data) {
      // Check if the actual API response indicates success
      if (response.data.code === 200 || response.data.code === 0) {
        return {
          code: 0,
          data: response.data.data || 'AI deleted successfully',
          error: '',
          msg: response.data.msg || 'Success'
        };
      } else {
        return {
          code: 1,
          data: '',
          error: response.data.msg || 'Failed to delete AI',
          msg: 'Error'
        };
      }
    } else {
      return {
        code: 1,
        data: '',
        error: response.error || 'Failed to delete AI',
        msg: 'Error'
      };
    }
  } catch (error) {
    console.error('Error deleting AI:', error);
    return {
      code: 1,
      data: '',
      error: error instanceof Error ? error.message : 'Unknown error',
      msg: 'Error'
    };
  }
};
