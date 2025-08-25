'use client';

import React from 'react';
import { Post } from '@/types';
import { formatDate } from '@/utils/dateUtils';

interface DashboardProps {
  posts: Post[];
}

export default function Dashboard({ posts }: DashboardProps) {
  const totalPosts = posts.length;
  const publishedPosts = posts.filter(post => post.status === 'published').length;
  const draftPosts = posts.filter(post => post.status === 'draft').length;
  const recentPosts = posts.slice(0, 5);

  const stats = [
    { name: '总文章数', value: totalPosts, color: 'text-blue-600' },
    { name: '已发布', value: publishedPosts, color: 'text-green-600' },
    { name: '草稿', value: draftPosts, color: 'text-yellow-600' },
    { name: '本月新增', value: posts.filter(p => {
      const postDate = new Date(p.createdAt);
      const now = new Date();
      return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
    }).length, color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">数据大屏</h1>
        <p className="mt-1 text-sm text-gray-500">
          欢迎使用内容管理系统。以下是您的内容概览。
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                    📊
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className={`text-lg font-medium ${stat.color}`}>{stat.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">最近文章</h3>
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {recentPosts.map((post) => (
                <li key={post.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {post.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {post.author} • {formatDate(post.createdAt)}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {recentPosts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">暂无文章。创建您的第一篇文章开始使用！</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                  📝
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Create New Post
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Start writing a new blog post or article.
                </p>
              </div>
            </button>

            <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                  🖼️
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Upload Media
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Add images, videos, or documents to your library.
                </p>
              </div>
            </button>

            <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                  ⚙️
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Site Settings
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Configure your site title, description, and theme.
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 