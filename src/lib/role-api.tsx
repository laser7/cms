import { apiClient } from "./api-client"

export interface RoleListParams {
  page?: number
  page_size?: number
  search?: string
  type?: string
}

export interface RoleItem {
  id: number
  name: string
  description: string
  permissions: string[]
  created_at: string
  updated_at?: string
  status?: number
  admin_ids?: number[]
  menu_ids?: number[]
  menus?: Array<{
    id: number
    name: string
    code: string
    type: string
  }>
}

export interface RoleListResponse {
  list: RoleItem[]
  page: number
  page_size: number
  total: number
}

export interface CreateRoleData {
  admin_ids: number[]
  name: string
  description: string
  menu_ids: number[]
  status: number
}

export interface UpdateRoleData {
  admin_ids?: number[]
  name?: string
  description?: string
  menu_ids?: number[]
  status?: number
}

export interface MenuTreeItem {
  id: number
  name: string
  code: string
  route: string
  type: string
  icon: string
  children: MenuTreeItem[] | null
}
export interface RoleAdminItem {
  id: number
  role: string
  status: number
  username: string
}
export interface MenuTreeResponse {
  data: MenuTreeItem[]
}
export interface UpdateRoleAdminItem {
  admin_ids: number[]
}

export interface UpdateRoleAdminResponse {
  code: number
  data: string
  error: string
  msg: string
}
// Get role list
export const getRoleList = async (params: RoleListParams = {}) => {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.append("page", params.page.toString())
  if (params.page_size)
    searchParams.append("page_size", params.page_size.toString())
  if (params.search) searchParams.append("search", params.search)
  if (params.type) searchParams.append("type", params.type)

  const queryString = searchParams.toString()
  const url = queryString ? `/admin/roles?${queryString}` : "/admin/roles"

  return apiClient<RoleListResponse>(url, {
    method: "GET",
  })
}

// Get menu tree
export const getMenuTree = async () => {
  return apiClient<MenuTreeItem[]>("/admin/menus/tree", {
    method: "GET",
  })
}

// Get role by ID
export const getRoleById = async (id: number) => {
  return apiClient<RoleItem>(`/admin/roles/${id}`, {
    method: "GET",
  })
}

// Create new role
export const createRole = async (data: CreateRoleData) => {
  return apiClient<RoleItem>("/admin/roles", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// Update role
export const updateRole = async (id: number, data: UpdateRoleData) => {
  return apiClient<RoleItem>(`/admin/roles/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

// Delete role
export const deleteRole = async (id: number) => {
  return apiClient<string>(`/admin/roles/${id}`, {
    method: "DELETE",
  })
}
export const getRoleAdmin = async (id: number) => {
  return apiClient<RoleAdminItem[]>(`/admin/roles/${id}/admins`, {
    method: "GET",
  })
}

export const updateRoleAdmin = async (
  id: number,
  data: UpdateRoleAdminItem
) => {
  return apiClient<UpdateRoleAdminResponse>(`/admin/roles/${id}/users`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}