// src/components/CreatePostModal.tsx
import React, { useState } from 'react';
import { X, MessageSquare, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import ImageUpload from './ImageUpload';

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

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (post: ForumPostData) => void;
  themeClasses: {
    bg: string;
    cardBg: string;
    text: string;
    textSecondary: string;
    border: string;
    hover: string;
  };
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreatePost, 
  themeClasses 
}) => {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    postImage: '',
    category: 'דיונים'
  });
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = [
    'דיונים',
    'ביקורות', 
    'המלצות',
    'שאלות',
    'חדשות',
    'מימים'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('אנא מלא את כל השדות הנדרשים');
      return;
    }

    setLoading(true);

    // יצירת פוסט חדש
    const newPost: ForumPostData = {
      id: Date.now(),
      title: formData.title,
      content: formData.content,
      author: user?.username || 'משתמש אנונימי',
      authorId: user?.id || 0,
      replies: 0,
      likes: 0,
      time: 'עכשיו',
      avatar: user?.avatar || 'https://via.placeholder.com/50x50/6366F1/FFFFFF?text=U',
      postImage: formData.postImage || `https://via.placeholder.com/800x200/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${encodeURIComponent(formData.category)}`,
      category: formData.category
    };

    // סימולציה של שמירה
    setTimeout(() => {
      onCreatePost(newPost);
      
      // עדכון מספר הפוסטים של המשתמש
      if (user && updateUserProfile) {
        updateUserProfile({ postsCount: user.postsCount + 1 });
      }
      
      setFormData({ title: '', content: '', postImage: '', category: 'דיונים' });
      setShowPreview(false);
      setLoading(false);
      onClose();
    }, 1000);
  };

  const handleClose = () => {
    setFormData({ title: '', content: '', postImage: '', category: 'דיונים' });
    setShowPreview(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${themeClasses.cardBg} rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`text-2xl font-bold ${themeClasses.text}`}>יצירת פוסט חדש</h2>
          <button
            onClick={handleClose}
            className={`${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {showPreview ? (
            /* Preview Mode */
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                >
                  ← חזור לעריכה
                </button>
              </div>
              
              <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg overflow-hidden`}>
                {/* Preview Image */}
                {formData.postImage && (
                  <div className="relative">
                    <img 
                      src={formData.postImage} 
                      alt="תצוגה מקדימה"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/800x200/6366F1/FFFFFF?text=${encodeURIComponent(formData.category)}`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                )}
                
                {/* Preview Content */}
                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <img 
                      src={user?.avatar || `https://via.placeholder.com/40x40/6366F1/FFFFFF?text=${user?.username?.charAt(0)?.toUpperCase() || 'U'}`}
                      alt={user?.username}
                      className="w-10 h-10 rounded-full border-2 border-blue-500"
                    />
                    <div>
                      <h4 className={`font-semibold ${themeClasses.text}`}>{user?.username}</h4>
                      <p className={`text-sm ${themeClasses.textSecondary}`}>עכשיו • {formData.category}</p>
                    </div>
                  </div>
                  
                  <h3 className={`font-bold text-lg ${themeClasses.text} mb-2`}>
                    {formData.title}
                  </h3>
                  
                  <p className={`${themeClasses.textSecondary} whitespace-pre-wrap`}>
                    {formData.content}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* User Info */}
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                <img 
                  src={user?.avatar || `https://via.placeholder.com/48x48/6366F1/FFFFFF?text=${user?.username?.charAt(0)?.toUpperCase() || 'U'}`}
                  alt={user?.username}
                  className="w-12 h-12 rounded-full border-2 border-blue-500"
                />
                <div>
                  <h4 className={`font-semibold ${themeClasses.text}`}>{user?.username}</h4>
                  <p className={`text-sm ${themeClasses.textSecondary}`}>יוצר פוסט חדש</p>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                  קטגוריה
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className={`w-full px-3 py-2 border ${themeClasses.border} rounded-md ${themeClasses.cardBg} ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                  כותרת הפוסט *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full px-3 py-2 border ${themeClasses.border} rounded-md ${themeClasses.cardBg} ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="מה הנושא שברצונך לדון בו?"
                  maxLength={100}
                />
                <p className={`text-xs ${themeClasses.textSecondary} mt-1`}>
                  {formData.title.length}/100 תווים
                </p>
              </div>

              {/* Post Image */}
              <ImageUpload
                value={formData.postImage}
                onChange={(url) => setFormData(prev => ({ ...prev, postImage: url }))}
                label="תמונת פוסט"
                placeholder="הוסף תמונה לפוסט שלך"
                previewClassName="w-full h-32"
                themeClasses={themeClasses}
              />

              {/* Content */}
              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                  תוכן הפוסט *
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className={`w-full px-3 py-2 border ${themeClasses.border} rounded-md ${themeClasses.cardBg} ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                  placeholder="שתף את המחשבות שלך עם הקהילה..."
                  rows={6}
                  maxLength={1000}
                />
                <p className={`text-xs ${themeClasses.textSecondary} mt-1`}>
                  {formData.content.length}/1000 תווים
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md ${themeClasses.hover} ${themeClasses.text} transition-colors`}
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="text-sm">{showPreview ? 'עריכה' : 'תצוגה מקדימה'}</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className={`px-4 py-2 text-sm font-medium ${themeClasses.textSecondary} ${themeClasses.hover} rounded-md transition-colors`}
            >
              ביטול
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.title.trim() || !formData.content.trim()}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <MessageSquare className="w-4 h-4" />
              )}
              <span>{loading ? 'מפרסם...' : 'פרסם פוסט'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;