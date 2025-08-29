'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Badge } from '@/types';
import { FiPlus, FiSearch, FiFilter, FiEye, FiEdit, FiTrash2, FiChevronDown } from 'react-icons/fi';

// Mock data for badges
const mockBadges: Badge[] = [
  {
    id: '03',
    name: 'First Step Taken',
    description: 'Logged in for the first time and began your Guara journey.',
    icon: '🌱',
    color: '#4CAF50',
    criteria: '首次登录',
    triggerCondition: '首次登录',
    category: '注册登录',
    ownerCount: 2910,
    createdAt: '2025.08.12, 12:30',
    updatedAt: '2025.08.12, 16:00',
    status: 'active'
  },
  {
    id: '23',
    name: 'First Daily Card',
    description: 'Drew your first daily spiritual card. Welcome to the flow.',
    icon: '🎴',
    color: '#9C27B0',
    criteria: '首次抽卡',
    triggerCondition: '首次抽卡',
    category: '每日卡片',
    ownerCount: 2847,
    createdAt: '2025.08.12, 12:30',
    updatedAt: '2025.08.12, 16:00',
    status: 'active'
  },
  {
    id: '21',
    name: 'Dream Decoder',
    description: 'Used the AI dream interpretation feature once.',
    icon: '🌙',
    color: '#2196F3',
    criteria: '使用AI解梦',
    triggerCondition: '使用AI解梦',
    category: 'AI功能',
    ownerCount: 2156,
    createdAt: '2025.08.12, 12:30',
    updatedAt: '2025.08.12, 16:00',
    status: 'active'
  },
  {
    id: '34',
    name: 'Mindful Breath',
    description: 'Used the AI dream interpretation feature once.',
    icon: '🧘‍♀️',
    color: '#FF9800',
    criteria: '完成冥想',
    triggerCondition: '完成冥想',
    category: '冥想',
    ownerCount: 1892,
    createdAt: '2025.08.12, 12:30',
    updatedAt: '2025.08.12, 16:00',
    status: 'active'
  },
  {
    id: '233',
    name: '3-Day Streak',
    description: 'You checked in three days in a row. Keep the momentum!',
    icon: '🔥',
    color: '#F44336',
    criteria: '连续签到3天',
    triggerCondition: '连续签到3天',
    category: '签到',
    ownerCount: 1654,
    createdAt: '2025.08.12, 12:30',
    updatedAt: '2025.08.12, 16:00',
    status: 'active'
  },
  {
    id: '12',
    name: 'I Ching Initiate',
    description: 'Read your first I Ching article in the Explore page.',
    icon: '📖',
    color: '#795548',
    criteria: '阅读易经文章',
    triggerCondition: '阅读易经文章',
    category: '易经',
    ownerCount: 1432,
    createdAt: '2025.08.12, 12:30',
    updatedAt: '2025.08.12, 16:00',
    status: 'active'
  },
  {
    id: '09',
    name: 'Star Seeker',
    description: 'Checked your natal chart in the Explore zone.',
    icon: '⭐',
    color: '#FFD700',
    criteria: '查看星盘',
    triggerCondition: '查看星盘',
    category: '占星',
    ownerCount: 1287,
    createdAt: '2025.08.12, 12:30',
    updatedAt: '2025.08.12, 16:00',
    status: 'active'
  },
  {
    id: '08',
    name: 'Number Whisperer',
    description: 'Unveiled your sacred number for the day.',
    icon: '🔢',
    color: '#607D8B',
    criteria: '查看幸运数字',
    triggerCondition: '查看幸运数字',
    category: '数字',
    ownerCount: 1156,
    createdAt: '2025.08.12, 12:30',
    updatedAt: '2025.08.12, 16:00',
    status: 'active'
  },
  {
    id: '05',
    name: 'Zen Practitioner',
    description: 'Completed 5 meditation sessions.',
    icon: '🧘',
    color: '#4CAF50',
    criteria: '完成5次冥想',
    triggerCondition: '完成5次冥想',
    category: '冥想',
    ownerCount: 987,
    createdAt: '2025.08.12, 12:30',
    updatedAt: '2025.08.12, 16:00',
    status: 'active'
  },
  {
    id: '01',
    name: 'Inner Growth',
    description: 'Reached Level 5 on your spiritual journey.',
    icon: '🌿',
    color: '#8BC34A',
    criteria: '达到5级',
    triggerCondition: '达到5级',
    category: '成长',
    ownerCount: 756,
    createdAt: '2025.08.12, 12:30',
    updatedAt: '2025.08.12, 16:00',
    status: 'active'
  }
];

export default function BadgesPage() {
  const router = useRouter();
  const [badges, setBadges] = useState<Badge[]>(mockBadges);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBadges, setSelectedBadges] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredBadges = badges.filter(badge =>
    badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    badge.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedBadges = filteredBadges.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredBadges.length / itemsPerPage);

  const handleSelectAll = () => {
    if (selectedBadges.size === paginatedBadges.length) {
      setSelectedBadges(new Set());
    } else {
      setSelectedBadges(new Set(paginatedBadges.map(b => b.id)));
    }
  };

  const handleSelectBadge = (id: string) => {
    const newSelected = new Set(selectedBadges);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedBadges(newSelected);
  };

  const handleDelete = (id: string) => {
    setBadges(prev => prev.filter(b => b.id !== id));
  };

  return (
    <ProtectedRoute>
      <CMSLayout>
        <div className="space-y-4">
          {/* Controls */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex flex-row gap-2">
                  <h1 className="text-xl font-bold text-gray-900">徽章列表</h1>
                  <p className="mt-1 text-sm text-gray-500">管理用户成就徽章和奖励系统</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="搜索列表..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-[#220646] focus:border-[#220646]"
                  />
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <FiFilter className="w-4 h-4" />
                </button>
                <button className="bg-[#220646] hover:bg-[#8C7E9C] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2">
                  <FiPlus className="w-4 h-4" />
                  <span>新增</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      名称
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      描述
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      图标
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
                  {paginatedBadges.map((badge) => (
                    <tr key={badge.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {badge.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {badge.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {badge.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="text-2xl">{badge.icon}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {badge.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleDelete(badge.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => router.push(`/settings/badges/${badge.id}`)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => router.push(`/settings/badges/${badge.id}`)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">显示</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                >
                  <option value={10}>10行</option>
                  <option value={20}>20行</option>
                  <option value={50}>50行</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50"
                >
                  &lt;
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-sm border rounded-md ${
                        currentPage === page
                          ? 'bg-[#220646] text-white border-[#220646]'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                {totalPages > 5 && <span className="text-sm text-gray-500">...</span>}
                {totalPages > 5 && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      currentPage === totalPages
                        ? 'bg-[#220646] text-white border-[#220646]'
                        : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    {totalPages}
                  </button>
                )}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </CMSLayout>
    </ProtectedRoute>
  );
}
