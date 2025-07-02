// SimpleCreatePostModal.tsx - מודאל פשוט ליצירת פוסט
import React, { useState } from 'react';
import { X, MessageSquare } from 'lucide-react';

interface SimpleCreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  themeClasses: {
    bg: string;
    cardBg: string;
    text: string;
    textSecondary: string;
    border: string;
    hover: string;
  };
}

const SimpleCreatePostModal: React.FC<SimpleCreatePostModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  themeClasses
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    category_name: 'דיונים'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      setError('אנא מלא את כל השדות הנדרשים');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        handleClose();
        onSuccess();
      } else {
        setError(data.error || 'שגיאה ביצירת הפוסט');
      }
    } catch (err) {
      setError('שגיאת רשת');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ title: '', content: '', image_url: '', category_name: 'דיונים' });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${themeClasses.cardBg} rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden`}>
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
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category */}
            <div>
              <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                קטגוריה
              </label>
              <select
                value={formData.category_name}
                onChange={(e) => setFormData(prev => ({ ...prev, category_name: e.target.value }))}
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

            {/* Image URL */}
            <div>
              <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                תמונת פוסט (קישור)
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                className={`w-full px-3 py-2 border ${themeClasses.border} rounded-md ${themeClasses.cardBg} ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="https://example.com/image.jpg (אופציונלי)"
              />
            </div>

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

            {/* Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className={`px-4 py-2 text-sm font-medium ${themeClasses.textSecondary} ${themeClasses.hover} rounded-md transition-colors`}
              >
                ביטול
              </button>
              <button
                type="submit"
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default SimpleCreatePostModal;