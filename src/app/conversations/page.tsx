'use client';

import React, { useState } from 'react';
import { FiTrash2, FiEye, FiEdit3, FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import ConversationModal from '@/components/ConversationModal';

interface Conversation {
  id: string;
  user: {
    name: string;
    id: string;
    avatar: string;
  };
  latestMessage: string;
  status: '进行中' | '已结束';
  device: 'Android' | 'IOS';
  lastMessageTime: string;
}

// Sample data based on the image
const initialConversations: Conversation[] = [
  {
    id: '3sw8a',
    user: {
      name: 'Alex',
      id: '0924',
      avatar: '/api/placeholder/32/32'
    },
    latestMessage: 'I don\'t feel like to ...',
    status: '已结束',
    device: 'Android',
    lastMessageTime: '2025.08.12, 12:30'
  },
  {
    id: '3su2s9',
    user: {
      name: 'Asad',
      id: '0393',
      avatar: '/api/placeholder/32/32'
    },
    latestMessage: 'I don\'t feel like to ...',
    status: '进行中',
    device: 'IOS',
    lastMessageTime: '2025.08.12, 11:45'
  },
  {
    id: '3su3s0',
    user: {
      name: 'Josef',
      id: '0456',
      avatar: '/api/placeholder/32/32'
    },
    latestMessage: 'I don\'t feel like to ...',
    status: '进行中',
    device: 'Android',
    lastMessageTime: '2025.08.12, 10:20'
  },
  {
    id: '3su3s1',
    user: {
      name: 'Karen',
      id: '0789',
      avatar: '/api/placeholder/32/32'
    },
    latestMessage: 'I don\'t feel like to ...',
    status: '已结束',
    device: 'IOS',
    lastMessageTime: '2025.08.12, 09:15'
  },
  {
    id: '3su3s2',
    user: {
      name: 'Max',
      id: '0123',
      avatar: '/api/placeholder/32/32'
    },
    latestMessage: 'I don\'t feel like to ...',
    status: '进行中',
    device: 'Android',
    lastMessageTime: '2025.08.12, 08:30'
  },
  {
    id: '3su3s3',
    user: {
      name: 'John',
      id: '0567',
      avatar: '/api/placeholder/32/32'
    },
    latestMessage: 'I don\'t feel like to ...',
    status: '已结束',
    device: 'IOS',
    lastMessageTime: '2025.08.12, 07:45'
  },
  {
    id: '3su3s4',
    user: {
      name: 'Paul',
      id: '0890',
      avatar: '/api/placeholder/32/32'
    },
    latestMessage: 'I don\'t feel like to ...',
    status: '进行中',
    device: 'Android',
    lastMessageTime: '2025.08.12, 06:20'
  }
];

export default function ConversationsPage() {
  const [conversations] = useState<Conversation[]>(initialConversations);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(conversations.map(c => c.id)));
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
      case '进行中':
        return 'bg-green-100 text-green-800';
      case '已结束':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedConversation(null);
  };

  return (
    <ProtectedRoute>
      <CMSLayout>
      <div className="space-y-4">
          {/* Page header */}
          <div className="flex flex-row gap-3">
            <h1 className="text-xl font-bold text-gray-900">会话列表</h1>
            <p className="mt-1 text-sm text-gray-500">
              管理系统中的所有用户会话
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
                      checked={selectedRows.size === conversations.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-[#8C7E9C] focus:ring-[#8C7E9C]"
                    />
                    <span className="text-sm font-medium text-gray-700">会话列表</span>
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

          {/* Conversations Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      用户
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      用户ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      最新消息
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      设备
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      最后消息时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredConversations.map((conversation) => (
                    <tr key={conversation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {conversation.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {conversation.user.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {conversation.user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {conversation.user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                        {conversation.latestMessage}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(conversation.status)}`}>
                          {conversation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {conversation.device}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {conversation.lastMessageTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewConversation(conversation)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <FiEye size={16} />
                          </button>
                          <button 
                            onClick={() => handleEditConversation(conversation)}
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

          {/* Conversation Modal */}
          {selectedConversation && (
            <ConversationModal
              conversation={selectedConversation}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              mode={modalMode}
            />
          )}
        </div>
      </CMSLayout>
    </ProtectedRoute>
  );
}
