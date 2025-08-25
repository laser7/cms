'use client';

import React, { useState } from 'react';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface IChingArticle {
  id: string;
  image: string;
  title: string;
  content: string;
  createdAt: string;
}

const initialArticles: IChingArticle[] = [
  {
    id: '03',
    image: '/api/placeholder/60/60',
    title: 'placeholder article title',
    content: 'Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    createdAt: '2025.08.12, 12:30'
  },
  {
    id: '23',
    image: '/api/placeholder/60/60',
    title: 'placeholder article title',
    content: 'Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    createdAt: '2025.08.12, 12:30'
  },
  {
    id: '21',
    image: '/api/placeholder/60/60',
    title: 'placeholder article title',
    content: 'Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    createdAt: '2025.08.12, 12:30'
  },
  {
    id: '34',
    image: '/api/placeholder/60/60',
    title: 'placeholder article title',
    content: 'Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    createdAt: '2025.08.12, 12:30'
  },
  {
    id: '233',
    image: '/api/placeholder/60/60',
    title: 'placeholder article title',
    content: 'Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    createdAt: '2025.08.12, 12:30'
  },
  {
    id: '12',
    image: '/api/placeholder/60/60',
    title: 'placeholder article title',
    content: 'Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    createdAt: '2025.08.12, 12:30'
  },
  {
    id: '09',
    image: '/api/placeholder/60/60',
    title: 'placeholder article title',
    content: 'Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    createdAt: '2025.08.12, 12:30'
  },
  {
    id: '08',
    image: '/api/placeholder/60/60',
    title: 'placeholder article title',
    content: 'Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    createdAt: '2025.08.12, 12:30'
  },
  {
    id: '05',
    image: '/api/placeholder/60/60',
    title: 'placeholder article title',
    content: 'Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    createdAt: '2025.08.12, 12:30'
  },
  {
    id: '01',
    image: '/api/placeholder/60/60',
    title: 'placeholder article title',
    content: 'Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    createdAt: '2025.08.12, 12:30'
  }
];

export default function IChingArticlesPage() {
  const [articles] = useState<IChingArticle[]>(initialArticles);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(articles.map(a => a.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <CMSLayout>
        <div className="space-y-6">
          {/* Page header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">易经文章列表</h1>
            <p className="mt-1 text-sm text-gray-500">
              管理易经相关的文章和内容
            </p>
          </div>

          {/* Controls */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === articles.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">易经文章列表</span>
                  </div>
                  <button className="text-sm text-gray-600 hover:text-gray-900">
                    选择列
                  </button>
                  <button className="text-sm text-gray-600 hover:text-gray-900">
                    ↕️
                  </button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Q 搜索列表..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">🔍</span>
                    </div>
                  </div>
                  <button className="text-sm text-gray-600 hover:text-gray-900">
                    ☰
                  </button>
                  <button className="bg-[#220646] hover:bg-[#8C7E9C] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    + 新增
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Articles table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedRows.size === articles.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      图片
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      标题
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      内容
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      创建时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(article.id)}
                          onChange={(e) => handleSelectRow(article.id, e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {article.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">图片</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {article.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {article.content}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {article.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-gray-400 hover:text-gray-600">
                            🗑️
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            👁️
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            ✏️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-gray-600">
                  ←
                </button>
                <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900">
                  1
                </button>
                <button className="px-3 py-1 text-sm font-medium text-white bg-pink-500 rounded">
                  2
                </button>
                <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900">
                  3
                </button>
                <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900">
                  4
                </button>
                <span className="text-gray-500">...</span>
                <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900">
                  10
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  →
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">显示</span>
                <select className="text-sm border border-gray-300 rounded px-2 py-1">
                  <option>10行</option>
                  <option>20行</option>
                  <option>50行</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </CMSLayout>
    </ProtectedRoute>
  );
}
