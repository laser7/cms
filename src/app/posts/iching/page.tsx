'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiEye, FiEdit3, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getYijingContents, deleteYijingContent, YijingContent, YijingListParams } from '@/lib/yijing-api';

// Default query parameters
const defaultParams: YijingListParams = {
  page: 1,
  page_size: 10,
  search: ''
};

export default function IChingArticlesPage() {
  const router = useRouter();
  const [contents, setContents] = useState<YijingContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [queryParams, setQueryParams] = useState<YijingListParams>(defaultParams);
  const [totalContents, setTotalContents] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  // Fetch Yijing contents from API
  const fetchContents = async (params: YijingListParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getYijingContents(params);
      
      if (response.code === 0) {
        setContents(response.data.items);
        setTotalContents(response.data.total);
      } else {
        setError(response.msg || 'Failed to fetch Yijing contents');
        setContents([]);
        setTotalContents(0);
      }
    } catch (err) {
      setError('Network error occurred');
      setContents([]);
      setTotalContents(0);
    } finally {
      setLoading(false);
    }
  };

  // Load contents on component mount and when query params change
  useEffect(() => {
    fetchContents(queryParams);
  }, [queryParams]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(contents.map(c => c.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (contentId: number, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => new Set([...prev, contentId]));
    } else {
      setSelectedRows(prev => {
        const newSet = new Set(prev);
        newSet.delete(contentId);
        return newSet;
      });
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

  const handleViewContent = (id: number) => {
    router.push(`/posts/iching/${id}?mode=view`);
  };

  const handleEditContent = (id: number) => {
    router.push(`/posts/iching/${id}?mode=edit`);
  };

  const handleDeleteContent = async (id: number) => {
    setDeleteLoading(id);
    setError(null);
    
    try {
      const response = await deleteYijingContent(id);
      
      if (response.code === 0) {
        // Remove the deleted item from the list
        setContents(prev => prev.filter(content => content.id !== id));
        setTotalContents(prev => prev - 1);
        alert('文章删除成功！');
      } else {
        setError(response.msg || 'Failed to delete content');
        alert(`删除失败: ${response.msg}`);
      }
    } catch (err) {
      setError('Network error occurred while deleting');
      alert('删除文章时发生错误');
    } finally {
      setDeleteLoading(null);
    }
  };

  const confirmDelete = (id: number) => {
    const content = contents.find(c => c.id === id);
    const title = content?.title || `文章 ${id}`;
    
    if (confirm(`确定要删除文章 "${title}" 吗？此操作不可撤销。`)) {
      handleDeleteContent(id);
    }
  };



  return (
    <ProtectedRoute>
      <CMSLayout>
        <div className="space-y-4">
          {/* Page header */}
          <div className="flex flex-row gap-3">
            <h1 className="text-xl font-bold text-gray-900">易经文章列表</h1>
            <p className="mt-1 text-sm text-gray-500">
              管理易经相关的文章和内容
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
                      checked={selectedRows.size === (contents?.length || 0)}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
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
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">🔍</span>
                    </div>
                    <input
                      type="text"
                      placeholder="搜索列表..."
                      value={queryParams.search || ''}
                      onChange={(e) => handleSearchInputChange(e.target.value)}
                      className="w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <button className="text-sm text-gray-600 hover:text-gray-900">
                    ☰
                  </button>
                  <button className="bg-[#8C7E9C] hover:bg-[#7A6B8A] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    + 新增
                  </button>
                </div>
              </div>
            </div>
          </div>



          {/* Contents table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedRows.size === (contents?.length || 0)}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      图片
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      标题
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      内容
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
                  ) : contents?.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        暂无数据
                      </td>
                    </tr>
                  ) : (
                    contents?.map((content: YijingContent) => (
                      <tr key={content.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedRows.has(content.id)}
                            onChange={(e) => handleSelectRow(content.id, e.target.checked)}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {content.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
                            <img 
                              src={content.image} 
                              alt={content.title}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/api/placeholder/60/60';
                              }}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {content.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {content.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {content.created_at}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => confirmDelete(content.id)}
                              className="text-gray-400 hover:text-red-600 p-1"
                              title="删除内容"
                            >
                              <FiTrash2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleViewContent(content.id)}
                              className="text-gray-400 hover:text-gray-600 p-1"
                              title="查看内容"
                            >
                              <FiEye size={16} />
                            </button>
                            <button 
                              onClick={() => handleEditContent(content.id)}
                              className="text-gray-400 hover:text-gray-600 p-1"
                              title="编辑内容"
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
                {/* Previous button */}
                <button 
                  onClick={() => handlePageChange(Math.max(1, (queryParams.page || 1) - 1))}
                  disabled={(queryParams.page || 1) <= 1}
                  className={`px-3 py-1 text-sm font-medium rounded ${
                    (queryParams.page || 1) <= 1 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  ← 上一页
                </button>
                
                {/* Page numbers */}
                {(() => {
                  const totalPages = Math.ceil(totalContents / (queryParams.page_size || 10));
                  const currentPage = queryParams.page || 1;
                  const pages = [];
                  
                  // Always show first page
                  pages.push(
                    <button
                      key={1}
                      onClick={() => handlePageChange(1)}
                      className={`px-3 py-1 text-sm font-medium rounded ${
                        currentPage === 1
                          ? 'text-white bg-purple-600'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      1
                    </button>
                  );
                  
                  // Calculate range of pages to show
                  let startPage = Math.max(2, currentPage - 2);
                  let endPage = Math.min(totalPages - 1, currentPage + 2);
                  
                  // Adjust range if we're near the beginning
                  if (currentPage <= 4) {
                    endPage = Math.min(totalPages - 1, 5);
                  }
                  
                  // Adjust range if we're near the end
                  if (currentPage >= totalPages - 3) {
                    startPage = Math.max(2, totalPages - 4);
                  }
                  
                  // Add ellipsis after first page if needed
                  if (startPage > 2) {
                    pages.push(
                      <span key="ellipsis1" className="px-2 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  
                  // Add middle pages
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`px-3 py-1 text-sm font-medium rounded ${
                          currentPage === i
                            ? 'text-white bg-purple-600'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }
                  
                  // Add ellipsis before last page if needed
                  if (endPage < totalPages - 1) {
                    pages.push(
                      <span key="ellipsis2" className="px-2 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  
                  // Always show last page if there's more than one page
                  if (totalPages > 1) {
                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        className={`px-3 py-1 text-sm font-medium rounded ${
                          currentPage === totalPages
                            ? 'text-white bg-purple-600'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        {totalPages}
                      </button>
                    );
                  }
                  
                  return pages;
                })()}
                
                {/* Next button */}
                <button 
                  onClick={() => handlePageChange((queryParams.page || 1) + 1)}
                  disabled={(queryParams.page || 1) >= Math.ceil(totalContents / (queryParams.page_size || 10))}
                  className={`px-3 py-1 text-sm font-medium rounded ${
                    (queryParams.page || 1) >= Math.ceil(totalContents / (queryParams.page_size || 10))
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  下一页 →
                </button>
              </div>
              
              {/* Page info and size selector */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  共 {totalContents} 条记录，第 {queryParams.page || 1} / {Math.ceil(totalContents / (queryParams.page_size || 10))} 页
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">每页显示</span>
                  <select 
                    value={queryParams.page_size || 10}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-gray-700">条</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CMSLayout>


    </ProtectedRoute>
  );
}
