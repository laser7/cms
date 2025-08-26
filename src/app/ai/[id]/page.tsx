'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface AIFeature {
  id: string;
  api: string;
  page: string;
  prompt: string;
  createdAt: string;
  rawApi: string;
  function: string;
  model: string;
  request: string;
  response: string;
  processingTime: string;
}

// Mock data
const mockAIFeature: AIFeature = {
  id: '01',
  api: '/api/v1/ai/chat',
  page: '聊天页面',
  prompt: '你是一个智能助手，请帮助用户解决问题。',
  createdAt: '2025.08.12, 12:30',
  rawApi: '/api/v1/ai/chat',
  function: '智能对话助手，提供问题解答和对话服务',
  model: 'GPT-4',
  request: '{\n  "message": "你好，请介绍一下自己",\n  "model": "gpt-4",\n  "temperature": 0.7\n}',
  response: '{\n  "response": "你好！我是一个AI助手，很高兴为您服务。我可以帮助您回答问题、提供信息、进行对话交流等。有什么我可以帮助您的吗？",\n  "status": "success",\n  "timestamp": "2025-08-12T12:30:00Z"\n}',
  processingTime: '2.3s'
};

export default function AIFeatureDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get('mode') || 'view'; // 'view' or 'edit'
  
  const [aiFeature, setAIFeature] = useState<AIFeature>(mockAIFeature);
  const [formData, setFormData] = useState<AIFeature>(mockAIFeature);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Simulate loading AI feature data
    const loadAIFeature = async () => {
      setIsLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setAIFeature(mockAIFeature);
      setFormData(mockAIFeature);
      setIsLoading(false);
    };

    loadAIFeature();
  }, [params.id]);

  const handleInputChange = (field: keyof AIFeature, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update the AI feature with new data
    setAIFeature(formData);
    setIsSaving(false);
    
    // Switch back to view mode
    router.push(`/ai/${params.id}?mode=view`);
  };

  const handleCancel = () => {
    // Reset form data to original AI feature
    setFormData(aiFeature);
    // Switch back to view mode
    router.push(`/ai/${params.id}?mode=view`);
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
                    value={aiFeature.id}
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
                    value={aiFeature.createdAt}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Raw API
                  </label>
                  <input
                    type="text"
                    value={formData.rawApi}
                    onChange={(e) => handleInputChange('rawApi', e.target.value)}
                    disabled={mode === 'view'}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C7E9C] focus:border-transparent ${
                      mode === 'view' ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    }`}
                    placeholder="输入API端点..."
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

          {/* Request Card */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base leading-6 font-medium text-gray-900 mb-4">
                请求
              </h3>
              <div className="relative">
                <textarea
                  rows={12}
                  value={formData.request}
                  onChange={(e) => handleInputChange('request', e.target.value)}
                  disabled={mode === 'view'}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C7E9C] focus:border-transparent resize-none font-mono text-sm ${
                    mode === 'view' ? 'bg-gray-50 text-gray-500' : 'bg-white'
                  }`}
                  placeholder="输入AI请求参数..."
                />
                {mode === 'edit' && (
                  <button className="absolute top-2 right-2 bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                    发送
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Processing Time */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base leading-6 font-medium text-gray-900 mb-4">
                处理时间
              </h3>
              <div className="text-lg font-mono text-gray-900">
                {formData.processingTime}
              </div>
            </div>
          </div>

          {/* Response Card */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base leading-6 font-medium text-gray-900 mb-4">
                返回
              </h3>
              <textarea
                rows={16}
                value={formData.response}
                onChange={(e) => handleInputChange('response', e.target.value)}
                disabled={mode === 'view'}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C7E9C] focus:border-transparent resize-none font-mono text-sm ${
                  mode === 'view' ? 'bg-gray-50 text-gray-500' : 'bg-white'
                }`}
                placeholder="AI响应内容..."
              />
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
