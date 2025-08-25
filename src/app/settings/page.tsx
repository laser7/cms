'use client';

import React, { useState } from 'react';
import CMSLayout from '@/components/CMSLayout';
import Settings from '@/components/Settings';
import ProtectedRoute from '@/components/ProtectedRoute';
import { SiteSettings } from '@/types';

const initialSettings: SiteSettings = {
  title: 'Content Management System',
  description: 'A modern CMS built with Next.js and Tailwind CSS',
  logo: '',
  theme: 'light',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);

  const handleUpdateSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
  };

  return (
    <ProtectedRoute>
      <CMSLayout>
        <Settings 
          settings={settings} 
          onUpdateSettings={handleUpdateSettings} 
        />
      </CMSLayout>
    </ProtectedRoute>
  );
} 