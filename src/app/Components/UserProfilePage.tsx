// src/components/UserProfilePage.tsx
import React, { useState } from 'react';
import { Calendar, Heart, MessageSquare, Edit3, Save, X, Camera, Star, Clock } from 'lucide-react';
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

interface UserProfilePageProps {
  themeClasses: {
    bg: string;
    cardBg: string;
    text: string;
    textSecondary: string;
    border: string;
    hover: string;
  };
  userPosts: ForumPostData[];
  onBack: () => void;
  onCreatePost: () => void;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ 
  themeClasses, 
  userPosts, 
  onBack,
  onCreatePost 
}) => {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    coverImage: user?.coverImage || ''
  });

  if (!user) return null;

  const handleSave = () => {
    updateUserProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      username: user.username,
      bio: user.bio || '',
      avatar: user.avatar,
      coverImage: user.coverImage || ''
    });
    setIsEditing(false);
  };

  // סינון פוסטים של המשתמש הנוכחי
  const currentUserPosts = userPosts.filter(post => post.authorId === user.id);

  return (
    <div className="max-w-4xl mx-auto">
      {/* כפתור חזרה */}
      <button
        onClick={onBack}
        className={`mb-6 flex items-center space-x-2 px-4 py-2 rounded-lg ${themeClasses.hover} ${themeClasses.text} transition-colors`}
      >
        <span>← חזור לפורום</span>
      </button>

      {/* תמונת רקע */}
      <div className="relative mb-8">
        <div className="h-48 md:h-64 rounded-lg overflow-hidden relative">
          <img
            src={editForm.coverImage || "https://via.placeholder.com/800x200/6366F1/FFFFFF?text=Cover+Image"}
            alt="תמונת רקע"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* עריכת תמונת רקע */}
          {isEditing && (
            <div className="absolute top-4 right-4 max-w-xs">
              <ImageUpload
                value={editForm.coverImage}
                onChange={(url) => setEditForm(prev => ({ ...prev, coverImage: url }))}
                label=""
                placeholder="שנה תמונת רקע"
                previewClassName="w-16 h-16"
                className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg"
                themeClasses={themeClasses}
              />
            </div>
          )}
        </div>

        {/* תמונת פרופיל */}
        <div className="absolute -bottom-16 right-8">
          <div className="relative">
            <img
              src={editForm.avatar || `https://via.placeholder.com/128x128/6366F1/FFFFFF?text=${editForm.username?.charAt(0)?.toUpperCase() || 'U'}`}
              alt={editForm.username}
              className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg"
            />
            {isEditing && (
              <div className="absolute -bottom-2 -left-2">
                <ImageUpload
                  value={editForm.avatar}
                  onChange={(url) => setEditForm(prev => ({ ...prev, avatar: url }))}
                  label=""
                  placeholder="שנה תמונת פרופיל"
                  previewClassName="w-12 h-12 rounded-full"
                  className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg max-w-xs"
                  themeClasses={themeClasses}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* פרטי המשתמש */}
      <div className="mt-20 mb-8">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                    שם משתמש
                  </label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                    className={`text-2xl font-bold ${themeClasses.text} ${themeClasses.cardBg} border-2 border-blue-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="שם משתמש"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                    אודות
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    className={`w-full px-3 py-2 border ${themeClasses.border} rounded-md ${themeClasses.cardBg} ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                    placeholder="ספר על עצמך..."
                    rows={3}
                    maxLength={200}
                  />
                  <p className={`text-xs ${themeClasses.textSecondary} mt-1`}>
                    {editForm.bio.length}/200 תווים
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h1 className={`text-3xl font-bold ${themeClasses.text} mb-2`}>
                  {user.username}
                </h1>
                <p className={`${themeClasses.textSecondary} text-lg mb-4`}>
                  {user.bio || 'משתמש בקהילה'}
                </p>
              </div>
            )}

            {/* סטטיסטיקות */}
            <div className="flex items-center space-x-6 text-sm mb-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className={themeClasses.textSecondary}>
                  הצטרף ב{new Date(user.joinDate).toLocaleDateString('he-IL')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                <span className={themeClasses.textSecondary}>
                  {user.postsCount} פוסטים
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span className={themeClasses.textSecondary}>
                  {user.likesCount} לייקים
                </span>
              </div>
            </div>
          </div>

          {/* כפתורי עריכה */}
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>שמור</span>
                </button>
                <button
                  onClick={handleCancel}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${themeClasses.hover} ${themeClasses.text} transition-colors`}
                >
                  <X className="w-4 h-4" />
                  <span>ביטול</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>עריכת פרופיל</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* פוסטים של המשתמש */}
      <div>
        <h2 className={`text-2xl font-bold ${themeClasses.text} mb-6`}>
          הפוסטים שלי ({currentUserPosts.length})
        </h2>
        
        {currentUserPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentUserPosts.map(post => (
              <div key={post.id} className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg overflow-hidden ${themeClasses.hover} transition-colors`}>
                {/* תמונת הפוסט */}
                <div className="relative">
                  <img 
                    src={post.postImage} 
                    alt={post.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  
                  {/* סטטיסטיקות על התמונה */}
                  <div className="absolute bottom-2 right-2">
                    <div className="flex items-center space-x-3 text-xs text-white">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="w-3 h-3 text-blue-400" />
                        <span>{post.replies}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{post.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* תוכן הפוסט */}
                <div className="p-4">
                  {/* קטגוריה */}
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs rounded-full">
                      {post.category}
                    </span>
                  </div>
                  
                  {/* כותרת */}
                  <h3 className={`font-semibold ${themeClasses.text} text-sm line-clamp-2 mb-2`}>
                    {post.title}
                  </h3>
                  
                  {/* תוכן */}
                  <p className={`text-xs ${themeClasses.textSecondary} line-clamp-3`}>
                    {post.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-8 text-center`}>
            <MessageSquare className={`w-16 h-16 ${themeClasses.textSecondary} mx-auto mb-4`} />
            <h3 className={`text-lg font-semibold ${themeClasses.text} mb-2`}>
              עדיין לא יצרת פוסטים
            </h3>
            <p className={`${themeClasses.textSecondary} mb-4`}>
              בואו נתחיל! צור את הפוסט הראשון שלך ושתף עם הקהילה
            </p>
            <button
              onClick={onCreatePost}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              צור פוסט חדש
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;