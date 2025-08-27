'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FiBarChart, 
  FiUsers, 
  FiFileText, 
  FiBook, 
  FiMusic, 
  FiCpu, 
  FiImage, 
  FiShield, 
  FiMessageCircle, 
  FiSettings, 
  FiLogOut,
  FiChevronDown
} from 'react-icons/fi';

interface CMSLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: '数据大屏', href: '/', icon: <FiBarChart /> },
  { name: '用户', href: '/users', icon: <FiUsers /> },
  { 
    name: '内容管理', 
    href: '/posts', 
    icon: <FiFileText />,
    subItems: [
      { name: '易经文章', href: '/posts/iching', icon: <FiBook /> },
      { name: '音频管理', href: '/posts/audio', icon: <FiMusic /> }
    ]
  },
  { name: 'AI', href: '/ai', icon: <FiCpu /> },
  { name: '媒体管理', href: '/media', icon: <FiImage /> },
  { 
    name: '权限管理', 
    href: '/permissions', 
    icon: <FiShield />,
    subItems: [
      { name: '菜单管理', href: '/permissions/menus', icon: <FiFileText /> },
      { name: '角色管理', href: '/permissions/roles', icon: <FiUsers /> }
    ]
  },
  { name: '会话管理', href: '/conversations', icon: <FiMessageCircle /> },
  { name: '设置', href: '/settings', icon: <FiSettings /> },
];

export default function CMSLayout({ children }: CMSLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, logoutLoading } = useAuth();

  // Initialize expandedItems based on current pathname
  const getInitialExpandedItems = () => {
    const expanded = new Set<string>();
    navigation.forEach(item => {
      if (item.subItems && (pathname === item.href || item.subItems.some(sub => pathname === sub.href))) {
        expanded.add(item.name);
      }
    });
    return expanded;
  };

  const [expandedItems, setExpandedItems] = useState<Set<string>>(getInitialExpandedItems());

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
              <div key={item.name}>
                {item.subItems ? (
                  <div
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                      pathname === item.href || item.subItems.some(sub => pathname === sub.href)
                        ? 'text-white'
                        : 'text-white hover:bg-[#8C7E9C] hover:text-white'
                    }`}
                    onClick={() => {
                      setExpandedItems(prev => {
                        const newSet = new Set(prev);
                        if (newSet.has(item.name)) {
                          newSet.delete(item.name);
                        } else {
                          newSet.add(item.name);
                        }
                        return newSet;
                      });
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      border: pathname === item.href || item.subItems.some(sub => pathname === sub.href) ? '1px solid rgba(140, 126, 156, 0.5)' : '1px solid transparent',
                      borderRadius: pathname === item.href || item.subItems.some(sub => pathname === sub.href) ? '8px 8px 8px 0px' : '8px'
                    }}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    <span className="flex-1">{item.name}</span>
                    <span className={`transition-transform ${expandedItems.has(item.name) ? 'rotate-90' : ''}`}>
                      <FiChevronDown />
                    </span>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      pathname === item.href
                        ? 'text-white'
                        : 'text-white hover:bg-[#8C7E9C] hover:text-white'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                    style={{
                      backgroundColor: 'transparent',
                      border: pathname === item.href ? '1px solid rgba(140, 126, 156, 0.5)' : '1px solid transparent',
                      borderRadius: pathname === item.href ? '8px' : '8px'
                    }}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    <span className="flex-1">{item.name}</span>
                  </Link>
                )}
                
                {item.subItems && expandedItems.has(item.name) && (
                  <div className="ml-6 space-y-1">
                    {item.subItems.map((subItem, index) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={`group flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                          pathname === subItem.href
                            ? 'text-white'
                            : 'text-white hover:bg-[#8C7E9C] hover:text-white'
                        }`}
                        onClick={() => {
                          setSidebarOpen(false);
                        }}
                        style={{
                          backgroundColor: pathname === subItem.href ? 'rgba(140, 126, 156, 0.3)' : 'transparent',
                          border: '1px solid transparent',
                          borderRadius: pathname === subItem.href ? 
                            (index === item.subItems!.length - 1 ? '0px 8px 8px 8px' : '0px 8px 0px 0px') : 
                            '8px'
                        }}
                      >
                        <span className="mr-3 text-sm">{subItem.icon}</span>
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="p-4 border-t border-[#8C7E9C]">
            <button
              onClick={logout}
              disabled={logoutLoading}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-white hover:bg-[#8C7E9C] hover:text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="mr-3">
                {logoutLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <FiLogOut />
                )}
              </span>
              {logoutLoading ? '退出中...' : '退出登录'}
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
              <div key={item.name}>
                {item.subItems ? (
                  <div
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                      pathname === item.href || item.subItems.some(sub => pathname === sub.href)
                        ? 'text-white'
                        : 'text-white hover:bg-[#8C7E9C] hover:text-white'
                    }`}
                    onClick={() => {
                      setExpandedItems(prev => {
                        const newSet = new Set(prev);
                        if (newSet.has(item.name)) {
                          newSet.delete(item.name);
                        } else {
                          newSet.add(item.name);
                        }
                        return newSet;
                      });
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      border: pathname === item.href || item.subItems.some(sub => pathname === sub.href) ? '1px solid rgba(140, 126, 156, 0.5)' : '1px solid transparent',
                      borderRadius: pathname === item.href || item.subItems.some(sub => pathname === sub.href) ? '8px 8px 8px 0px' : '8px'
                    }}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    <span className="flex-1">{item.name}</span>
                    <span className={`transition-transform ${expandedItems.has(item.name) ? 'rotate-90' : ''}`}>
                      <FiChevronDown />
                    </span>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      pathname === item.href
                        ? 'text-white'
                        : 'text-white hover:bg-[#8C7E9C] hover:text-white'
                    }`}
                    style={{
                      backgroundColor: 'transparent',
                      border: pathname === item.href ? '1px solid rgba(140, 126, 156, 0.5)' : '1px solid transparent',
                      borderRadius: pathname === item.href ? '8px' : '8px'
                    }}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    <span className="flex-1">{item.name}</span>
                  </Link>
                )}
                
                {item.subItems && expandedItems.has(item.name) && (
                  <div className="ml-6 space-y-1">
                    {item.subItems.map((subItem, index) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={`group flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                          pathname === subItem.href
                            ? 'text-white'
                            : 'text-white hover:bg-[#8C7E9C] hover:text-white'
                        }`}

                        style={{
                          backgroundColor: pathname === subItem.href ? 'rgba(140, 126, 156, 0.3)' : 'transparent',
                          border: '1px solid transparent',
                          borderRadius: pathname === subItem.href ? 
                            (index === item.subItems!.length - 1 ? '0px 8px 8px 8px' : '0px 8px 0px 0px') : 
                            '8px'
                        }}
                      >
                        <span className="mr-3 text-sm">{subItem.icon}</span>
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="p-4 border-t border-[#8C7E9C]">
            <button
              onClick={logout}
              disabled={logoutLoading}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-white hover:bg-[#8C7E9C] hover:text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="mr-3">
                {logoutLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <FiLogOut />
                )}
              </span>
              {logoutLoading ? '退出中...' : '退出登录'}
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
                <div className="h-8 w-8 rounded-full bg-[#8C7E9C] bg-opacity-20 flex items-center justify-center">
                  <span className="text-sm font-medium text-[#8C7E9C]">
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