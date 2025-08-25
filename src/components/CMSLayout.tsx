'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface CMSLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: '数据大屏', href: '/', icon: '📊' },
  { name: '用户', href: '/users', icon: '👤' },
  { name: '内容管理', href: '/posts', icon: '📝' },
  { name: 'AI', href: '/ai', icon: '🤖' },
  { name: '媒体管理', href: '/media', icon: '🖼️' },
  { name: '权限管理', href: '/permissions', icon: '🔐' },
  { name: '会话管理', href: '/conversations', icon: '💬' },
  { name: '设置', href: '/settings', icon: '⚙️' },
];

export default function CMSLayout({ children }: CMSLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col" style={{ backgroundColor: '#220646' }}>
          <div className="flex h-16 items-center justify-between px-4">
            <div className="mx-auto h-10 w-10 flex items-center justify-center rounded-full overflow-hidden bg-white">
              <Image
                src="/logo.webp"
                alt="Logo"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
                          <button
                onClick={() => setSidebarOpen(false)}
                className="text-white hover:text-white"
              >
                <span className="sr-only">Close sidebar</span>
                ✕
              </button>
            </div>
                        <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname === item.href
                    ? 'text-white'
                    : 'text-white hover:bg-purple-700 hover:text-white'
                }`}
                onClick={() => setSidebarOpen(false)}
                style={{
                  backgroundColor: pathname === item.href ? '#8C7E9C' : 'transparent'
                }}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-purple-700">
              <button
                onClick={logout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-white hover:bg-purple-700 hover:text-white rounded-md transition-colors"
              >
                <span className="mr-3">🚪</span>
                退出登录
              </button>
            </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow" style={{ backgroundColor: '#220646' }}>
          <div className="flex h-16 items-center px-4">
            <div className="mx-auto h-10 w-10 flex items-center justify-center rounded-full overflow-hidden bg-white">
              <Image
                src="/logo.webp"
                alt="Logo"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname === item.href
                    ? 'text-white'
                    : 'text-white hover:bg-purple-700 hover:text-white'
                }`}
                style={{
                  backgroundColor: pathname === item.href ? '#8C7E9C' : 'transparent'
                }}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-[#8C7E9C]">
            <button 
              onClick={logout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-white hover:bg-purple-700 hover:text-white rounded-md transition-colors"
            >
              <span className="mr-3">🚪</span>
              退出登录
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            ☰
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-600">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 