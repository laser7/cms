'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Image from 'next/image';

interface AudioFile {
  id: string;
  title: string;
  category: string;
  composer: string;
  url: string;
  cover: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data - in a real app this would come from an API
const mockAudio: AudioFile = {
  id: '09',
  title: 'Placeholder for an example soundtrack title',
  category: 'Focus',
  composer: 'Alicia Keys',
  url: 'https://www.haike.sound.cn/suhoiwe9w0e9ru0q3iu',
  cover: '/api/placeholder/200/150',
  createdAt: '2025.08.11, 12:00',
  updatedAt: '2025.08.12, 16:00'
};

export default function AudioDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get('mode') || 'view'; // 'view' or 'edit'
  
  const [audio, setAudio] = useState<AudioFile>(mockAudio);
  const [formData, setFormData] = useState<AudioFile>(mockAudio);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Simulate loading audio data
    const loadAudio = async () => {
      setIsLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setAudio(mockAudio);
      setFormData(mockAudio);
      setIsLoading(false);
    };

    loadAudio();
  }, [params.id]);

  const handleInputChange = (field: keyof AudioFile, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update the audio with new data
    setAudio(formData);
    setIsSaving(false);
    
    // Switch back to view mode
    router.push(`/posts/audio/${params.id}?mode=view`);
  };

  const handleCancel = () => {
    // Reset form data to original audio
    setFormData(audio);
    // Switch back to view mode
    router.push(`/posts/audio/${params.id}?mode=view`);
  };

  const handleEdit = () => {
    router.push(`/posts/audio/${params.id}?mode=edit`);
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
              <h1 className="text-2xl font-bold text-gray-900">
                {mode === 'edit' ? '编辑音频' : '音频信息'}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {mode === 'edit' ? '编辑音频文件信息' : '查看音频文件详情'}
              </p>
            </div>
            {mode === 'view' && (
              <button
                onClick={handleEdit}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                编辑音频
              </button>
            )}
          </div>

          {/* Audio Metadata Card */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                音频信息
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID
                  </label>
                  <input
                    type="text"
                    value={audio.id}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    创建时间
                  </label>
                  <input
                    type="text"
                    value={audio.createdAt}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    上次更新
                  </label>
                  <input
                    type="text"
                    value={audio.updatedAt}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Audio Details Card */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                音频详情
              </h3>
              
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    标题
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    disabled={mode === 'view'}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      mode === 'view' ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    }`}
                    placeholder="输入音频标题..."
                  />
                </div>

                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    封面
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
                      <Image
                        src={audio.cover}
                        alt="Audio cover"
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                    {mode === 'edit' && (
                      <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                        更换封面
                      </button>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    类别
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    disabled={mode === 'view'}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      mode === 'view' ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    }`}
                  >
                    <option value="Focus">Focus</option>
                    <option value="Relaxation">Relaxation</option>
                    <option value="Meditation">Meditation</option>
                    <option value="Workout">Workout</option>
                    <option value="Sleep">Sleep</option>
                  </select>
                </div>

                {/* Composer */}
                <div>
                  <label htmlFor="composer" className="block text-sm font-medium text-gray-700 mb-2">
                    作曲
                  </label>
                  <input
                    type="text"
                    id="composer"
                    value={formData.composer}
                    onChange={(e) => handleInputChange('composer', e.target.value)}
                    disabled={mode === 'view'}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      mode === 'view' ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    }`}
                    placeholder="输入作曲者姓名..."
                  />
                </div>

                {/* URL */}
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                    URL
                  </label>
                  <input
                    type="url"
                    id="url"
                    value={formData.url}
                    onChange={(e) => handleInputChange('url', e.target.value)}
                    disabled={mode === 'view'}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      mode === 'view' ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    }`}
                    placeholder="输入音频文件URL..."
                  />
                </div>
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
