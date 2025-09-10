'use client';

import React from 'react';
import { FiUpload, FiTrash2 } from 'react-icons/fi';

interface FileUploadProps {
  uploadedFiles: File[];
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (fileIndex: number) => void;
  isUploading?: boolean;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
  description?: string;
  showFileList?: boolean;
  maxFiles?: number;
  maxFileSize?: number; // in MB
}

export default function FileUpload({
  uploadedFiles,
  onFileUpload,
  onRemoveFile,
  isUploading = false,
  accept = "image/*",
  multiple = true,
  disabled = false,
  label = "选择文件",
  description,
  showFileList = true,
  maxFiles,
  maxFileSize
}: FileUploadProps) {
  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2);
  };

  const validateFile = (file: File): string | null => {
    if (maxFileSize && file.size > maxFileSize * 1024 * 1024) {
      return `文件 ${file.name} 超过最大大小限制 (${maxFileSize}MB)`;
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    
    // Check max files limit
    if (maxFiles && uploadedFiles.length + files.length > maxFiles) {
      alert(`最多只能选择 ${maxFiles} 个文件`);
      return;
    }
    
    // Validate each file
    for (const file of files) {
      const error = validateFile(file);
      if (error) {
        alert(error);
        return;
      }
    }
    
    onFileUpload(e);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            disabled={disabled || isUploading}
            multiple={multiple}
          />
          <label
            htmlFor="file-upload"
            className={`inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white cursor-pointer ${
              disabled || isUploading
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#8C7E9C] hover:bg-[#7A6B8A]'
            }`}
          >
            <FiUpload className="mr-2" size={14} />
            {isUploading ? '上传中...' : '选择文件'}
          </label>
          {description && (
            <p className="text-sm text-gray-500 mt-2">
              {description}
            </p>
          )}
          {maxFileSize && (
            <p className="text-xs text-gray-400 mt-1">
              最大文件大小: {maxFileSize}MB
            </p>
          )}
          {maxFiles && (
            <p className="text-xs text-gray-400 mt-1">
              最多选择 {maxFiles} 个文件
            </p>
          )}
        </div>
      </div>

      {showFileList && uploadedFiles.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            已选择的文件 ({uploadedFiles.length})
          </label>
          <div className="grid grid-cols-2 gap-4">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl text-gray-400 mb-2">📁</div>
                    <div className="text-xs text-gray-600 truncate px-2">{file.name}</div>
                    <div className="text-xs text-gray-500">
                      {formatFileSize(file.size)} MB
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveFile(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={disabled || isUploading}
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
