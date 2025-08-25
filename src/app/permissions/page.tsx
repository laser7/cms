'use client';

import React, { useState } from 'react';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  lastActive: string;
  status: 'active' | 'inactive' | 'suspended';
}

const permissions: Permission[] = [
  { id: 'read_posts', name: '查看文章', description: '查看所有文章内容', category: '内容管理' },
  { id: 'write_posts', name: '创建文章', description: '创建和编辑文章', category: '内容管理' },
  { id: 'publish_posts', name: '发布文章', description: '发布文章到网站', category: '内容管理' },
  { id: 'delete_posts', name: '删除文章', description: '删除文章', category: '内容管理' },
  { id: 'manage_media', name: '管理媒体', description: '上传和管理媒体文件', category: '媒体管理' },
  { id: 'manage_users', name: '管理用户', description: '创建、编辑和删除用户', category: '用户管理' },
  { id: 'manage_roles', name: '管理角色', description: '创建和编辑用户角色', category: '用户管理' },
  { id: 'view_analytics', name: '查看统计', description: '查看网站统计数据', category: '数据分析' },
  { id: 'manage_settings', name: '管理设置', description: '修改系统设置', category: '系统管理' },
  { id: 'access_ai', name: 'AI功能', description: '使用AI相关功能', category: 'AI功能' },
  { id: 'manage_conversations', name: '管理会话', description: '查看和管理用户会话', category: '会话管理' },
  { id: 'export_data', name: '导出数据', description: '导出系统数据', category: '系统管理' }
];

const roles: Role[] = [
  {
    id: 'admin',
    name: '管理员',
    description: '拥有所有权限的超级管理员',
    permissions: permissions.map(p => p.id),
    userCount: 2
  },
  {
    id: 'editor',
    name: '编辑',
    description: '可以创建、编辑和发布内容',
    permissions: ['read_posts', 'write_posts', 'publish_posts', 'manage_media', 'view_analytics'],
    userCount: 5
  },
  {
    id: 'author',
    name: '作者',
    description: '可以创建和编辑自己的文章',
    permissions: ['read_posts', 'write_posts', 'manage_media'],
    userCount: 12
  },
  {
    id: 'viewer',
    name: '查看者',
    description: '只能查看内容，无法编辑',
    permissions: ['read_posts', 'view_analytics'],
    userCount: 8
  }
];

const users: User[] = [
  { id: 1, name: '张三', email: 'zhang@example.com', role: 'admin', lastActive: '2025.08.12, 12:30', status: 'active' },
  { id: 2, name: '李四', email: 'li@example.com', role: 'editor', lastActive: '2025.08.12, 11:45', status: 'active' },
  { id: 3, name: '王五', email: 'wang@example.com', role: 'author', lastActive: '2025.08.12, 10:20', status: 'active' },
  { id: 4, name: '赵六', email: 'zhao@example.com', role: 'viewer', lastActive: '2025.08.11, 15:30', status: 'inactive' },
  { id: 5, name: '钱七', email: 'qian@example.com', role: 'author', lastActive: '2025.08.12, 09:15', status: 'suspended' }
];

export default function PermissionsPage() {
  const [selectedRole, setSelectedRole] = useState<string>('admin');
  const [showNewRoleModal, setShowNewRoleModal] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', description: '', permissions: [] as string[] });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
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
      case 'suspended':
        return '已暂停';
      default:
        return '未知';
    }
  };

  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : roleId;
  };

  const handlePermissionToggle = (permissionId: string) => {
    setNewRole(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const handleCreateRole = () => {
    if (newRole.name && newRole.description) {
      // In a real app, this would save to the backend
      console.log('Creating new role:', newRole);
      setNewRole({ name: '', description: '', permissions: [] });
      setShowNewRoleModal(false);
    }
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <ProtectedRoute>
      <CMSLayout>
        <div className="space-y-6">
          {/* Page header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">权限管理</h1>
            <p className="mt-1 text-sm text-gray-500">
              管理用户角色、权限和访问控制
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Roles List */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">角色</h3>
                    <button
                      onClick={() => setShowNewRoleModal(true)}
                      className="bg-[#220646] hover:bg-[#8C7E9C] text-white px-3 py-1 rounded-md text-sm font-medium"
                    >
                      + 新建
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {roles.map((role) => (
                      <div
                        key={role.id}
                        className={`p-3 rounded-md cursor-pointer transition-colors ${
                          selectedRole === role.id
                            ? 'bg-purple-50 border border-purple-200'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedRole(role.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{role.name}</h4>
                            <p className="text-xs text-gray-500">{role.description}</p>
                          </div>
                          <span className="text-xs text-gray-500">{role.userCount} 用户</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Permissions for Selected Role */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {roles.find(r => r.id === selectedRole)?.name} 权限
                  </h3>
                  
                  <div className="space-y-6">
                    {Object.entries(groupedPermissions).map(([category, perms]) => (
                      <div key={category}>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">{category}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {perms.map((permission) => {
                            const isGranted = roles.find(r => r.id === selectedRole)?.permissions.includes(permission.id);
                            return (
                              <div
                                key={permission.id}
                                className={`p-3 rounded-md border ${
                                  isGranted
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-gray-50 border-gray-200'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{permission.name}</p>
                                    <p className="text-xs text-gray-500">{permission.description}</p>
                                  </div>
                                  <div className={`w-3 h-3 rounded-full ${
                                    isGranted ? 'bg-green-500' : 'bg-gray-300'
                                  }`}></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Users with Roles */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">用户角色分配</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        用户
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        角色
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        最后活跃
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {getRoleName(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                            {getStatusText(user.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.lastActive}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-purple-600 hover:text-purple-900 mr-3">
                            编辑
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* New Role Modal */}
          {showNewRoleModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">创建新角色</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        角色名称
                      </label>
                      <input
                        type="text"
                        value={newRole.name}
                        onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="输入角色名称"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        描述
                      </label>
                      <textarea
                        value={newRole.description}
                        onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows={3}
                        placeholder="输入角色描述"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        权限
                      </label>
                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {permissions.map((permission) => (
                          <label key={permission.id} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={newRole.permissions.includes(permission.id)}
                              onChange={() => handlePermissionToggle(permission.id)}
                              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{permission.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => setShowNewRoleModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleCreateRole}
                      className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md"
                    >
                      创建
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CMSLayout>
    </ProtectedRoute>
  );
}
