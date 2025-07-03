// src/app/Context/CreatePostContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import CreatePostModal from '../Components/CreatePostModal';
import { ForumPostData } from '../types';

interface CreatePostContextType {
  openCreatePost: () => void;
  closeCreatePost: () => void;
  isCreatePostOpen: boolean;
}

const CreatePostContext = createContext<CreatePostContextType | undefined>(undefined);

export const useCreatePost = () => {
  const context = useContext(CreatePostContext);
  if (!context) {
    throw new Error('useCreatePost must be used within a CreatePostProvider');
  }
  return context;
};

interface CreatePostProviderProps {
  children: ReactNode;
  onPostCreated?: (post: ForumPostData) => void;
}

export const CreatePostProvider: React.FC<CreatePostProviderProps> = ({ 
  children, 
  onPostCreated 
}) => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Theme classes דינמיות
  const themeClasses = {
    bg: isDark ? 'bg-gray-900' : 'bg-gray-50',
    cardBg: isDark ? 'bg-gray-800' : 'bg-white',
    text: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-600',
    border: isDark ? 'border-gray-700' : 'border-gray-200',
    hover: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
  };

  const openCreatePost = () => {
    setIsCreatePostOpen(true);
  };

  const closeCreatePost = () => {
    setIsCreatePostOpen(false);
  };

  const handlePostSuccess = (newPost: ForumPostData) => {
    if (onPostCreated) {
      onPostCreated(newPost);
    }
    closeCreatePost();
  };

  return (
    <CreatePostContext.Provider value={{
      openCreatePost,
      closeCreatePost,
      isCreatePostOpen
    }}>
      {children}
      
      {/* פופאפ עולמי - זמין מכל מקום באתר */}
      {isCreatePostOpen && (
        <CreatePostModal
          isOpen={isCreatePostOpen}
          onClose={closeCreatePost}
          onSuccess={handlePostSuccess}
          themeClasses={themeClasses}
        />
      )}
    </CreatePostContext.Provider>
  );
};