'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Image from 'next/image';
import { FiX } from 'react-icons/fi';

interface MediaItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  rawApi: string;
  images: string[];
}

// Mock data based on the image
const mockMediaItem: MediaItem = {
  id: '01',
  createdAt: '2025.08.11, 12:00',
  updatedAt: '2025.08.12, 16:00',
  rawApi: '/api/v1/daily',
  images: [
    '/api/placeholder/200/150',
    '/api/placeholder/200/150',
    '/api/placeholder/200/150',
    '/api/placeholder/200/150'
  ]
};

export default function MediaDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get('mode') || 'view'; // 'view' or 'edit'
  
  const [mediaItem, setMediaItem] = useState<MediaItem>(mockMediaItem);
  const [formData, setFormData] = useState<MediaItem>(mockMediaItem);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Simulate loading media data
    const loadMediaItem = async () => {
      setIsLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setMediaItem(mockMediaItem);
      setFormData(mockMediaItem);
      setIsLoading(false);
    };

    loadMediaItem();
  }, [params.id]);

  const handleInputChange = (field: keyof MediaItem, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update the media item with new data
    setMediaItem(formData);
    setIsSaving(false);
    
    // Switch back to view mode
    router.push(`/media/${params.id}?mode=view`);
  };

  const handleCancel = () => {
    // Reset form data to original media item
    setFormData(mediaItem);
    // Switch back to view mode
    router.push(`/media/${params.id}?mode=view`);
  };

  const handleEdit = () => {
    router.push(`/media/${params.id}?mode=edit`);
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

  return (
    <ProtectedRoute>
      <CMSLayout>
        <div className="space-y-6">
          {/* Page header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {mode === 'edit' ? '编辑媒体' : '媒体详情'}
              </h1>
              <p className="mt-1 text-xs text-gray-500">
                {mode === 'edit' ? '编辑媒体文件信息' : '查看媒体文件详情'}
              </p>
            </div>
            {mode === 'view' && (
              <button
                onClick={handleEdit}
                className="bg-[#8C7E9C] hover:bg-[#220646] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                编辑媒体
              </button>
            )}
          </div>

          {/* Basic Information Card */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base leading-6 font-medium text-gray-900 mb-4">
                基本信息
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Id:</span>
                  <span className="text-gray-900">{mediaItem.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">创建时间:</span>
                  <span className="text-gray-900">{mediaItem.createdAt}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">上次更新:</span>
                  <span className="text-gray-900">{mediaItem.updatedAt}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Raw API:</span>
                  <input
                    type="text"
                    value={formData.rawApi}
                    onChange={(e) => handleInputChange('rawApi', e.target.value)}
                    disabled={mode === 'view'}
                                         className={`text-right border-none bg-transparent focus:outline-none focus:ring-0 ${
                       mode === 'view' ? 'text-gray-900' : 'text-gray-900 border-b border-gray-300 focus:border-[#8C7E9C]'
                     }`}
                    placeholder="输入API端点..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Image Management Card */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base leading-6 font-medium text-gray-900 mb-4">
                图片管理
              </h3>
              <div className="flex flex-wrap gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <div className="w-48 h-32 bg-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`Image ${index + 1}`}
                        width={192}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {mode === 'edit' && (
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <FiX size={14} />
                      </button>
                    )}
                  </div>
                ))}
                {mode === 'edit' && (
                                     <div className="w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-[#8C7E9C] transition-colors cursor-pointer">
                    <div className="text-center">
                      <div className="text-2xl text-gray-400 mb-2">+</div>
                      <div className="text-sm text-gray-500">添加图片</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons - Only show in edit mode */}
          {mode === 'edit' && (
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-pink-300 text-pink-700 bg-white hover:bg-pink-50 rounded-md text-sm font-medium transition-colors"
              >
                取消更新
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white rounded-md text-sm font-medium transition-colors"
              >
                {isSaving ? '保存中...' : '更新'}
              </button>
            </div>
          )}
        </div>
      </CMSLayout>
    </ProtectedRoute>
  );
}
