'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiEye, FiEdit3, FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Image from 'next/image';

interface Media {
  id: string;
  name: string;
  page: string;
  images: string[];
  createdAt: string;
  status: 'active' | 'inactive';
}

// Sample data based on the image
const initialMedia: Media[] = [
  {
    id: '01',
    name: 'Number Background',
    page: 'explore',
    images: ['/api/placeholder/60/60', '/api/placeholder/60/60', '/api/placeholder/60/60', '/api/placeholder/60/60'],
    createdAt: '2025.08.12, 12:30',
    status: 'active'
  },
  {
    id: '02',
    name: 'Bagua Background',
    page: 'explore',
    images: ['/api/placeholder/60/60', '/api/placeholder/60/60', '/api/placeholder/60/60', '/api/placeholder/60/60'],
    createdAt: '2025.08.12, 12:30',
    status: 'active'
  },
  {
    id: '03',
    name: 'Tarot Background',
    page: 'explore',
    images: ['/api/placeholder/60/60', '/api/placeholder/60/60', '/api/placeholder/60/60', '/api/placeholder/60/60'],
    createdAt: '2025.08.12, 12:30',
    status: 'active'
  },
  {
    id: '04',
    name: 'Affirmation Background',
    page: 'daily',
    images: ['/api/placeholder/60/60', '/api/placeholder/60/60', '/api/placeholder/60/60', '/api/placeholder/60/60'],
    createdAt: '2025.08.12, 12:30',
    status: 'active'
  },
  {
    id: '05',
    name: 'Answer Background',
    page: 'daily',
    images: ['/api/placeholder/60/60', '/api/placeholder/60/60', '/api/placeholder/60/60', '/api/placeholder/60/60'],
    createdAt: '2025.08.12, 12:30',
    status: 'active'
  },
  {
    id: '06',
    name: 'natal chart',
    page: 'Profile',
    images: ['/api/placeholder/60/60', '/api/placeholder/60/60', '/api/placeholder/60/60', '/api/placeholder/60/60'],
    createdAt: '2025.08.12, 12:30',
    status: 'active'
  },
  {
    id: '07',
    name: 'Badge',
    page: 'Profile',
    images: ['/api/placeholder/60/60', '/api/placeholder/60/60', '/api/placeholder/60/60', '/api/placeholder/60/60'],
    createdAt: '2025.08.12, 12:30',
    status: 'active'
  }
];

export default function MediaPage() {
  const router = useRouter();
  const [media] = useState<Media[]>(initialMedia);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(media.map(m => m.id)));
    } else {
      setSelectedRows(new Set());
    }
  };



  const filteredMedia = media.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.page.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewMedia = (id: string) => {
    router.push(`/media/${id}?mode=view`);
  };

  const handleEditMedia = (id: string) => {
    router.push(`/media/${id}?mode=edit`);
  };

  return (
    <ProtectedRoute>
      <CMSLayout>
      <div className="space-y-4">
          {/* Page header */}
          <div className="flex flex-row gap-3">
            <h1 className="text-xl font-bold text-gray-900">媒体列表</h1>
            <p className="mt-1 text-sm text-gray-500">
              管理系统中的所有媒体文件和图片
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
                      checked={selectedRows.size === media.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-[#8C7E9C] focus:ring-[#8C7E9C]"
                    />
                
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
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Q 搜索列表"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#8C7E9C] focus:border-transparent"
                    />
                  </div>
                  <button className="text-gray-600 hover:text-gray-900">
                    <FiFilter size={20} />
                  </button>
                  <button className="bg-[#8C7E9C] hover:bg-[#220646] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2">
                    <FiPlus size={16} />
                    <span>新增</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Media Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      名称
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      页面
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      图片
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      创建时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMedia.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.page}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-1">
                          {item.images.map((image, index) => (
                            <div key={index} className="relative">
                              <Image
                                src={image}
                                alt={`Image ${index + 1}`}
                                width={60}
                                height={60}
                                className="rounded-md object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewMedia(item.id)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <FiEye size={16} />
                          </button>
                          <button 
                            onClick={() => handleEditMedia(item.id)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <FiEdit3 size={16} />
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
                <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900">
                  1
                </button>
                <button className="px-3 py-1 text-sm font-medium text-white bg-pink-500 rounded">
                  2
                </button>
                <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900">
                  3
                </button>
                <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900">
                  4
                </button>
                <span className="text-gray-500">...</span>
                <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900">
                  10
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