'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiTrash2, FiEye, FiEdit3, FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface User {
  id: string;
  name: string;
  contact: string;
  birthData: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

// Sample data based on the image
const initialUsers: User[] = [
  {
    id: '01',
    name: 'Johnny',
    contact: 'placeholder@gmail.com',
    birthData: '1995.04.23, 15:30, Berlin, Germany',
    createdAt: '2025.08.12, 12:30',
    status: 'active'
  },
  {
    id: '02',
    name: 'Sarah Chen',
    contact: 'sarah.chen@example.com',
    birthData: '1992.08.15, 09:15, Shanghai, China',
    createdAt: '2025.08.11, 14:20',
    status: 'active'
  },
  {
    id: '03',
    name: 'Michael Rodriguez',
    contact: 'michael.r@example.com',
    birthData: '1988.12.03, 22:45, Madrid, Spain',
    createdAt: '2025.08.10, 16:45',
    status: 'inactive'
  },
  {
    id: '04',
    name: 'Emma Wilson',
    contact: 'emma.wilson@example.com',
    birthData: '1990.06.18, 11:30, London, UK',
    createdAt: '2025.08.09, 10:15',
    status: 'active'
  },
  {
    id: '05',
    name: 'David Kim',
    contact: 'david.kim@example.com',
    birthData: '1993.03.25, 07:20, Seoul, Korea',
    createdAt: '2025.08.08, 13:40',
    status: 'active'
  }
];

export default function UsersPage() {
  const router = useRouter();
  const [users] = useState<User[]>(initialUsers);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(users.map(u => u.id)));
    } else {
      setSelectedRows(new Set());
    }
  };



  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewUser = (id: string) => {
    router.push(`/users/${id}?mode=view`);
  };

  const handleEditUser = (id: string) => {
    router.push(`/users/${id}?mode=edit`);
  };

  return (
    <ProtectedRoute>
      <CMSLayout>
        <div className="space-y-4">
          {/* Page header */}
          <div className="flex flex-row gap-3">
            <h1 className="text-2xl font-bold text-gray-900">用户列表</h1>
            <p className="mt-2 text-sm text-gray-500">
              管理系统中的所有用户账户
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
                      checked={selectedRows.size === users.length}
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
                      placeholder="搜索列表..."
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

          {/* Users Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      姓名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      联系方式
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      出生数据
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
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.contact}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                        {user.birthData}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-gray-400 hover:text-gray-600 p-1">
                            <FiTrash2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleViewUser(user.id)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <FiEye size={16} />
                          </button>
                          <button 
                            onClick={() => handleEditUser(user.id)}
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
                <button className="px-3 py-1 text-sm font-medium text-white bg-pink-500 rounded">
                  1
                </button>
                <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900">
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