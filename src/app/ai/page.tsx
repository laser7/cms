'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiTrash2, FiEye, FiEdit3, FiPlus, FiSearch, FiRefreshCw } from 'react-icons/fi';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getAIList, deleteAI } from '@/lib/ai-api';
import { AI, AIListParams } from '@/types';
import CreateAIModal from '@/components/CreateAIModal';
import Toast from '@/components/Toast';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

export default function AIPage() {
  const router = useRouter();
  const [aiFeatures, setAiFeatures] = useState<AI[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [pageFilter, setPageFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  const fetchAIFeatures = useCallback(async () => {
    setLoading(true);
    try {
      const params: AIListParams = {
        page: currentPage,
        page_size: pageSize,
        search: searchTerm,
        page_filter: pageFilter,
      };
      const response = await getAIList(params);
      if (response.code === 0 && response.data) {
        setAiFeatures(response.data.list);
        setTotal(response.data.total);
      } else {
        setError(response.error || 'Failed to fetch AI features');
      }
    } catch (err) {
      setError('Failed to fetch AI features');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchTerm, pageFilter]);

  useEffect(() => {
    fetchAIFeatures();
  }, [fetchAIFeatures]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(aiFeatures.map(a => a.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleDeleteAI = async (id: number) => {
    if (deleteLoading === id) return;
    setDeleteLoading(id);
    try {
      const result = await deleteAI(id);
      
      if (result.code === 0) {
        // Successfully deleted
        setAiFeatures(aiFeatures?.filter(a => a.id !== id));
        setTotal(total - 1);
        setToast({
          message: 'AI功能删除成功',
          type: 'success',
          isVisible: true
        });
      } else {
        setToast({
          message: result.error || '删除失败',
          type: 'error',
          isVisible: true
        });
      }
    } catch (err) {
      setToast({
        message: '删除AI功能时发生错误',
        type: 'error',
        isVisible: true
      });
      console.error(err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const confirmDeleteAI = (id: number) => {
    setShowDeleteConfirm(id);
  };

  const filteredAIFeatures = aiFeatures?.filter(feature =>
    feature.api.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feature.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    feature.page.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewAI = (id: number) => {
    router.push(`/ai/${id}?mode=view`);
  };

  const handleEditAI = (id: number) => {
    router.push(`/ai/${id}?mode=edit`);
  };

  return (
    <ProtectedRoute>
      <CMSLayout>
      <div className="space-y-4">
          {/* Page header */}
          <div className="flex flex-row gap-3">
            <h1 className="text-xl font-bold text-gray-900">AI 列表</h1>
            <p className="mt-1 text-sm text-gray-500">
              管理系统中的所有AI功能和配置
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">错误</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === aiFeatures.length}
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
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#8C7E9C] focus:border-transparent"
                    />
                  </div>
                  <select
                    value={pageFilter}
                    onChange={(e) => setPageFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#8C7E9C] focus:border-transparent"
                  >
                    <option value="">所有页面</option>
                    <option value="onboarding">onboarding</option>
                    <option value="daily">daily</option>
                    <option value="explore">explore</option>
                    <option value="chat">chat</option>
                    <option value="profile">profile</option>
                    <option value="natal">natal</option>
                    <option value="elements">elements</option>
                    <option value="number">number</option>
                    <option value="article">article</option>
                    <option value="dream">dream</option>
                  </select>
                  <button 
                    onClick={fetchAIFeatures}
                    className="text-gray-600 hover:text-gray-900 p-2"
                    title="刷新"
                  >
                    <FiRefreshCw size={20} />
                  </button>
                  <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-[#8C7E9C] hover:bg-[#220646] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    <FiPlus size={16} />
                    <span>新增</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Features Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      API
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      页面
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prompt
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
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-red-500">
                        {error}
                      </td>
                    </tr>
                  ) : filteredAIFeatures.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        No AI features found.
                      </td>
                    </tr>
                  ) : (
                    filteredAIFeatures.map((feature) => (
                      <tr key={feature.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {feature.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {feature.api}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {feature.page}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {feature.prompt}
                        </td>
                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                           {feature.created_at}
                         </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => confirmDeleteAI(feature.id)}
                              className="text-gray-400 hover:text-gray-600 p-1"
                              disabled={deleteLoading === feature.id}
                            >
                              {deleteLoading === feature.id ? (
                                <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <FiTrash2 size={16} />
                              )}
                            </button>
                            <button 
                              onClick={() => handleViewAI(feature.id)}
                              className="text-gray-400 hover:text-gray-600 p-1"
                            >
                              <FiEye size={16} />
                            </button>
                            <button 
                              onClick={() => handleEditAI(feature.id)}
                              className="text-gray-400 hover:text-gray-600 p-1"
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
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="text-gray-400 hover:text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  ←
                </button>
                <span className="text-sm text-gray-700">
                  第 {currentPage} 页，共 {Math.ceil(total / pageSize)} 页
                </span>
                <button 
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= Math.ceil(total / pageSize)}
                  className="text-gray-400 hover:text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  →
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">显示</span>
                <select 
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value={10}>10行</option>
                  <option value={20}>20行</option>
                  <option value={50}>50行</option>
                </select>
                <span className="text-sm text-gray-700">共 {total} 条记录</span>
              </div>
            </div>
          </div>
        </div>

        {/* Create AI Modal */}
        <CreateAIModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            fetchAIFeatures();
          }}
        />

        {/* Toast Notifications */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={showDeleteConfirm !== null}
          onClose={() => setShowDeleteConfirm(null)}
          onConfirm={() => {
            if (showDeleteConfirm) {
              handleDeleteAI(showDeleteConfirm);
              setShowDeleteConfirm(null);
            }
          }}
          title="确认删除"
          message="确定要删除这个AI功能吗？此操作无法撤销。"
          isLoading={deleteLoading !== null}
        />
      </CMSLayout>
    </ProtectedRoute>
  );
}
