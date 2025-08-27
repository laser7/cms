'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiTrash2, FiEye, FiEdit3, FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getUsersList, deleteUser, User, UsersListParams } from '@/lib/users-api';

// Default query parameters
const defaultParams: UsersListParams = {
  page: 1,
  page_size: 10,
  search: '',
  status: ''
};

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [queryParams, setQueryParams] = useState<UsersListParams>(defaultParams);
  const [totalUsers, setTotalUsers] = useState(0);

  // Fetch users from API
  const fetchUsers = async (params: UsersListParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getUsersList(params);
      
      if (response.code === 0) {
        setUsers(response.data.users);
        setTotalUsers(response.data.total);
      } else {
        setError(response.msg || 'Failed to fetch users');
        setUsers([]);
        setTotalUsers(0);
      }
    } catch (err) {
      setError('Network error occurred');
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount and when query params change
  useEffect(() => {
    fetchUsers(queryParams);
  }, [queryParams]);



  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(users?.map(u => u.id) || []));
    } else {
      setSelectedRows(new Set());
    }
  };



  // Debounced search to avoid too many API calls
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (searchTerm: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setQueryParams(prev => ({
            ...prev,
            search: searchTerm,
            page: 1 // Reset to first page when searching
          }));
        }, 500); // Wait 500ms after user stops typing
      };
    })(),
    []
  );

  // Handle search input change
  const handleSearchInputChange = (searchTerm: string) => {
    debouncedSearch(searchTerm);
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setQueryParams(prev => ({
      ...prev,
      status: status,
      page: 1 // Reset to first page when filtering
    }));
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setQueryParams(prev => ({
      ...prev,
      page: page
    }));
  };

  // Handle page size change
  const handlePageSizeChange = (pageSize: number) => {
    setQueryParams(prev => ({
      ...prev,
      page_size: pageSize,
      page: 1 // Reset to first page when changing page size
    }));
  };

  const handleViewUser = (id: number) => {
    router.push(`/users/${id}?mode=view`);
  };

  const handleEditUser = (id: number) => {
    router.push(`/users/${id}?mode=edit`);
  };

  const handleDeleteUser = async (id: number, name: string) => {
    if (confirm(`确定要删除用户 "${name}" 吗？此操作不可撤销。`)) {
      try {
        const response = await deleteUser(id);
        
        if (response.code === 0) {
          alert('用户删除成功！');
          // Refresh the users list
          fetchUsers(queryParams);
        } else {
          alert(`删除失败: ${response.msg}`);
        }
      } catch (err) {
        alert('删除用户时发生错误');
      }
    }
  };

  return (
    <ProtectedRoute>
      <CMSLayout>
        <div className="space-y-4">
          {/* Page header */}
          <div className="flex flex-row gap-3">
            <h1 className="text-2xl font-bold text-gray-900">用户列表</h1>
            <p className="mt-2 text-sm text-gray-500">
              管理系统中的所有用户账户
            </p>
          </div>

          {/* Controls */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === (users?.length || 0)}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-[#8C7E9C] focus:ring-[#8C7E9C]"
                    />
                
                  </div>
                  <button className="text-sm text-gray-600 hover:text-gray-900">
                    选择列
                  </button>
                  <button className="text-sm text-gray-600 hover:text-gray-900">
                    ↕️
                  </button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="搜索列表..."
                      value={queryParams.search || ''}
                      onChange={(e) => handleSearchInputChange(e.target.value)}
                      className="w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#8C7E9C] focus:border-transparent"
                    />
                  </div>
                  <select
                    value={queryParams.status || ''}
                    onChange={(e) => handleStatusFilter(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8C7E9C] focus:border-transparent"
                  >
                    <option value="">所有状态</option>
                    <option value="active">活跃</option>
                    <option value="inactive">非活跃</option>
                  </select>
                  <button className="bg-[#8C7E9C] hover:bg-[#220646] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2">
                    <FiPlus size={16} />
                    <span>新增</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                显示 {((queryParams.page || 1) - 1) * (queryParams.page_size || 10) + 1} - {Math.min((queryParams.page || 1) * (queryParams.page_size || 10), totalUsers)} 条，共 {totalUsers} 条记录
              </div>
              <div className="text-sm text-gray-600">
                第 {queryParams.page || 1} 页，共 {Math.ceil(totalUsers / (queryParams.page_size || 10))} 页
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      姓名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      联系方式
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      出生数据
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
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        加载中...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-red-500">
                        {error}
                      </td>
                    </tr>
                  ) : users?.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        暂无数据
                      </td>
                    </tr>
                  ) : (
                    users?.map((user: User) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.contact}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                        {user.birth_data}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.created_at}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                            title="删除用户"
                          >
                            <FiTrash2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleViewUser(user.id)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                            title="查看用户"
                          >
                            <FiEye size={16} />
                          </button>
                          <button 
                            onClick={() => handleEditUser(user.id)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                            title="编辑用户"
                          >
                            <FiEdit3 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handlePageChange(Math.max(1, queryParams.page! - 1))}
                  disabled={queryParams.page === 1}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ←
                </button>
                
                {/* Generate page numbers */}
                {(() => {
                  const totalPages = Math.ceil(totalUsers / (queryParams.page_size || 10));
                  const currentPage = queryParams.page || 1;
                  const pages = [];
                  
                  // Show first page
                  if (currentPage > 1) {
                    pages.push(
                      <button
                        key={1}
                        onClick={() => handlePageChange(1)}
                        className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        1
                      </button>
                    );
                  }
                  
                  // Show ellipsis if needed
                  if (currentPage > 3) {
                    pages.push(
                      <span key="ellipsis1" className="text-gray-500">...</span>
                    );
                  }
                  
                  // Show current page and neighbors
                  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                    if (i === currentPage) {
                      pages.push(
                        <button
                          key={i}
                          className="px-3 py-1 text-sm font-medium text-white bg-pink-500 rounded"
                        >
                          {i}
                        </button>
                      );
                    } else {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => handlePageChange(i)}
                          className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                          {i}
                        </button>
                      );
                    }
                  }
                  
                  // Show ellipsis if needed
                  if (currentPage < totalPages - 2) {
                    pages.push(
                      <span key="ellipsis2" className="text-gray-500">...</span>
                    );
                  }
                  
                  // Show last page
                  if (currentPage < totalPages && totalPages > 1) {
                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        {totalPages}
                      </button>
                    );
                  }
                  
                  return pages;
                })()}
                
                <button 
                  onClick={() => handlePageChange(queryParams.page! + 1)}
                  disabled={queryParams.page! >= Math.ceil(totalUsers / (queryParams.page_size || 10))}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  →
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">显示</span>
                <select 
                  value={queryParams.page_size || 10}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value={10}>10行</option>
                  <option value={20}>20行</option>
                  <option value={50}>50行</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </CMSLayout>
    </ProtectedRoute>
  );
} 