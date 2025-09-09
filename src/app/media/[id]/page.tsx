'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiTrash2, FiUpload } from "react-icons/fi"
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Toast from '@/components/Toast';
import Image from 'next/image';
import { getMediaById, updateMedia, deleteMedia, deleteMediaImage } from '@/lib/media-api';
import type { MediaItem, UpdateMediaData } from '@/types';
import Breadcrumbs from "@/components/Breadcrumbs"
import DetailPageActions from "@/components/DetailPageActions"

export default function MediaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "view"

  // Unwrap the params Promise using React.use()
  const { id } = React.use(params)

  const [media, setMedia] = useState<MediaItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(mode === "edit")
  const [formData, setFormData] = useState<UpdateMediaData>({
    name: "",
    page: "",
    raw_api: "",
    images: [],
  })
  const [isUploading, setIsUploading] = useState(false)

  // Toast state
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error" | "info"
    isVisible: boolean
  }>({
    message: "",
    type: "info",
    isVisible: false,
  })

  const loadMedia = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getMediaById(parseInt(id))

      if (result.success && result.data) {
        setMedia(result.data)

        // Handle both possible image formats
        let imageIds: number[] = []
        if (
          result.data.detailedImages &&
          result.data.detailedImages.length > 0
        ) {
          imageIds = result.data.detailedImages.map((img) => img.id)
        } else if (
          result.data.images &&
          Array.isArray(result.data.images) &&
          result.data.images.length > 0
        ) {
          // If images is an array of objects with IDs
          if (
            typeof result.data.images[0] === "object" &&
            "id" in result.data.images[0]
          ) {
            imageIds = (result.data.images as any[]).map((img) => img.id)
          }
        }

        setFormData({
          name: result.data.name,
          page: result.data.page,
          raw_api: result.data.raw_api || "",
          images: imageIds,
        })
      } else {
        console.error("Failed to load media:", result.error)
        setToast({
          message: "加载媒体信息失败",
          type: "error",
          isVisible: true,
        })
        router.push("/media")
      }
    } catch (error) {
      console.error("Error loading media:", error)
      setToast({
        message: "加载媒体信息失败",
        type: "error",
        isVisible: true,
      })
      router.push("/media")
    } finally {
      setLoading(false)
    }
  }, [id, router])

  useEffect(() => {
    loadMedia()
  }, [loadMedia])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setIsUploading(true)
    try {
      const file = e.target.files[0]
      const { uploadImage } = await import("@/lib/media-api")
      const result = await uploadImage(file)

      if (result.success && result.data) {
        // Create a new MediaImage object from the upload result
        const newImage = {
          id: result.data.id,
          filename: result.data.filename,
          size: result.data.size,
          type: result.data.type,
          url: result.data.url,
          created_at: new Date().toISOString(),
          media_id: parseInt(id),
          sort: media?.detailedImages?.length || 0,
        }

        setMedia((prev) =>
          prev
            ? {
                ...prev,
                detailedImages: prev.detailedImages
                  ? [...prev.detailedImages, newImage]
                  : [newImage],
                images: prev.images
                  ? [...prev.images, result.data.url]
                  : [result.data.url],
              }
            : null
        )

        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, result.data.id],
        }))

        setToast({
          message: "图片上传成功",
          type: "success",
          isVisible: true,
        })
      } else {
        setToast({
          message: "上传失败: " + result.error,
          type: "error",
          isVisible: true,
        })
      }
    } catch (error) {
      console.error("Upload error:", error)
      setToast({
        message: "上传失败",
        type: "error",
        isVisible: true,
      })
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = async (imageId: number) => {
    if (!media) return

    try {
      const result = await deleteMediaImage(media.id, imageId)

      if (result.success) {
        // Remove the image from both detailedImages and images arrays
        setMedia((prev) =>
          prev
            ? {
                ...prev,
                detailedImages:
                  prev.detailedImages?.filter((img) => img.id !== imageId) ||
                  [],
                images:
                  prev.images?.filter((_, index) => {
                    // Find the index of the deleted image in detailedImages
                    const deletedImageIndex = prev.detailedImages?.findIndex(
                      (img) => img.id === imageId
                    )
                    return (
                      deletedImageIndex === undefined ||
                      index !== deletedImageIndex
                    )
                  }) || [],
              }
            : null
        )

        // Also remove from formData
        setFormData((prev) => ({
          ...prev,
          images: prev.images.filter((id) => id !== imageId),
        }))

        setToast({
          message: "图片删除成功",
          type: "success",
          isVisible: true,
        })
      } else {
        setToast({
          message: "删除图片失败: " + result.error,
          type: "error",
          isVisible: true,
        })
      }
    } catch (error) {
      console.error("Delete image error:", error)
      setToast({
        message: "删除图片失败",
        type: "error",
        isVisible: true,
      })
    }
  }

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.page.trim()) {
      setToast({
        message: "请填写所有必填字段",
        type: "error",
        isVisible: true,
      })
      return
    }

    try {
      const result = await updateMedia(parseInt(id), formData)

      if (result.success) {
        setIsEditing(false)
        loadMedia() // Reload to get updated data

        setToast({
          message: "保存成功",
          type: "success",
          isVisible: true,
        })
      } else {
        setToast({
          message: "保存失败: " + result.error,
          type: "error",
          isVisible: true,
        })
      }
    } catch (error) {
      console.error("Error saving media:", error)
      setToast({
        message: "保存失败",
        type: "error",
        isVisible: true,
      })
    }
  }

  const handleDelete = async () => {
    if (!confirm("确定要删除这个媒体吗？此操作无法撤销。")) {
      return
    }

    try {
      const result = await deleteMedia(parseInt(id))

      if (result.success) {
        setToast({
          message: "删除成功",
          type: "success",
          isVisible: true,
        })
        router.push("/media")
      } else {
        setToast({
          message: "删除失败: " + result.error,
          type: "error",
          isVisible: true,
        })
      }
    } catch (error) {
      console.error("Error deleting media:", error)
      setToast({
        message: "删除失败",
        type: "error",
        isVisible: true,
      })
    }
  }

  const handleCancel = () => {
    if (isEditing) {
      setIsEditing(false)
      // Reset form data to original values
      if (media) {
        let imageIds: number[] = []
        if (media.detailedImages && media.detailedImages.length > 0) {
          imageIds = media.detailedImages.map((img) => img.id)
        } else if (
          media.images &&
          Array.isArray(media.images) &&
          typeof media.images[0] === "object" &&
          "id" in media.images[0]
        ) {
          imageIds = (media.images as any[]).map((img) => img.id)
        }

        setFormData({
          name: media.name,
          page: media.page,
          raw_api: media.raw_api || "",
          images: imageIds,
        })
      }
    } else {
      router.push("/media")
    }
  }

  if (loading) {
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

  if (!media) {
    return (
      <ProtectedRoute>
        <CMSLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">媒体不存在</div>
          </div>
        </CMSLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <CMSLayout>
        <div className="space-y-6">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: "媒体管理", href: "/media" },
              { label: media?.name || "媒体详情" },
            ]}
          />

          {/* Media Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">基本信息</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    名称 <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C7E9C] focus:border-transparent"
                      required
                    />
                  ) : (
                    <p className="text-gray-900">{media.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    页面 <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <select
                      name="page"
                      value={formData.page}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C7E9C] focus:border-transparent"
                      required
                    >
                      <option value="explore">explore</option>
                      <option value="daily">daily</option>
                      <option value="Profile">Profile</option>
                      <option value="other">other</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{media.page}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Raw API
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="raw_api"
                      value={formData.raw_api}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C7E9C] focus:border-transparent"
                      placeholder="例如: /api/v1/daily"
                    />
                  ) : (
                    <p className="text-gray-900">{media.raw_api || "-"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    创建时间
                  </label>
                  <p className="text-gray-900">
                    {new Date(media.created_at).toLocaleString("zh-CN")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  图片 (
                  {media.detailedImages && media.detailedImages.length > 0
                    ? media.detailedImages.length
                    : media.images &&
                      Array.isArray(media.images) &&
                      typeof media.images[0] === "object"
                    ? media.images.length
                    : 0}
                  )
                </h3>
                {isEditing && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white cursor-pointer ${
                        isUploading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#8C7E9C] hover:bg-[#7A6B8A]"
                      }`}
                    >
                      <FiUpload className="mr-2" size={14} />
                      {isUploading ? "上传中..." : "添加图片"}
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4">
              {(!media.detailedImages || media.detailedImages.length === 0) &&
              (!media.images || media.images.length === 0) ? (
                <div className="text-center py-12 text-gray-500">暂无图片</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {/* Show detailedImages if available, otherwise fall back to images */}
                  {(media.detailedImages && media.detailedImages.length > 0
                    ? media.detailedImages
                    : media.images &&
                      Array.isArray(media.images) &&
                      typeof media.images[0] === "object"
                    ? media.images
                    : []
                  ).map((image: any) => (
                    <div key={image.id} className="relative group">
                      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                        <Image
                          src={image.url}
                          alt={image.filename || `Image ${image.id}`}
                          fill
                          className="object-cover object-center"
                        />
                      </div>

                      {isEditing && (
                        <button
                          onClick={() => removeImage(image.id)}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="删除图片"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      )}

                      <div className="mt-2 text-xs text-gray-600">
                        <p className="truncate">
                          {image.filename || `Image ${image.id}`}
                        </p>
                        {image.size && (
                          <p>{Math.round(image.size / 1024)} KB</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <DetailPageActions
            isEditing={isEditing}
            pageName="媒体"
            onEdit={() => setIsEditing(true)}
            onSave={handleSave}
            onCancel={handleCancel}
            onDelete={handleDelete}
            isSaving={isUploading}
            disabled={isUploading}
          />
        </div>
        {/* Toast Notifications */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
        />
      </CMSLayout>
    </ProtectedRoute>
  )
}
