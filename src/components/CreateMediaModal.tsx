'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiUpload, FiTrash2 } from 'react-icons/fi';
import Image from 'next/image';
import Toast from '@/components/Toast';
import type { MediaItem, CreateMediaData, UpdateMediaData, MediaImage } from '@/types';

interface CreateMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMediaData | UpdateMediaData) => Promise<number | null>;
  media?: MediaItem | null;
  mode: 'create' | 'edit';
}

export default function CreateMediaModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  media, 
  mode 
}: CreateMediaModalProps) {
  const [formData, setFormData] = useState<CreateMediaData>({
    name: '',
    page: '',
    raw_api: '',
    images: []
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [createdMediaId, setCreatedMediaId] = useState<number | null>(null);

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

  useEffect(() => {
    if (media && mode === 'edit') {
      setFormData({
        name: media.name,
        page: media.page,
        raw_api: media.raw_api || '',
        images: [] // We'll populate this with image IDs when editing
      });
      setCreatedMediaId(media.id);
    } else {
      setFormData({
        name: '',
        page: '',
        raw_api: '',
        images: []
      });
      setUploadedFiles([]);
      setCreatedMediaId(null);
    }
  }, [media, mode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setUploadedFiles(prev => [...prev, file]);
  };

  const removeFile = (fileIndex: number) => {
    setUploadedFiles(prev => prev.filter((_, index) => index !== fileIndex));
  };

  const uploadFilesForMedia = async (mediaId: number) => {
    if (uploadedFiles.length === 0) return;
    
    console.log('Starting upload for media ID:', mediaId);
    setIsUploading(true);
    
    try {
      const { uploadImage } = await import('@/lib/media-api');
      
      // Add a delay to ensure media creation is fully committed to database
      console.log('Waiting for media creation to commit...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Proceeding with image upload...');
      
      for (const file of uploadedFiles) {
        console.log('Uploading file:', file.name, 'for media ID:', mediaId);
        const result = await uploadImage(file);
        if (!result.success) {
          console.error('Failed to upload file:', file.name, result.error);
          setToast({
            message: `上传文件 ${file.name} 失败: ${result.error}`,
            type: 'error',
            isVisible: true
          });
        } else {
          console.log('Successfully uploaded:', file.name);
        }
      }
      
      // Clear uploaded files after upload attempt
      setUploadedFiles([]);
      
      setToast({
        message: '图片上传完成！',
        type: 'success',
        isVisible: true
      });
      
    } catch (error) {
      console.error('Error uploading files:', error);
      setToast({
        message: '上传过程中发生错误',
        type: 'error',
        isVisible: true
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.page.trim()) {
      setToast({
        message: 'Please fill in all required fields',
        type: 'error',
        isVisible: true
      });
      return;
    }
    
    const submitData = {
      name: formData.name.trim(),
      page: formData.page.trim(),
      raw_api: formData.raw_api?.trim() || undefined,
      images: formData.images // Include the uploaded image IDs
    };
    
    try {
      // Submit the media with images
      const result = await onSubmit(submitData);
      
      if (result) {
        // If we have files to upload and we got a media ID, upload them
        if (mode === 'create' && uploadedFiles.length > 0) {
          await uploadFilesForMedia(result);
        }
        
        // Close the modal after successful creation
        onClose();
      } else {
        setToast({
          message: '创建媒体失败，请重试',
          type: 'error',
          isVisible: true
        });
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setToast({
        message: '提交失败，请重试',
        type: 'error',
        isVisible: true
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? '创建媒体' : '编辑媒体'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C7E9C] focus:border-transparent"
              placeholder="输入媒体名称"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              页面 <span className="text-red-500">*</span>
            </label>
            <select
              name="page"
              value={formData.page}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C7E9C] focus:border-transparent"
              required
            >
              <option value="">选择页面</option>
              <option value="explore">explore</option>
              <option value="daily">daily</option>
              <option value="Profile">Profile</option>
              <option value="other">other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Raw API
            </label>
            <input
              type="text"
              name="raw_api"
              value={formData.raw_api}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C7E9C] focus:border-transparent"
              placeholder="例如: /api/v1/daily"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择图片
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="image-upload"
                disabled={isUploading}
                multiple
              />
              <label
                htmlFor="image-upload"
                className={`inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white cursor-pointer ${
                  isUploading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#8C7E9C] hover:bg-[#7A6B8A]'
                }`}
              >
                <FiUpload className="mr-2" size={14} />
                {isUploading ? '上传中...' : '选择图片'}
              </label>
              <p className="text-sm text-gray-500 mt-2">
                {mode === 'create' 
                  ? '图片将在创建媒体后自动上传并关联' 
                  : '选择要上传的图片'
                }
              </p>
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                已选择的图片 ({uploadedFiles.length})
              </label>
              <div className="grid grid-cols-2 gap-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl text-gray-400 mb-2">📁</div>
                        <div className="text-xs text-gray-600 truncate">{file.name}</div>
                        <div className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#8C7E9C] border border-transparent rounded-md hover:bg-[#7A6B8A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8C7E9C]"
            >
              {mode === 'create' ? '创建' : '更新'}
            </button>
          </div>
        </form>
        {/* Toast Notifications */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
        />
      </div>
    </div>
  );
}
