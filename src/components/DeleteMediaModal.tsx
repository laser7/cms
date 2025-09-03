'use client';

import React from 'react';
import { FiX, FiAlertTriangle } from 'react-icons/fi';

interface DeleteMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mediaName: string;
}

export default function DeleteMediaModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  mediaName 
}: DeleteMediaModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">删除媒体</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-4">
            <FiAlertTriangle className="text-red-500 mr-3" size={24} />
            <span className="text-red-500 font-medium">确认删除</span>
          </div>
          
          <p className="text-gray-700 mb-6">
            您确定要删除媒体 <span className="font-semibold">&ldquo;{mediaName}&rdquo;</span> 吗？此操作无法撤销。
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              取消
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
