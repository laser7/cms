'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FiX, FiCheck } from 'react-icons/fi';

interface User {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  createdAt: string;
  birthInfo: string;
  contactInfo: string;
  activity: {
    totalVisitDays: number;
    consecutiveVisits: number;
    goldCoins: number;
    level: number;
    levelScore: number;
    badges: string[];
  };
  permissions: {
    viewPersonalInfo: boolean;
    updateContactInfo: boolean;
    edit: boolean;
    updateProfile: boolean;
    updateBirthData: boolean;
    changePassword: boolean;
    changeAvatar: boolean;
  };
}

// Mock data based on the image
const mockUser: User = {
  id: '09',
  name: 'Johny',
  status: 'active',
  createdAt: '2025.08.12, 12:30',
  birthInfo: '1995.04.23, 15:30, Berlin, Germany',
  contactInfo: 'placeholder@gmail.com',
  activity: {
    totalVisitDays: 87,
    consecutiveVisits: 57,
    goldCoins: 316,
    level: 2,
    levelScore: 1523,
    badges: ['14-Day streaks', 'First Meditation', 'Explorer']
  },
  permissions: {
    viewPersonalInfo: true,
    updateContactInfo: true,
    edit: false,
    updateProfile: false,
    updateBirthData: false,
    changePassword: false,
    changeAvatar: false
  }
};

