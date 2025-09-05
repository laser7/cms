'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiFilter, FiEye, FiEdit, FiTrash2, FiChevronDown, FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import CreateMediaModal from '@/components/CreateMediaModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import Toast from '@/components/Toast';
import Image from 'next/image';
import { getMediaList, createMedia, updateMedia, deleteMedia } from '@/lib/media-api';
import type { MediaItem, CreateMediaData, UpdateMediaData } from '@/types';

export default function MediaPage() {
  const router = useRouter();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [pageType, setPageType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingMedia, setDeletingMedia] = useState<MediaItem | null>(null);

  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  // Load media data
  const loadMedia = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getMediaList({
        page: currentPage,
        page_size: pageSize,
        search: searchTerm,
        page_type: pageType
      });
      
      if (result.success && result.data) {
        setMedia(result.data.list)
        setTotal(result.data.total)
      } else {
        console.error("Failed to load media:", result.error)
        setMedia([])
      }
    } catch (error) {
      console.error('Error loading media:', error);
      setMedia([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchTerm, pageType]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(media.map(m => m.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const filteredMedia = media?.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.page.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewMedia = (id: number) => {
    router.push(`/media/${id}?mode=view`);
  };

  const handleEditMedia = (mediaItem: MediaItem) => {
    router.push(`/media/${mediaItem.id}?mode=edit`);
  };

  const handleDeleteMedia = (mediaItem: MediaItem) => {
    setDeletingMedia(mediaItem);
    setIsDeleteModalOpen(true);
  };

  const handleCreateMedia = () => {
    setIsCreateModalOpen(true);
  };

  const handleSubmitMedia = async (data: CreateMediaData | UpdateMediaData) => {
    try {
      let result;
      
      // Only handle create media here since edit is now on detail page
      result = await createMedia(data as CreateMediaData);
      
      if (result.success) {
        setIsCreateModalOpen(false)
        loadMedia() // Reload the list

        setToast({
          message: "媒体创建成功",
          type: "success",
          isVisible: true,
        })

        return result.data?.id || null // Return the created media ID
      } else {
        setToast({
          message: '操作失败: ' + result.error,
          type: 'error',
          isVisible: true
        });
        return null;
      }
    } catch (error) {
      console.error('Error submitting media:', error);
      setToast({
        message: '操作失败',
        type: 'error',
        isVisible: true
      });
      return null;
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingMedia) return;
    
    try {
      const result = await deleteMedia(deletingMedia.id);
      
      if (result.success) {
        setIsDeleteModalOpen(false);
        setDeletingMedia(null);
        loadMedia(); // Reload the list
        
        setToast({
          message: '媒体删除成功',
          type: 'success',
          isVisible: true
        });
      } else {
        setToast({
          message: '删除失败: ' + result.error,
          type: 'error',
          isVisible: true
        });
      }
    } catch (error) {
      console.error('Error deleting media:', error);
      setToast({
        message: '删除失败',
        type: 'error',
        isVisible: true
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <ProtectedRoute>
      <CMSLayout>
        <div className="space-y-4">
          {/* Page header */}
          <div className="flex flex-row gap-3">
            <h1 className="text-xl font-bold text-gray-900">媒体列表</h1>
            <p className="mt-1 text-sm text-gray-500">
              管理系统中的所有媒体文件和图片
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
                      checked={selectedRows.size === media?.length && media?.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-[#8C7E9C] focus:ring-[#8C7E9C]"
                    />
                    <button className="text-sm text-gray-600 hover:text-gray-900">
                      选择列
                    </button>
                  </div>
                  
                  {/* Page type filter */}
                  <select
                    value={pageType}
                    onChange={(e) => setPageType(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-3 py-1"
                  >
                    <option value="">所有页面</option>
                    <option value="explore">explore</option>
                    <option value="daily">daily</option>
                    <option value="Profile">Profile</option>
                    <option value="other">other</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="搜索媒体..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#8C7E9C] focus:border-transparent"
                    />
                  </div>
                  <button 
                    onClick={handleCreateMedia}
                    className="bg-[#8C7E9C] hover:bg-[#7A6B8A] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    <FiPlus size={16} />
                    <span>新增</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Media Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="text-gray-500">加载中...</div>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        名称
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        页面
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        图片
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
                    {filteredMedia?.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          暂无媒体数据
                        </td>
                      </tr>
                    ) : (
                      filteredMedia?.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.page}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-1">
                              {item.images && item.images.length > 0 ? (
                                <>
                                  {item.images.slice(0, 4).map((imageUrl, index) => (
                                    <div key={index} className="relative">
                                      <Image
                                        src={imageUrl}
                                        alt={`Image ${index + 1}`}
                                        width={60}
                                        height={60}
                                        className="rounded-md object-cover"
                                      />
                                    </div>
                                  ))}
                                  {item.images.length > 4 && (
                                    <div className="flex items-center justify-center w-[60px] h-[60px] bg-gray-100 rounded-md text-xs text-gray-500">
                                      +{item.images.length - 4}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="flex items-center justify-center w-[60px] h-[60px] bg-gray-100 rounded-md text-xs text-gray-500">
                                  无图片
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(item.created_at).toLocaleDateString('zh-CN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => handleViewMedia(item.id)}
                                className="text-gray-400 hover:text-gray-600 p-1"
                                title="查看"
                              >
                                <FiEye size={16} />
                              </button>
                              <button
                                onClick={() => handleEditMedia(item)}
                                className="text-green-600 hover:text-green-900"
                                title="编辑"
                              >
                                <FiEdit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteMedia(item)}
                                className="text-red-400 hover:text-red-600 p-1"
                                title="删除"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Pagination */}
          {total > 0 && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ←
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    if (totalPages <= 5) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 text-sm font-medium rounded ${
                            currentPage === page
                              ? 'text-white bg-[#8C7E9C]'
                              : 'text-gray-700 hover:text-gray-900'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    return null;
                  })}
                  
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    →
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">显示</span>
                  <select 
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value={10}>10行</option>
                    <option value={20}>20行</option>
                    <option value={50}>50行</option>
                  </select>
                  <span className="text-sm text-gray-700">
                    共 {total} 条记录
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <CreateMediaModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={async (data) => {
            const result = await handleSubmitMedia(data);
            return result || null;
          }}
          mode="create"
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingMedia(null);
          }}
          onConfirm={handleConfirmDelete}
          title="删除媒体"
          message="您确定要删除这个媒体项吗？此操作无法撤销。"
          itemName={deletingMedia?.name || ''}
        />

        {/* Toast Notifications */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
        />
      </CMSLayout>
    </ProtectedRoute>
  );
} 