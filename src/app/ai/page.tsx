'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiTrash2, FiEye, FiEdit3, FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface AIFeature {
  id: string;
  api: string;
  page: string;
  prompt: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

// Sample data based on the image
const initialAIFeatures: AIFeature[] = [
  {
    id: '01',
    api: 'deepseek/profile',
    page: 'onboarding',
    prompt: 'generate zodiac signs (sun, rising, moon), bazi (day master, yinyang balance, nature energy), and five elements distribution/analysis',
    createdAt: '2025.08.12, 12:30',
    status: 'active'
  },
  {
    id: '02',
    api: 'deepseek/daily',
    page: 'daily',
    prompt: 'generate zodiac signs (sun, rising, moon), bazi (day master, yinyang balance, nature energy), and five elements distribution/analysis',
    createdAt: '2025.08.12, 12:30',
    status: 'active'
  },
  {
    id: '03',
    api: 'deepseek/natal',
    page: 'explore',
    prompt: 'generate zodiac signs (sun, rising, moon), bazi (day master, yinyang balance, nature energy), and five elements distribution/analysis',
    createdAt: '2025.08.12, 12:30',
    status: 'active'
  },
  {
    id: '04',
    api: 'deepseek/elements',
    page: 'explore',
    prompt: 'generate zodiac signs (sun, rising, moon), bazi (day master, yinyang balance, nature energy), and five elements distribution/analysis',
    createdAt: '2025.08.12, 12:30',
    status: 'active'
  },
  {
    id: '05',
    api: 'deepseek/number',
    page: 'explore',
    prompt: 'generate zodiac signs (sun, rising, moon), bazi (day master, yinyang balance, nature energy), and five elements distribution/analysis',
    createdAt: '2025.08.12, 12:30',
    status: 'active'
  },
  {
    id: '06',
    api: 'deepseek/article',
    page: 'explore',
    prompt: 'generate zodiac signs (sun, rising, moon), bazi (day master, yinyang balance, nature energy), and five elements distribution/analysis',
    createdAt: '2025.08.12, 12:30',
    status: 'active'
  },
  {
    id: '07',
    api: 'deepseek/dream',
    page: 'explore',
    prompt: 'generate zodiac signs (sun, rising, moon), bazi (day master, yinyang balance, nature energy), and five elements distribution/analysis',
    createdAt: '2025.08.12, 12:30',
    status: 'active'
  },
  {
    id: '08',
    api: 'deepseek/chat',
    page: 'chat',
    prompt: 'generate zodiac signs (sun, rising, moon), bazi (day master, yinyang balance, nature energy), and five elements distribution/analysis',
    createdAt: '2025.08.12, 12:30',
    status: 'active'
  }
];

export default function AIPage() {
  const router = useRouter();
  const [aiFeatures] = useState<AIFeature[]>(initialAIFeatures);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(aiFeatures.map(a => a.id)));
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '活跃';
      case 'inactive':
        return '非活跃';
      default:
        return '未知';
    }
  };

  const filteredAIFeatures = aiFeatures.filter(feature =>
    feature.api.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feature.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feature.page.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewAI = (id: string) => {
    router.push(`/ai/${id}?mode=view`);
  };

  const handleEditAI = (id: string) => {
    router.push(`/ai/${id}?mode=edit`);
  };

  return (
    <ProtectedRoute>
      <CMSLayout>
      <div className="space-y-4">
          {/* Page header */}
          <div className="flex flex-row gap-3">
            <h1 className="text-xl font-bold text-gray-900">AI 列表</h1>
            <p className="mt-1 text-sm text-gray-500">
              管理系统中的所有AI功能和配置
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
                      checked={selectedRows.size === aiFeatures.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-[#8C7E9C] focus:ring-[#8C7E9C]"
                    />
             
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
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="搜索列表..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#8C7E9C] focus:border-transparent"
                    />
                  </div>
                  <button className="text-gray-600 hover:text-gray-900">
                    <FiFilter size={20} />
                  </button>
                  <button className="bg-[#8C7E9C] hover:bg-[#220646] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2">
                    <FiPlus size={16} />
                    <span>新增</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Features Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      API
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      页面
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prompt
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
                  {filteredAIFeatures.map((feature) => (
                    <tr key={feature.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {feature.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {feature.api}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {feature.page}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {feature.prompt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {feature.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-gray-400 hover:text-gray-600 p-1">
                            <FiTrash2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleViewAI(feature.id)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <FiEye size={16} />
                          </button>
                          <button 
                            onClick={() => handleEditAI(feature.id)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <FiEdit3 size={16} />
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
                <button className="px-3 py-1 text-sm font-medium text-white bg-pink-500 rounded">
                  1
                </button>
                <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900">
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
