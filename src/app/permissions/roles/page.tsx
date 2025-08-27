'use client';

import React, { useState } from 'react';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FiSearch, FiFilter, FiEye, FiEdit, FiTrash2, FiChevronDown, FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi';
import Link from 'next/link';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  creationTime: string;
}

interface Permission {
  id: string;
  name: string;
  category: string;
}

const permissions: Permission[] = [
  { id: 'read_posts', name: '查看文章', category: '内容管理' },
  { id: 'write_posts', name: '创建文章', category: '内容管理' },
  { id: 'publish_posts', name: '发布文章', category: '内容管理' },
  { id: 'delete_posts', name: '删除文章', category: '内容管理' },
  { id: 'manage_media', name: '管理媒体', category: '媒体管理' },
  { id: 'manage_users', name: '管理用户', category: '用户管理' },
  { id: 'manage_roles', name: '管理角色', category: '用户管理' },
  { id: 'view_analytics', name: '查看统计', category: '数据分析' },
  { id: 'manage_settings', name: '管理设置', category: '系统管理' },
  { id: 'access_ai', name: 'AI功能', category: 'AI功能' },
  { id: 'manage_conversations', name: '管理会话', category: '会话管理' },
  { id: 'export_data', name: '导出数据', category: '系统管理' }
];

const roles: Role[] = [
  {
    id: '01',
    name: '管理员',
    description: '拥有所有权限的超级管理员',
    permissions: ['view_user', 'edit_content', 'view_settings', 'view_media', 'delete_content', 'view_dashboard'],
    userCount: 2,
    creationTime: '2025.08.12, 12:30'
  },
  {
    id: '02',
    name: '总编辑',
    description: '负责内容编辑和审核',
    permissions: ['view_user', 'edit_content', 'view_media', 'delete_content'],
    userCount: 3,
    creationTime: '2025.08.12, 12:30'
  },
  {
    id: '03',
    name: '开发者',
    description: '系统开发和维护',
    permissions: ['view_user', 'edit_content', 'view_settings', 'view_dashboard'],
    userCount: 4,
    creationTime: '2025.08.12, 12:30'
  },
  {
    id: '04',
    name: '用户',
    description: '普通用户权限',
    permissions: ['view_content', 'view_media'],
    userCount: 15,
    creationTime: '2025.08.12, 12:30'
  },
  {
    id: '05',
    name: '内容审核者',
    description: '负责内容审核',
    permissions: ['view_content', 'edit_content', 'delete_content'],
    userCount: 2,
    creationTime: '2025.08.12, 12:30'
  },
  {
    id: '06',
    name: '翻译人员',
    description: '负责内容翻译',
    permissions: ['view_content', 'edit_content'],
    userCount: 3,
    creationTime: '2025.08.12, 12:30'
  },
  {
    id: '07',
    name: '数据查看者',
    description: '只能查看数据',
    permissions: ['view_dashboard', 'view_content'],
    userCount: 5,
    creationTime: '2025.08.12, 12:30'
  },
  {
    id: '08',
    name: 'SEO专员',
    description: '负责SEO优化',
    permissions: ['view_content', 'edit_content', 'view_settings'],
    userCount: 2,
    creationTime: '2025.08.12, 12:30'
  },
  {
    id: '09',
    name: '访客',
    description: '只读访问权限',
    permissions: ['view_content'],
    userCount: 8,
    creationTime: '2025.08.12, 12:30'
  },
  {
    id: '10',
    name: '超级管理员',
    description: '系统最高权限',
    permissions: ['view_user', 'edit_content', 'view_settings', 'view_media', 'delete_content', 'view_dashboard', 'manage_users', 'manage_roles'],
    userCount: 1,
    creationTime: '2025.08.12, 12:30'
  }
];

export default function RoleManagementPage() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showNewRoleModal, setShowNewRoleModal] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', description: '', permissions: [] as string[] });

  const filteredItems = roles.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(currentItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleViewDetails = (role: Role) => {
    // Navigate to view page
    window.location.href = `/permissions/roles/${role.id}?mode=view`;
  };

  const handleEdit = (role: Role) => {
    // Navigate to edit page
    window.location.href = `/permissions/roles/${role.id}?mode=edit`;
  };

  const handleDelete = (role: Role) => {
    if (confirm(`确定要删除角色 "${role.name}" 吗？`)) {
      // In a real app, this would call an API to delete the role
      console.log('Deleting role:', role);
      // Remove from local state for demo
      const updatedRoles = roles.filter(r => r.id !== role.id);
      // In real app, you would update the state here
      alert('删除成功！');
    }
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

  const getPermissionName = (permissionId: string) => {
    const permission = permissions.find(p => p.id === permissionId);
    return permission ? permission.name : permissionId;
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
        <div className="space-y-4">
          {/* Page header */}
          <div className="flex flex-row gap-3">
            <h1 className="text-xl font-bold text-gray-900">角色列表</h1>
          </div>

          {/* Controls */}
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <select className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>选择列</option>
                  </select>
                  <FiChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>

                <div className="relative">
                  <FiSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Q 搜索列表..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                  />
                </div>

                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <FiFilter className="w-4 h-4" />
                </button>
              </div>

              <button 
                onClick={() => setShowNewRoleModal(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-pink-600 hover:to-purple-700 flex items-center space-x-2"
              >
                <FiPlus className="w-4 h-4" />
                <span>新增</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === currentItems.length && currentItems.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      名称
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      权限
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
                  {currentItems.map((role) => (
                    <tr key={role.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(role.id)}
                          onChange={(e) => handleSelectItem(role.id, e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {role.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {role.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.map((permission) => (
                            <span
                              key={permission}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {role.creationTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDelete(role)}
                            className="text-red-600 hover:text-red-900"
                            title="删除"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleViewDetails(role)}
                            className="text-blue-600 hover:text-blue-900"
                            title="查看"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(role)}
                            className="text-green-600 hover:text-green-900"
                            title="编辑"
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
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === pageNum
                          ? 'bg-pink-500 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {totalPages > 5 && (
                  <>
                    <span className="text-gray-500">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === totalPages
                          ? 'bg-pink-500 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
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
                        {Object.entries(groupedPermissions).map(([category, perms]) => (
                          <div key={category}>
                            <h5 className="text-xs font-medium text-gray-600 mb-1">{category}</h5>
                            {perms.map((permission) => (
                              <label key={permission.id} className="flex items-center ml-2">
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
