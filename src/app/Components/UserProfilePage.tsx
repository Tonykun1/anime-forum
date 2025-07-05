// src/app/Components/UserProfilePage.tsx
import React, { useState } from 'react';
import { Calendar, Heart, MessageSquare, Edit3, Save, X, Camera, Star, Clock, Eye } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { ForumPostData, ThemeClasses } from '../types';

interface UserProfilePageProps {
  themeClasses: ThemeClasses;
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

  // פילטר פוסטים של המשתמש הנוכחי
  const currentUserPosts = userPosts.filter(post => 
    post.author === user.username
  );

  // פורמט תאריך
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('he-IL');
    } catch {
      return 'תאריך לא זמין';
    }
  };

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
            <div className="absolute top-4 right-4">
              <input
                type="url"
                value={editForm.coverImage}
                onChange={(e) => setEditForm(prev => ({ ...prev, coverImage: e.target.value }))}
                placeholder="קישור לתמונת רקע"
                className="px-3 py-2 rounded-lg bg-black/50 text-white placeholder-gray-300 border border-white/20"
              />
            </div>
          )}
        </div>

        {/* תמונת פרופיל ומידע */}
        <div className="absolute -bottom-16 right-8 flex items-end space-x-4">
          <div className="relative">
            <img
              src={editForm.avatar || `https://via.placeholder.com/120x120/6366F1/FFFFFF?text=${user.username.charAt(0).toUpperCase()}`}
              alt={user.username}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white object-cover"
            />
            {isEditing && (
              <div className="absolute -bottom-2 -right-2">
                <Camera className="w-6 h-6 text-blue-500 bg-white rounded-full p-1" />
              </div>
            )}
          </div>
        </div>

        {/* כפתורי פעולה */}
        <div className="absolute bottom-4 left-4 flex space-x-2">
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
                className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
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

      {/* מידע המשתמש */}
      <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-6 mb-8 mt-16`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-1`}>
                    שם משתמש
                  </label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                    className={`w-full px-3 py-2 border ${themeClasses.border} rounded-md ${themeClasses.cardBg} ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-1`}>
                    אודות
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    className={`w-full px-3 py-2 border ${themeClasses.border} rounded-md ${themeClasses.cardBg} ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="ספר קצת על עצמך..."
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-1`}>
                    תמונת פרופיל (קישור)
                  </label>
                  <input
                    type="url"
                    value={editForm.avatar}
                    onChange={(e) => setEditForm(prev => ({ ...prev, avatar: e.target.value }))}
                    className={`w-full px-3 py-2 border ${themeClasses.border} rounded-md ${themeClasses.cardBg} ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>
            ) : (
              <div>
                <h1 className={`text-3xl font-bold ${themeClasses.text} mb-2`}>
                  {user.username}
                </h1>
                <p className={`${themeClasses.textSecondary} mb-4 leading-relaxed`}>
                  {user.bio || "משתמש חדש בקהילה"}
                </p>
                
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className={themeClasses.textSecondary}>
                      הצטרף ב-{user.joinDate}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-green-500" />
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentUserPosts.map((post) => (
              <div key={post.id} className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg overflow-hidden`}>
                {post.postImage && (
                  <img 
                    src={post.postImage} 
                    alt={post.title}
                    className="w-full h-32 object-cover"
                  />
                )}
                
                <div className="p-4">
                  <h3 className={`font-semibold ${themeClasses.text} mb-2 line-clamp-2`}>
                    {post.title}
                  </h3>
                  
                  <p className={`${themeClasses.textSecondary} text-sm mb-3 line-clamp-3`}>
                    {post.content}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className={themeClasses.textSecondary}>{post.likes}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="w-3 h-3 text-blue-500" />
                        <span className={themeClasses.textSecondary}>{post.replies}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className={`text-xs ${themeClasses.textSecondary}`}>
                        {post.time}
                      </span>
                    </div>
                  </div>
                  
                  {/* קטגוריה */}
                  <div className="mt-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
                      {post.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-8 text-center`}>
            <MessageSquare className={`w-16 h-16 ${themeClasses.textSecondary} mx-auto mb-4`} />
            <h3 className={`text-lg font-medium ${themeClasses.text} mb-2`}>
              עדיין לא פרסמת פוסטים
            </h3>
            <p className={`${themeClasses.textSecondary} mb-4`}>
              צור את הפוסט הראשון שלך ושתף עם הקהילה
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