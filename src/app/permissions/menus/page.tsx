'use client';

import React, { useState, useEffect, useCallback } from 'react';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { FiSearch, FiFilter, FiEye, FiEdit, FiTrash2, FiChevronDown, FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi';
import { getMenuList, deleteMenu, type MenuItem, type MenuListParams } from '@/lib/menu-api';
import Toast from '@/components/Toast';
import CreateMenuModal from '@/components/CreateMenuModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<MenuItem | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Load menu data
  const loadMenuData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: MenuListParams = {
        page: currentPage,
        page_size: itemsPerPage,
        search: searchTerm || undefined,
        type: selectedType || undefined
      };

      const result = await getMenuList(params);
      
      if (result.success && result.data) {
        setMenuItems(result.data.list);
        setTotalItems(result.data.total);
      } else {
        setToast({
          message: result.error || '获取菜单列表失败',
          type: 'error',
          isVisible: true
        });
      }
    } catch (error) {
      console.error('Error loading menu data:', error);
      setToast({
        message: '加载菜单数据失败',
        type: 'error',
        isVisible: true
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, selectedType]);

  // Load data on component mount and when dependencies change
  useEffect(() => {
    loadMenuData();
  }, [loadMenuData]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(menuItems?.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: number, checked: boolean) => {
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
    setMenuToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!menuToDelete) return;

    try {
      const result = await deleteMenu(menuToDelete.id);
      
      if (result.success) {
        setToast({
          message: '删除成功！',
          type: 'success',
          isVisible: true
        });
        // Reload data
        loadMenuData();
      } else {
        setToast({
          message: result.error || '删除失败',
          type: 'error',
          isVisible: true
        });
      }
    } catch (error) {
      console.error('Error deleting menu:', error);
      setToast({
        message: '删除失败',
        type: 'error',
        isVisible: true
      });
    } finally {
      setMenuToDelete(undefined);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    loadMenuData();
  };

  const handleTypeFilter = (type: string) => {
    setSelectedType(type === selectedType ? '' : type);
    setCurrentPage(1);
  };

  const handleCreateNew = () => {
    // Open create modal
    setIsCreateModalOpen(true);
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
  };

  const handleModalSuccess = () => {
    // Reload data after successful create/edit
    loadMenuData();
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
                  <select
                    className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={selectedType}
                    onChange={(e) => handleTypeFilter(e.target.value)}
                  >
                    <option value="">所有类型</option>
                    <option value="页面">页面</option>
                    <option value="按钮">按钮</option>
                    <option value="菜单">菜单</option>
                  </select>
                  <FiChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                  <FiSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索菜单..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                  />
                </div>
              </div>

              <button
                onClick={handleCreateNew}
                className="bg-[#8C7E9C] hover:bg-[#7A6B8A] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
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
                        checked={
                          selectedItems.length === menuItems?.length &&
                          menuItems?.length > 0
                        }
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
                      顶级菜单
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      父菜单
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
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={10}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        加载中...
                      </td>
                    </tr>
                  ) : menuItems?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={10}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        暂无数据
                      </td>
                    </tr>
                  ) : (
                    menuItems?.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={(e) =>
                              handleSelectItem(item.id, e.target.checked)
                            }
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
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              item.is_top_level
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {item.is_top_level ? "是" : "否"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.parent_name || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(item.created_at).toLocaleString("zh-CN")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleDelete(item)}
                              className="text-red-500 hover:text-red-900"
                              title="删除"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleViewDetails(item)}
                              className="text-gray-400 hover:text-blue-900"
                              title="查看"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-gray-400 hover:text-green-900"
                              title="编辑"
                            >
                              <FiEdit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
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
                <span className="text-sm text-gray-700">
                  共 {totalItems} 条记录
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === pageNum
                          ? "bg-[#8C7E9C] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                {totalPages > 5 && (
                  <>
                    <span className="text-gray-500">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === totalPages
                          ? "bg-[#8C7E9C] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Toast notification */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
        />

        {/* Create/Edit Menu Modal */}
        <CreateMenuModal
          isOpen={isCreateModalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
          mode="create"
          menu={undefined}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="删除菜单"
          message="确定要删除这个菜单项吗？此操作无法撤销。"
          itemName={menuToDelete?.name || ""}
        />
      </CMSLayout>
    </ProtectedRoute>
  )
}
