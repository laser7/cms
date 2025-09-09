import React, { useState } from 'react';
import { FiX, FiSave } from 'react-icons/fi';
import { createRole } from '@/lib/role-api';
import { CreateRoleData, MenuTreeItem } from '@/lib/role-api';

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  menuTree?: MenuTreeItem[];
}

export default function CreateRoleModal({ isOpen, onClose, onSuccess, menuTree }: CreateRoleModalProps) {
  const [formData, setFormData] = useState<CreateRoleData>({
    name: '',
    description: '',
    admin_ids: [],
    menu_ids: [],
    status: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Selected menu codes state
  const [selectedMenuCodes, setSelectedMenuCodes] = useState<Set<string>>(new Set());

  // Helper function to check if parent should be indeterminate
  const isParentIndeterminate = (menuItem: MenuTreeItem): boolean => {
    if (!menuItem.children || menuItem.children.length === 0) return false;
    
    const hasCheckedChildren = menuItem.children.some(child => selectedMenuCodes.has(child.code));
    const hasUncheckedChildren = menuItem.children.some(child => !selectedMenuCodes.has(child.code));
    return hasCheckedChildren && hasUncheckedChildren;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'status' ? parseInt(value) : value
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return '请输入角色名称';
    if (!formData.description.trim()) return '请输入角色描述';
    if (selectedMenuCodes.size === 0) return '请至少选择一个菜单权限';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert selected menu codes to menu_ids
      const menuIds = Array.from(selectedMenuCodes).map(code => {
        const findMenuId = (items: MenuTreeItem[]): number | null => {
          for (const item of items) {
            if (item.code === code) return item.id;
            if (item.children) {
              const found = findMenuId(item.children);
              if (found) return found;
            }
          }
          return null;
        };
        return findMenuId(menuTree || []) || 0;
      }).filter(id => id !== 0);

      const submitData = {
        ...formData,
        menu_ids: menuIds
      };

      const response = await createRole(submitData);
      
      if (response.success && response.data) {
        // Success
        resetForm();
        onSuccess();
        onClose();
      } else {
        setError(response.error || '创建失败');
      }
    } catch (err) {
      console.error('Error creating role:', err);
      setError('创建角色时发生错误');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      admin_ids: [],
      menu_ids: [],
      status: 1
    });
    setSelectedMenuCodes(new Set());
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">创建新角色</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">基本信息</h3>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                角色名称 *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="请输入角色名称"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                角色描述 *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="请输入角色描述"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                状态
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value={1}>启用</option>
                <option value={0}>禁用</option>
              </select>
            </div>
          </div>

          {/* Menu Permissions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">菜单权限配置 *</h3>
            <p className="text-sm text-gray-600">选择该角色可以访问的菜单和功能</p>
            
            <div className="grid grid-cols-2 gap-4 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-4">
              {menuTree?.map((parentItem) => (
                <div key={parentItem.code} className="col-span-2 space-y-2">
                  {/* Parent menu item checkbox */}
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedMenuCodes.has(parentItem.code)}
                      ref={(el) => {
                        if (el && parentItem.children && parentItem.children.length > 0) {
                          el.indeterminate = isParentIndeterminate(parentItem);
                        }
                      }}
                      onChange={() => {
                        setSelectedMenuCodes(prev => {
                          const newSet = new Set(prev);
                          
                          if (newSet.has(parentItem.code)) {
                            // Remove parent
                            newSet.delete(parentItem.code);
                            
                            // Remove all children
                            if (parentItem.children && parentItem.children.length > 0) {
                              const removeChildrenRecursively = (children: MenuTreeItem[]) => {
                                children.forEach(child => {
                                  newSet.delete(child.code);
                                  if (child.children && child.children.length > 0) {
                                    removeChildrenRecursively(child.children);
                                  }
                                });
                              };
                              removeChildrenRecursively(parentItem.children);
                            }
                          } else {
                            // Add parent
                            newSet.add(parentItem.code);
                            
                            // Add all children
                            if (parentItem.children && parentItem.children.length > 0) {
                              const addChildrenRecursively = (children: MenuTreeItem[]) => {
                                children.forEach(child => {
                                  newSet.add(child.code);
                                  if (child.children && child.children.length > 0) {
                                    addChildrenRecursively(child.children);
                                  }
                                });
                              };
                              addChildrenRecursively(parentItem.children);
                            }
                          }
                          
                          return newSet;
                        });
                      }}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-800">{parentItem.name} ({parentItem.type})</span>
                  </label>
                  
                  {/* Children menu items */}
                  {parentItem.children && parentItem.children.length > 0 && (
                    <div className="ml-6 space-y-1">
                      {parentItem.children.map((childItem) => (
                        <label key={childItem.code} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedMenuCodes.has(childItem.code)}
                            onChange={() => {
                              setSelectedMenuCodes(prev => {
                                const newSet = new Set(prev);
                                if (newSet.has(childItem.code)) {
                                  newSet.delete(childItem.code);
                                } else {
                                  newSet.add(childItem.code);
                                }
                                return newSet;
                              });
                            }}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-700">{childItem.name} ({childItem.type})</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">错误</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  创建中...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  创建角色
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
