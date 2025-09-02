'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getAIById, updateAI, deleteAI, testAI } from '@/lib/ai-api';
import { AI } from '@/types';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

export default function AIFeatureDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get('mode') || 'view'; // 'view' or 'edit'
  
  const [aiFeature, setAIFeature] = useState<AI | null>(null);
  const [formData, setFormData] = useState<Partial<AI>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [testRequest, setTestRequest] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch AI feature data from API
  useEffect(() => {
    const fetchAIFeature = async () => {
      if (!params.id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await getAIById(Number(params.id));
        
        if (result.code === 0 && result.data) {
          setAIFeature(result.data);
          setFormData({
            api: result.data.api,
            function: result.data.function,
            model: result.data.model,
            page: result.data.page,
            prompt: result.data.prompt,
            request: result.data.request,
            response: result.data.response
          });
        } else {
          setError(result.error || '获取AI功能信息失败');
        }
      } catch (err) {
        console.error('Error fetching AI feature:', err);
        setError('获取AI功能信息时发生错误');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAIFeature();
  }, [params.id]);

  const handleInputChange = (field: keyof AI, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!aiFeature || !params.id) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      const result = await updateAI(Number(params.id), formData);
      
      if (result.code === 0 && result.data) {
        // Update local state with new data
        setAIFeature(result.data);
        setFormData({
          api: result.data.api,
          function: result.data.function,
          model: result.data.model,
          page: result.data.page,
          prompt: result.data.prompt,
          request: result.data.request,
          response: result.data.response
        });
        
        // Switch back to view mode
        router.push(`/ai/${params.id}?mode=view`);
      } else {
        setError(result.error || '更新失败');
      }
    } catch (err) {
      console.error('Error updating AI feature:', err);
      setError('更新AI功能时发生错误');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (!aiFeature) return;
    
    // Reset form data to original AI feature data
    setFormData({
      api: aiFeature.api,
      function: aiFeature.function,
      model: aiFeature.model,
      page: aiFeature.page,
      prompt: aiFeature.prompt,
      request: aiFeature.request,
      response: aiFeature.response
    });
    
    // Switch back to view mode
    router.push(`/ai/${params.id}?mode=view`);
  };

  const handleDelete = async () => {
    if (!aiFeature || !params.id) return;
    
    setIsDeleting(true);
    setError(null);
    
    try {
      const result = await deleteAI(Number(params.id));
      
      if (result.code === 0) {
        // Successfully deleted, redirect to AI list
        router.push('/ai');
      } else {
        setError(result.error || '删除失败');
      }
    } catch (err) {
      console.error('Error deleting AI feature:', err);
      setError('删除AI功能时发生错误');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleTestAI = async () => {
    if (!aiFeature || !params.id || !testRequest.trim()) return;
    
    setIsTesting(true);
    setTestError(null);
    setTestResponse('');
    
    try {
      const result = await testAI(Number(params.id), { request: testRequest });
      
      if (result.code === 0 && result.data) {
        setTestResponse(result.data.response);
        // Update the processing time in the UI
        if (aiFeature) {
          setAIFeature({
            ...aiFeature,
            processing_time: result.data.processing_time
          });
        }
      } else {
        setTestError(result.error || '测试失败');
      }
    } catch (err) {
      console.error('Error testing AI:', err);
      setTestError('测试AI功能时发生错误');
    } finally {
      setIsTesting(false);
    }
  };

  const handleEdit = () => {
    router.push(`/ai/${params.id}?mode=edit`);
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

  if (!aiFeature) {
    return (
      <ProtectedRoute>
        <CMSLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">AI功能不存在或加载失败</div>
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
                {mode === 'edit' ? '编辑AI功能' : 'AI功能详情'}
              </h1>
              <p className="mt-1 text-xs text-gray-500">
                {mode === 'edit' ? '编辑AI功能配置' : '查看AI功能详细信息'}
              </p>
            </div>
            {mode === 'view' && (
              <button
                onClick={handleEdit}
                className="bg-[#8C7E9C] hover:bg-[#220646] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                编辑AI
              </button>
            )}
          </div>

          {/* Basic Information Card */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base leading-6 font-medium text-gray-900 mb-4">
                基本信息
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID
                  </label>
                  <input
                    type="text"
                    value={aiFeature?.id}
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
                      value={aiFeature?.created_at}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                    />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API端点
                  </label>
                  <input
                    type="text"
                    value={formData.api}
                    onChange={(e) => handleInputChange('api', e.target.value)}
                    disabled={mode === 'view'}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C7E9C] focus:border-transparent ${
                      mode === 'view' ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    }`}
                    placeholder="输入API端点..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    页面
                  </label>
                  <input
                    type="text"
                    value={formData.page}
                    onChange={(e) => handleInputChange('page', e.target.value)}
                    disabled={mode === 'view'}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C7E9C] focus:border-transparent ${
                      mode === 'view' ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    }`}
                    placeholder="输入页面名称..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    提示词
                  </label>
                  <input
                    type="text"
                    value={formData.prompt}
                    onChange={(e) => handleInputChange('prompt', e.target.value)}
                    disabled={mode === 'view'}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C7E9C] focus:border-transparent ${
                      mode === 'view' ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    }`}
                    placeholder="输入提示词..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    作用
                  </label>
                  <textarea
                    rows={3}
                    value={formData.function}
                    onChange={(e) => handleInputChange('function', e.target.value)}
                    disabled={mode === 'view'}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C7E9C] focus:border-transparent resize-none ${
                      mode === 'view' ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    }`}
                    placeholder="描述AI功能的作用..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    模型
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    disabled={mode === 'view'}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C7E9C] focus:border-transparent ${
                      mode === 'view' ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    }`}
                    placeholder="输入AI模型名称..."
                  />
                </div>
              </div>
            </div>
          </div>



          {/* Test AI Card - Always Visible */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base leading-6 font-medium text-gray-900 mb-4">
                测试AI功能
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    测试请求
                  </label>
                  <textarea
                    rows={4}
                    value={testRequest}
                    onChange={(e) => setTestRequest(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C7E9C] focus:border-transparent resize-none font-mono text-sm"
                    placeholder="例如：请分析我的星座运势，生日是1990年1月1日"
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleTestAI}
                    disabled={isTesting || !testRequest.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md text-sm font-medium transition-colors"
                  >
                    {isTesting ? '测试中...' : '发送测试'}
                  </button>
                  
                  {testError && (
                    <div className="text-sm text-red-600">
                      错误: {testError}
                    </div>
                  )}
                </div>

                {testResponse && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      AI响应
                    </label>
                    <textarea
                      rows={Math.max(6, testResponse.split('\n').length)}
                      value={testResponse}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 resize-none font-mono text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    处理时间
                  </label>
                  <div className="text-lg font-mono text-gray-900">
                    {aiFeature?.processing_time || 0}ms
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            {mode === 'edit'&&  (
              <>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-md text-sm font-medium transition-colors"
                >
                  {isDeleting ? '删除中...' : '删除'}
                </button>
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
              </>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          title="确认删除"
          message={`确定要删除AI功能 "${aiFeature?.api}" 吗？此操作无法撤销。`}
          isLoading={isDeleting}
        />
      </CMSLayout>
    </ProtectedRoute>
  );
}
