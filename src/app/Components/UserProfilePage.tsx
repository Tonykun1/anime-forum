// src/app/Components/UserProfilePage.tsx - עם טעינת פוסטים מהשרת
import React, { useState, useEffect } from 'react';
import { Calendar, Heart, MessageSquare, Edit3, Save, X, Camera, Star, Clock, Eye, RefreshCw } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import ImageUpload from './ImageUpload';

interface UserPost {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  views_count: number;
  created_at: string;
  category: {
    name: string;
    color: string;
  };
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
  onBack: () => void;
  onCreatePost: () => void;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ 
  themeClasses, 
  onBack,
  onCreatePost 
}) => {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    coverImage: user?.coverImage || ''
  });

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  const fetchUserPosts = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/posts/user/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setUserPosts(data.posts || []);
      } else {
        // If specific user posts endpoint doesn't exist, fetch all posts and filter
        const allPostsResponse = await fetch('/api/posts');
        if (allPostsResponse.ok) {
          const allData = await allPostsResponse.json();
          // Filter posts by current user (you might need to adjust this based on your data structure)
          const filteredPosts = allData.posts.filter((post: any) => 
            post.author?.username === user.username ||
            post.author?.id === user.id ||
            post.author_id === user.id
          );
          setUserPosts(filteredPosts);
        }
      }
    } catch (err) {
      console.error('Error fetching user posts:', err);
      setError('שגיאה בטעינת הפוסטים');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const handleSave = async () => {
    if (updateUserProfile) {
      await updateUserProfile(editForm);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'עכשיו';
    if (diffInHours < 24) return `לפני ${diffInHours} שעות`;
    if (diffInHours < 48) return 'אתמול';
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `לפני ${diffInDays} ימים`;
    
    return date.toLocaleDateString('he-IL');
  };

  const handleRefreshPosts = () => {
    fetchUserPosts();
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
            <div className="absolute top-4 right-4 max-w-xs">
              <ImageUpload
                value={editForm.coverImage}
                onChange={(url) => setEditForm(prev => ({ ...prev, coverImage: url }))}
                label=""
                placeholder="שנה תמונת רקע"
                previewClassName="w-16 h-16"
                className="bg-black/50 text-white"
                themeClasses={themeClasses}
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
                  themeClasses={themeClasses}
                />
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
                <span className={themeClasses.textSecondary}>
                  הצטרף ב{user.joinDate ? new Date(user.joinDate).toLocaleDateString('he-IL') : 'מרץ 2024'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageSquare className={`w-4 h-4 ${themeClasses.textSecondary}`} />
                <span className={themeClasses.textSecondary}>{userPosts.length} פוסטים</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className={`w-4 h-4 ${themeClasses.textSecondary}`} />
                <span className={themeClasses.textSecondary}>
                  {userPosts.reduce((total, post) => total + (post.likes_count || 0), 0)} לייקים
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className={`w-4 h-4 ${themeClasses.textSecondary}`} />
                <span className={themeClasses.textSecondary}>
                  {userPosts.reduce((total, post) => total + (post.views_count || 0), 0)} צפיות
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* פוסטים של המשתמש */}
      <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-bold ${themeClasses.text}`}>הפוסטים שלי</h2>
          <div className="flex space-x-2">
            <button
              onClick={handleRefreshPosts}
              disabled={loading}
              className={`p-2 rounded-lg transition-colors ${themeClasses.hover} ${themeClasses.text}`}
              title="רענן פוסטים"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onCreatePost}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              פוסט חדש
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className={`w-8 h-8 ${themeClasses.textSecondary} mx-auto mb-4 animate-spin`} />
            <p className={themeClasses.textSecondary}>טוען פוסטים...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <MessageSquare className={`w-16 h-16 ${themeClasses.textSecondary} mx-auto mb-4`} />
            <h3 className={`text-lg font-semibold ${themeClasses.text} mb-2`}>שגיאה בטעינת הפוסטים</h3>
            <p className={`${themeClasses.textSecondary} mb-4`}>{error}</p>
            <button
              onClick={handleRefreshPosts}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              נסה שוב
            </button>
          </div>
        ) : userPosts.length > 0 ? (
          <div className="space-y-4">
            {userPosts.map((post) => (
              <div key={post.id} className={`${themeClasses.hover} border ${themeClasses.border} rounded-lg p-4 transition-colors`}>
                <div className="flex gap-4">
                  {post.image_url && (
                    <img 
                      src={post.image_url} 
                      alt={post.title} 
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0" 
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-semibold ${themeClasses.text} line-clamp-2`}>{post.title}</h3>
                      <span 
                        className="text-xs px-2 py-1 rounded-full text-white"
                        style={{ backgroundColor: post.category.color }}
                      >
                        {post.category.name}
                      </span>
                    </div>
                    <p className={`text-sm ${themeClasses.textSecondary} line-clamp-2 mb-3`}>
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-3 h-3 text-red-500" />
                          <span className={themeClasses.textSecondary}>{post.likes_count || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-3 h-3 text-blue-500" />
                          <span className={themeClasses.textSecondary}>{post.comments_count || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3 text-green-500" />
                          <span className={themeClasses.textSecondary}>{post.views_count || 0}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className={themeClasses.textSecondary}>{formatDate(post.created_at)}</span>
                      </div>
                    </div>
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