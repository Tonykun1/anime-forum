// src/app/Components/UserProfilePage.tsx - עם מזהי string
import React, { useState } from 'react';
import { Calendar, Heart, MessageSquare, Edit3, Save, X, Camera, Star, Clock } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import ImageUpload from './ImageUpload';
import { ForumPostData } from '../types/ForumPost';

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
    if (updateUserProfile) {
      updateUserProfile(editForm);
    }
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
                className="bg-black/50 text-white"
              />
            </div>
          )}
        </div>

        {/* תמונת פרופיל ומידע */}
        <div className="absolute -bottom-16 right-8 flex items-end space-x-4">
          <div className="relative">
            <img
              src={user.avatar || "https://via.placeholder.com/128x128/6366F1/FFFFFF?text=U"}
              alt={user.username}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
            {isEditing && (
              <div className="absolute top-0 right-0">
                <ImageUpload
                  value={editForm.avatar}
                  onChange={(url) => setEditForm(prev => ({ ...prev, avatar: url }))}
                  label=""
                  placeholder="שנה תמונה"
                  previewClassName="w-8 h-8"
                  className="bg-blue-500 text-white p-2 rounded-full"
                >
                  <Camera className="w-4 h-4" />
                </ImageUpload>
              </div>
            )}
          </div>
        </div>

        {/* כפתור עריכה */}
        <div className="absolute top-4 left-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>ערוך פרופיל</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>שמור</span>
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>ביטול</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* מידע אישי */}
      <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-6 mb-6 mt-16`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {!isEditing ? (
              <>
                <h1 className={`text-3xl font-bold ${themeClasses.text} mb-2`}>{user.username}</h1>
                <p className={`${themeClasses.textSecondary} mb-4`}>{user.bio || 'אין תיאור עדיין'}</p>
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>שם משתמש</label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                    className={`w-full px-3 py-2 border ${themeClasses.border} rounded-lg ${themeClasses.cardBg} ${themeClasses.text}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>תיאור</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className={`w-full px-3 py-2 border ${themeClasses.border} rounded-lg ${themeClasses.cardBg} ${themeClasses.text}`}
                    placeholder="ספר קצת על עצמך..."
                  />
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className={`w-4 h-4 ${themeClasses.textSecondary}`} />
                <span className={themeClasses.textSecondary}>הצטרף במרץ 2024</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageSquare className={`w-4 h-4 ${themeClasses.textSecondary}`} />
                <span className={themeClasses.textSecondary}>{currentUserPosts.length} פוסטים</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className={`w-4 h-4 ${themeClasses.textSecondary}`} />
                <span className={themeClasses.textSecondary}>156 לייקים</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* פוסטים של המשתמש */}
      <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-bold ${themeClasses.text}`}>הפוסטים שלי</h2>
          <button
            onClick={onCreatePost}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            פוסט חדש
          </button>
        </div>
        
        {currentUserPosts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentUserPosts.map((post) => (
              <div key={post.id} className={`${themeClasses.hover} border ${themeClasses.border} rounded-lg p-4 transition-colors`}>
                <img src={post.postImage} alt={post.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                <h3 className={`font-semibold ${themeClasses.text} mb-2 line-clamp-2`}>{post.title}</h3>
                <p className={`text-sm ${themeClasses.textSecondary} line-clamp-3 mb-3`}>{post.content}</p>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className={themeClasses.textSecondary}>{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-3 h-3 text-blue-500" />
                      <span className={themeClasses.textSecondary}>{post.replies}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className={themeClasses.textSecondary}>{post.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className={`w-16 h-16 ${themeClasses.textSecondary} mx-auto mb-4`} />
            <h3 className={`text-lg font-semibold ${themeClasses.text} mb-2`}>עדיין לא פרסמת פוסטים</h3>
            <p className={`${themeClasses.textSecondary} mb-4`}>התחל לשתף את המחשבות שלך עם הקהילה!</p>
            <button
              onClick={onCreatePost}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              צור פוסט ראשון
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;