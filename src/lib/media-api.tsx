import { apiClient } from './api-client';
import type { 
  MediaListResponse, 
  MediaListParams, 
  MediaItem, 
  CreateMediaData, 
  UpdateMediaData
} from '@/types';

// Get media list
export const getMediaList = async (params: MediaListParams = {}) => {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.page_size) searchParams.append('page_size', params.page_size.toString());
  if (params.search) searchParams.append('search', params.search);
  if (params.page_type) searchParams.append('page_type', params.page_type);
  
  const queryString = searchParams.toString();
  const endpoint = `/admin/media${queryString ? `?${queryString}` : ''}`;
  
  return apiClient<MediaListResponse>(endpoint);
};

// Get media detail by ID
export const getMediaById = async (id: number) => {
  return apiClient<MediaItem>(`/admin/media/${id}`);
};

// Create new media
export const createMedia = async (data: CreateMediaData) => {
  return apiClient<MediaItem>('/admin/media', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Update media by ID
export const updateMedia = async (id: number, data: UpdateMediaData) => {
  return apiClient<MediaItem>(`/admin/media/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// Delete media by ID
export const deleteMedia = async (id: number) => {
  return apiClient<string>(`/admin/media/${id}`, {
    method: 'DELETE',
  });
};

// Upload image
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Get auth token for this request
  const { getAuthToken } = await import('./auth');
  const token = getAuthToken();
  
  const url = '/api/admin/media/upload';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: responseData.msg || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    return {
      success: true,
      data: responseData.data,
    };
  } catch (error) {
    console.error('Upload Image Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
};

// Delete image from media
export const deleteMediaImage = async (mediaId: number, imageId: number) => {
  return apiClient<string>(`/admin/media-images/${mediaId}/${imageId}`, {
    method: 'DELETE',
  });
};
