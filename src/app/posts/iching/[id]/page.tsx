'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Image from 'next/image';
import { getYijingContentById, deleteYijingContent, YijingContent } from '@/lib/yijing-api';
import { FiTrash2 } from 'react-icons/fi';
import Breadcrumbs from '@/components/Breadcrumbs';

interface IChingArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data - fallback when API fails
const mockArticle: IChingArticle = {
  id: '09',
  title: 'Placeholder for an example I-Ching article title',
  description: 'A placeholder description for the article',
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = async () => {
      if (!params.id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await getYijingContentById(Number(params.id));
        
        if (response.code === 0 && response.data) {
          // Map the API response to our local interface
          const apiData = response.data as YijingContent;
          
          const articleData: IChingArticle = {
            id: apiData.id.toString(),
            title: apiData.title || `易经文章 ${params.id}`,
            description: apiData.description || '',
            content: apiData.content || '',
            image: apiData.image || '/api/placeholder/200/150',
            createdAt: apiData.created_at || new Date().toLocaleDateString('zh-CN'),
            updatedAt: apiData.updated_at || new Date().toLocaleDateString('zh-CN')
          };
          
          setArticle(articleData);
          setFormData(articleData);
        } else {
          setError(response.msg || 'Failed to load article');
          // Fallback to mock data
          setArticle(mockArticle);
          setFormData(mockArticle);
        }
      } catch (err) {
        setError('Network error occurred');
        // Fallback to mock data
        setArticle(mockArticle);
        setFormData(mockArticle);
      } finally {
        setIsLoading(false);
      }
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

  const handleDelete = async () => {
    if (!params.id) return;
    
    setIsDeleting(true);
    setError(null);
    
    try {
      const response = await deleteYijingContent(Number(params.id));
      
      if (response.code === 0) {
        alert('文章删除成功！');
        // Redirect to the list page after successful deletion
        router.push('/posts/iching');
      } else {
        setError(response.msg || 'Failed to delete article');
        alert(`删除失败: ${response.msg}`);
      }
    } catch (err) {
      setError('Network error occurred while deleting');
      alert('删除文章时发生错误');
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDelete = () => {
    if (confirm(`确定要删除文章 "${article.title}" 吗？此操作不可撤销。`)) {
      handleDelete();
    }
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
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: '易经管理', href: '/posts/iching' },
              { label: article?.title || '文章详情' }
            ]}
          />

          {/* Page header */}
          <div className="flex items-end justify-end">
            
            {mode === 'view' && (
              <button
                onClick={handleEdit}
                                  className="bg-[#553C9A] hover:bg-[#4A2F8A] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                编辑文章
              </button>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    加载失败
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

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

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    描述
                  </label>
                  <input
                    type="text"
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    disabled={mode === 'view'}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      mode === 'view' ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    }`}
                    placeholder="输入文章描述..."
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
            <div className="flex justify-between items-center">
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                                  className="px-4 py-2 bg-[#C24C4C] hover:bg-[#7A3636] disabled:bg-gray-400 text-white rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <FiTrash2 size={16} />
                <span>{isDeleting ? '删除中...' : '删除文章'}</span>
              </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-[#553C9A] text-[#553C9A] bg-white hover:bg-[#553C9A] hover:text-white rounded-md text-sm font-medium transition-colors"
                >
                  取消更新
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#8C7E9C] hover:bg-[#7A6B8A] disabled:bg-gray-400 text-white rounded-md text-sm font-medium transition-colors"
                >
                  {isSaving ? '保存中...' : '更新'}
                </button>
              </div>
            </div>
          )}


        </div>
      </CMSLayout>
    </ProtectedRoute>
  );
}
