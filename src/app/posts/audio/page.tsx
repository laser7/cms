'use client';

import React, { useState } from 'react';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface AudioFile {
  id: string;
  title: string;
  duration: string;
  size: string;
  format: string;
  uploadedAt: string;
  status: 'published' | 'draft' | 'processing';
}

const initialAudioFiles: AudioFile[] = [
  {
    id: 'A001',
    title: '易经讲解 - 第一卦 乾卦',
    duration: '15:30',
    size: '12.5 MB',
    format: 'MP3',
    uploadedAt: '2025.08.12, 12:30',
    status: 'published'
  },
  {
    id: 'A002',
    title: '易经讲解 - 第二卦 坤卦',
    duration: '18:45',
    size: '15.2 MB',
    format: 'MP3',
    uploadedAt: '2025.08.12, 11:15',
    status: 'published'
  },
  {
    id: 'A003',
    title: '易经讲解 - 第三卦 屯卦',
    duration: '22:10',
    size: '18.8 MB',
    format: 'MP3',
    uploadedAt: '2025.08.11, 16:20',
    status: 'draft'
  },
  {
    id: 'A004',
    title: '易经讲解 - 第四卦 蒙卦',
    duration: '19:30',
    size: '16.1 MB',
    format: 'MP3',
    uploadedAt: '2025.08.11, 14:45',
    status: 'processing'
  },
  {
    id: 'A005',
    title: '易经讲解 - 第五卦 需卦',
    duration: '21:15',
    size: '17.9 MB',
    format: 'MP3',
    uploadedAt: '2025.08.10, 09:30',
    status: 'published'
  },
  {
    id: 'A006',
    title: '易经讲解 - 第六卦 讼卦',
    duration: '16:45',
    size: '13.8 MB',
    format: 'MP3',
    uploadedAt: '2025.08.10, 08:15',
    status: 'published'
  },
  {
    id: 'A007',
    title: '易经讲解 - 第七卦 师卦',
    duration: '24:20',
    size: '20.5 MB',
    format: 'MP3',
    uploadedAt: '2025.08.09, 17:30',
    status: 'draft'
  },
  {
    id: 'A008',
    title: '易经讲解 - 第八卦 比卦',
    duration: '20:10',
    size: '16.9 MB',
    format: 'MP3',
    uploadedAt: '2025.08.09, 15:45',
    status: 'published'
  }
];

export default function AudioManagementPage() {
  const [audioFiles] = useState<AudioFile[]>(initialAudioFiles);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(audioFiles.map(a => a.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return '已发布';
      case 'draft':
        return '草稿';
      case 'processing':
        return '处理中';
      default:
        return '未知';
    }
  };

  const filteredAudioFiles = audioFiles.filter(audio =>
    audio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    audio.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <CMSLayout>
        <div className="space-y-6">
          {/* Page header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">音频管理</h1>
            <p className="mt-1 text-sm text-gray-500">
              管理易经相关的音频文件和内容
            </p>
          </div>

          {/* Controls */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === audioFiles.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">音频文件列表</span>
                  </div>
                  <button className="text-sm text-gray-600 hover:text-gray-900">
                    选择列
                  </button>
                  <button className="text-sm text-gray-600 hover:text-gray-900">
                    ↕️
                  </button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Q 搜索列表..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">🔍</span>
                    </div>
                  </div>
                  <button className="text-sm text-gray-600 hover:text-gray-900">
                    ☰
                  </button>
                  <button className="bg-[#220646] hover:bg-[#8C7E9C] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    + 上传音频
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Audio files table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedRows.size === audioFiles.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      标题
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      时长
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      大小
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      格式
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      上传时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAudioFiles.map((audio) => (
                    <tr key={audio.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(audio.id)}
                          onChange={(e) => handleSelectRow(audio.id, e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {audio.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {audio.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {audio.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {audio.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {audio.format}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(audio.status)}`}>
                          {getStatusText(audio.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {audio.uploadedAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-gray-400 hover:text-gray-600">
                            ▶️
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            🗑️
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            👁️
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            ✏️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-gray-600">
                  ←
                </button>
                <button className="px-3 py-1 text-sm font-medium text-white bg-pink-500 rounded">
                  1
                </button>
                <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900">
                  2
                </button>
                <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900">
                  3
                </button>
                <span className="text-gray-500">...</span>
                <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900">
                  5
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  →
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">显示</span>
                <select className="text-sm border border-gray-300 rounded px-2 py-1">
                  <option>10行</option>
                  <option>20行</option>
                  <option>50行</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </CMSLayout>
    </ProtectedRoute>
  );
}
