'use client';

import React, { useState } from 'react';
import { Post } from '@/types';
import { formatDate } from '@/utils/dateUtils';

interface PostsProps {
  posts: Post[];
  onUpdatePost: (post: Post) => void;
  onDeletePost: (id: number) => void;
}

export default function Posts({ posts, onUpdatePost, onDeletePost }: PostsProps) {
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    author: 'Admin User'
  });

  const handleCreatePost = () => {
    if (newPost.title && newPost.content) {
      const post: Post = {
        id: posts.length + 1,
        title: newPost.title,
        content: newPost.content,
        author: newPost.author,
        status: 'draft',
        slug: newPost.title.toLowerCase().replace(/\s+/g, '-'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onUpdatePost(post);
      setNewPost({ title: '', content: '', author: 'Admin User' });
      setShowNewPostModal(false);
    }
  };

  const togglePostStatus = (post: Post) => {
    const updatedPost: Post = {
      ...post,
      status: post.status === 'draft' ? 'published' : 'draft',
      updatedAt: new Date().toISOString(),
    };
    onUpdatePost(updatedPost);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">内容管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            管理您的博客文章和内容
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowNewPostModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            新建文章
          </button>
        </div>
      </div>

      {/* Posts table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {posts.map((post) => (
            <li key={post.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {post.title}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex">
                      <div className="flex items-center text-sm text-gray-500">
                        <p>By {post.author}</p>
                        <span className="mx-2">•</span>
                        <p>{formatDate(post.createdAt)}</p>
                        <span className="mx-2">•</span>
                        <p>{post.content.substring(0, 100)}...</p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                    <button
                      onClick={() => togglePostStatus(post)}
                      className={`text-sm font-medium ${
                        post.status === 'draft' 
                          ? 'text-blue-600 hover:text-blue-900' 
                          : 'text-yellow-600 hover:text-yellow-900'
                      }`}
                    >
                      {post.status === 'draft' ? 'Publish' : 'Unpublish'}
                    </button>
                    <button
                      onClick={() => onDeletePost(post.id)}
                      className="text-sm font-medium text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts yet. Create your first post to get started!</p>
          </div>
        )}
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Post</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter post title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Enter post content"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter author name"
                    value={newPost.author}
                    onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    onClick={() => setShowNewPostModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={handleCreatePost}
                  >
                    Create Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 