'use client';

import React from 'react';
import { FiEdit3, FiSave, FiX, FiTrash2 } from 'react-icons/fi';
import { getButtonClasses } from '@/utils/buttonStyles';

interface DetailPageActionsProps {
  isEditing: boolean;
  pageName: string; // e.g., "用户", "角色", "菜单", "媒体", "文章"
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  isSaving?: boolean;
  isDeleting?: boolean;
  disabled?: boolean;
}

export default function DetailPageActions({
  isEditing,
  pageName,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  isSaving = false,
  isDeleting = false,
  disabled = false,
}: DetailPageActionsProps) {
  return (
    <div className="flex justify-end space-x-3 mt-6">
      {isEditing ? (
        <>
          {/* Delete Button */}
          <button
            onClick={onDelete}
            disabled={disabled || isDeleting}
            className={`${getButtonClasses('delete', disabled || isDeleting)} flex items-center gap-2`}
          >
            <FiTrash2 className="w-4 h-4" />
            <span>删除</span>
          </button>
          
          {/* Cancel Button */}
          <button
            onClick={onCancel}
            disabled={disabled || isSaving}
            className={`${getButtonClasses('outlineSecondary', disabled || isSaving)} flex items-center gap-2`}
          >
            <FiX className="w-4 h-4" />
            <span>取消更新</span>
          </button>
          
          {/* Save/Update Button */}
          <button
            onClick={onSave}
            disabled={disabled || isSaving}
            className={`${getButtonClasses('primary', disabled || isSaving)} flex items-center gap-2`}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>更新中...</span>
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4" />
                <span>更新</span>
              </>
            )}
          </button>
        </>
      ) : (
        /* Edit Button */
        <button
          onClick={onEdit}
          className={`${getButtonClasses('secondary')} flex items-center gap-2`}
        >
          <FiEdit3 className="w-4 h-4" />
          <span>编辑{pageName}</span>
        </button>
      )}
    </div>
  );
}
