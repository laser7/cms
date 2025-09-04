'use client';

import React, { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  FiSearch,
  FiChevronLeft,
  FiSave,
  FiEdit,
  FiTrash2,
} from "react-icons/fi"
import CMSLayout from "@/components/CMSLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import {
  getRoleById,
  updateRole,
  deleteRole,
  getMenuTree,
  getRoleAdmin,
  updateRoleAdmin,
  type RoleItem,
  type UpdateRoleData,
  type MenuTreeItem,
  type RoleAdminItem,
} from "@/lib/role-api"
import { getUsersList } from "@/lib/users-api"
import Toast from "@/components/Toast"
import DeleteConfirmModal from "@/components/DeleteConfirmModal"

export default function RoleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = React.use(params)
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "view"
  const menuTreeParam = searchParams.get("menuTree")

  const [role, setRole] = useState<RoleItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(mode === "edit")
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error"
    isVisible: boolean
  }>({
    message: "",
    type: "success",
    isVisible: false,
  })

  // Menu tree state - get from URL params instead of loading
  const [menuTree, setMenuTree] = useState<MenuTreeItem[]>([])
  const [isMenuTreeLoading, setIsMenuTreeLoading] = useState(false)

  // Collapsible state for menu sections
  const [collapsedSections, setCollapsedSections] = useState<Set<number>>(
    new Set()
  )

  // Selected menu codes state
  const [selectedMenuCodes, setSelectedMenuCodes] = useState<Set<string>>(
    new Set()
  )

  // Role admin users state
  const [roleAdminUsers, setRoleAdminUsers] = useState<RoleAdminItem[]>([])
  const [isLoadingRoleAdmin, setIsLoadingRoleAdmin] = useState(false)

  // User search state
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<RoleAdminItem[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Debug: Log selectedMenuCodes changes
  useEffect(() => {
    console.log("selectedMenuCodes updated:", Array.from(selectedMenuCodes))
  }, [selectedMenuCodes])

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Load role data
  const loadRole = useCallback(async () => {
    if (!id) return

    setIsLoading(true)
    try {
      const result = await getRoleById(parseInt(id))

      if (result.success && result.data) {
        setRole(result.data)

        // Initialize selected menu codes from role.menus
        if (result.data.menus) {
          const menuCodes = result.data.menus.map((menu) => menu.code)
          // Remove duplicates using Set
          const uniqueMenuCodes = Array.from(new Set(menuCodes))
          console.log("Role menus:", result.data.menus)
          console.log("Extracted menu codes:", menuCodes)
          console.log("Unique menu codes after deduplication:", uniqueMenuCodes)
          setSelectedMenuCodes(new Set(uniqueMenuCodes))
        }
      } else {
        setToast({
          message: result.error || "获取角色信息失败",
          type: "error",
          isVisible: true,
        })
      }
    } catch (error) {
      console.error("Error loading role:", error)
      setToast({
        message: "加载角色数据失败",
        type: "error",
        isVisible: true,
      })
    } finally {
      setIsLoading(false)
    }
  }, [id])

  // Load role admin users
  const loadRoleAdminUsers = useCallback(async () => {
    if (!id) return

    setIsLoadingRoleAdmin(true)
    try {
      const result = await getRoleAdmin(parseInt(id))

      if (result.success && result.data) {
        // Remove duplicates based on username
        const uniqueUsers = result.data.filter(
          (user, index, self) =>
            index === self.findIndex((u) => u.username === user.username)
        )
        setRoleAdminUsers(uniqueUsers)
      } else {
        // Handle case where error might be undefined
        if (!result.success) {
          const errorMessage = result.error || "Unknown error occurred"
          console.error("Failed to load role admin users:", errorMessage)
        }

        // Set empty array if no data
        setRoleAdminUsers([])
      }
    } catch (error) {
      console.error("Error loading role admin users:", error)
      // Set empty array on error
      setRoleAdminUsers([])
    } finally {
      setIsLoadingRoleAdmin(false)
    }
  }, [id])

  // Search users function
  const searchUsers = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      try {
        // Search all users using the users API
        const result = await getUsersList({ search: query, page_size: 20 })

        if (result.code === 0 && result.data.users) {
          // Transform User objects to RoleAdminItem format for consistency
          const transformedUsers: RoleAdminItem[] = result.data.users.map(
            (user) => ({
              id: user.id,
              username: user.name, // User.name maps to username
              role: "",
              status: 1,
            })
          )

          // Filter out users that are already in the role
          const availableUsers = transformedUsers.filter(
            (user) =>
              !roleAdminUsers.some((roleUser) => roleUser.id === user.id)
          )

          setSearchResults(availableUsers)
        } else {
          setSearchResults([])
        }
      } catch (error) {
        console.error("Error searching users:", error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    },
    [roleAdminUsers]
  )

  // Add user to role function
  const addUserToRole = useCallback(
    async (user: RoleAdminItem) => {
      try {
        // Check if user is already in the role
        if (
          roleAdminUsers.some((existingUser) => existingUser.id === user.id)
        ) {
          setToast({
            message: "用户已在角色中",
            type: "error",
            isVisible: true,
          })
          return
        }

        // Call API to add user to role
        const result = await updateRoleAdmin(parseInt(id), {
          admin_ids: [user.id],
        })

        if (result.success) {
          // Add user to local state
          setRoleAdminUsers((prev) => [...prev, user])
          setSearchResults([])
          setSearchQuery("")

          setToast({
            message: `已添加用户 ${user.username} 到角色`,
            type: "success",
            isVisible: true,
          })
        } else {
          setToast({
            message: result.error || "添加用户失败",
            type: "error",
            isVisible: true,
          })
        }
      } catch (error) {
        console.error("Error adding user to role:", error)
        setToast({
          message: "添加用户失败",
          type: "error",
          isVisible: true,
        })
      }
    },
    [roleAdminUsers, id]
  )

  // Remove user from role function
  const removeUserFromRole = useCallback(
    async (userId: number) => {
      try {
        const userToRemove = roleAdminUsers.find((user) => user.id === userId)
        if (!userToRemove) return

        // For now, we'll just update local state
        // TODO: Implement API call to remove user from role if endpoint exists
        setRoleAdminUsers((prev) => prev.filter((user) => user.id !== userId))

        setToast({
          message: `已从角色中移除用户 ${userToRemove.username}`,
          type: "success",
          isVisible: true,
        })
      } catch (error) {
        console.error("Error removing user from role:", error)
        setToast({
          message: "移除用户失败",
          type: "error",
          isVisible: true,
        })
      }
    },
    [roleAdminUsers]
  )

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      // Parse menu tree from URL params
      if (menuTreeParam) {
        try {
          const parsedMenuTree = JSON.parse(decodeURIComponent(menuTreeParam))
          setMenuTree(parsedMenuTree)
          setIsMenuTreeLoading(false)
        } catch (error) {
          console.error("Error parsing menu tree from URL:", error)
          setIsMenuTreeLoading(false)
        }
      }

      // Load role data
      await loadRole()
      // Load role admin users
      await loadRoleAdminUsers()
    }
    loadData()
  }, [loadRole, loadRoleAdminUsers, menuTreeParam])

  const handleSave = async () => {
    if (!role) return

    setIsSaving(true)
    try {
      const updateData: UpdateRoleData = {
        name: role.name,
        description: role.description,
        status: role.status,
        admin_ids: role.admin_ids,
        menu_ids: Array.from(selectedMenuCodes)
          .map((code) => {
            // Find the menu item in the tree to get its ID
            const findMenuIdInTree = (items: MenuTreeItem[]): number | null => {
              for (const item of items) {
                if (item.code === code) {
                  return item.id
                }
                if (item.children) {
                  const found = findMenuIdInTree(item.children)
                  if (found) return found
                }
              }
              return null
            }

            return findMenuIdInTree(menuTree) || 0
          })
          .filter((id) => id !== 0), // Remove any invalid IDs
      }

      const result = await updateRole(role?.id, updateData)

      if (result.success) {
        setToast({
          message: "角色更新成功！",
          type: "success",
          isVisible: true,
        })
        setIsEditing(false)
        // Reload data to get any server-side changes
        loadRole()
      } else {
        setToast({
          message: result.error || "更新失败",
          type: "error",
          isVisible: true,
        })
      }
    } catch (error) {
      console.error("Error updating role:", error)
      setToast({
        message: "更新失败，请重试",
        type: "error",
        isVisible: true,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reload original data
    loadRole()
  }

  const handleDelete = () => {
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!role) return

    setIsDeleting(true)
    try {
      const result = await deleteRole(role?.id)

      if (result.success) {
        setToast({
          message: "角色删除成功！",
          type: "success",
          isVisible: true,
        })
        // Redirect to role list after successful deletion
        window.location.href = "/permissions/roles"
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
        message: "删除失败，请重试",
        type: "error",
        isVisible: true,
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
    }
  }

  const handleInputChange = (field: keyof RoleItem, value: any) => {
    if (!role) return
    setRole((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  const toggleSection = (menuId: number) => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(menuId)) {
        newSet.delete(menuId)
      } else {
        newSet.add(menuId)
      }
      return newSet
    })
  }

  // Helper function to check if parent should be indeterminate
  const isParentIndeterminate = (menuItem: MenuTreeItem): boolean => {
    if (!menuItem.children || menuItem.children.length === 0) return false

    const hasCheckedChildren = menuItem.children.some((child) =>
      selectedMenuCodes.has(child.code)
    )
    const hasUncheckedChildren = menuItem.children.some(
      (child) => !selectedMenuCodes.has(child.code)
    )
    return hasCheckedChildren && hasUncheckedChildren
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <CMSLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">加载中...</div>
          </div>
        </CMSLayout>
      </ProtectedRoute>
    )
  }

  if (!role) {
    return (
      <ProtectedRoute>
        <CMSLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">角色不存在</div>
          </div>
        </CMSLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <CMSLayout>
        <div className="space-y-6">
          {/* Page header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/permissions/roles"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiChevronLeft className="w-4 h-4" />
                <span className="text-sm">返回列表</span>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">
                {isEditing ? "编辑角色" : "角色详情"}
              </h1>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                基本信息
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">ID:</span>
                  <span className="text-sm text-gray-900">{role?.id}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">
                    名称:
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={role?.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="text-sm text-gray-900 bg-white border border-gray-300 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{role?.name}</span>
                  )}
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">
                    描述:
                  </span>
                  {isEditing ? (
                    <textarea
                      value={role?.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className="text-sm text-gray-900 bg-white border border-gray-300 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows={2}
                    />
                  ) : (
                    <span className="text-sm text-gray-900">
                      {role?.description}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">
                    状态:
                  </span>
                  {isEditing ? (
                    <select
                      value={role?.status || 1}
                      onChange={(e) =>
                        handleInputChange("status", parseInt(e.target.value))
                      }
                      className="text-sm text-gray-900 bg-white border border-gray-300 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value={1}>启用</option>
                      <option value={0}>禁用</option>
                    </select>
                  ) : (
                    <span
                      className={`text-sm px-3 py-1 rounded ${
                        (role?.status || 1) === 1
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {(role?.status || 1) === 1 ? "启用" : "禁用"}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">
                    创建时间:
                  </span>
                  <span className="text-sm text-gray-900">
                    {new Date(role?.created_at).toLocaleString("zh-CN")}
                  </span>
                </div>

                {role?.updated_at && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">
                      更新时间:
                    </span>
                    <span className="text-sm text-gray-900">
                      {new Date(role?.updated_at).toLocaleString("zh-CN")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Menu Tree Configuration */}
          <div className="bg-white shadow rounded-lg mt-6">
            <div className="px-6 py-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                菜单权限配置
              </h3>

              <div className="space-y-2">
                {isMenuTreeLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="text-gray-500 mt-3">加载菜单树中...</p>
                  </div>
                ) : menuTree?.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    暂无菜单数据
                  </div>
                ) : (
                  <div className="space-y-1">
                    {menuTree?.map((menuItem) => (
                      <div key={menuItem.id} className="space-y-1">
                        {/* Parent Menu Item */}
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center space-x-2 flex-1">
                            <input
                              type="checkbox"
                              checked={
                                selectedMenuCodes.has(menuItem.code) || false
                              }
                              ref={(el) => {
                                if (
                                  el &&
                                  menuItem.children &&
                                  menuItem.children.length > 0
                                ) {
                                  el.indeterminate =
                                    isParentIndeterminate(menuItem)
                                }
                              }}
                              onChange={(e) => {
                                if (!role || !isEditing) return

                                const newSelectedCodes = new Set(
                                  selectedMenuCodes
                                )

                                if (e.target.checked) {
                                  // Add parent
                                  newSelectedCodes.add(menuItem.code)
                                  console.log(`Adding parent: ${menuItem.code}`)

                                  // Add all children if they exist
                                  if (
                                    menuItem.children &&
                                    menuItem.children.length > 0
                                  ) {
                                    console.log(
                                      `Found ${menuItem.children.length} children for ${menuItem.code}`
                                    )
                                    const addChildrenRecursively = (
                                      children: MenuTreeItem[]
                                    ) => {
                                      children.forEach((child) => {
                                        newSelectedCodes.add(child.code)
                                        console.log(
                                          `Adding child: ${child.code}`
                                        )
                                        if (
                                          child.children &&
                                          child.children.length > 0
                                        ) {
                                          addChildrenRecursively(child.children)
                                        }
                                      })
                                    }
                                    addChildrenRecursively(menuItem.children)
                                  }
                                } else {
                                  // Remove parent
                                  newSelectedCodes.delete(menuItem.code)
                                  console.log(
                                    `Removing parent: ${menuItem.code}`
                                  )

                                  // Remove all children if they exist
                                  if (
                                    menuItem.children &&
                                    menuItem.children.length > 0
                                  ) {
                                    console.log(
                                      `Removing ${menuItem.children.length} children for ${menuItem.code}`
                                    )
                                    const removeChildrenRecursively = (
                                      children: MenuTreeItem[]
                                    ) => {
                                      children.forEach((child) => {
                                        newSelectedCodes.delete(child.code)
                                        console.log(
                                          `Removing child: ${child.code}`
                                        )
                                        if (
                                          child.children &&
                                          child.children.length > 0
                                        ) {
                                          removeChildrenRecursively(
                                            child.children
                                          )
                                        }
                                      })
                                    }
                                    removeChildrenRecursively(menuItem.children)
                                  }
                                }

                                console.log(
                                  `Final selected codes:`,
                                  Array.from(newSelectedCodes)
                                )
                                setSelectedMenuCodes(newSelectedCodes)
                              }}
                              disabled={!isEditing}
                              className={`!rounded !border-2 !focus:ring-2 !focus:ring-offset-2 disabled:!opacity-50 transition-all duration-200 ${
                                selectedMenuCodes.has(menuItem.code)
                                  ? "!border-green-600 !bg-green-600 !text-white !accent-green-600 !checked:bg-green-600 !checked:border-green-600"
                                  : "!border-gray-400 !bg-white !text-gray-600 !accent-gray-400 hover:!border-gray-500"
                              }`}
                              style={{
                                accentColor: selectedMenuCodes.has(
                                  menuItem.code
                                )
                                  ? "#059669"
                                  : "#9CA3AF",
                              }}
                            />

                            {/* Expand/Collapse Arrow */}
                            {menuItem.children &&
                            menuItem.children.length > 0 ? (
                              <button
                                onClick={() => toggleSection(menuItem.id)}
                                className="text-gray-500 hover:text-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded p-1"
                                title={
                                  collapsedSections.has(menuItem.id)
                                    ? "展开"
                                    : "收起"
                                }
                              >
                                <span
                                  className={`text-sm transition-transform duration-200 ${
                                    collapsedSections.has(menuItem.id)
                                      ? "rotate-[-90deg]"
                                      : "rotate-0"
                                  }`}
                                >
                                  {collapsedSections.has(menuItem.id)
                                    ? "▶"
                                    : "▼"}
                                </span>
                              </button>
                            ) : (
                              <span className="text-gray-300 text-sm">•</span>
                            )}

                            <span className="font-medium text-gray-900">
                              {menuItem.name}
                            </span>
                            <span className="text-sm text-gray-500">
                              ({menuItem.type})
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-gray-500">
                            {menuItem.icon && (
                              <span className="flex items-center space-x-1">
                                <span className="w-4 h-4">📱</span>
                                <span>{menuItem.icon}</span>
                              </span>
                            )}
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                              {menuItem.route}
                            </span>
                          </div>
                        </div>

                        {/* Children menus */}
                        {menuItem.children &&
                          menuItem.children.length > 0 &&
                          !collapsedSections.has(menuItem.id) && (
                            <div className="ml-8 space-y-1">
                              {menuItem.children.map((childMenu) => (
                                <div
                                  key={childMenu.id}
                                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <div className="flex items-center space-x-2 flex-1">
                                    <input
                                      type="checkbox"
                                      checked={
                                        selectedMenuCodes.has(childMenu.code) ||
                                        false
                                      }
                                      onChange={(e) => {
                                        if (!role || !isEditing) return

                                        const newSelectedCodes = new Set(
                                          selectedMenuCodes
                                        )
                                        if (e.target.checked) {
                                          newSelectedCodes.add(childMenu.code)
                                        } else {
                                          newSelectedCodes.delete(
                                            childMenu.code
                                          )
                                        }
                                        setSelectedMenuCodes(newSelectedCodes)
                                      }}
                                      disabled={!isEditing}
                                      className={`!rounded !border-2 !focus:ring-2 !focus:ring-offset-2 disabled:!opacity-50 transition-all duration-200 ${
                                        selectedMenuCodes.has(childMenu.code)
                                          ? "!border-green-600 !bg-green-600 !text-white !accent-green-600 !checked:bg-green-600 !checked:border-green-600"
                                          : "!border-gray-400 !bg-white !text-gray-600 !accent-gray-400 hover:!border-gray-500"
                                      }`}
                                      style={{
                                        accentColor: selectedMenuCodes.has(
                                          childMenu.code
                                        )
                                          ? "#059669"
                                          : "#9CA3AF",
                                      }}
                                    />
                                    <span className="text-gray-400 text-sm">
                                      •
                                    </span>
                                    <span className="text-gray-700">
                                      {childMenu.name}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      ({childMenu.type})
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                                    {childMenu.icon && (
                                      <span className="flex items-center space-x-1">
                                        <span className="w-4 h-4">🔧</span>
                                        <span>{childMenu.icon}</span>
                                      </span>
                                    )}
                                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                      {childMenu.route}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Role Users Section */}
          <div className="bg-white shadow rounded-lg mt-6">
            <div className="px-6 py-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                角色用户
              </h3>

              <div className="space-y-4">
                {/* Total Users */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">
                    用户总数
                  </span>
                  <span className="text-sm font-gray-900">
                    {roleAdminUsers.length}
                  </span>
                </div>

                {/* User Search and Add */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">
                    搜索并添加用户
                  </span>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="搜索用户名..."
                      value={searchQuery}
                      onChange={(e) => {
                        const query = e.target.value
                        setSearchQuery(query)

                        // Clear results if query is empty
                        if (!query.trim()) {
                          setSearchResults([])
                          return
                        }

                        // Debounce search to avoid too many API calls
                        const timeoutId = setTimeout(() => {
                          searchUsers(query)
                        }, 300)

                        return () => clearTimeout(timeoutId)
                      }}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {isSearching && (
                      <div className="px-3 py-1 text-sm text-gray-500">
                        搜索中...
                      </div>
                    )}
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery("")
                          setSearchResults([])
                        }}
                        className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      >
                        清除
                      </button>
                    )}
                  </div>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="py-3 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-600 mb-2">
                      搜索结果
                    </div>
                    <div className="space-y-2">
                      {searchResults.map((user) => (
                        <div
                          key={user.id}
                          className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-md"
                        >
                          <span className="text-sm text-gray-700">
                            {user.id}
                          </span>
                          <span className="text-sm text-gray-700">
                            {user.username}
                          </span>

                          <button
                            onClick={() => addUserToRole(user)}
                            className="px-2 py-1 text-xs text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                          >
                            添加+
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* User List */}
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm font-medium text-gray-600">
                    用户列表
                  </span>
                  <div className="flex space-x-2">
                    {isLoadingRoleAdmin ? (
                      <div className="text-sm text-gray-500">加载中...</div>
                    ) : roleAdminUsers.length === 0 ? (
                      <div className="text-sm text-gray-500">暂无用户</div>
                    ) : (
                      roleAdminUsers.map((user) => (
                        <div
                          key={user.id}
                          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md flex items-center space-x-2"
                        >
                          <span>{user.username}</span>
                          <button
                            onClick={() => removeUserFromRole(user.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            🗑️
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      保存中...
                    </>
                  ) : (
                    <>
                      <FiSave className="w-4 h-4" />
                      保存
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center gap-2"
                >
                  <FiEdit className="w-4 h-4" />
                  编辑
                </button>

                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-white hover:bg-red-50 border border-red-200 rounded-md transition-colors flex items-center gap-2"
                >
                  <FiTrash2 className="w-4 h-4" />
                  删除
                </button>
              </>
            )}
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
          itemName={role?.name || ""}
        />
      </CMSLayout>
    </ProtectedRoute>
  )
}
