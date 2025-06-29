// src/app/Components/CreatePostModalWithServer.tsx
'use client';

import React, { useState, useEffect } from 'react';

interface ForumPostData {
  id: number;
  title: string;
  content: string;
  author: string;
  authorId: number;
  replies: number;
  likes: number;
  time: string;
  avatar: string;
  postImage: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (post: ForumPostData) => void;
  themeClasses: any;
}

const CreatePostModalWithServer: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onCreatePost,
  themeClasses
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
        if (data.categories && data.categories.length > 0) {
          setSelectedCategory(data.categories[0].name);
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // אם יש שגיאה, השתמש בקטגוריות ברירת מחדל
      setCategories([
        { id: '1', name: 'כללי', color: '#6366F1' },
        { id: '2', name: 'דיונים', color: '#10B981' },
        { id: '3', name: 'המלצות', color: '#F59E0B' }
      ]);
      setSelectedCategory('כללי');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('כותרת ותוכן נדרשים');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          image_url: imageUrl.trim() || undefined,
          category_name: selectedCategory
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה ביצירת פוסט');
      }

      // הצלחה - המר את התגובה לפורמט הקיים
      const newPost: ForumPostData = {
        id: Math.floor(Math.random() * 1000000), // ID זמני
        title: title.trim(),
        content: content.trim(),
        author: 'משתמש חדש', // ברירת מחדל
        authorId: 1,
        replies: 0,
        likes: 0,
        time: 'עכשיו',
        avatar: 'https://via.placeholder.com/50x50/3B82F6/FFFFFF?text=U',
        postImage: imageUrl.trim() || 'https://via.placeholder.com/800x200/6366F1/FFFFFF?text=New+Post',
        category: selectedCategory
      };

      setSuccess(true);
      onCreatePost(newPost);
      
      // איפוס הטופס
      setTitle('');
      setContent('');
      setImageUrl('');
      
      // סגירה אחרי 1.5 שניות
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);

    } catch (err) {
      console.error('Error creating post:', err);
      setError(err instanceof Error ? err.message : 'שגיאה ביצירת פוסט');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setTitle('');
      setContent('');
      setImageUrl('');
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${themeClasses.cardBg} rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto ${themeClasses.border} border`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${themeClasses.border}`}>
          <h2 className={`text-xl font-bold ${themeClasses.text}`}>
            צור פוסט חדש
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className={`${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors disabled:opacity-50`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* הודעות */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-700 dark:text-green-300 text-sm">הפוסט נוצר בהצלחה! 🎉</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* בחירת קטגוריה */}
            <div>
              <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                קטגוריה
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${themeClasses.border} ${themeClasses.cardBg} ${themeClasses.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                required
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* כותרת */}
            <div>
              <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                כותרת הפוסט
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="הכנס כותרת מעניינת לפוסט..."
                className={`w-full px-3 py-2 rounded-lg border ${themeClasses.border} ${themeClasses.cardBg} ${themeClasses.text} placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                maxLength={255}
                required
              />
            </div>

            {/* תוכן */}
            <div>
              <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                תוכן הפוסט
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="כתב את התוכן של הפוסט שלך כאן..."
                rows={6}
                className={`w-full px-3 py-2 rounded-lg border ${themeClasses.border} ${themeClasses.cardBg} ${themeClasses.text} placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical`}
                maxLength={5000}
                required
              />
            </div>

            {/* תמונה */}
            <div>
              <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                תמונה (אופציונלי)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="הכנס קישור לתמונה..."
                className={`w-full px-3 py-2 rounded-lg border ${themeClasses.border} ${themeClasses.cardBg} ${themeClasses.text} placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {imageUrl && (
                <div className="mt-2">
                  <img
                    src={imageUrl}
                    alt="תצוגה מקדימה"
                    className="w-full max-h-32 object-cover rounded-lg"
                    onError={() => setImageUrl('')}
                  />
                </div>
              )}
            </div>

            {/* כפתורים */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className={`px-4 py-2 rounded-lg border ${themeClasses.border} ${themeClasses.text} hover:${themeClasses.hover} transition-colors disabled:opacity-50`}
              >
                ביטול
              </button>
              <button
                type="submit"
                disabled={loading || !title.trim() || !content.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                <span>{loading ? 'יוצר פוסט...' : 'פרסם פוסט'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModalWithServer;