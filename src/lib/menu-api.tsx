import { apiClient } from './api-client';

// Types for menu API
export interface MenuItem {
  id: number;
  code: string;
  name: string;
  route: string;
  type: string;
  icon: string;
  is_top_level: boolean;
  parent_id: number;
  parent_name: string;
  sort: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface MenuListResponse {
  list: MenuItem[];
  page: number;
  page_size: number;
  total: number;
}

export interface MenuListParams {
  page?: number;
  page_size?: number;
  search?: string;
  type?: string;
}

export interface CreateMenuData {
  code: string;
  name: string;
  route: string;
  type: string;
  icon: string;
  is_top_level: boolean;
  parent_id?: number;
  sort: number;
  status: number;
}

export interface UpdateMenuData {
  code?: string;
  name?: string;
  route?: string;
  type?: string;
  icon?: string;
  is_top_level?: boolean;
  parent_id?: number;
  sort?: number;
  status?: number;
}



// Get menu list
export const getMenuList = async (params: MenuListParams = {}) => {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.page_size) searchParams.append('page_size', params.page_size.toString());
  if (params.search) searchParams.append('search', params.search);
  if (params.type) searchParams.append('type', params.type);
  
  const queryString = searchParams.toString();
  const url = queryString ? `/admin/menus?${queryString}` : '/admin/menus';
  
  return apiClient<MenuListResponse>(url, {
    method: 'GET',
  });
};

// Get menu by ID
export const getMenuById = async (id: number) => {
  return apiClient<MenuItem>(`/admin/menus/${id}`, {
    method: 'GET',
  });
};

// Create new menu
export const createMenu = async (data: CreateMenuData) => {
  return apiClient<MenuItem>('/admin/menus', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Update menu
export const updateMenu = async (id: number, data: UpdateMenuData) => {
  return apiClient<MenuItem>(`/admin/menus/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// Delete menu
export const deleteMenu = async (id: number) => {
  return apiClient<string>(`/admin/menus/${id}`, {
    method: 'DELETE',
  });
};
