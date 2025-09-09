import { apiClient } from './api-client';

export interface YijingContent {
  id: number;
  title: string;
  description: string;
  content: string;
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
export const getYijingContents = async (
  params: YijingListParams = {}
): Promise<ApiResponse<YijingListResponse>> => {
  const queryParams = new URLSearchParams()

  if (params.page !== undefined) {
    queryParams.append("page", params.page.toString())
  }
  if (params.page_size !== undefined) {
    queryParams.append("page_size", params.page_size.toString())
  }
  if (params.search) {
    queryParams.append("search", params.search)
  }

  const endpoint = `/admin/yijing-contents${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`

  try {
    const response = await apiClient<YijingListResponse>(endpoint, {
      method: "GET",
    })

    // Transform the response to match the expected ApiResponse format
    if (response.success && response.data) {
      return {
        code: 0,
        data: response.data,
        error: "",
        msg: "Success",
      }
    } else {
      return {
        code: 1,
        data: { total: 0, items: [] },
        error: response.error || "Failed to fetch Yijing contents",
        msg: response.error || "Failed to fetch Yijing contents",
      }
    }
  } catch (error) {
    console.error("Error fetching Yijing contents:", error)
    return {
      code: 1,
      data: { total: 0, items: [] },
      error: error instanceof Error ? error.message : "Unknown error",
      msg: "Error",
    }
  }
}

// Get single Yijing content by ID
export const getYijingContentById = async (
  id: number
): Promise<ApiResponse<YijingContent>> => {
  const endpoint = `/admin/yijing-contents/${id}`

  try {
    const response = await apiClient<YijingContent>(endpoint, {
      method: "GET",
    })

    // Transform the response to match the expected ApiResponse format
    if (response.success && response.data) {
      return {
        code: 0,
        data: response.data,
        error: "",
        msg: "Success",
      }
    } else {
      return {
        code: 1,
        data: {} as YijingContent,
        error: response.error || "Failed to fetch Yijing content",
        msg: response.error || "Failed to fetch Yijing content",
      }
    }
  } catch (error) {
    console.error("Error fetching Yijing content:", error)
    return {
      code: 1,
      data: {} as YijingContent,
      error: error instanceof Error ? error.message : "Unknown error",
      msg: "Error",
    }
  }
}

// Delete Yijing content by ID
export const deleteYijingContent = async (
  id: number
): Promise<ApiResponse<string>> => {
  const endpoint = `/admin/yijing-contents/${id}`

  try {
    const response = await apiClient<string>(endpoint, {
      method: "DELETE",
    })

    // Transform the response to match the expected ApiResponse format
    if (response.success && response.data) {
      return {
        code: 0,
        data: response.data || "",
        error: "",
        msg: "Success",
      }
    } else {
      return {
        code: 1,
        data: "",
        error: response.error || "Failed to delete Yijing content",
        msg: response.error || "Failed to delete Yijing content",
      }
    }
  } catch (error) {
    console.error("Error deleting Yijing content:", error)
    return {
      code: 1,
      data: "",
      error: error instanceof Error ? error.message : "Unknown error",
      msg: "Error",
    }
  }
}