export default function UserDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get('mode') || 'view'; // 'view' or 'edit'
  
  const [user, setUser] = useState<User>(mockUser);
  const [formData, setFormData] = useState<User>(mockUser);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Simulate loading user data
    const loadUser = async () => {
      setIsLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(mockUser);
      setFormData(mockUser);
      setIsLoading(false);
    };

    loadUser();
  }, [params.id]);

  const handleInputChange = (field: keyof User, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleActivityChange = (field: keyof User['activity'], value: number) => {
    setFormData(prev => ({
      ...prev,
      activity: {
        ...prev.activity,
        [field]: value
      }
    }));
  };

  const handlePermissionChange = (permission: keyof User['permissions'], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: value
      }
    }));
  };

  const handleRemoveBadge = (badgeIndex: number) => {
    setFormData(prev => ({
      ...prev,
      activity: {
        ...prev.activity,
        badges: prev.activity.badges.filter((_, index) => index !== badgeIndex)
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update the user with new data
    setUser(formData);
    setIsSaving(false);
    
    // Switch back to view mode
    router.push(`/users/${params.id}?mode=view`);
  };

  const handleCancel = () => {
    // Reset form data to original user
    setFormData(user);
    // Switch back to view mode
    router.push(`/users/${params.id}?mode=view`);
  };

  const handleEdit = () => {
    router.push(`/users/${params.id}?mode=edit`);
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <CMSLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">加载中...</div>
          </div>
        </CMSLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <CMSLayout>
        <div className="space-y-6">
          {/* Page header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {mode === 'edit' ? '编辑用户' : '用户详情'}
              </h1>
              <p className="mt-1 text-xs text-gray-500">
                {mode === 'edit' ? '编辑用户信息和权限' : '查看用户详细信息'}
              </p>
            </div>
            {mode === 'view' && (
              <button
                onClick={handleEdit}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                编辑用户
              </button>
            )}
          </div>

          {/* User Details Card */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base leading-6 font-medium text-gray-900 mb-4">
                用户详情
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID
                  </label>
                  <input
                    type="text"
                    value={user.id}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    姓名
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={mode === 'view'}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      mode === 'view' ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    }`}
                    placeholder="输入用户姓名..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    状态
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    disabled={mode === 'view'}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      mode === 'view' ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    }`}
                  >
                    <option value="active">活跃</option>
                    <option value="inactive">非活跃</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    创建时间
                  </label>
                  <input
                    type="text"
                    value={user.createdAt}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    出生信息
                  </label>
                  <input
                    type="text"
                    value={formData.birthInfo}
                    onChange={(e) => handleInputChange('birthInfo', e.target.value)}
                    disabled={mode === 'view'}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      mode === 'view' ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    }`}
                    placeholder="输入出生信息..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    联系方式
                  </label>
                  <input
                    type="email"
                    value={formData.contactInfo}
                    onChange={(e) => handleInputChange('contactInfo', e.target.value)}
                    disabled={mode === 'view'}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      mode === 'view' ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    }`}
                    placeholder="输入联系方式..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* User Activity Card */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base leading-6 font-medium text-gray-900 mb-4">
                用户活动
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    访问总天数
                  </label>
                  <input
                    type="number"
                    value={formData.activity.totalVisitDays}
                    onChange={(e) => handleActivityChange('totalVisitDays', parseInt(e.target.value) || 0)}
                    disabled={mode === 'view'}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      mode === 'view' ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    连续访问
                  </label>
                  <input
                    type="number"
                    value={formData.activity.consecutiveVisits}
                    onChange={(e) => handleActivityChange('consecutiveVisits', parseInt(e.target.value) || 0)}
                    disabled={mode === 'view'}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      mode === 'view' ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    金币数
                  </label>
                  <input
                    type="number"
                    value={formData.activity.goldCoins}
                    onChange={(e) => handleActivityChange('goldCoins', parseInt(e.target.value) || 0)}
                    disabled={mode === 'view'}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      mode === 'view' ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    等级
                  </label>
                  <input
                    type="number"
                    value={formData.activity.level}
                    onChange={(e) => handleActivityChange('level', parseInt(e.target.value) || 0)}
                    disabled={mode === 'view'}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      mode === 'view' ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    等级分
                  </label>
                  <input
                    type="number"
                    value={formData.activity.levelScore}
                    onChange={(e) => handleActivityChange('levelScore', parseInt(e.target.value) || 0)}
                    disabled={mode === 'view'}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      mode === 'view' ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    }`}
                  />
                </div>
              </div>
              
                             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   徽章
                 </label>
                 <div className="flex flex-wrap gap-2">
                   {formData.activity.badges.map((badge, index) => (
                     <span
                       key={index}
                       className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                     >
                       {badge}
                       {mode === 'edit' && (
                         <button
                           onClick={() => handleRemoveBadge(index)}
                           className="ml-2 text-gray-400 hover:text-red-500 text-xs"
                         >
                           ×
                         </button>
                       )}
                     </span>
                   ))}
                 </div>
               </div>
            </div>
          </div>

          {/* Permissions Card */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base leading-6 font-medium text-gray-900 mb-4">
                权限
              </h3>
              <div className="space-y-3">
                {Object.entries(formData.permissions).map(([key, value]) => {
                  const permissionLabels: { [key: string]: string } = {
                    viewPersonalInfo: '查看个人信息',
                    updateContactInfo: '更新联系方式',
                    edit: '编辑',
                    updateProfile: '更新档案',
                    updateBirthData: '更新出生数据',
                    changePassword: '更改密码',
                    changeAvatar: '更改头像'
                  };

                  return (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {permissionLabels[key]}
                      </span>
                      <div className="flex items-center space-x-2">
                        {mode === 'edit' ? (
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handlePermissionChange(key as keyof User['permissions'], e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        ) : (
                          <div className="flex items-center">
                            {value ? (
                              <FiCheck className="text-green-500" size={20} />
                            ) : (
                              <FiX className="text-red-500" size={20} />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons - Only show in edit mode */}
          {mode === 'edit' && (
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-pink-300 text-pink-700 bg-white hover:bg-pink-50 rounded-md text-sm font-medium transition-colors"
              >
                取消更新
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white rounded-md text-sm font-medium transition-colors"
              >
                {isSaving ? '保存中...' : '更新'}
              </button>
            </div>
          )}
        </div>
      </CMSLayout>
    </ProtectedRoute>
  );
}
