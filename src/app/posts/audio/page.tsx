'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlay, FiTrash2, FiEye, FiEdit3, FiRefreshCw } from 'react-icons/fi';
import CMSLayout from '@/components/CMSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import CreateSoundtrackModal from '@/components/CreateSoundtrackModal';
import { getSoundtracks, deleteSoundtrack, isRealAudioFile } from '@/lib/audio-api';
import { Soundtrack, SoundtrackListParams } from '@/types';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

export default function AudioManagementPage() {
  const router = useRouter();
  const [soundtracks, setSoundtracks] = useState<Soundtrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  // Fetch soundtracks from API
  const fetchSoundtracks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params: SoundtrackListParams = {
        page: currentPage,
        page_size: pageSize,
        search: searchTerm || undefined,
        category: categoryFilter || undefined,
      }

      console.log("Fetching soundtracks with params:", params)
      const response = await getSoundtracks(params)

      if ((response.code === 0 || response.code === 200) && response.data) {
        setSoundtracks(response.data.list)
        setTotal(response.data.total)
      } else {
        console.error("API Error:", response.msg, response.error)
        setError(response.msg || "Failed to fetch soundtracks")
      }
    } catch (err) {
      console.error("Network Error:", err)
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, searchTerm, categoryFilter])

  // Initial fetch
  useEffect(() => {
    fetchSoundtracks()
  }, [fetchSoundtracks])

  // Search and filter effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1) // Reset to first page when searching
      fetchSoundtracks()
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm, categoryFilter, fetchSoundtracks])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(soundtracks?.map((s) => s.id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedRows(newSelected)
  }

  const handleDeleteSoundtrack = async (id: number) => {
    try {
      const response = await deleteSoundtrack(id)
      if (response.code === 0) {
        // Refresh the list
        fetchSoundtracks()
        // Remove from selected rows
        const newSelected = new Set(selectedRows)
        newSelected.delete(id)
        setSelectedRows(newSelected)
      } else {
        setError(response.msg || "删除失败")
      }
    } catch (err) {
      setError("删除时发生错误")
      console.error("Error deleting soundtrack:", err)
    }
  }

  const confirmDeleteSoundtrack = (id: number) => {
    setShowDeleteConfirm(id)
  }

  const handleBulkDelete = async () => {
    if (selectedRows.size === 0) return

    if (confirm(`确定要删除选中的 ${selectedRows.size} 个音频文件吗？`)) {
      try {
        const deletePromises = Array.from(selectedRows).map((id) =>
          deleteSoundtrack(id)
        )
        await Promise.all(deletePromises)

        // Refresh the list and clear selection
        fetchSoundtracks()
        setSelectedRows(new Set())
      } catch (err) {
        setError("批量删除时发生错误")
        console.error("Error bulk deleting soundtracks:", err)
      }
    }
  }

  // Audio playing functions
  const handlePlayAudio = (soundtrack: Soundtrack) => {
    console.log(
      "Attempting to play audio:",
      soundtrack.title,
      "URL:",
      soundtrack.url
    )

    // Stop any currently playing audio
    if (audioElement) {
      audioElement.pause()
      audioElement.currentTime = 0
    }

    // Check if URL is a valid audio file - more strict validation
    const isDirectAudioFile = isRealAudioFile(soundtrack.url)

    if (!isDirectAudioFile) {
      console.warn(
        "URL does not appear to be a direct audio file:",
        soundtrack.url
      )
      setError(
        `无法播放音频：URL "${soundtrack.url}" 不是有效的音频文件链接。请检查音频文件格式或联系管理员。`
      )
      return
    }

    // Create new audio element
    const audio = new Audio(soundtrack.url)

    // Add event listeners before playing
    audio.addEventListener("loadeddata", () => {
      console.log("Audio loaded successfully:", soundtrack.title)
    })

    audio.addEventListener("canplay", () => {
      console.log("Audio can start playing:", soundtrack.title)
    })

    audio.addEventListener("ended", () => {
      console.log("Audio playback ended:", soundtrack.title)
      setPlayingId(null)
      setAudioElement(null)
    })

    audio.addEventListener("error", (e) => {
      console.error("Audio playback error for:", soundtrack.title)
      console.error("Error details:", e)
      console.error("Audio error code:", audio.error?.code)
      console.error("Audio error message:", audio.error?.message)

      let errorMessage = "音频播放失败"

      if (audio.error) {
        switch (audio.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = "音频播放被中止"
            break
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = "网络错误，无法加载音频文件"
            break
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = "音频文件格式不支持或文件损坏"
            break
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = "音频文件格式不支持或URL无效"
            break
          default:
            errorMessage = `音频播放失败 (错误代码: ${audio.error.code})`
        }
      }

      setError(`${errorMessage}：${soundtrack.title}`)
      setPlayingId(null)
      setAudioElement(null)
    })

    // Start playing
    audio
      .play()
      .then(() => {
        console.log("Audio started playing:", soundtrack.title)
        setPlayingId(soundtrack.id)
        setAudioElement(audio)
        setError(null) // Clear any previous errors
      })
      .catch((err) => {
        console.error("Failed to start audio playback:", err)
        console.error("Audio URL:", soundtrack.url)

        let errorMessage = "无法播放音频"
        if (err.name === "NotSupportedError") {
          errorMessage = "浏览器不支持此音频格式"
        } else if (err.name === "NotAllowedError") {
          errorMessage = "用户未授权播放音频"
        } else if (err.name === "AbortError") {
          errorMessage = "音频播放被中止"
        }

        setError(`${errorMessage}：${soundtrack.title}`)
        setPlayingId(null)
        setAudioElement(null)
      })
  }

  const handleStopAudio = () => {
    if (audioElement) {
      audioElement.pause()
      audioElement.currentTime = 0
      setPlayingId(null)
      setAudioElement(null)
    }
  }

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause()
        audioElement.currentTime = 0
      }
    }
  }, [audioElement])

  const handleViewAudio = (id: number) => {
    router.push(`/posts/audio/${id}?mode=view`)
  }

  const handleEditAudio = (id: number) => {
    router.push(`/posts/audio/${id}?mode=edit`)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(total / pageSize)

  if (loading && soundtracks?.length === 0) {
    return (
      <ProtectedRoute>
        <CMSLayout>
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <FiRefreshCw className="animate-spin" size={20} />
              <span>加载中...</span>
            </div>
          </div>
        </CMSLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <CMSLayout>
        <div className="space-y-4">
          {/* Page header */}
          <div className="flex flex-row gap-3">
            <h1 className="text-xl font-bold text-gray-900">音频管理</h1>
            <p className="mt-1 text-sm text-gray-500">
              管理易经相关的音频文件和内容
            </p>
          </div>

          {/* Error display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">错误</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Audio Player Status */}
          {playingId && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-800">
                    正在播放:{" "}
                    {soundtracks.find((s) => s.id === playingId)?.title}
                  </span>
                </div>
                <button
                  onClick={handleStopAudio}
                  className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 border border-green-300 rounded-md hover:bg-green-200 transition-colors"
                >
                  停止播放
                </button>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={
                        selectedRows.size === soundtracks?.length &&
                        soundtracks?.length > 0
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-600">
                      {selectedRows.size} / {soundtracks?.length}
                    </span>
                  </div>
                  {selectedRows.size > 0 && (
                    <button
                      onClick={handleBulkDelete}
                      className="text-sm text-[#C24C4C] hover:text-[#7A3636] px-3 py-1 border border-[#C24C4C] rounded hover:bg-[#C24C4C] transition-colors"
                    >
                      删除选中 ({selectedRows.size})
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  {/* Category filter */}
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">所有分类</option>
                    <option value="focus">Focus</option>
                    <option value="calm">Calm</option>
                    <option value="relax">Relax</option>
                    <option value="测试分类">测试音频</option>
                  </select>

                  {/* Search */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="搜索音频..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">🔍</span>
                    </div>
                  </div>

                  {/* Refresh button */}
                  <button
                    onClick={fetchSoundtracks}
                    disabled={loading}
                    className="text-sm text-gray-600 hover:text-gray-900 p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                  >
                    <FiRefreshCw
                      className={loading ? "animate-spin" : ""}
                      size={16}
                    />
                  </button>

                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-[#8C7E9C] hover:bg-[#7A6B8A] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    + 上传音频
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Audio files table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={
                          selectedRows.size === soundtracks?.length &&
                          soundtracks?.length > 0
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      标题
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      作曲家
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      分类
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      封面
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
                  {soundtracks?.map((soundtrack) => (
                    <tr key={soundtrack.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(soundtrack.id)}
                          onChange={(e) =>
                            handleSelectRow(soundtrack.id, e.target.checked)
                          }
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {soundtrack.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <span>{soundtrack.title}</span>
                          {playingId === soundtrack.id && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              🔊 播放中
                            </span>
                          )}
                          {!isRealAudioFile(soundtrack.url) && (
                            <button
                              onClick={() =>
                                window.open(soundtrack.url, "_blank")
                              }
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer transition-colors"
                              title="点击在新标签页中打开音频链接"
                            >
                              🔗 链接
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {soundtrack.composer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {soundtrack.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {soundtrack.cover ? (
                          <img
                            src={soundtrack.cover}
                            alt="封面"
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-500">
                              无封面
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(soundtrack.created_at).toLocaleDateString(
                          "zh-CN"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {playingId === soundtrack.id ? (
                            <button
                              onClick={handleStopAudio}
                              className="text-red-400 hover:text-red-600 p-1"
                              title="停止播放"
                            >
                              <FiPlay
                                size={16}
                                className="transform rotate-90"
                              />
                            </button>
                          ) : (
                            <>
                              {/* Show play button for real audio files, disabled button for others */}
                              {isRealAudioFile(soundtrack.url) ? (
                                <button
                                  onClick={() => handlePlayAudio(soundtrack)}
                                  className="text-gray-400 hover:text-gray-600 p-1"
                                  title="播放"
                                >
                                  <FiPlay size={16} />
                                </button>
                              ) : (
                                <button
                                  disabled
                                  className="text-gray-300 cursor-not-allowed p-1"
                                  title="此音频无法直接播放"
                                >
                                  <FiPlay size={16} />
                                </button>
                              )}
                            </>
                          )}
                          <button
                            onClick={() =>
                              confirmDeleteSoundtrack(soundtrack.id)
                            }
                            className="text-red-400 hover:text-red-600 p-1"
                            title="删除"
                          >
                            <FiTrash2 size={16} />
                          </button>
                          <button
                            onClick={() => handleViewAudio(soundtrack.id)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                            title="查看"
                          >
                            <FiEye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditAudio(soundtrack.id)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                            title="编辑"
                          >
                            <FiEdit3 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

                {soundtracks?.length === 0 && !loading && (
                  <tbody>
                    <tr>
                      <td colSpan={8} className="text-center py-12">
                        <p className="text-gray-500">暂无音频文件</p>
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ←
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1
                    if (totalPages <= 5) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 text-sm font-medium rounded ${
                            page === currentPage
                              ? "text-white bg-[#220646]"
                              : "text-gray-700 hover:text-gray-900"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    }

                    // Show first page, current page, and last page with ellipsis
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 text-sm font-medium rounded ${
                            page === currentPage
                              ? "text-white bg-[#220646]"
                              : "text-gray-700 hover:text-gray-900"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    }

                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="text-gray-500">
                          ...
                        </span>
                      )
                    }

                    return null
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    →
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">显示</span>
                  <select
                    value={pageSize}
                    onChange={(e) =>
                      handlePageSizeChange(Number(e.target.value))
                    }
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value={10}>10行</option>
                    <option value={20}>20行</option>
                    <option value={50}>50行</option>
                  </select>
                  <span className="text-sm text-gray-700">
                    共 {total} 条记录
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Create Soundtrack Modal */}
        <CreateSoundtrackModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false)
            fetchSoundtracks()
          }}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={showDeleteConfirm !== null}
          onClose={() => setShowDeleteConfirm(null)}
          onConfirm={() => {
            if (showDeleteConfirm) {
              handleDeleteSoundtrack(showDeleteConfirm)
              setShowDeleteConfirm(null)
            }
          }}
          title="确认删除"
          message="确定要删除这个音频文件吗？此操作无法撤销。"
          itemName={""}
        />
      </CMSLayout>
    </ProtectedRoute>
  )
}
