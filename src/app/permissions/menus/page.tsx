'use client';

import React, { useState } from 'react';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { FiSearch, FiFilter, FiEye, FiEdit, FiTrash2, FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface MenuItem {
  id: string;
  name: string;
  route: string;
  code: string;
  type: string;
  creationTime: string;
}

const menuItems: MenuItem[] = [
  { id: '010', name: '数据大屏', route: '/dashboard', code: 'view_dashboard', type: '页面', creationTime: '2025.08.12, 12:30' },
  { id: '020', name: '用户', route: '/user', code: 'view_user', type: '页面', creationTime: '2025.08.12, 12:30' },
  { id: '021', name: '编辑用户', route: '/user/edit', code: 'edit_user', type: '按钮, 页面', creationTime: '2025.08.12, 12:30' },
  { id: '022', name: '删除用户', route: '/user/delete', code: 'delete_user', type: '按钮', creationTime: '2025.08.12, 12:30' },
  { id: '030', name: '内容管理', route: '/content', code: 'view_content', type: '页面', creationTime: '2025.08.12, 12:30' },
  { id: '031', name: '编辑内容', route: '/content/edit', code: 'edit_content', type: '按钮, 页面', creationTime: '2025.08.12, 12:30' },
  { id: '032', name: '删除内容', route: '/content/delete', code: 'delete_content', type: '按钮', creationTime: '2025.08.12, 12:30' },
  { id: '040', name: 'AI列表', route: '/ai', code: 'view_ai', type: '页面', creationTime: '2025.08.12, 12:30' },
  { id: '041', name: '编辑AI列表', route: '/ai/edit', code: 'edit_ai', type: '按钮, 页面', creationTime: '2025.08.12, 12:30' },
  { id: '042', name: '删除AI列表', route: '/ai/delete', code: 'delete_ai', type: '按钮', creationTime: '2025.08.12, 12:30' },
];

export default function MenuManagementPage() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleViewDetails = (item: MenuItem) => {
    // Navigate to view page
    window.location.href = `/permissions/menus/${item.id}?mode=view`;
  };

  const handleEdit = (item: MenuItem) => {
    // Navigate to edit page
    window.location.href = `/permissions/menus/${item.id}?mode=edit`;
  };

  const handleDelete = (item: MenuItem) => {
    if (confirm(`确定要删除菜单项 "${item.name}" 吗？`)) {
      // In a real app, this would call an API to delete the item
      console.log('Deleting item:', item);
      // Remove from local state for demo
      const updatedItems = menuItems.filter(i => i.id !== item.id);
      // In real app, you would update the state here
      alert('删除成功！');
    }
  };

  return (
    <ProtectedRoute>
      <CMSLayout>
        <div className="space-y-4">
          {/* Page header */}
          <div className="flex flex-row gap-3">
            <h1 className="text-xl font-bold text-gray-900">菜单列表</h1>
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

              <button className="bg-[#8C7E9C] hover:bg-[#7A6B8A] text-white px-4 py-2 rounded-md text-sm font-medium hover:from-pink-600 hover:to-purple-700">
                新增
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
                      路由
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      类型
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
                  {currentItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.route}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.creationTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDelete(item)}
                            className="text-red-600 hover:text-red-900"
                            title="删除"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleViewDetails(item)}
                            className="text-blue-600 hover:text-blue-900"
                            title="查看"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
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


        </div>
      </CMSLayout>
    </ProtectedRoute>
  );
}
