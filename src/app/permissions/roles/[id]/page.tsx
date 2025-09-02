'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiSearch, FiChevronLeft } from 'react-icons/fi';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  creationTime: string;
  lastUpdate: string;
}

// Mock data - in real app this would come from API
const role: Role = {
  id: '01',
  name: '管理员',
  description: '拥有所有权限的超级管理员',
  permissions: ['view_user', 'edit_content', 'view_settings', 'view_media', 'delete_content', 'view_dashboard'],
  userCount: 2,
  creationTime: '2023.04.10 12:00',
  lastUpdate: '2023.04.10 16:00'
};

// Permission tree structure for the detail page
const permissionTree = [
  {
    category: '用户管理',
    permissions: [
      { id: 'user_list', name: '用户列表', checked: true },
      { id: 'add_user', name: '新增用户', checked: true },
      { id: 'edit_user', name: '编辑用户', checked: true },
      { id: 'delete_user', name: '删除用户', checked: false }
    ]
  },
  {
    category: '内容管理',
    permissions: [
      { id: 'content_list', name: '内容列表', checked: true },
      { id: 'add_content', name: '新增内容', checked: true },
      { id: 'edit_content', name: '编辑内容', checked: true },
      { id: 'delete_content', name: '删除内容', checked: true }
    ]
  },
  {
    category: '媒体管理',
    permissions: [
      { id: 'media_list', name: '媒体列表', checked: true },
      { id: 'add_media', name: '新增媒体', checked: false },
      { id: 'edit_media', name: '编辑媒体', checked: false },
      { id: 'delete_media', name: '删除媒体', checked: false }
    ]
  },
  {
    category: '团队管理',
    permissions: [
      { id: 'team_list', name: '团队列表', checked: false },
      { id: 'add_team', name: '新增团队', checked: false },
      { id: 'edit_team', name: '编辑团队', checked: false },
      { id: 'delete_team', name: '删除团队', checked: false }
    ]
  },
  {
    category: '代码管理',
    permissions: [
      { id: 'code_list', name: '代码列表', checked: false },
      { id: 'add_code', name: '新增代码', checked: false },
      { id: 'edit_code', name: '编辑代码', checked: false },
      { id: 'delete_code', name: '删除代码', checked: false }
    ]
  },
  {
    category: '会话管理',
    permissions: [
      { id: 'conversation_list', name: '会话列表', checked: false },
      { id: 'add_conversation', name: '新增会话', checked: false },
      { id: 'edit_conversation', name: '编辑会话', checked: false },
      { id: 'delete_conversation', name: '删除会话', checked: false }
    ]
  },
  {
    category: '系统',
    permissions: [
      { id: 'system_settings', name: '系统设置', checked: true },
      { id: 'log_management', name: '日志管理', checked: false },
      { id: 'backup_restore', name: '备份恢复', checked: false }
    ]
  },
  {
    category: '徽章管理',
    permissions: [
      { id: 'badge_list', name: '徽章列表', checked: false },
      { id: 'add_badge', name: '新增徽章', checked: false },
      { id: 'edit_badge', name: '编辑徽章', checked: false },
      { id: 'delete_badge', name: '删除徽章', checked: false }
    ]
  }
];



export default function RoleDetailPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'view';
  const [formData, setFormData] = useState<Role>(role);
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [permissions, setPermissions] = useState(permissionTree);
  return (
    <ProtectedRoute>
      <CMSLayout>
        <div className="space-y-6">
          {/* Page header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/permissions/roles"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiChevronLeft className="w-4 h-4" />
                <span className="text-sm">返回列表</span>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">
                角色信息 {isEditing && <span className="text-sm font-normal text-gray-500">(编辑模式)</span>}
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
                  <span className="text-sm text-gray-900">{formData.id}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">名称:</span>
                  <span className="text-sm text-gray-900">{formData.name}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">创建时间:</span>
                  <span className="text-sm text-gray-900">{formData.creationTime}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">上次更新:</span>
                  <span className="text-sm text-gray-900">{formData.lastUpdate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Permission Configuration */}
          <div className="bg-white shadow rounded-lg mt-6">
            <div className="px-6 py-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">权限配置</h3>
              <div className="space-y-3">
                {permissions.map((category) => (
                  <div key={category.category} className="border border-gray-200 rounded-md">
                    <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700">{category.category}</h4>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-3 space-y-2">
                      {category.permissions.map((permission) => (
                        <label key={permission.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={permission.checked}
                            onChange={(e) => {
                              if (isEditing) {
                                const updatedPermissions = permissions.map(cat => {
                                  if (cat.category === category.category) {
                                    return {
                                      ...cat,
                                      permissions: cat.permissions.map(perm => 
                                        perm.id === permission.id 
                                          ? { ...perm, checked: e.target.checked }
                                          : perm
                                      )
                                    };
                                  }
                                  return cat;
                                });
                                setPermissions(updatedPermissions);
                              }
                            }}
                            disabled={!isEditing}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                          />
                          <span className="ml-2 text-sm text-gray-700">{permission.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Associated Users */}
          <div className="bg-white shadow rounded-lg mt-6">
            <div className="px-6 py-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">关联用户</h3>
              <div className="space-y-4">
                <div className="flex items-end space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">用户账号</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="搜索用户账号"
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <FiSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">用户名称</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="搜索用户名称"
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <FiSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button 
                      disabled={!isEditing}
                      className="px-4 py-2 bg-[#8C7E9C] text-white rounded-md hover:bg-[#7A6B8A] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      关联
                    </button>
                  </div>
                </div>
                
                {/* User pagination */}
                <div className="flex justify-center space-x-2 mt-4">
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">001</button>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">002</button>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">003</button>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">004</button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            {isEditing ? (
              <>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    alert('保存成功！');
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 rounded-md transition-colors"
                >
                  保存
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                编辑
              </button>
            )}
          </div>
        </div>
      </CMSLayout>
    </ProtectedRoute>
  );
}
