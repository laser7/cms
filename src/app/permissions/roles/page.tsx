'use client';

import React, { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  FiTrash2,
  FiEye,
  FiEdit,
  FiPlus,
  FiSearch,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi"
import CMSLayout from "@/components/CMSLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import {
  getRoleList,
  deleteRole,
  getMenuTree,
  type RoleItem,
  type RoleListParams,
  type MenuTreeItem,
} from "@/lib/role-api"
import CreateRoleModal from "@/components/CreateRoleModal"
import Toast from "@/components/Toast"
import DeleteConfirmModal from "@/components/DeleteConfirmModal"

export default function RoleManagementPage() {
  const router = useRouter()
  const [roles, setRoles] = useState<RoleItem[]>([])
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error" | "info"
    isVisible: boolean
  }>({
    message: "",
    type: "info",
    isVisible: false,
  })

  // Menu tree state
  const [menuTree, setMenuTree] = useState<MenuTreeItem[]>([])
  const [isMenuTreeLoading, setIsMenuTreeLoading] = useState(false)

  // Delete modal state
  const [roleToDelete, setRoleToDelete] = useState<RoleItem | undefined>(
    undefined
  )
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Create Role Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Load role data
  const loadRoleData = useCallback(async () => {
    setIsLoading(true)
    try {
      const params: RoleListParams = {
        page: currentPage,
        page_size: itemsPerPage,
        search: searchTerm || undefined,
      }

      const result = await getRoleList(params)

      if (result.success && result.data) {
        setRoles(result.data.list)
        setTotalItems(result.data.total)
      } else {
        setToast({
          message: result.error || "获取角色列表失败",
          type: "error",
          isVisible: true,
        })
      }
    } catch (error) {
      console.error("Error loading role data:", error)
      setToast({
        message: "加载角色数据失败",
        type: "error",
        isVisible: true,
      })
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, itemsPerPage, searchTerm])

  // Load menu tree data
  const loadMenuTree = useCallback(async () => {
    setIsMenuTreeLoading(true)
    try {
      const result = await getMenuTree()

      if (result.success && result.data) {
        setMenuTree(result.data)
      } else {
        console.error("Failed to load menu tree:", result.error)
      }
    } catch (error) {
      console.error("Error loading menu tree:", error)
    } finally {
      setIsMenuTreeLoading(false)
    }
  }, [])

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      // Load menu tree first, then roles
      await loadMenuTree()
      await loadRoleData()
    }
    loadData()
  }, [loadMenuTree, loadRoleData])

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(roles?.map((item) => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (itemId: number, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId])
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId))
    }
  }

  const handleViewRole = (id: number) => {
    // Pass menu tree data to detail page
    const menuTreeData = encodeURIComponent(JSON.stringify(menuTree))
    router.push(`/permissions/roles/${id}?mode=view&menuTree=${menuTreeData}`)
  }

  const handleEditRole = (id: number) => {
    // Pass menu tree data to detail page
    const menuTreeData = encodeURIComponent(JSON.stringify(menuTree))
    router.push(`/permissions/roles/${id}?mode=edit&menuTree=${menuTreeData}`)
  }

  const handleDelete = (role: RoleItem) => {
    setRoleToDelete(role)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return

    try {
      const result = await deleteRole(roleToDelete.id)

      if (result.success) {
        setToast({
          message: "删除成功！",
          type: "success",
          isVisible: true,
        })
        // Reload data
        loadRoleData()
      } else {
        setToast({
          message: result.error || "删除失败",
          type: "error",
          isVisible: true,
        })
      }
    } catch (error) {
      console.error("Error deleting role:", error)
      setToast({
        message: "删除失败",
        type: "error",
        isVisible: true,
      })
    } finally {
      setRoleToDelete(undefined)
      setIsDeleteModalOpen(false)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1) // Reset to first page when searching
    loadRoleData()
  }

  const handleCreateNew = () => {
    setIsCreateModalOpen(true)
  }

  return (
    <ProtectedRoute>
      <CMSLayout>
        <div className="space-y-4">
          {/* Page header */}
          <div className="flex flex-row gap-3">
            <h1 className="text-xl font-bold text-gray-900">角色列表</h1>
          </div>

          {/* Controls */}
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索角色..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                  />
                </div>

                <button
                  onClick={handleSearch}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  搜索
                </button>
              </div>

              <button
                onClick={handleCreateNew}
                className="bg-[#8C7E9C] hover:bg-[#7A6B8A] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                新增
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedItems.length === roles?.length &&
                          roles?.length > 0
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      名称
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      描述
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      权限
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
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        加载中...
                      </td>
                    </tr>
                  ) : roles?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        暂无角色数据
                      </td>
                    </tr>
                  ) : (
                    roles?.map((role) => (
                      <tr key={role?.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(role?.id)}
                            onChange={(e) =>
                              handleSelectItem(role?.id, e.target.checked)
                            }
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {role?.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {role?.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {role?.description}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="flex flex-wrap gap-1">
                            {role?.permissions &&
                            role.permissions.length > 0 ? (
                              role.permissions.map((permission, index) => (
                                <span
                                  key={permission + index}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  {permission}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 text-sm">
                                暂无权限
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(role?.created_at).toLocaleString("zh-CN")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleDelete(role)}
                              className="text-red-600 hover:text-red-900"
                              title="删除"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleViewRole(role?.id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="查看"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditRole(role?.id)}
                              className="text-green-600 hover:text-green-900"
                              title="编辑"
                            >
                              <FiEdit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">显示</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                >
                  <option value={10}>10行</option>
                  <option value={20}>20行</option>
                  <option value={50}>50行</option>
                </select>
                <span className="text-sm text-gray-700">
                  共 {totalItems} 条记录
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === pageNum
                          ? "bg-pink-500 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                {totalPages > 5 && (
                  <>
                    <span className="text-gray-500">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === totalPages
                          ? "bg-pink-500 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Toast notification */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="删除角色"
          message="确定要删除这个角色吗？此操作无法撤销。"
          itemName={roleToDelete?.name || ""}
        />

        {/* Create Role Modal */}
        <CreateRoleModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false)
            loadRoleData()
          }}
          menuTree={menuTree}
        />
      </CMSLayout>
    </ProtectedRoute>
  )
}
