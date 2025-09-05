'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Notification } from '@/types';
import { FiArrowLeft } from 'react-icons/fi';
import DetailPageActions from '@/components/DetailPageActions';

// Mock data for notifications
const mockNotifications: Notification[] = [
  {
    id: '09',
    title: 'We miss you ✨',
    content: 'You haven\'t checked in for a few days. Your daily cards, lucky numbers, and spiritual insights are waiting for you. Come back and explore ✨',
    type: 'reminder',
    pushTime: '2025.08.14 17:30',
    pushLocation: 'home',
    createdAt: '2025.08.11, 12:00',
    updatedAt: '2025.08.12, 16:00',
    status: 'active'
  },
  {
    id: '03',
    title: 'Your Daily Spiritual Card is ready 🌿',
    content: 'Today\'s draw is "Inner Balance" 🌿 Tap here to reveal the full message and let it guide your day.',
    type: 'reminder',
    pushTime: '2025.08.12, 12:30',
    pushLocation: 'home',
    createdAt: '2025.08.11, 12:00',
    updatedAt: '2025.08.12, 16:00',
    status: 'active'
  }
];

export default function NotificationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [formData, setFormData] = useState<Partial<Notification>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchNotification = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const found = mockNotifications.find(n => n.id === params.id);
      if (found) {
        setNotification(found);
        setFormData(found);
      }
      setIsLoading(false);
    };

    fetchNotification();
  }, [params.id]);

  const handleInputChange = (field: keyof Notification, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push('/settings/notifications');
  };

  const handleCancel = () => {
    router.push('/settings/notifications');
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <CMSLayout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#220646]"></div>
          </div>
        </CMSLayout>
      </ProtectedRoute>
    );
  }

  if (!notification) {
    return (
      <ProtectedRoute>
        <CMSLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">通知未找到</h2>
              <p className="text-gray-500 mt-2">请求的通知不存在或已被删除</p>
            </div>
          </div>
        </CMSLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <CMSLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/settings/notifications')}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
              >
                <FiArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">通知详情</h1>
                <p className="text-sm text-gray-500">查看和编辑通知信息</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow">
            {/* General Information Section */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 ">
              <h2 className="text-lg font-medium text-gray-900 mb-4">基本信息</h2>
              <div className=" gap-4 flex flex-col">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Id:</span>
                  <span className="text-gray-900">{notification.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">创建时间:</span>
                  <span className="text-gray-900">{notification.createdAt}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">上次更新:</span>
                  <span className="text-gray-900">{notification.updatedAt}</span>
                </div>
              </div>
            </div>

            {/* Notification Content Section */}
            <div className="px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">通知内容</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">类型:</span>
                  <select
                    value={formData.type || notification.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className=" border-none bg-transparent focus:ring-0 focus:outline-none"
                  >
                    <option value="reminder">提醒</option>
                    <option value="promotion">推广</option>
                    <option value="update">更新</option>
                    <option value="alert">警告</option>
                  </select>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">推送时间:</span>
                  <input
                    type="text"
                    value={formData.pushTime || notification.pushTime}
                    onChange={(e) => handleInputChange('pushTime', e.target.value)}
                    className=" border-none bg-transparent focus:ring-0 focus:outline-none text-right"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">标题:</span>
                  <input
                    type="text"
                    value={formData.title || notification.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className=" border-none bg-transparent focus:ring-0 focus:outline-none text-right flex-1 ml-4"
                  />
                </div>
                <div className="flex justify-between items-start">
                  <span className="font-medium text-gray-700">内容:</span>
                  <textarea
                    value={formData.content || notification.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    className=" border-none bg-transparent focus:ring-0 focus:outline-none text-right flex-1 ml-4 resize-none"
                    rows={3}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">推送位置:</span>
                  <input
                    type="text"
                    value={formData.pushLocation || notification.pushLocation}
                    onChange={(e) => handleInputChange('pushLocation', e.target.value)}
                    className=" border-none bg-transparent focus:ring-0 focus:outline-none text-right"
                  />
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-gray-200">
              <DetailPageActions
                isEditing={true}
                pageName="通知"
                onEdit={() => {}} // No-op since always in edit mode
                onSave={handleSave}
                onCancel={handleCancel}
                onDelete={() => {}} // No delete functionality for notifications
                isSaving={false}
                isDeleting={false}
                disabled={false}
              />
            </div>
          </div>
        </div>
      </CMSLayout>
    </ProtectedRoute>
  );
}
