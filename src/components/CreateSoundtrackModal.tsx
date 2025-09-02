'use client';

import React, { useState } from 'react';
import { FiX, FiUpload, FiMusic } from 'react-icons/fi';
import { createSoundtrack } from '@/lib/audio-api';

interface CreateSoundtrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface SoundtrackFormData {
  title: string;
  composer: string;
  category: string;
  cover: string;
  url: string;
}

export default function CreateSoundtrackModal({ isOpen, onClose, onSuccess }: CreateSoundtrackModalProps) {
  const [formData, setFormData] = useState<SoundtrackFormData>({
    title: '',
    composer: '',
    category: '',
    cover: '',
    url: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim()) return '请输入音频标题';
    if (!formData.composer.trim()) return '请输入作曲家';
    if (!formData.category.trim()) return '请选择分类';
    if (!formData.url.trim()) return '请输入音频链接';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await createSoundtrack({
        ...formData,
        updated_at: new Date().toISOString()
      });
      
      if (response.code === 0 && response.data) {
        // Success
        resetForm();
        onSuccess();
        onClose();
      } else {
        setError(response.msg || '创建失败');
      }
    } catch (err) {
      console.error('Error creating soundtrack:', err);
      setError('创建音频时发生错误');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      composer: '',
      category: '',
      cover: '',
      url: ''
    });
    setError(null);
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FiMusic className="text-[#220646] text-xl" />
            <h2 className="text-lg font-semibold text-gray-900">创建新音频</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              音频标题 *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#220646] focus:border-transparent"
              placeholder="请输入音频标题"
              required
            />
          </div>

          {/* Composer */}
          <div>
            <label htmlFor="composer" className="block text-sm font-medium text-gray-700 mb-1">
              作曲家 *
            </label>
            <input
              type="text"
              id="composer"
              name="composer"
              value={formData.composer}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#220646] focus:border-transparent"
              placeholder="请输入作曲家姓名"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              分类 *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#220646] focus:border-transparent"
              required
            >
              <option value="">请选择分类</option>
              <option value="focus">Focus</option>
              <option value="calm">Calm</option>
              <option value="relax">Relax</option>
              <option value="测试分类">测试音频</option>
            </select>
          </div>

          {/* Cover URL */}
          <div>
            <label htmlFor="cover" className="block text-sm font-medium text-gray-700 mb-1">
              封面图片链接
            </label>
            <input
              type="url"
              id="cover"
              name="cover"
              value={formData.cover}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#220646] focus:border-transparent"
              placeholder="https://example.com/cover.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">可选，留空将显示默认封面</p>
          </div>

          {/* Audio URL */}
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              音频链接 *
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#220646] focus:border-transparent"
              placeholder="https://example.com/audio.mp3"
              required
            />
            <p className="text-xs text-gray-500 mt-1">支持 MP3, WAV, OGG, M4A, AAC, FLAC 格式</p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-[#220646] border border-transparent rounded-md hover:bg-[#8C7E9C] disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>创建中...</span>
                </>
              ) : (
                <>
                  <FiUpload size={16} />
                  <span>创建音频</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
