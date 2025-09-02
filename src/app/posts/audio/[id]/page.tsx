'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Image from 'next/image';
import { getSoundtrackById, updateSoundtrack, deleteSoundtrack } from '@/lib/audio-api';
import { Soundtrack } from '@/types';

export default function AudioDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get('mode') || 'view'; // 'view' or 'edit'
  
  const [soundtrack, setSoundtrack] = useState<Soundtrack | null>(null);
  const [formData, setFormData] = useState<Partial<Soundtrack>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch soundtrack data from API
  useEffect(() => {
    const fetchSoundtrack = async () => {
      if (!params.id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await getSoundtrackById(Number(params.id));
        
        if (result.code === 0 && result.data) {
          setSoundtrack(result.data);
          setFormData({
            title: result.data.title,
            composer: result.data.composer,
            category: result.data.category,
            cover: result.data.cover,
            url: result.data.url
          });
        } else {
          setError(result.error || '获取音频信息失败');
        }
      } catch (err) {
        console.error('Error fetching soundtrack:', err);
        setError('获取音频信息时发生错误');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSoundtrack();
  }, [params.id]);

  const handleInputChange = (field: keyof Soundtrack, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!soundtrack || !params.id) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      const result = await updateSoundtrack(Number(params.id), formData);
      
      if (result.code === 0 && result.data) {
        // Update local state with new data
        setSoundtrack(result.data);
        setFormData({
          title: result.data.title,
          composer: result.data.composer,
          category: result.data.category,
          cover: result.data.cover,
          url: result.data.url
        });
        
        // Switch back to view mode
        router.push(`/posts/audio/${params.id}?mode=view`);
      } else {
        setError(result.error || '更新失败');
      }
    } catch (err) {
      console.error('Error updating soundtrack:', err);
      setError('更新音频时发生错误');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (!soundtrack) return;
    
    // Reset form data to original soundtrack data
    setFormData({
      title: soundtrack.title,
      composer: soundtrack.composer,
      category: soundtrack.category,
      cover: soundtrack.cover,
      url: soundtrack.url
    });
    
    // Switch back to view mode
    router.push(`/posts/audio/${params.id}?mode=view`);
  };

  const handleDelete = async () => {
    if (!soundtrack || !params.id) return;
    
    setIsDeleting(true);
    setError(null);
    
    try {
      const result = await deleteSoundtrack(Number(params.id));
      
      if (result.code === 0) {
        // Successfully deleted, redirect to audio list
        router.push('/posts/audio');
      } else {
        setError(result.error || '删除失败');
        setShowDeleteConfirm(false);
      }
    } catch (err) {
      console.error('Error deleting soundtrack:', err);
      setError('删除音频时发生错误');
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
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

  if (!soundtrack) {
    return (
      <ProtectedRoute>
        <CMSLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">音频不存在或加载失败</div>
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
              <div className="flex space-x-3">
                <button
                  onClick={handleEdit}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  编辑音频
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  删除音频
                </button>
              </div>
            )}
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
                    value={soundtrack?.id}
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
                    value={soundtrack?.created_at}
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
                    value={soundtrack?.updated_at}
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
                      {soundtrack?.cover ? (
                        <Image
                          src={soundtrack.cover}
                          alt="Audio cover"
                          width={80}
                          height={80}
                          className="object-cover"
                          onError={(e) => {
                            // Fallback to placeholder if image fails
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                          unoptimized={true}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center text-gray-400 text-xs ${soundtrack?.cover ? 'hidden' : ''}`}>
                        <span>无封面</span>
                      </div>
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
                    <option value="focus">Focus</option>
                    <option value="calm">Calm</option>
                    <option value="relax">Relax</option>
                    <option value="测试分类">测试分类</option>
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
            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-md text-sm font-medium transition-colors"
              >
                {isDeleting ? '删除中...' : '删除音频'}
              </button>
              <div className="flex space-x-3">
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
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">确认删除</h3>
              <p className="text-sm text-gray-500 mb-6">
                确定要删除音频 &quot;{soundtrack?.title}&quot; 吗？此操作无法撤销。
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-md text-sm font-medium transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-md text-sm font-medium transition-colors"
                >
                  {isDeleting ? '删除中...' : '确认删除'}
                </button>
              </div>
            </div>
          </div>
        )}
      </CMSLayout>
    </ProtectedRoute>
  );
}
