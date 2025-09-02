export interface Post {
  id: number;
  title: string;
  content: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  author: string;
  slug: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'author';
}

export interface Media {
  id: number;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
  uploadedAt: string;
}

export interface SiteSettings {
  title: string;
  description: string;
  logo: string;
  theme: 'light' | 'dark';
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'reminder' | 'promotion' | 'update' | 'alert';
  pushTime: string;
  pushLocation: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'draft';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  criteria: string;
  triggerCondition: string;
  category: string;
  ownerCount: number;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive';
}

export interface Soundtrack {
  id: number;
  title: string;
  composer: string;
  category: string;
  cover: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface SoundtrackListResponse {
  list: Soundtrack[];
  page: number;
  page_size: number;
  total: number;
}

export interface SoundtrackListParams {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
}

export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  error: string;
  msg: string;
}

export interface RawApiResponse<T = unknown> {
  code: number;
  data: T;
  msg: string;
} 

export interface AI {
  id: number;
  api: string;
  function: string;
  model: string;
  page: string;
  prompt: string;
  created_at: string;
  updated_at: string;
  processing_time?: number;
  request?: string;
  response?: string;
}

export interface AIListResponse {
  list: AI[];
  page: number;
  page_size: number;
  total: number;
}

export interface AIListParams {
  page?: number;
  page_size?: number;
  search?: string;
  page_filter?: string;
}

export interface CreateAIData {
  api: string;
  function: string;
  model: string;
  page: string;
  prompt: string;
} 