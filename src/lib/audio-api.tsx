import { apiClient } from './api-client';
import { 
  Soundtrack,
  SoundtrackListParams, 
  SoundtrackListResponse, 
  ApiResponse,
  RawApiResponse
} from '../types';

/**
 * Get list of soundtracks with pagination and filtering
 * @param params - Query parameters for pagination and filtering
 * @returns Promise with soundtrack list response
 */
export const getSoundtracks = async (
  params: SoundtrackListParams = {}
): Promise<ApiResponse<SoundtrackListResponse>> => {
  const {
    page = 1,
    page_size = 10,
    search = '',
    category = ''
  } = params;

  // Build query string
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('page_size', page_size.toString());
  
  if (search) {
    queryParams.append('search', search);
  }
  
  if (category) {
    queryParams.append('category', category);
  }

  const endpoint = `/admin/soundtracks?${queryParams.toString()}`;
  
  try {
    const response = await apiClient<RawApiResponse<SoundtrackListResponse>>(endpoint);
    
    if (response.success && response.data) {
      // The apiClient already parsed the response, so we can use it directly
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
          data: {} as SoundtrackListResponse,
          error: response.data.msg || 'Failed to fetch soundtracks',
          msg: 'Error'
        };
      }
    } else {
      return {
        code: 1,
        data: {} as SoundtrackListResponse,
        error: response.error || 'Failed to fetch soundtracks',
        msg: 'Error'
      };
    }
  } catch (error) {
    console.error('Error fetching soundtracks:', error);
    return {
      code: 1,
      data: {} as SoundtrackListResponse,
      error: error instanceof Error ? error.message : 'Unknown error',
      msg: 'Error'
    };
  }
};

/**
 * Get a single soundtrack by ID
 * @param id - Soundtrack ID
 * @returns Promise with soundtrack data
 */
export const getSoundtrackById = async (id: number): Promise<ApiResponse<Soundtrack>> => {
  try {
    const response = await apiClient<RawApiResponse<Soundtrack>>(`/admin/soundtracks/${id}`);
    
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
          data: {} as Soundtrack,
          error: response.data.msg || 'Failed to fetch soundtrack',
          msg: 'Error'
        };
      }
    } else {
      return {
        code: 1,
        data: {} as Soundtrack,
        error: response.error || 'Failed to fetch soundtrack',
        msg: 'Error'
      };
    }
  } catch (error) {
    console.error('Error fetching soundtrack:', error);
    return {
      code: 1,
      data: {} as Soundtrack,
      error: error instanceof Error ? error.message : 'Unknown error',
      msg: 'Error'
    };
  }
};

/**
 * Create a new soundtrack
 * @param soundtrackData - Soundtrack data to create
 * @returns Promise with created soundtrack
 */
export const createSoundtrack = async (
  soundtrackData: Omit<Soundtrack, 'id' | 'created_at'>
): Promise<ApiResponse<Soundtrack>> => {
  try {
    const response = await apiClient<RawApiResponse<Soundtrack>>('/admin/soundtracks', {
      method: 'POST',
      body: JSON.stringify(soundtrackData)
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
          data: {} as Soundtrack,
          error: response.data.msg || 'Failed to create soundtrack',
          msg: 'Error'
        };
      }
    } else {
      return {
        code: 1,
        data: {} as Soundtrack,
        error: response.error || 'Failed to create soundtrack',
        msg: 'Error'
      };
    }
  } catch (error) {
    console.error('Error creating soundtrack:', error);
    return {
      code: 1,
      data: {} as Soundtrack,
      error: error instanceof Error ? error.message : 'Unknown error',
      msg: 'Error'
    };
  }
};

/**
 * Update an existing soundtrack
 * @param id - Soundtrack ID
 * @param soundtrackData - Updated soundtrack data
 * @returns Promise with updated soundtrack
 */
export const updateSoundtrack = async (
  id: number,
  soundtrackData: Partial<Omit<Soundtrack, 'id' | 'created_at'>>
): Promise<ApiResponse<Soundtrack>> => {
  try {
    const response = await apiClient<RawApiResponse<Soundtrack>>(`/admin/soundtracks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(soundtrackData)
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
          data: {} as Soundtrack,
          error: response.data.msg || 'Failed to update soundtrack',
          msg: 'Error'
        };
      }
    } else {
      return {
        code: 1,
        data: {} as Soundtrack,
        error: response.error || 'Failed to update soundtrack',
        msg: 'Error'
      };
    }
  } catch (error) {
    console.error('Error updating soundtrack:', error);
    return {
      code: 1,
      data: {} as Soundtrack,
      error: error instanceof Error ? error.message : 'Unknown error',
      msg: 'Error'
    };
  }
};

/**
 * Delete a soundtrack
 * @param id - Soundtrack ID
 * @returns Promise with deletion result
 */
export const deleteSoundtrack = async (id: number): Promise<ApiResponse<string>> => {
  try {
    const response = await apiClient<RawApiResponse<string>>(`/admin/soundtracks/${id}`, {
      method: 'DELETE'
    });
    
    if (response.success && response.data) {
      // Check if the actual API response indicates success
      if (response.data.code === 200 || response.data.code === 0) {
        return {
          code: 0,
          data: response.data.data || 'Soundtrack deleted successfully',
          error: '',
          msg: response.data.msg || 'Success'
        };
      } else {
        return {
          code: 1,
          data: '',
          error: response.data.msg || 'Failed to delete soundtrack',
          msg: 'Error'
        };
      }
    } else {
      return {
        code: 1,
        data: '',
        error: response.error || 'Failed to delete soundtrack',
        msg: 'Error'
      };
    }
  } catch (error) {
    console.error('Error deleting soundtrack:', error);
    return {
      code: 1,
      data: '',
      error: error instanceof Error ? error.message : 'Unknown error',
      msg: 'Error'
    };
  }
};

/**
 * Check if URL is a real audio file that can be played
 * @param url - URL to check
 * @returns boolean indicating if URL is a playable audio file
 */
export const isRealAudioFile = (url: string): boolean => {
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'];
  const hasAudioExtension = audioExtensions.some(ext => url.toLowerCase().includes(ext));
  
  // Check for common placeholder/example domains
  const placeholderDomains = ['example.com', 'placeholder.com', 'test.com', 'dummy.com'];
  const isPlaceholder = placeholderDomains.some(domain => url.includes(domain));
  
  // Check if URL looks like a real file (not just a page)
  const isLikelyFile = url.includes('/') && !url.includes('?') && !url.includes('#');
  
  return hasAudioExtension && !isPlaceholder && isLikelyFile;
};
