'use client';

import React from 'react';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FiMenu, FiUsers, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

export default function PermissionsPage() {
  const sections = [
    {
      id: 'menus',
      title: '菜单管理',
      description: '管理系统菜单项、路由和权限配置',
      icon: FiMenu,
      href: '/permissions/menus',
      color: 'from-blue-500 to-purple-600',
      hoverColor: 'from-blue-600 to-purple-700'
    },
    {
      id: 'roles',
      title: '角色管理',
      description: '管理用户角色、权限分配和访问控制',
      icon: FiUsers,
      href: '/permissions/roles',
      color: 'from-green-500 to-blue-600',
      hoverColor: 'from-green-600 to-blue-700'
    }
  ];

  return (
    <ProtectedRoute>
      <CMSLayout>
        <div className="space-y-6">
          {/* Page header */}
          <div className="flex flex-row gap-3">
            <h1 className="text-2xl font-bold text-gray-900">权限管理</h1>
            <p className="mt-2 text-sm text-gray-500">
              管理系统权限、角色和菜单配置
            </p>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <Link
                  key={section.id}
                  href={section.href}
                  className="group block"
                >
                  <div className={`bg-gradient-to-r ${section.color} hover:${section.hoverColor} p-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">
                            {section.title}
                          </h3>
                          <p className="text-white text-opacity-90 text-sm">
                            {section.description}
                          </p>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <FiArrowRight className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiMenu className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">菜单项</p>
                  <p className="text-2xl font-semibold text-gray-900">10</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiUsers className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">角色</p>
                  <p className="text-2xl font-semibold text-gray-900">5</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">权限</p>
                  <p className="text-2xl font-semibold text-gray-900">12</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">最近活动</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">新增菜单项 "AI管理"</p>
                    <p className="text-xs text-gray-500">2025.08.12, 14:30</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">更新角色 "编辑者" 权限</p>
                    <p className="text-xs text-gray-500">2025.08.12, 13:15</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">删除菜单项 "旧版管理"</p>
                    <p className="text-xs text-gray-500">2025.08.12, 11:45</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CMSLayout>
    </ProtectedRoute>
  );
}
