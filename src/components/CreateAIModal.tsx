import React, { useState } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';
import { createAI } from '@/lib/ai-api';
import { CreateAIData } from '@/types';

interface CreateAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateAIModal({ isOpen, onClose, onSuccess }: CreateAIModalProps) {
  const [formData, setFormData] = useState<CreateAIData>({
    api: '',
    function: '',
    model: '',
    page: '',
    prompt: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.api.trim()) return '请输入API端点';
    if (!formData.function.trim()) return '请输入功能描述';
    if (!formData.model.trim()) return '请输入模型名称';
    if (!formData.page.trim()) return '请选择页面';
    if (!formData.prompt.trim()) return '请输入提示词';
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
      const response = await createAI(formData);
      
      if (response.code === 0 && response.data) {
        // Success
        resetForm();
        onSuccess();
        onClose();
      } else {
        setError(response.msg || '创建失败');
      }
    } catch (err) {
      console.error('Error creating AI:', err);
      setError('创建AI功能时发生错误');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      api: '',
      function: '',
      model: '',
      page: '',
      prompt: ''
    });
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50"   style={{ backgroundColor: 'rgba(229, 231, 235, 0.5)' }}>
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">新增AI功能</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="api" className="block text-sm font-medium text-gray-700 mb-1">
                API端点 *
              </label>
              <input
                type="text"
                id="api"
                name="api"
                value={formData.api}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C7E9C] focus:border-transparent"
                placeholder="例如: deepseek/profile"
                required
              />
            </div>

            <div>
              <label htmlFor="page" className="block text-sm font-medium text-gray-700 mb-1">
                页面 *
              </label>
              <select
                id="page"
                name="page"
                value={formData.page}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C7E9C] focus:border-transparent"
                required
              >
                <option value="">选择页面</option>
                <option value="onboarding">onboarding</option>
                <option value="daily">daily</option>
                <option value="explore">explore</option>
                <option value="chat">chat</option>
                <option value="profile">profile</option>
                <option value="natal">natal</option>
                <option value="elements">elements</option>
                <option value="number">number</option>
                <option value="article">article</option>
                <option value="dream">dream</option>
              </select>
            </div>

            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                模型 *
              </label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C7E9C] focus:border-transparent"
                placeholder="例如: GPT-4, DeepSeek"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="function" className="block text-sm font-medium text-gray-700 mb-1">
              功能描述 *
            </label>
            <textarea
              id="function"
              name="function"
              rows={3}
              value={formData.function}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C7E9C] focus:border-transparent resize-none"
              placeholder="描述AI功能的作用和用途..."
              required
            />
          </div>

          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
              提示词 *
            </label>
            <textarea
              id="prompt"
              name="prompt"
              rows={6}
              value={formData.prompt}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C7E9C] focus:border-transparent resize-none"
              placeholder="输入AI提示词..."
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-md text-sm font-medium transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#8C7E9C] hover:bg-[#220646] disabled:bg-gray-400 text-white rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>创建中...</span>
                </>
              ) : (
                <>
                  <FiPlus size={16} />
                  <span>创建</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
