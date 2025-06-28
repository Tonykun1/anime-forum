// app/anime/[id]/page.tsx - עמוד אנימה
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Star, 
  Calendar, 
  Film, 
  Clock, 
  Eye, 
  Play, 
  Plus, 
  MessageSquare,
  Heart,
  Share,
  Bookmark,
  Check
} from 'lucide-react';
import Image from 'next/image';

interface Anime {
  id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  description?: string;
  image_url?: string;
  banner_url?: string;
  trailer_url?: string;
  type: 'series' | 'movie' | 'ova' | 'special';
  status: 'ongoing' | 'completed' | 'upcoming' | 'cancelled';
  genre: string[];
  year?: number;
  episodes?: number;
  duration_minutes?: number;
  rating?: number;
  studio?: string;
  director?: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    username: string;
    avatar?: string;
  };
  likes_count: number;
  comments_count: number;
  created_at: string;
}

const AnimePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchStatus, setWatchStatus] = useState<string>('planning');

  useEffect(() => {
    fetchAnime();
    fetchAnimePosts();
  }, [params.id]);

  const fetchAnime = async () => {
    try {
      const response = await fetch(`/api/animes/${params.id}`);
      if (!response.ok) {
        throw new Error('אנימה לא נמצאה');
      }
      const data = await response.json();
      setAnime(data.anime);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בטעינת אנימה');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnimePosts = async () => {
    try {
      const response = await fetch(`/api/posts?anime_id=${params.id}&limit=10`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handleWatchlistToggle = async () => {
    try {
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          anime_id: anime?.id, 
          status: inWatchlist ? null : watchStatus 
        }),
      });
      
      if (response.ok) {
        setInWatchlist(!inWatchlist);
      }
    } catch (err) {
      console.error('Error updating watchlist:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'upcoming': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ongoing': return 'בהקרנה';
      case 'completed': return 'הסתיים';
      case 'upcoming': return 'בקרוב';
      case 'cancelled': return 'בוטל';
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'series': return 'סדרה';
      case 'movie': return 'סרט';
      case 'ova': return 'OVA';
      case 'special': return 'מיוחד';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">שגיאה</h1>
          <p className="text-gray-400 mb-4">{error || 'אנימה לא נמצאה'}</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            חזור
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Banner Section */}
      <div className="relative h-96 overflow-hidden">
        {anime.banner_url && (
          <Image
            src={anime.banner_url}
            alt={anime.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
        
        {/* Anime Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto flex items-end gap-6">
            {/* Poster */}
            <div className="flex-shrink-0">
              <div className="w-48 h-64 rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={anime.image_url || '/placeholder-anime.jpg'}
                  alt={anime.title}
                  width={192}
                  height={256}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 pb-4">
              <h1 className="text-4xl font-bold mb-2">{anime.title}</h1>
              {anime.title_english && (
                <p className="text-xl text-gray-300 mb-1">{anime.title_english}</p>
              )}
              {anime.title_japanese && (
                <p className="text-lg text-gray-400 mb-4">{anime.title_japanese}</p>
              )}

              <div className="flex items-center gap-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(anime.status)}`}>
                  {getStatusText(anime.status)}
                </span>
                <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                  {getTypeText(anime.type)}
                </span>
                {anime.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-semibold">{anime.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {anime.trailer_url && (
                  <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors">
                    <Play className="w-5 h-5" />
                    צפה בטריילר
                  </button>
                )}
                <button
                  onClick={handleWatchlistToggle}
                  className={`px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors ${
                    inWatchlist 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {inWatchlist ? <Check className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                  {inWatchlist ? 'ברשימה' : 'הוסף לרשימה'}
                </button>
                <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                  <Share className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {anime.description && (
              <section className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">תקציר</h2>
                <p className="text-gray-300 leading-relaxed">{anime.description}</p>
              </section>
            )}

            {/* Related Posts */}
            <section className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">פוסטים קשורים</h2>
                <button 
                  onClick={() => router.push(`/anime/${anime.id}/posts`)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  ראה הכל
                </button>
              </div>
              
              {posts.length > 0 ? (
                <div className="space-y-4">
                  {posts.map(post => (
                    <div key={post.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer">
                      <h3 className="font-semibold mb-2">{post.title}</h3>
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">{post.content}</p>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          {post.author.avatar && (
                            <img 
                              src={post.author.avatar} 
                              alt={post.author.username}
                              className="w-6 h-6 rounded-full"
                            />
                          )}
                          <span>{post.author.username}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>{post.likes_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.comments_count}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">עדיין אין פוסטים על האנימה הזו</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                    צור פוסט ראשון
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">פרטים</h3>
              <div className="space-y-3">
                {anime.year && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">שנה:</span>
                    <span>{anime.year}</span>
                  </div>
                )}
                {anime.episodes && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">פרקים:</span>
                    <span>{anime.episodes}</span>
                  </div>
                )}
                {anime.duration_minutes && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">משך פרק:</span>
                    <span>{anime.duration_minutes} דקות</span>
                  </div>
                )}
                {anime.studio && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">אולפן:</span>
                    <span>{anime.studio}</span>
                  </div>
                )}
                {anime.director && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">במאי:</span>
                    <span>{anime.director}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Genres */}
            {anime.genre && anime.genre.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">ז'אנרים</h3>
                <div className="flex flex-wrap gap-2">
                  {anime.genre.map((genre, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm cursor-pointer hover:bg-blue-700 transition-colors"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Watch Progress (if in watchlist) */}
            {inWatchlist && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">התקדמות צפייה</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">סטטוס:</label>
                    <select 
                      value={watchStatus}
                      onChange={(e) => setWatchStatus(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="planning">מתכנן לצפות</option>
                      <option value="watching">צופה</option>
                      <option value="completed">סיימתי</option>
                      <option value="paused">השהיתי</option>
                      <option value="dropped">עזבתי</option>
                    </select>
                  </div>
                  {anime.episodes && (
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">פרקים שנצפו:</label>
                      <input 
                        type="number"
                        min="0"
                        max={anime.episodes}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        placeholder="0"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">הדירוג שלי:</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star}
                          className="w-6 h-6 text-yellow-400 cursor-pointer hover:fill-current transition-colors"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimePage;