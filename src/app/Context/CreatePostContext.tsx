// src/app/Context/CreatePostContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import CreatePostModal from '../Components/CreatePostModal';
import { ForumPostData } from '../types';

interface CreatePostContextType {
  isCreatePostOpen: boolean;
  openCreatePost: () => void;
  closeCreatePost: () => void;
}

const CreatePostContext = createContext<CreatePostContextType | undefined>(undefined);

interface ThemeClasses {
  bg: string;
  cardBg: string;
  text: string;
  textSecondary: string;
  border: string;
  hover: string;
}

interface CreatePostProviderProps {
  children: ReactNode;
  onCreatePost?: (post: ForumPostData) => void;
  themeClasses?: ThemeClasses;
}

export const CreatePostProvider: React.FC<CreatePostProviderProps> = ({ 
  children, 
  onCreatePost,
  themeClasses = {
    bg: 'bg-gray-900',
    cardBg: 'bg-gray-800',
    text: 'text-white',
    textSecondary: 'text-gray-400',
    border: 'border-gray-700',
    hover: 'hover:bg-gray-700'
  }
}) => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState<boolean>(false);

  const openCreatePost = () => {
    setIsCreatePostOpen(true);
  };

  const closeCreatePost = () => {
    setIsCreatePostOpen(false);
  };

  const handleCreatePost = (post: ForumPostData) => {
    console.log('Post created:', post);
    
    // קריאה לפונקציה החיצונית אם קיימת
    if (onCreatePost) {
      onCreatePost(post);
    }
    
    closeCreatePost();
  };

  const value: CreatePostContextType = {
    isCreatePostOpen,
    openCreatePost,
    closeCreatePost
  };

  return (
    <CreatePostContext.Provider value={value}>
      {children}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={closeCreatePost}
        onSuccess={handleCreatePost}
        themeClasses={themeClasses}
      />
    </CreatePostContext.Provider>
  );
};

export const useCreatePost = (): CreatePostContextType => {
  const context = useContext(CreatePostContext);
  if (!context) {
    // במקום לזרוק שגיאה, נחזיר אובייקט ריק
    return {
      isCreatePostOpen: false,
      openCreatePost: () => {
        console.warn('CreatePost context not available');
      },
      closeCreatePost: () => {}
    };
  }
  return context;
};