// src/app/[username]/page.tsx - פרופיל משתמש מתקדם
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Heart, MessageSquare, Edit3, Save, X, Camera, Star, Clock, Eye, RefreshCw, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  role: string;
  created_at: string;
  posts_count: number;
  bio?: string;
  coverImage?: string;
}

interface UserPost {
  id: number;
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

const UserProfilePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    bio: '',
    avatar: '',
    coverImage: ''
  });

  useEffect(() => {
    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const userResponse = await fetch(`/api/users/${username}`);
      if (!userResponse.ok) {
        if (userResponse.status === 404) {
          setError('משתמש לא נמצא');
        } else {
          setError('שגיאה בטעינת המשתמש');
        }
        return;
      }

      const userData = await userResponse.json();
      const userProfile = userData.user;
      
      setUser(userProfile);
      setEditForm({
        username: userProfile.username,
        bio: userProfile.bio || '',
        avatar: userProfile.avatar || '',
        coverImage: userProfile.coverImage || ''
      });

      // טען פוסטים
      fetchUserPosts(userProfile.id);

    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('שגיאה בטעינת הפרופיל');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async (userId: number) => {
    try {
      setPostsLoading(true);
      const postsResponse = await fetch(`/api/posts/user/${userId}`);
      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        setPosts(postsData.posts || []);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setPostsLoading(false);
    }
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

  const handleSave = async () => {
    // כאן תוכל להוסיף לוגיקה לשמירת הפרופיל
    console.log('Saving profile:', editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (user) {
      setEditForm({
        username: user.username,
        bio: user.bio || '',
        avatar: user.avatar || '',
        coverImage: user.coverImage || ''
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">טוען פרופיל...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-white mb-2">{error || 'משתמש לא נמצא'}</h1>
          <p className="text-slate-400 mb-4">המשתמש לא נמצא במערכת</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            חזור לדף הבית
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto">
        {/* כפתור חזרה */}
        <div className="p-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>חזור לפורום</span>
          </button>
        </div>

        {/* תמונת כריכה */}
        <div className="relative mb-8 mx-6">
          <div className="h-48 md:h-64 rounded-xl overflow-hidden relative bg-gradient-to-r from-blue-600 to-purple-600">
            {editForm.coverImage && (
              <Image
                src={editForm.coverImage}
                alt="תמונת רקע"
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            
            {/* כפתורי עריכה */}
            <div className="absolute top-4 left-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>ערוך פרופיל</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>שמור</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>ביטול</span>
                  </button>
                </div>
              )}
            </div>

            {/* עריכת תמונת רקע */}
            {isEditing && (
              <div className="absolute top-4 right-4">
                <button className="bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-2 rounded-lg transition-all">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* תמונת פרופיל */}
          <div className="absolute -bottom-16 right-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-slate-900 overflow-hidden bg-slate-700">
                {user.avatar ? (
                  <Image 
                    src={user.avatar} 
                    alt={user.username}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* פרטי המשתמש */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mx-6 mt-16 mb-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {!isEditing ? (
                <>
                  <h1 className="text-3xl font-bold text-white mb-2">{user.username}</h1>
                  <p className="text-slate-400 mb-4">{user.bio || 'אין תיאור עדיין'}</p>
                </>
              ) : (
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">שם משתמש</label>
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">תיאור</label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
                      placeholder="ספר קצת על עצמך..."
                    />
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>הצטרף {formatDate(user.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>{posts.length} פוסטים</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>{posts.reduce((total, post) => total + (post.likes_count || 0), 0)} לייקים</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{posts.reduce((total, post) => total + (post.views_count || 0), 0)} צפיות</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* פוסטים */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mx-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">הפוסטים שלי</h2>
            <div className="flex gap-2">
              <button
                onClick={() => fetchUserPosts(user.id)}
                disabled={postsLoading}
                className="p-2 text-slate-400 hover:text-white transition-colors"
                title="רענן פוסטים"
              >
                <RefreshCw className={`w-4 h-4 ${postsLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => router.push('/create')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                פוסט חדש
              </button>
            </div>
          </div>
          
          {postsLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 text-slate-400 mx-auto mb-4 animate-spin" />
              <p className="text-slate-400">טוען פוסטים...</p>
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 transition-all">
                  <div className="flex gap-4">
                    {post.image_url && (
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image 
                          src={post.image_url} 
                          alt={post.title} 
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-white line-clamp-2">{post.title}</h3>
                        <span 
                          className="text-xs px-2 py-1 rounded-full text-white flex-shrink-0"
                          style={{ backgroundColor: post.category.color }}
                        >
                          {post.category.name}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 line-clamp-2 mb-3">
                        {post.content}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-red-400" />
                            <span className="text-slate-400">{post.likes_count || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3 text-blue-400" />
                            <span className="text-slate-400">{post.comments_count || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3 text-green-400" />
                            <span className="text-slate-400">{post.views_count || 0}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span className="text-slate-400">{formatDate(post.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">עדיין לא פרסם פוסטים</h3>
              <p className="text-slate-400 mb-4">התחל לשתף את המחשבות שלך עם הקהילה!</p>
              <button
                onClick={() => router.push('/create')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                צור פוסט ראשון
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;