// app/profile/[username]/page.tsx - מעודכן עם קומפוננט PostsList
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/Context/AuthContext';
import PostsList from '@/app/Components/PostsList';
import { 
  Calendar, 
  MessageCircle, 
  Heart, 
  User, 
  ArrowLeft,
  Edit,
  Camera,
  MapPin,
  Link as LinkIcon,
  Mail,
  Shield,
  Star
} from 'lucide-react';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth(); // המשתמש המחובר
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postsFilter, setPostsFilter] = useState<string>('all'); // פילטר לפוסטים

  const username = params.username as string;

  // Theme classes
  const themeClasses = {
    bg: 'bg-gray-900',
    cardBg: 'bg-gray-800',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    border: 'border-gray-700',
    hover: 'hover:bg-gray-700'
  };

  useEffect(() => {
    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching profile for:', username);
      
      const response = await fetch(`/api/users/${username}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'משתמש לא נמצא');
        return;
      }

      const data = await response.json();
      console.log('✅ Profile fetched:', data);
      
      // בדיקה אם זה הפרופיל של המשתמש המחובר
      const isOwnProfile = currentUser?.username === username;
      
      setProfile({
        ...data.user,
        isOwnProfile
      });
      
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching profile:', err);
      setError('שגיאה בטעינת הפרופיל');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('he-IL');
    } catch {
      return dateString;
    }
  };

  // קומפוננט PostsList מותאם אישית לפרופיל
  const UserPostsList = () => {
    return (
      <PostsList
        className="mt-6"
        themeClasses={themeClasses}
        layout="list"
        limit={10}
        // נעביר את שם המשתמש כפרמטר להגבלת הפוסטים
        // אבל קודם צריך להוסיף תמיכה בזה ב-API
      />
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">
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
    <div className="min-h-screen bg-gray-900">
      {/* Cover Image */}
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

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 mb-8">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Main Profile */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 flex-1">
                {/* Profile Picture */}
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
                    <button className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* User Details */}
                <div className="flex-1 text-center sm:text-right">
                  <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
                    <h1 className="text-3xl font-bold text-white">{profile.username}</h1>
                    {profile.role === 'admin' && (
                      <Shield className="w-6 h-6 text-yellow-500" />
                    )}
                  </div>

                  {profile.bio && (
                    <p className="text-gray-400 mb-4 max-w-md">{profile.bio}</p>
                  )}

                  <div className="flex flex-wrap items-center justify-center sm:justify-start space-x-4 text-sm text-gray-400 mb-4">
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

                  {/* Stats */}
                  <div className="flex items-center justify-center sm:justify-start space-x-6 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{profile.postsCount}</div>
                      <div className="text-sm text-gray-400">פוסטים</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{profile.likesCount}</div>
                      <div className="text-sm text-gray-400">לייקים</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    {profile.isOwnProfile ? (
                      <button 
                        onClick={() => router.push('/settings')}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        <span>עריכת פרופיל</span>
                      </button>
                    ) : (
                      <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>שלח הודעה</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* About Panel */}
              <div className="w-full lg:w-80 bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">אודות</h3>
                <div className="space-y-3">
                  {profile.isOwnProfile && (
                    <div className="flex items-center space-x-3 text-gray-400">
                      <Mail className="w-5 h-5" />
                      <span className="text-sm">{profile.email}</span>
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-center space-x-3 text-gray-400">
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
                  <div className="flex items-center space-x-3 text-gray-400">
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

        {/* Posts Section */}
        <div className="bg-gray-800 rounded-lg shadow-xl mb-6">
          <div className="p-6">
            {/* כותרת עם פילטרים */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-xl font-bold text-white mb-4 sm:mb-0">
                פוסטים של {profile.username}
              </h2>
              
              {/* פילטרים */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setPostsFilter('all')}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    postsFilter === 'all' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  הכל
                </button>
                <button
                  onClick={() => setPostsFilter('recent')}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    postsFilter === 'recent' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  אחרונים
                </button>
                <button
                  onClick={() => setPostsFilter('popular')}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    postsFilter === 'popular' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  פופולריים
                </button>
              </div>
            </div>
            
            {/* רכיב PostsList מותאם אישית */}
            <UserPostsListComponent 
              username={username} 
              themeClasses={themeClasses}
              isOwnProfile={profile.isOwnProfile}
              filter={postsFilter}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// קומפוננט נפרד לפוסטים של המשתמש
interface UserPostsListComponentProps {
  username: string;
  themeClasses: any;
  isOwnProfile: boolean;
  filter: string;
}

const UserPostsListComponent: React.FC<UserPostsListComponentProps> = ({ 
  username, 
  themeClasses, 
  isOwnProfile,
  filter 
}) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserPosts();
  }, [username, filter]);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching posts for user:', username);
      
      const response = await fetch(`/api/users/${username}/posts`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'שגיאה בטעינת פוסטים');
      }
      
      const data = await response.json();
      console.log('✅ User posts fetched:', data);
      
      let userPosts = data.posts || [];
      
      // מיון לפי הפילטר
      if (filter === 'recent') {
        userPosts = userPosts.sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else if (filter === 'popular') {
        userPosts = userPosts.sort((a: any, b: any) => 
          (b.likes_count + b.comments_count) - (a.likes_count + a.comments_count)
        );
      }
      
      setPosts(userPosts);
      
    } catch (err: any) {
      console.error('❌ Error fetching user posts:', err);
      setError(err.message || 'שגיאה בטעינת פוסטים');
    } finally {
      setLoading(false);
    }
  };

  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={`skeleton-${index}`} className="bg-gray-700 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-600 rounded mb-2"></div>
            <div className="h-3 bg-gray-600 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">שגיאה בטעינת פוסטים</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={fetchUserPosts}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          נסה שוב
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">אין פוסטים עדיין</h3>
        <p className="text-gray-400 mb-4">
          {isOwnProfile 
            ? 'עדיין לא פרסמת תוכן. בואו ניצור את הפוסט הראשון שלך!'
            : `${username} עדיין לא פרסם תוכן`
          }
        </p>
        {isOwnProfile && (
          <button
            onClick={() => router.push('/newpost')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
          >
            צור פוסט ראשון
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map(post => (
        <div
          key={post.id}
          className="bg-gray-700 rounded-lg p-6 hover:bg-gray-650 transition-colors cursor-pointer"
        >
          {/* תמונת פוסט */}
          {post.image_url && (
            <div className="mb-4">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
          
          {/* כותרת */}
          <h3 className="text-xl font-semibold text-white mb-3 hover:text-blue-400 transition-colors">
            {post.title}
          </h3>
          
          {/* תוכן */}
          <p className="text-gray-300 mb-4 leading-relaxed">
            {truncateContent(post.content)}
          </p>
          
          {/* מטה-דאטה */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{post.likes_count || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments_count || 0}</span>
              </div>
              {post.category && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {post.category}
                </span>
              )}
            </div>
            
            <div className="text-sm text-gray-400">
              {post.time_ago}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};