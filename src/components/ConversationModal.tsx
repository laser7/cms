'use client';

import React from 'react';
import { FiX, FiMoreVertical } from 'react-icons/fi';

interface Conversation {
  id: string;
  user: {
    name: string;
    id: string;
    avatar: string;
  };
  latestMessage: string;
  status: string;
  device: string;
  lastMessageTime: string;
}

interface ConversationModalProps {
  conversation: Conversation;
  isOpen: boolean;
  onClose: () => void;
  mode: 'view' | 'edit';
}

// Mock conversation messages
const messages = [
  {
    id: 1,
    sender: 'user',
    content: '你好，我想了解一下易经的相关内容',
    timestamp: '2025.08.12, 12:25'
  },
  {
    id: 2,
    sender: 'ai',
    content: '您好！很高兴为您介绍易经。易经是中国古代的一部经典著作，被誉为"群经之首"。它包含了丰富的哲学思想和智慧，主要探讨宇宙万物的变化规律。您想了解哪个方面的内容呢？',
    timestamp: '2025.08.12, 12:26'
  },
  {
    id: 3,
    sender: 'user',
    content: '我想了解八卦的含义',
    timestamp: '2025.08.12, 12:27'
  },
  {
    id: 4,
    sender: 'ai',
    content: '八卦是易经的核心概念，由三爻组成，共有八种基本卦象：乾、坤、震、巽、坎、离、艮、兑。每种卦象都代表不同的自然现象和人生哲理。比如乾卦代表天，象征刚健、领导力；坤卦代表地，象征包容、顺从。您对哪个卦象特别感兴趣？',
    timestamp: '2025.08.12, 12:28'
  },
  {
    id: 5,
    sender: 'user',
    content: '谢谢你的解释，我想了解更多关于乾卦的内容',
    timestamp: '2025.08.12, 12:29'
  },
  {
    id: 6,
    sender: 'ai',
    content: '乾卦是八卦之首，由三个阳爻组成，象征纯阳之气。它代表天、父亲、领导、创造等概念。乾卦的卦辞是"元亨利贞"，意思是开始、通达、适宜、正固。在人生中，乾卦教导我们要像天一样刚健中正，自强不息，勇于担当，追求卓越。您觉得这些解释对您有帮助吗？',
    timestamp: '2025.08.12, 12:30'
  }
];

export default function ConversationModal({ conversation, isOpen, onClose, mode }: ConversationModalProps) {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-end z-50 p-4">
      <div className="bg-white mr-20 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">会话详情</h2>
          </div>
          <div className="flex items-center space-x-2">
            {/* Dropdown Menu */}
            <div className="relative">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md">
                <FiMoreVertical size={20} />
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Conversation Details */}
        <div className="p-6 border-b border-gray-200">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Id:</span>
              <span className="text-gray-900">{conversation.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">用户:</span>
              <span className="text-gray-900">{conversation.user.name} (ID: {conversation.user.id})</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">最后消息时间:</span>
              <span className="text-gray-900">{conversation.lastMessageTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">状态:</span>
              <span className="text-gray-900">{conversation.status}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">设备:</span>
              <span className="text-gray-900">{conversation.device} 37</span>
            </div>
          </div>
        </div>

        {/* Conversation Record */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">会话记录</h3>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                    message.sender === 'user' ? 'bg-[#8C7E9C]' : 'bg-[#220646]'
                  }`}>
                    {message.sender === 'user' ? 'U' : 'A'}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {message.sender === 'user' ? conversation.user.name : 'AI助手'}
                    </span>
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                  </div>
                  <div className={`rounded-lg p-3 max-w-xs ${
                    message.sender === 'user' 
                      ? 'bg-[#8C7E9C] text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="text-sm">{message.content}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        {mode === 'edit' && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-pink-300 text-pink-700 bg-white hover:bg-pink-50 rounded-md text-sm font-medium transition-colors"
            >
              取消
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              保存
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
