'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiPlus } from 'react-icons/fi';
import { createMenu, updateMenu, type MenuItem, type CreateMenuData, type UpdateMenuData } from '@/lib/menu-api';
import Toast from '@/components/Toast';

interface CreateMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  menu?: MenuItem;
  onSuccess: () => void;
}

export default function CreateMenuModal({ isOpen, onClose, mode, menu, onSuccess }: CreateMenuModalProps) {
  const [formData, setFormData] = useState<CreateMenuData>({
    code: "",
    name: "",
    route: "",
    type: "页面",
    icon: "",
    is_top_level: true,
    parent_id: undefined,
    sort: 0,
    status: 1,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error"
    isVisible: boolean
  }>({
    message: "",
    type: "success",
    isVisible: false,
  })

  // Initialize form data when editing
  useEffect(() => {
    if (mode === "edit" && menu) {
      setFormData({
        code: menu.code,
        name: menu.name,
        route: menu.route,
        type: menu.type,
        icon: menu.icon,
        is_top_level: menu.is_top_level,
        parent_id: menu.parent_id || undefined,
        sort: menu.sort,
        status: menu.status,
      })
    } else {
      // Reset form for create mode
      setFormData({
        code: "",
        name: "",
        route: "",
        type: "页面",
        icon: "",
        is_top_level: true,
        parent_id: undefined,
        sort: 0,
        status: 1,
      })
    }
  }, [mode, menu])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.name.trim() ||
      !formData.code.trim() ||
      !formData.route.trim()
    ) {
      setToast({
        message: "请填写所有必填字段",
        type: "error",
        isVisible: true,
      })
      return
    }

    setIsSubmitting(true)
    try {
      if (mode === "create") {
        const result = await createMenu(formData)
        if (result.success) {
          setToast({
            message: "菜单创建成功！",
            type: "success",
            isVisible: true,
          })
          onSuccess()
          onClose()
        } else {
          setToast({
            message: result.error || "创建失败",
            type: "error",
            isVisible: true,
          })
        }
      } else {
        // Edit mode
        if (!menu) return
        const updateData: UpdateMenuData = { ...formData }
        const result = await updateMenu(menu.id, updateData)
        if (result.success) {
          setToast({
            message: "菜单更新成功！",
            type: "success",
            isVisible: true,
          })
          onSuccess()
          onClose()
        } else {
          setToast({
            message: result.error || "更新失败",
            type: "error",
            isVisible: true,
          })
        }
      }
    } catch (error) {
      console.error("Error submitting menu:", error)
      setToast({
        message: "操作失败，请重试",
        type: "error",
        isVisible: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (field: keyof CreateMenuData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === "create" ? "创建菜单" : "编辑菜单"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="请输入菜单名称"
                required
              />
            </div>

            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                代码 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="view_dashboard"
                required
              />
            </div>

            {/* Route */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                路由 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.route}
                onChange={(e) => handleInputChange("route", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="/dashboard"
                required
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                类型 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="页面">页面</option>
                <option value="按钮">按钮</option>
                <option value="菜单">菜单</option>
              </select>
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                图标
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => handleInputChange("icon", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="dashboard"
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                排序
              </label>
              <input
                type="number"
                value={formData.sort}
                onChange={(e) =>
                  handleInputChange("sort", parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="0"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状态
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  handleInputChange("status", parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={1}>启用</option>
                <option value={0}>禁用</option>
              </select>
            </div>

            {/* Parent ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                父菜单ID
              </label>
              <input
                type="number"
                value={formData.parent_id || ""}
                onChange={(e) =>
                  handleInputChange(
                    "parent_id",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="留空表示顶级菜单"
                min="0"
              />
            </div>
          </div>

          {/* Is Top Level */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_top_level"
              checked={formData.is_top_level}
              onChange={(e) =>
                handleInputChange("is_top_level", e.target.checked)
              }
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label
              htmlFor="is_top_level"
              className="ml-2 block text-sm text-gray-900"
            >
              顶级菜单
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  保存中...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  {mode === "create" ? "创建" : "保存"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Toast notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  )
}
