'use client';

import React, { useState, useEffect, useCallback } from 'react';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiArrowLeft, FiSave, FiEdit, FiEye, FiChevronRight, FiFolder, FiFile, FiTrash2 } from 'react-icons/fi';
import { getMenuById, updateMenu, deleteMenu, type MenuItem, type UpdateMenuData } from '@/lib/menu-api';
import Toast from '@/components/Toast';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

export default function MenuDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'view';
  
  const [menu, setMenu] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load menu data
  const loadMenu = useCallback(async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const result = await getMenuById(parseInt(id));
      
      if (result.success && result.data) {
        setMenu(result.data);
      } else {
        setToast({
          message: result.error || '获取菜单信息失败',
          type: 'error',
          isVisible: true
        });
      }
    } catch (error) {
      console.error('Error loading menu:', error);
      setToast({
        message: '加载菜单数据失败',
        type: 'error',
        isVisible: true
      });
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // Load data on component mount
  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const handleSave = async () => {
    if (!menu) return;
    
    setIsSaving(true);
    try {
      const updateData: UpdateMenuData = {
        name: menu.name,
        code: menu.code,
        route: menu.route,
        type: menu.type,
        icon: menu.icon,
        is_top_level: menu.is_top_level,
        parent_id: menu.parent_id,
        sort: menu.sort,
        status: menu.status
      };

      const result = await updateMenu(menu.id, updateData);
      
      if (result.success) {
        setToast({
          message: '菜单更新成功！',
          type: 'success',
          isVisible: true
        });
        setIsEditing(false);
        // Reload data to get any server-side changes
        loadMenu();
      } else {
        setToast({
          message: result.error || '更新失败',
          type: 'error',
          isVisible: true
        });
      }
    } catch (error) {
      console.error('Error updating menu:', error);
      setToast({
        message: '更新失败，请重试',
        type: 'error',
        isVisible: true
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reload original data
    loadMenu();
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!menu) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteMenu(menu.id);
      
      if (result.success) {
        setToast({
          message: '菜单删除成功！',
          type: 'success',
          isVisible: true
        });
        // Redirect to menu list after successful deletion
        window.location.href = '/permissions/menus';
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
        message: '删除失败，请重试',
        type: 'error',
        isVisible: true
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleInputChange = (field: keyof MenuItem, value: any) => {
    if (!menu) return;
    setMenu(prev => prev ? { ...prev, [field]: value } : null);
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

  if (!menu) {
    return (
      <ProtectedRoute>
        <CMSLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">菜单不存在</div>
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
            <div className="flex items-center space-y-4 flex-col">
              <Link
                href="/permissions/menus"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiArrowLeft className="w-4 h-4" />
                <span className="text-sm">返回列表</span>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">
                {isEditing ? '编辑菜单' : '菜单详情'}
              </h1>
            </div>
          </div>

          {/* Menu Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4">
              <div className="space-y-4">
                {/* ID */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">ID:</span>
                  <span className="text-sm text-gray-900 bg-gray-50 px-3 py-1 rounded">{menu.id}</span>
                </div>
                
                {/* Name */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">名称:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={menu.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="text-sm text-gray-900 bg-white border border-gray-300 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 bg-gray-50 px-3 py-1 rounded">{menu.name}</span>
                  )}
                </div>
                
                {/* Code */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">代码:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={menu.code}
                      onChange={(e) => handleInputChange('code', e.target.value)}
                      className="text-sm text-gray-900 bg-white border border-gray-300 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 bg-gray-50 px-3 py-1 rounded">{menu.code}</span>
                  )}
                </div>
                
                {/* Route */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">路由:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={menu.route}
                      onChange={(e) => handleInputChange('route', e.target.value)}
                      className="text-sm text-gray-900 bg-white border border-gray-300 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 bg-gray-50 px-3 py-1 rounded">{menu.route}</span>
                  )}
                </div>
                
                {/* Type */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">类型:</span>
                  {isEditing ? (
                    <select
                      value={menu.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="text-sm text-gray-900 bg-white border border-gray-300 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="页面">页面</option>
                      <option value="按钮">按钮</option>
                      <option value="菜单">菜单</option>
                    </select>
                  ) : (
                    <span className="text-sm text-gray-900 bg-gray-50 px-3 py-1 rounded">{menu.type}</span>
                  )}
                </div>

                {/* Icon */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">图标:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={menu.icon}
                      onChange={(e) => handleInputChange('icon', e.target.value)}
                      className="text-sm text-gray-900 bg-white border border-gray-300 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 bg-gray-50 px-3 py-1 rounded">{menu.icon || '-'}</span>
                  )}
                </div>

                {/* Is Top Level */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">顶级菜单:</span>
                  {isEditing ? (
                    <select
                      value={menu.is_top_level ? 'true' : 'false'}
                      onChange={(e) => handleInputChange('is_top_level', e.target.value === 'true')}
                      className="text-sm text-gray-900 bg-white border border-gray-300 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="true">是</option>
                      <option value="false">否</option>
                    </select>
                  ) : (
                    <span className="text-sm text-gray-900 bg-gray-50 px-3 py-1 rounded">
                      {menu.is_top_level ? '是' : '否'}
                    </span>
                  )}
                </div>

                {/* Parent ID */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">父菜单ID:</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={menu.parent_id || ''}
                      onChange={(e) => handleInputChange('parent_id', e.target.value ? parseInt(e.target.value) : 0)}
                      className="text-sm text-gray-900 bg-white border border-gray-300 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="0"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 bg-gray-50 px-3 py-1 rounded">
                      {menu.parent_id || '-'}
                    </span>
                  )}
                </div>

                {/* Parent Name */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">父菜单名称:</span>
                  <span className="text-sm text-gray-900 bg-gray-50 px-3 py-1 rounded">
                    {menu.parent_name || '-'}
                  </span>
                </div>

                {/* Sort */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">排序:</span>
                  <span className="text-sm text-gray-900 bg-gray-50 px-3 py-1 rounded">{menu.sort}</span>
                </div>

                {/* Status */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">状态:</span>
                  <span className={`text-sm px-3 py-1 rounded ${
                    menu.status === 1 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {menu.status === 1 ? '启用' : '禁用'}
                  </span>
                </div>
                
                {/* Created At */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">创建时间:</span>
                  <span className="text-sm text-gray-900 bg-gray-50 px-3 py-1 rounded">
                    {new Date(menu.created_at).toLocaleString('zh-CN')}
                  </span>
                </div>
                
                {/* Updated At */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">更新时间:</span>
                  <span className="text-sm text-gray-900 bg-gray-50 px-3 py-1 rounded">
                    {new Date(menu.updated_at).toLocaleString('zh-CN')}
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="px-4 py-2 text-sm font-medium border-[#553C9A] text-[#553C9A] bg-white hover:bg-[#553C9A] hover:text-white rounded-md transition-colors disabled:opacity-50"
                    >
                      取消
                    </button>
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          保存中...
                        </>
                      ) : (
                        <>
                          <FiSave className="w-4 h-4" />
                          保存
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-md transition-colors flex items-center gap-2"
                  >
                    <FiEdit className="w-4 h-4" />
                    编辑
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-white hover:bg-red-50 rounded-md transition-colors flex items-center gap-2"
                >
                  <FiTrash2 className="w-4 h-4" />
                  删除
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
          onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="删除菜单"
          message="确定要删除这个菜单项吗？此操作无法撤销。"
          itemName={menu?.name || ''}
        />
      </CMSLayout>
    </ProtectedRoute>
  );
}
