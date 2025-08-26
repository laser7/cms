'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Image from 'next/image';

interface IChingArticle {
  id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data - in a real app this would come from an API
const mockArticle: IChingArticle = {
  id: '09',
  title: 'Placeholder for an example I-Ching article title',
  content: `Until recently, the prevailing view assumed lorem ipsum was born as a nonsense text. "It's not Latin, though it looks like it, and it actually says nothing," Before & After magazine answered a curious reader, "Its 'words' do not convey the same meaning as real Latin words do. Lorem ipsum is a dummy text that has been used by typesetters since the 1500s to show what text will look like when it is laid out on a page.

The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with:

"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."

The purpose of lorem ipsum is to create a natural looking block of text (sentence, paragraph, page, etc.) that doesn't distract from the layout. A practice not without controversy, laying out pages with meaningless filler text can be very useful when the focus is meant to be on design, not content.`,
  image: '/api/placeholder/200/150',
  createdAt: '2025.08.11, 12:00',
  updatedAt: '2025.08.12, 16:00'
};

export default function IChingArticleDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get('mode') || 'view'; // 'view' or 'edit'
  
  const [article, setArticle] = useState<IChingArticle>(mockArticle);
  const [formData, setFormData] = useState<IChingArticle>(mockArticle);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Simulate loading article data
    const loadArticle = async () => {
      setIsLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setArticle(mockArticle);
      setFormData(mockArticle);
      setIsLoading(false);
    };

    loadArticle();
  }, [params.id]);

  const handleInputChange = (field: keyof IChingArticle, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update the article with new data
    setArticle(formData);
    setIsSaving(false);
    
    // Switch back to view mode
    router.push(`/posts/iching/${params.id}?mode=view`);
  };

  const handleCancel = () => {
    // Reset form data to original article
    setFormData(article);
    // Switch back to view mode
    router.push(`/posts/iching/${params.id}?mode=view`);
  };

  const handleEdit = () => {
    router.push(`/posts/iching/${params.id}?mode=edit`);
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
                {mode === 'edit' ? '编辑文章' : '文章详情'}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {mode === 'edit' ? '编辑易经文章内容' : '查看易经文章详情'}
              </p>
            </div>
            {mode === 'view' && (
              <button
                onClick={handleEdit}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                编辑文章
              </button>
            )}
          </div>

          {/* Article Metadata Card */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                文章信息
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID
                  </label>
                  <input
                    type="text"
                    value={article.id}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    创建日期
                  </label>
                  <input
                    type="text"
                    value={article.createdAt}
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
                    value={article.updatedAt}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Article Content Card */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                文章内容
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
                    placeholder="输入文章标题..."
                  />
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    图片
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
                      <Image
                        src={article.image}
                        alt="Article thumbnail"
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                    {mode === 'edit' && (
                      <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                        更换图片
                      </button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    内容
                  </label>
                  <textarea
                    id="content"
                    rows={12}
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    disabled={mode === 'view'}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                      mode === 'view' ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    }`}
                    placeholder="输入文章内容..."
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
