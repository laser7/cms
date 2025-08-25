'use client';

import React, { useState } from 'react';
import CMSLayout from '@/components/CMSLayout';
import Users from '@/components/Users';
import ProtectedRoute from '@/components/ProtectedRoute';
import { User } from '@/types';

// Sample data
const initialUsers: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const handleUpdateUser = (user: User) => {
    setUsers(prev => {
      const existingIndex = prev.findIndex(u => u.id === user.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = user;
        return updated;
      } else {
        return [...prev, user];
      }
    });
  };

  const handleDeleteUser = (id: number) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  return (
    <ProtectedRoute>
      <CMSLayout>
        <Users 
          users={users} 
          onUpdateUser={handleUpdateUser} 
          onDeleteUser={handleDeleteUser} 
        />
      </CMSLayout>
    </ProtectedRoute>
  );
} 