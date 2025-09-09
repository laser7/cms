'use client';

import React from 'react';
import CMSLayout from '@/components/CMSLayout';
import Dashboard from '@/components/Dashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Home() {
  return (
    <ProtectedRoute>
      <CMSLayout>
        <Dashboard />
      </CMSLayout>
    </ProtectedRoute>
  );
}
