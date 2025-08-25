'use client';

import React, { useState } from 'react';
import CMSLayout from '@/components/CMSLayout';
import Media from '@/components/Media';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Media as MediaType } from '@/types';

export default function MediaPage() {
  const [media, setMedia] = useState<MediaType[]>([]);

  const handleUploadMedia = (file: File) => {
    const newMedia: MediaType = {
      id: media.length + 1,
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
      size: file.size,
      uploadedAt: new Date().toISOString(),
    };
    setMedia(prev => [...prev, newMedia]);
  };

  const handleDeleteMedia = (id: number) => {
    setMedia(prev => prev.filter(item => item.id !== id));
  };

  return (
    <ProtectedRoute>
      <CMSLayout>
        <Media 
          media={media} 
          onUploadMedia={handleUploadMedia} 
          onDeleteMedia={handleDeleteMedia} 
        />
      </CMSLayout>
    </ProtectedRoute>
  );
} 