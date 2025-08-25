'use client';

import React, { useState } from 'react';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface AIFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'active' | 'inactive' | 'beta';
  usage: number;
  limit: number;
}

const aiFeatures: AIFeature[] = [
  {
    id: 'content-generation',
    name: '内容生成',
    description: '使用AI自动生成文章、标题和描述',
    icon: '✍️',
    status: 'active',
    usage: 45,
    limit: 100
  },
  {
    id: 'image-analysis',
    name: '图像分析',
    description: '自动分析图片内容并生成标签',
    icon: '🖼️',
    status: 'active',
    usage: 23,
    limit: 50
  },
  {
    id: 'sentiment-analysis',
    name: '情感分析',
    description: '分析用户评论和反馈的情感倾向',
    icon: '😊',
    status: 'beta',
    usage: 12,
    limit: 30
  },
  {
    id: 'auto-translation',
    name: '自动翻译',
    description: '多语言内容自动翻译',
    icon: '🌐',
    status: 'active',
    usage: 67,
    limit: 200
  },
  {
    id: 'seo-optimization',
    name: 'SEO优化',
    description: '自动优化内容以提高搜索引擎排名',
    icon: '📈',
    status: 'beta',
    usage: 8,
    limit: 25
  },
  {
    id: 'chatbot',
    name: '智能客服',
    description: 'AI驱动的客户服务聊天机器人',
    icon: '🤖',
    status: 'inactive',
    usage: 0,
    limit: 100
  }
];

export default function AIPage() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const handleGenerateContent = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setGeneratedContent(`基于您的提示"${prompt}"，AI生成了以下内容：

这是一段自动生成的内容示例。在实际应用中，这里会显示由AI模型根据您的输入生成的真实内容。

您可以继续编辑和完善这些内容，或者重新生成以获得不同的结果。`);
    
    setIsGenerating(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'beta':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '可用';
      case 'beta':
        return '测试版';
      case 'inactive':
        return '未启用';
      default:
        return '未知';
    }
  };

  return (
    <ProtectedRoute>
      <CMSLayout>
        <div className="space-y-6">
          {/* Page header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI 智能助手</h1>
            <p className="mt-1 text-sm text-gray-500">
              利用人工智能提升您的内容创作和管理效率
            </p>
          </div>

          {/* AI Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiFeatures.map((feature) => (
              <div
                key={feature.id}
                className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => console.log('Selected feature:', feature.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">{feature.icon}</div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(feature.status)}`}>
                    {getStatusText(feature.status)}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{feature.description}</p>
                
                {/* Usage bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>使用量</span>
                    <span>{feature.usage}/{feature.limit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(feature.usage / feature.limit) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Content Generation Tool */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                AI 内容生成器
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                    输入提示
                  </label>
                  <textarea
                    id="prompt"
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="描述您想要生成的内容类型、主题或风格..."
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleGenerateContent}
                    disabled={isGenerating || !prompt.trim()}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {isGenerating ? '生成中...' : '生成内容'}
                  </button>
                </div>
              </div>

              {generatedContent && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">生成结果</h4>
                  <div className="bg-gray-50 rounded-md p-4">
                    <pre className="text-sm text-gray-900 whitespace-pre-wrap">{generatedContent}</pre>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="text-sm text-purple-600 hover:text-purple-700">
                      复制内容
                    </button>
                    <button className="text-sm text-purple-600 hover:text-purple-700">
                      重新生成
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Analytics */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                AI 使用统计
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">1,234</div>
                  <div className="text-sm text-gray-500">本月生成内容</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">89%</div>
                  <div className="text-sm text-gray-500">用户满意度</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">45</div>
                  <div className="text-sm text-gray-500">节省时间(小时)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CMSLayout>
    </ProtectedRoute>
  );
}
