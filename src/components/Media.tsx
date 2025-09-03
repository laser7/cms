'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import type { Media as MediaType } from '@/types';
import { formatDate } from '@/utils/dateUtils';

interface MediaProps {
  media: MediaType[];
  onUploadMedia: (file: File) => void;
  onDeleteMedia: (id: number) => void;
}

export default function Media({ media, onUploadMedia, onDeleteMedia }: MediaProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUploadMedia(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadMedia(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    return '📄';
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">媒体管理</h1>
        <p className="mt-1 text-sm text-gray-500">
          上传和管理您的媒体文件
        </p>
      </div>

      {/* Upload area */}
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center ${
          dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-6xl mb-4">📁</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          上传您的文件
        </h3>
        <p className="text-gray-500 mb-4">
          拖拽文件到此处，或点击选择文件
        </p>
        <input
          type="file"
          className="hidden"
          id="file-upload"
          onChange={handleFileInput}
          accept="image/*,video/*,.pdf,.doc,.docx"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#220646] hover:bg-[#8C7E9C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
        >
          选择文件
        </label>
      </div>

      {/* Media grid */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">All Media</h3>
          
          {media?.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🖼️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No media files yet</h3>
              <p className="text-gray-500">Upload your first image or video to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {media.map((item) => (
                <div key={item.id} className="relative group">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                    {item.type === 'image' ? (
                      <Image
                        src={item.url}
                        alt={item.name}
                        fill
                        className="object-cover object-center group-hover:opacity-75"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-4xl">{getFileIcon(item.type)}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                                         <p className="text-xs text-gray-500">
                       {formatFileSize(item.size)} • {formatDate(item.uploadedAt)}
                     </p>
                  </div>
                  <button
                    onClick={() => onDeleteMedia(item.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 