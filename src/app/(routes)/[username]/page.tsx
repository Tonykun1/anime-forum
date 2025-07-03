// src/app/[username]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Calendar, 
  MessageCircle, 
  Heart, 
  User, 
  Settings,
  ArrowLeft,
  Edit,
  Camera,
  MapPin,
  Link as LinkIcon,
  Mail,
  Shield,
  Star,
  Eye
} from 'lucide-react';
import NavBar from '../../Components/NavBar';
import { useCreatePost } from '../../Context/CreatePostContext';
import { ForumPostData } from '../../types';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  joinDate: string;
  postsCount: number;
  likesCount: number;
  role: string;
  location?: string;
  website?: string;
  isOwnProfile: boolean;
}

interface UserPost {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  category: {
    name: string;
    color: string;
  };
}

const UserProfilePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
// src/app/[username]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Calendar, 
  MessageCircle, 
  Heart, 
  User, 
  Settings,
  ArrowLeft,
  Edit,
  Camera,
  MapPin,
  Link as LinkIcon,
  Mail,
  Shield,
  Star,
  Eye
} from 'lucide-react';
import NavBar from '../Components/NavBar';
import { ForumPostData } from '../types';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  joinDate: string;
  postsCount: number;
  likesCount: number;
  role: string;
  location?: string;
  website?: string;
  isOwnProfile: boolean;
}

interface UserPost {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  category: {
    name: string;
    color: string;
  };
}

const UserProfilePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const username = params.username as string;

  // Theme classes
  const themeClasses = {
    bg: isDark ? 'bg-gray-900' : 'bg-gray-50',
    cardBg: isDark ? 'bg-gray-800' : 'bg-white',
    text: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-400' : 'text-gray-600',
    border: isDark ? 'border-gray-700' : 'border-gray-200',
    hover: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
  };

  useEffect(() => {
    if (username) {
      fetchUserProfile();
      fetchUserPosts();
    }
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/users/${username}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('משתמש לא נמצא');
        } else {
          setError('שגיאה בטעינת הפרופיל');
        }
        return;
      }

      const data = await response.json();
      setProfile(data.user);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('שגיאה בטעינת הפרופיל');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`/api/users/${username}/posts`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error('Error fetching user posts:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const toggleTheme = () => setIsDark(!isDark);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleProfileClick = () => {};
  const handleSettingsClick = () => router.push('/settings');

  // פונקציה פשוטה לפתיחת פופאפ - תעבוד רק אם יש Context
  const handleCreatePost = () => {
    try {
      // נסה לקרוא ל-Context אם קיים
      const { useCreatePost } = require('../Context/CreatePostContext');
      const { openCreatePost } = useCreatePost();
      openCreatePost();
    } catch (error) {
      // אם Context לא זמין, פשוט נחזור לעמוד הראשי
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${themeClasses.bg}`}>
        <NavBar
          isDark={isDark}
          toggleTheme={toggleTheme}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          onCreatePost={handleCreatePost}
          onProfileClick={handleProfileClick}
          onSettingsClick={handleSettingsClick}
          themeClasses={themeClasses}
        />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className={`min-h-screen ${themeClasses.bg}`}>
        <NavBar
          isDark={isDark}
          toggleTheme={toggleTheme}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          onCreatePost={handleCreatePost}
          onProfileClick={handleProfileClick}
          onSettingsClick={handleSettingsClick}
          themeClasses={themeClasses}
        />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h1 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
              {error || 'משתמש לא נמצא'}
            </h1>
            <button
              onClick={() => router.back()}
              className="text-blue-400 hover:text-blue-300 flex items-center justify-center mx-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              חזור
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.bg}`}>
      {/* NavBar */}
      <NavBar
        isDark={isDark}
        toggleTheme={toggleTheme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        onCreatePost={handleCreatePost}
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
        themeClasses={themeClasses}
      />

      {/* תמונת רקע */}
      <div className="h-64 bg-gradient-to-r from-blue-600 to-purple-600 relative">
        {profile.coverImage && (
          <img
            src={profile.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      {/* תוכן הפרופיל */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 mb-8">
          <div className={`${themeClasses.cardBg} rounded-lg shadow-xl p-6`}>
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* פרופיל ראשי */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 flex-1">
                {/* תמונת פרופיל */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-gray-700 overflow-hidden bg-gray-700">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={profile.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                        {profile.username.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  {profile.isOwnProfile && (
                    <button className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* פרטי המשתמש */}
                <div className="flex-1 text-center sm:text-right">
                  <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
                    <h1 className={`text-3xl font-bold ${themeClasses.text}`}>{profile.username}</h1>
                    {profile.role === 'admin' && (
                      <Shield className="w-6 h-6 text-yellow-500" />
                    )}
                    {profile.role === 'editor' && (
                      <Star className="w-6 h-6 text-purple-500" />
                    )}
                  </div>

                  {profile.bio && (
                    <p className={`${themeClasses.textSecondary} mb-4 max-w-md`}>{profile.bio}</p>
                  )}

                  <div className={`flex flex-wrap items-center justify-center sm:justify-start space-x-4 text-sm ${themeClasses.textSecondary} mb-4`}>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>הצטרף ב-{formatDate(profile.joinDate)}</span>
                    </div>
                    {profile.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                  </div>

                  {/* סטטיסטיקות */}
                  <div className="flex items-center justify-center sm:justify-start space-x-6 mb-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${themeClasses.text}`}>{profile.postsCount}</div>
                      <div className={`text-sm ${themeClasses.textSecondary}`}>פוסטים</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${themeClasses.text}`}>{profile.likesCount}</div>
                      <div className={`text-sm ${themeClasses.textSecondary}`}>לייקים</div>
                    </div>
                  </div>

                  {/* כפתורי פעולה */}
                  <div className="flex space-x-3">
                    {profile.isOwnProfile ? (
                      <button 
                        onClick={() => router.push('/settings')}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        <span>ערוך פרופיל</span>
                      </button>
                    ) : (
                      <>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span>שלח הודעה</span>
                        </button>
                        <button className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition-colors">
                          עקוב
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* פאנל אודות */}
              <div className={`w-full lg:w-80 ${themeClasses.cardBg} rounded-lg p-6 border ${themeClasses.border}`}>
                <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>אודות</h3>
                <div className="space-y-3">
                  <div className={`flex items-center space-x-3 ${themeClasses.textSecondary}`}>
                    <Mail className="w-5 h-5" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                  {profile.website && (
                    <div className={`flex items-center space-x-3 ${themeClasses.textSecondary}`}>
                      <LinkIcon className="w-5 h-5" />
                      <a 
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        {profile.website}
                      </a>
                    </div>
                  )}
                  <div className={`flex items-center space-x-3 ${themeClasses.textSecondary}`}>
                    <Shield className="w-5 h-5" />
                    <span className="text-sm">
                      {profile.role === 'admin' ? 'מנהל' : 
                       profile.role === 'editor' ? 'עורך' : 'משתמש'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* פוסטים */}
        <div className={`${themeClasses.cardBg} rounded-lg shadow-xl mb-6`}>
          <div className="p-6">
            <h2 className={`text-xl font-bold ${themeClasses.text} mb-6`}>
              פוסטים ({posts.length})
            </h2>
            
            <div className="space-y-6">
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className={`text-xl font-semibold ${themeClasses.text} mb-2`}>אין פוסטים עדיין</h3>
                  <p className={themeClasses.textSecondary}>
                    {profile.isOwnProfile 
                      ? 'התחל לשתף תוכן עם הקהילה!' 
                      : `${profile.username} עדיין לא פרסם תוכן`
                    }
                  </p>
                  {profile.isOwnProfile && (
                    <button
                      onClick={handleCreatePost}
                      className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
                    >
                      צור פוסט ראשון
                    </button>
                  )}
                </div>
              ) : (
                posts.map(post => (
                  <div
                    key={post.id}
                    onClick={() => router.push(`/post/${post.id}`)}
                    className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-lg p-6 ${themeClasses.hover} transition-colors cursor-pointer`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: post.category.color }}
                        >
                          {post.category.name}
                        </span>
                        <span className={`text-sm ${themeClasses.textSecondary}`}>
                          {formatDate(post.created_at)}
                        </span>
                      </div>
                    </div>

                    <h3 className={`text-xl font-semibold ${themeClasses.text} mb-3 hover:text-blue-400 transition-colors`}>
                      {post.title}
                    </h3>

                    <p className={`${themeClasses.textSecondary} mb-4 leading-relaxed`}>
                      {truncateContent(post.content)}
                    </p>

                    {post.image_url && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}

                    <div className={`flex items-center space-x-6 text-sm ${themeClasses.textSecondary}`}>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes_count}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments_count}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;

  const username = params.username as string;

  // Theme classes
  const themeClasses = {
    bg: isDark ? 'bg-gray-900' : 'bg-gray-50',
    cardBg: isDark ? 'bg-gray-800' : 'bg-white',
    text: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-400' : 'text-gray-600',
    border: isDark ? 'border-gray-700' : 'border-gray-200',
    hover: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
  };

  useEffect(() => {
    if (username) {
      fetchUserProfile();
      fetchUserPosts();
    }
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/users/${username}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('משתמש לא נמצא');
        } else {
          setError('שגיאה בטעינת הפרופיל');
        }
        return;
      }

      const data = await response.json();
      setProfile(data.user);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('שגיאה בטעינת הפרופיל');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`/api/users/${username}/posts`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error('Error fetching user posts:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const toggleTheme = () => setIsDark(!isDark);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleProfileClick = () => {};
  const handleSettingsClick = () => router.push('/settings');

  if (loading) {
    return (
      <div className={`min-h-screen ${themeClasses.bg}`}>
        <NavBar
          isDark={isDark}
          toggleTheme={toggleTheme}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          onCreatePost={openCreatePost}
          onProfileClick={handleProfileClick}
          onSettingsClick={handleSettingsClick}
          themeClasses={themeClasses}
        />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className={`min-h-screen ${themeClasses.bg}`}>
        <NavBar
          isDark={isDark}
          toggleTheme={toggleTheme}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          onCreatePost={openCreatePost}
          onProfileClick={handleProfileClick}
          onSettingsClick={handleSettingsClick}
          themeClasses={themeClasses}
        />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h1 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
              {error || 'משתמש לא נמצא'}
            </h1>
            <button
              onClick={() => router.back()}
              className="text-blue-400 hover:text-blue-300 flex items-center justify-center mx-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              חזור
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.bg}`}>
      {/* NavBar */}
      <NavBar
        isDark={isDark}
        toggleTheme={toggleTheme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        onCreatePost={openCreatePost}
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
        themeClasses={themeClasses}
      />

      {/* תמונת רקע */}
      <div className="h-64 bg-gradient-to-r from-blue-600 to-purple-600 relative">
        {profile.coverImage && (
          <img
            src={profile.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      {/* תוכן הפרופיל */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 mb-8">
          <div className={`${themeClasses.cardBg} rounded-lg shadow-xl p-6`}>
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* פרופיל ראשי */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 flex-1">
                {/* תמונת פרופיל */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-gray-700 overflow-hidden bg-gray-700">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={profile.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                        {profile.username.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  {profile.isOwnProfile && (
                    <button className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* פרטי המשתמש */}
                <div className="flex-1 text-center sm:text-right">
                  <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
                    <h1 className={`text-3xl font-bold ${themeClasses.text}`}>{profile.username}</h1>
                    {profile.role === 'admin' && (
                      <Shield className="w-6 h-6 text-yellow-500" />
                    )}
                    {profile.role === 'editor' && (
                      <Star className="w-6 h-6 text-purple-500" />
                    )}
                  </div>

                  {profile.bio && (
                    <p className={`${themeClasses.textSecondary} mb-4 max-w-md`}>{profile.bio}</p>
                  )}

                  <div className={`flex flex-wrap items-center justify-center sm:justify-start space-x-4 text-sm ${themeClasses.textSecondary} mb-4`}>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>הצטרף ב-{formatDate(profile.joinDate)}</span>
                    </div>
                    {profile.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                  </div>

                  {/* סטטיסטיקות */}
                  <div className="flex items-center justify-center sm:justify-start space-x-6 mb-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${themeClasses.text}`}>{profile.postsCount}</div>
                      <div className={`text-sm ${themeClasses.textSecondary}`}>פוסטים</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${themeClasses.text}`}>{profile.likesCount}</div>
                      <div className={`text-sm ${themeClasses.textSecondary}`}>לייקים</div>
                    </div>
                  </div>

                  {/* כפתורי פעולה */}
                  <div className="flex space-x-3">
                    {profile.isOwnProfile ? (
                      <button 
                        onClick={() => router.push('/settings')}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        <span>ערוך פרופיל</span>
                      </button>
                    ) : (
                      <>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span>שלח הודעה</span>
                        </button>
                        <button className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition-colors">
                          עקוב
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* פאנל אודות */}
              <div className={`w-full lg:w-80 ${themeClasses.cardBg} rounded-lg p-6 border ${themeClasses.border}`}>
                <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>אודות</h3>
                <div className="space-y-3">
                  <div className={`flex items-center space-x-3 ${themeClasses.textSecondary}`}>
                    <Mail className="w-5 h-5" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                  {profile.website && (
                    <div className={`flex items-center space-x-3 ${themeClasses.textSecondary}`}>
                      <LinkIcon className="w-5 h-5" />
                      <a 
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        {profile.website}
                      </a>
                    </div>
                  )}
                  <div className={`flex items-center space-x-3 ${themeClasses.textSecondary}`}>
                    <Shield className="w-5 h-5" />
                    <span className="text-sm">
                      {profile.role === 'admin' ? 'מנהל' : 
                       profile.role === 'editor' ? 'עורך' : 'משתמש'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* פוסטים */}
        <div className={`${themeClasses.cardBg} rounded-lg shadow-xl mb-6`}>
          <div className="p-6">
            <h2 className={`text-xl font-bold ${themeClasses.text} mb-6`}>
              פוסטים ({posts.length})
            </h2>
            
            <div className="space-y-6">
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className={`text-xl font-semibold ${themeClasses.text} mb-2`}>אין פוסטים עדיין</h3>
                  <p className={themeClasses.textSecondary}>
                    {profile.isOwnProfile 
                      ? 'התחל לשתף תוכן עם הקהילה!' 
                      : `${profile.username} עדיין לא פרסם תוכן`
                    }
                  </p>
                  {profile.isOwnProfile && (
                    <button
                      onClick={openCreatePost}
                      className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
                    >
                      צור פוסט ראשון
                    </button>
                  )}
                </div>
              ) : (
                posts.map(post => (
                  <div
                    key={post.id}
                    onClick={() => router.push(`/post/${post.id}`)}
                    className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-lg p-6 ${themeClasses.hover} transition-colors cursor-pointer`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: post.category.color }}
                        >
                          {post.category.name}
                        </span>
                        <span className={`text-sm ${themeClasses.textSecondary}`}>
                          {formatDate(post.created_at)}
                        </span>
                      </div>
                    </div>

                    <h3 className={`text-xl font-semibold ${themeClasses.text} mb-3 hover:text-blue-400 transition-colors`}>
                      {post.title}
                    </h3>

                    {post.image_url && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}

                    <div className={`flex items-center space-x-6 text-sm ${themeClasses.textSecondary}`}>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes_count}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments_count}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;