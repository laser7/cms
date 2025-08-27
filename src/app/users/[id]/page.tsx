'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiChevronLeft, FiEdit3, FiSave, FiX, FiTrash2 } from 'react-icons/fi';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getUserDetail, deleteUser, UserDetail } from '@/lib/users-api';

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'view';
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [formData, setFormData] = useState<Partial<UserDetail>>({});

  // Fetch user detail
  const fetchUserDetail = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getUserDetail(parseInt(resolvedParams.id));
      
      if (response.code === 0) {
        setUser(response.data);
        setFormData(response.data);
      } else {
        setError(response.msg || 'Failed to fetch user detail');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, [resolvedParams.id]);

  useEffect(() => {
    setIsEditing(mode === 'edit');
  }, [mode]);

  const handleDeleteUser = async () => {
    if (!user) return;
    
    if (confirm(`确定要删除用户 "${user.name}" 吗？此操作不可撤销。`)) {
      try {
        const response = await deleteUser(user.id);
        
        if (response.code === 0) {
          alert('用户删除成功！');
          // Redirect to users list
          window.location.href = '/users';
        } else {
          alert(`删除失败: ${response.msg}`);
        }
      } catch (err) {
        alert('删除用户时发生错误');
      }
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <CMSLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">加载中...</div>
          </div>
        </CMSLayout>
      </ProtectedRoute>
    );
  }

  if (error || !user) {
    return (
      <ProtectedRoute>
        <CMSLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-600">{error || '用户不存在'}</div>
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
            <div className="flex items-center space-x-4">
              <Link
                href="/users"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiChevronLeft className="w-4 h-4" />
                <span className="text-sm">返回列表</span>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">
                用户信息 {isEditing && <span className="text-sm font-normal text-gray-500">(编辑模式)</span>}
              </h1>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">基本信息</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">ID:</span>
                  <span className="text-sm text-gray-900">{user.id}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">姓名:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="text-sm text-gray-900 bg-white border border-gray-300 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{user.name}</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">联系方式:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.contact || ''}
                      onChange={(e) => setFormData({...formData, contact: e.target.value})}
                      className="text-sm text-gray-900 bg-white border border-gray-300 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{user.contact}</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">出生信息:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.birth_info || ''}
                      onChange={(e) => setFormData({...formData, birth_info: e.target.value})}
                      className="text-sm text-gray-900 bg-white border border-gray-300 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{user.birth_info}</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">状态:</span>
                  {isEditing ? (
                    <select
                      value={formData.status || ''}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="text-sm text-gray-900 bg-white border border-gray-300 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">活跃</option>
                      <option value="inactive">非活跃</option>
                    </select>
                  ) : (
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? '活跃' : '非活跃'}
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">创建时间:</span>
                  <span className="text-sm text-gray-900">{user.created_at}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">活动信息</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-600">等级:</span>
                  <span className="text-sm text-gray-900">{user.activity.level}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-600">等级分数:</span>
                  <span className="text-sm text-gray-900">{user.activity.level_score}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-600">金币:</span>
                  <span className="text-sm text-gray-900">{user.activity.gold_coins}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-600">连续访问:</span>
                  <span className="text-sm text-gray-900">{user.activity.consecutive_visits} 天</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-600">总访问天数:</span>
                  <span className="text-sm text-gray-900">{user.activity.total_visit_days} 天</span>
                </div>
              </div>
              
              {/* Badges */}
              <div className="mt-4">
                <span className="text-sm font-medium text-gray-600">徽章:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.activity.badges.length > 0 ? (
                    user.activity.badges.map((badge, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {badge}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">暂无徽章</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">权限信息</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={user.permissions.view_personal_info}
                    disabled
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">查看个人信息</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={user.permissions.edit_profile}
                    disabled
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">编辑资料</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={user.permissions.update_profile}
                    disabled
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">更新资料</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={user.permissions.update_contact}
                    disabled
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">更新联系方式</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={user.permissions.update_birth_data}
                    disabled
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">更新出生数据</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={user.permissions.change_avatar}
                    disabled
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">更换头像</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={user.permissions.change_password}
                    disabled
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">修改密码</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(user); // Reset form data
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors flex items-center space-x-2"
                >
                  <FiX className="w-4 h-4" />
                  <span>取消</span>
                </button>
                <button
                  onClick={() => {
                    // Handle save logic here
                    alert('保存成功！');
                    setIsEditing(false);
                    // In real app, you would call an API to update the user
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center space-x-2"
                >
                  <FiSave className="w-4 h-4" />
                  <span>保存</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center space-x-2"
                >
                  <FiEdit3 className="w-4 h-4" />
                  <span>编辑</span>
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors flex items-center space-x-2"
                >
                  <FiTrash2 className="w-4 h-4" />
                  <span>删除</span>
                </button>
              </>
            )}
          </div>
        </div>
      </CMSLayout>
    </ProtectedRoute>
  );
}
