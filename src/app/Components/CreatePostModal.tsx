// src/components/CreatePost.tsx - קומפוננט ליצירת פוסט חדש
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Image as ImageIcon, 
  X, 
  AlertCircle, 
  CheckCircle,
  Loader2 
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface CreatePostProps {
  onPostCreated?: (post: any) => void;
  className?: string;
}

const CreatePostModal: React.FC<CreatePostProps> = ({ onPostCreated, className = "" }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
        // בחר את הקטגוריה הראשונה כברירת מחדל
        if (data.categories && data.categories.length > 0) {
          setSelectedCategory(data.categories[0].name);
        }
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ולידציה
    if (!title.trim() || !content.trim()) {
      setError('כותרת ותוכן הפוסט נדרשים');
      return;
    }

    if (title.trim().length < 5) {
      setError('כותרת חייבת להיות לפחות 5 תווים');
      return;
    }

    if (content.trim().length < 10) {
      setError('תוכן חייב להיות לפחות 10 תווים');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

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

      // הצלחה!
      setSuccess('הפוסט נוצר בהצלחה! 🎉');
      
      // איפוס הטופס
      setTitle('');
      setContent('');
      setImageUrl('');
      
      // קריאה לפונקציה אם סופקה
      if (onPostCreated) {
        onPostCreated(data.post);
      }

      // הסרת הודעת הצלחה אחרי 3 שניות
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      console.error('Error creating post:', err);
      setError(err instanceof Error ? err.message : 'שגיאה ביצירת פוסט');
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setImageUrl('');
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          יצירת פוסט חדש
        </h2>

        {/* הודעות */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
            <span className="text-red-700 dark:text-red-300">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
            <span className="text-green-700 dark:text-green-300">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* בחירת קטגוריה */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              קטגוריה
            </label>
            {loadingCategories ? (
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-10 rounded-lg"></div>
            ) : (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* כותרת */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              כותרת הפוסט *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="הכנס כותרת מעניינת לפוסט שלך..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={255}
              required
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {title.length}/255
            </div>
          </div>

          {/* תוכן */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              תוכן הפוסט *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="כתב את התוכן של הפוסט שלך כאן..."
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              maxLength={10000}
              required
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {content.length}/10,000
            </div>
          </div>

          {/* תמונה */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              תמונה (אופציונלי)
            </label>
            <div className="space-y-3">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="הכנס קישור לתמונה..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              {imageUrl && (
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="תצוגה מקדימה"
                    className="w-full max-h-48 object-cover rounded-lg"
                    onError={() => setImageUrl('')}
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* כפתור שליחה */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !title.trim() || !content.trim()}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{loading ? 'יוצר פוסט...' : 'פרסם פוסט'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;