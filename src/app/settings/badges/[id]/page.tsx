'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Badge } from '@/types';
import { FiArrowLeft } from 'react-icons/fi';
import DetailPageActions from '@/components/DetailPageActions';

// Mock data for badges
const mockBadges: Badge[] = [
  {
    id: '09',
    name: 'First Step Taken',
    description: 'Logged in for the first time and began your Guara journey.',
    icon: '🌱',
    color: '#4CAF50',
    criteria: '首次登录',
    triggerCondition: '首次登录',
    category: '注册登录',
    ownerCount: 2910,
    createdAt: '2025.08.11, 12:00',
    updatedAt: '2025.08.12, 16:00',
    status: 'active'
  },
  {
    id: '03',
    name: 'First Daily Card',
    description: 'Drew your first daily spiritual card. Welcome to the flow.',
    icon: '🎴',
    color: '#9C27B0',
    criteria: '首次抽卡',
    triggerCondition: '首次抽卡',
    category: '每日卡片',
    ownerCount: 2847,
    createdAt: '2025.08.11, 12:00',
    updatedAt: '2025.08.12, 16:00',
    status: 'active'
  }
];

export default function BadgeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [badge, setBadge] = useState<Badge | null>(null);
  const [formData, setFormData] = useState<Partial<Badge>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [newOwner, setNewOwner] = useState('');

  useEffect(() => {
    // Simulate API call
    const fetchBadge = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const found = mockBadges.find(b => b.id === params.id);
      if (found) {
        setBadge(found);
        setFormData(found);
      }
      setIsLoading(false);
    };

    fetchBadge();
  }, [params.id]);

  const handleInputChange = (field: keyof Badge, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddOwner = () => {
    if (newOwner.trim() && badge) {
      setFormData(prev => ({
        ...prev,
        ownerCount: (prev.ownerCount || badge.ownerCount) + 1
      }));
      setNewOwner('');
    }
  };

  const handleSave = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push('/settings/badges');
  };

  const handleCancel = () => {
    router.push('/settings/badges');
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

  if (!badge) {
    return (
      <ProtectedRoute>
        <CMSLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">徽章未找到</h2>
              <p className="text-gray-500 mt-2">请求的徽章不存在或已被删除</p>
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
                onClick={() => router.push('/settings/badges')}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
              >
                <FiArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">徽章详情</h1>
                <p className="text-sm text-gray-500">查看和编辑徽章信息</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow">
            {/* General Information Section */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900 mb-4">基本信息</h2>
              <div className="gap-4 flex flex-col">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Id:</span>
                  <span className="text-gray-900">{badge.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">创建时间:</span>
                  <span className="text-gray-900">{badge.createdAt}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">上次更新:</span>
                  <span className="text-gray-900">{badge.updatedAt}</span>
                </div>
              </div>
            </div>

            {/* Badge Specifics Section */}
            <div className="px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">徽章详情</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">名称:</span>
                  <input
                    type="text"
                    value={formData.name || badge.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="border-none bg-transparent focus:ring-0 focus:outline-none text-right flex-1 ml-4"
                  />
                </div>
                <div className="flex justify-between items-start">
                  <span className="font-medium text-gray-700">描述:</span>
                  <textarea
                    value={formData.description || badge.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="border-none bg-transparent focus:ring-0 focus:outline-none text-right flex-1 ml-4 resize-none"
                    rows={2}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">触发条件:</span>
                  <input
                    type="text"
                    value={formData.triggerCondition || badge.triggerCondition}
                    onChange={(e) => handleInputChange('triggerCondition', e.target.value)}
                    className="border-none bg-transparent focus:ring-0 focus:outline-none text-right"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">类别:</span>
                  <input
                    type="text"
                    value={formData.category || badge.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="border-none bg-transparent focus:ring-0 focus:outline-none text-right"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">icon:</span>
                  <div className="flex items-center space-x-2">

                    <input
                      type="text"
                      value={formData.icon || badge.icon}
                      onChange={(e) => handleInputChange('icon', e.target.value)}
                      className="border-none bg-transparent focus:ring-0 focus:outline-none text-right"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">状态:</span>
                  <select
                    value={formData.status || badge.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="border-none bg-transparent focus:ring-0 focus:outline-none"
                  >
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                  </select>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">拥有人数:</span>
                  <span className="text-gray-900">{formData.ownerCount || badge.ownerCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">添加拥有者:</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="输入用户ID"
                      value={newOwner}
                      onChange={(e) => setNewOwner(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-[#220646] focus:border-[#220646]"
                    />
                    <button
                      onClick={handleAddOwner}
                      className="bg-[#8C7E9C] hover:bg-[#7A6B8A] text-white px-3 py-1 rounded-md text-sm font-medium"
                    >
                      添加+
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-gray-200">
              <DetailPageActions
                isEditing={true}
                pageName="徽章"
                onEdit={() => {}} // No-op since always in edit mode
                onSave={handleSave}
                onCancel={handleCancel}
                onDelete={() => {}} // No delete functionality for badges
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
