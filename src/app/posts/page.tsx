'use client';

import React, { useState } from 'react';
import CMSLayout from '@/components/CMSLayout';
import Posts from '@/components/Posts';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Post } from '@/types';

// Sample data
const initialPosts: Post[] = [
  {
    id: 1,
    title: 'Welcome to Your CMS',
    content: 'This is your first post. Start creating amazing content!',
    status: 'published',
    author: 'Admin User',
    slug: 'welcome-to-your-cms',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    title: 'Getting Started Guide',
    content: 'Learn how to use this CMS effectively.',
    status: 'draft',
    author: 'Admin User',
    slug: 'getting-started-guide',
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
  },
];

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const handleUpdatePost = (post: Post) => {
    setPosts(prev => {
      const existingIndex = prev.findIndex(p => p.id === post.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = post;
        return updated;
      } else {
        return [...prev, post];
      }
    });
  };

  const handleDeletePost = (id: number) => {
    setPosts(prev => prev.filter(post => post.id !== id));
  };

  return (
    <ProtectedRoute>
      <CMSLayout>
        <Posts 
          posts={posts} 
          onUpdatePost={handleUpdatePost} 
          onDeletePost={handleDeletePost} 
        />
      </CMSLayout>
    </ProtectedRoute>
  );
} 