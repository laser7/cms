'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Notification } from '@/types';
import { FiPlus, FiSearch, FiFilter, FiEye, FiEdit, FiTrash2, FiChevronDown } from 'react-icons/fi';

// Mock data for notifications
const mockNotifications: Notification[] = [
  {
    id: '03',
    title: 'We miss you ✨',
    content: 'You haven\'t checked in for a few days. Your daily cards, lucky numbers, and spiritual insights are waiting for you. Come back and explore ✨',
    type: 'reminder',
    pushTime: '2025.08.12, 12:30',
    pushLocation: 'home',
    createdAt: '2025.08.11, 12:00',
    updatedAt: '2025.08.12, 16:00',
    status: 'active'
  },
  {
    id: '23',
    title: 'Your Daily Spiritual Card is ready 🌿',
    content: 'Today\'s draw is "Inner Balance" 🌿 Tap here to reveal the full message and let it guide your day.',
    type: 'reminder',
    pushTime: '2025.08.12, 12:30',
    pushLocation: 'home',
    createdAt: '2025.08.11, 12:00',
    updatedAt: '2025.08.12, 16:00',
    status: 'active'
  },
  {
    id: '21',
    title: 'You just leveled up! 🎉',
    content: 'Congratulations! You\'ve reached a new level in your spiritual journey. Check out your new achievements and rewards.',
    type: 'promotion',
    pushTime: '2025.08.12, 12:30',
    pushLocation: 'profile',
    createdAt: '2025.08.11, 12:00',
    updatedAt: '2025.08.12, 16:00',
    status: 'active'
  },
  {
    id: '34',
    title: 'A gift awaits your return 🎁',
    content: 'We\'ve prepared a special gift for your return. Open the app to claim your exclusive spiritual reading.',
    type: 'promotion',
    pushTime: '2025.08.12, 12:30',
    pushLocation: 'home',
    createdAt: '2025.08.11, 12:00',
    updatedAt: '2025.08.12, 16:00',
    status: 'active'
  },
  {
    id: '233',
    title: 'New meditation session available 🧘‍♀️',
    content: 'A new guided meditation session is now available. Take a moment to center yourself and find inner peace.',
    type: 'update',
    pushTime: '2025.08.12, 12:30',
    pushLocation: 'meditation',
    createdAt: '2025.08.11, 12:00',
    updatedAt: '2025.08.12, 16:00',
    status: 'active'
  },
  {
    id: '12',
    title: 'Weekly horoscope update 🔮',
    content: 'Your weekly horoscope has been updated with new insights and guidance for the coming week.',
    type: 'update',
    pushTime: '2025.08.12, 12:30',
    pushLocation: 'horoscope',
    createdAt: '2025.08.11, 12:00',
    updatedAt: '2025.08.12, 16:00',
    status: 'active'
  },
  {
    id: '09',
    title: 'System maintenance notice ⚠️',
    content: 'We\'ll be performing scheduled maintenance tonight. Some features may be temporarily unavailable.',
    type: 'alert',
    pushTime: '2025.08.12, 12:30',
    pushLocation: 'home',
    createdAt: '2025.08.11, 12:00',
    updatedAt: '2025.08.12, 16:00',
    status: 'active'
  },
  {
    id: '08',
    title: 'New feature: Daily Affirmations 💫',
    content: 'We\'ve added daily affirmations to help you start each day with positive energy and intention.',
    type: 'update',
    pushTime: '2025.08.12, 12:30',
    pushLocation: 'features',
    createdAt: '2025.08.11, 12:00',
    updatedAt: '2025.08.12, 16:00',
    status: 'active'
  },
  {
    id: '05',
    title: 'Community challenge starts today 🏆',
    content: 'Join our monthly spiritual challenge and connect with like-minded individuals on your journey.',
    type: 'promotion',
    pushTime: '2025.08.12, 12:30',
    pushLocation: 'community',
    createdAt: '2025.08.11, 12:00',
    updatedAt: '2025.08.12, 16:00',
    status: 'active'
  },
  {
    id: '01',
    title: 'Your personalized reading is ready 📖',
    content: 'Based on your recent activity, we\'ve prepared a personalized spiritual reading just for you.',
    type: 'reminder',
    pushTime: '2025.08.12, 12:30',
    pushLocation: 'readings',
    createdAt: '2025.08.11, 12:00',
    updatedAt: '2025.08.12, 16:00',
    status: 'active'
  }
];

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredNotifications = notifications.filter(notification =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);

  const handleSelectAll = () => {
    if (selectedNotifications.size === paginatedNotifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(paginatedNotifications.map(n => n.id)));
    }
  };

  const handleSelectNotification = (id: string) => {
    const newSelected = new Set(selectedNotifications);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedNotifications(newSelected);
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'reminder': return 'bg-blue-100 text-blue-800';
      case 'promotion': return 'bg-green-100 text-green-800';
      case 'update': return 'bg-purple-100 text-purple-800';
      case 'alert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute>
      <CMSLayout>
        <div className="space-y-4">
          {/* Header */}
     

          {/* Controls */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
              <div className="flex flex-row gap-2">
              <h1 className="text-xl font-bold text-gray-900">通知列表</h1>
              <p className="mt-1 text-sm text-gray-500">管理您的通知设置和内容</p>
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
                <button className="bg-[#8C7E9C] hover:bg-[#7A6B8A] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2">
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
                      标题
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      内容
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      推送时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedNotifications.map((notification) => (
                    <tr key={notification.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {notification.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {notification.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {notification.content}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {notification.pushTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleDelete(notification.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => router.push(`/settings/notifications/${notification.id}`)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => router.push(`/settings/notifications/${notification.id}`)}
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
