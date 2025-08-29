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