'use client';

import React, { useState } from 'react';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';

interface MenuItem {
  id: string;
  name: string;
  route: string;
  code: string;
  type: string;
  module: string;
  showAsMenu: boolean;
  creationTime: string;
  lastUpdate: string;
}

// Mock data - in real app this would come from API
const menuItem: MenuItem = {
  id: '021',
  name: '编辑用户',
  route: '/user/edit',
  code: 'edit_user',
  type: '页面,按钮',
  module: '用户管理',
  showAsMenu: false,
  creationTime: '2025.08.12. 16:00',
  lastUpdate: '2025.08.12. 16:00'
};

export default function MenuDetailPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'view';
  const [formData, setFormData] = useState<MenuItem>(menuItem);
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  return (
    <ProtectedRoute>
      <CMSLayout>
        <div className="space-y-6">
          {/* Page header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-y-4 flex-col">
              <Link
                href="/permissions/menus"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiArrowLeft className="w-4 h-4" />
                <span className="text-sm">返回列表</span>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">菜单信息</h1>
            </div>
          </div>

          {/* Menu Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-2">
              <div className="space-y-1">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Id:</span>
                  <span className="text-sm text-gray-900 bg-gray-50 px-3 py-1 rounded">{formData.id}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">名称:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="text-sm text-gray-900 bg-white border border-gray-300 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 bg-gray-50 px-3 py-1 rounded">{formData.name}</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Code:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      className="text-sm text-gray-900 bg-white border border-gray-300 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 bg-gray-50 px-3 py-1 rounded">{formData.code}</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">路由:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.route}
                      onChange={(e) => setFormData({...formData, route: e.target.value})}
                      className="text-sm text-gray-900 bg-white border border-gray-300 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 bg-gray-50 px-3 py-1 rounded">{formData.route}</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">类型:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="text-sm text-gray-900 bg-white border border-gray-300 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 bg-gray-50 px-3 py-1 rounded">{formData.type}</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">所属模块:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.module}
                      onChange={(e) => setFormData({...formData, module: e.target.value})}
                      className="text-sm text-gray-900 bg-white border border-gray-300 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 bg-gray-50 px-3 py-1 rounded">{formData.module}</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">是否展示为菜单项:</span>
                  {isEditing ? (
                    <select
                      value={formData.showAsMenu ? 'true' : 'false'}
                      onChange={(e) => setFormData({...formData, showAsMenu: e.target.value === 'true'})}
                      className="text-sm text-gray-900 bg-white border border-gray-300 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="true">是</option>
                      <option value="false">否</option>
                    </select>
                  ) : (
                    <span className="text-sm text-gray-900 bg-gray-50 px-3 py-1 rounded">{formData.showAsMenu ? '是' : '否'}</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">创建时间:</span>
                  <span className="text-sm text-gray-900 bg-gray-50 px-3 py-1 rounded">{formData.creationTime}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">上次更新:</span>
                  <span className="text-sm text-gray-900 bg-gray-50 px-3 py-1 rounded">{formData.lastUpdate}</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-sm font-medium border-[#553C9A] text-[#553C9A] bg-white hover:bg-[#553C9A] hover:text-white rounded-md transition-colors"
                    >
                      取消更新
                    </button>
                    <button 
                      onClick={() => {
                        // Handle update logic here
                        alert('更新成功！');
                        setIsEditing(false);
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-md transition-colors"
                    >
                      更新
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-md transition-colors"
                  >
                    编辑
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CMSLayout>
    </ProtectedRoute>
  );
}
