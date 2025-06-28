// app/post/[id]/page.tsx - עמוד פוסט עם תגובות אמיתי
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Heart, 
  MessageSquare, 
  Share, 
  Eye, 
  Clock, 
  User,
  Reply,
  MoreHorizontal,
  Flag,
  Edit,
  Trash2,
  ThumbsUp,
  Send
} from 'lucide-react';
import Image from 'next/image';

interface Post {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  category: string;
  anime_id?: number;
  author: {
    id: number;
    username: string;
    avatar?: string;
    role: string;
  };
  anime?: {
    id: number;
    title: string;
    image_url?: string;
  };
  likes_count: number;
  comments_count: number;
  views_count: number;
  is_pinned: boolean;
  created_at: string;
}

interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
    avatar?: string;
    role: string;
  };
  likes_count: number;
  created_at: string;
  replies?: Comment[];
}

interface User {
  id: number;
  username: string;
  avatar?: string;
  role: string;
}

const PostPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [likedPost, setLikedPost] = useState(false);
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchPost();
      fetchComments();
      fetchCurrentUser();
    }
  }, [params.id]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
      }
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('פוסט לא נמצא');
      }
      const data = await response.json();
      setPost(data.post);
      setLikedPost(data.userLiked || false);
      
      // Increment view count
      await fetch(`/api/posts/${params.id}/view`, { 
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בטעינת פוסט');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}/comments`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
        setLikedComments(new Set(data.userLikedComments || []));
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleLikePost = async () => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`/api/posts/${params.id}/like`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setLikedPost(data.liked);
        if (post) {
          setPost({
            ...post,
            likes_count: data.count
          });
        }
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        const newLikedComments = new Set(likedComments);
        
        if (data.liked) {
          newLikedComments.add(commentId);
        } else {
          newLikedComments.delete(commentId);
        }
        
        setLikedComments(newLikedComments);
        
        // Update comment likes count
        setComments(prevComments => 
          updateCommentLikes(prevComments, commentId, data.count)
        );
      }
    } catch (err) {
      console.error('Error liking comment:', err);
    }
  };

  const updateCommentLikes = (comments: Comment[], commentId: number, newCount: number): Comment[] => {
    return comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, likes_count: newCount };
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: updateCommentLikes(comment.replies, commentId, newCount)
        };
      }
      return comment;
    });
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    if (!newComment.trim()) return;

    setSubmittingComment(true);

    try {
      const response = await fetch(`/api/posts/${params.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          content: newComment,
          parent_id: replyTo
        }),
      });

      if (response.ok) {
        setNewComment('');
        setReplyTo(null);
        fetchComments(); // Refresh comments
        
        // Update comments count in post
        if (post) {
          setPost({
            ...post,
            comments_count: post.comments_count + 1
          });
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'שגיאה בשליחת התגובה');
      }
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('שגיאה בשליחת התגובה');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      alert('הקישור הועתק ללוח');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'לפני כמה דקות';
    if (diffInHours < 24) return `לפני ${diffInHours} שעות`;
    if (diffInHours < 48) return 'אתמול';
    return date.toLocaleDateString('he-IL');
  };

  const renderComment = (comment: Comment, depth = 0) => (
    <div key={comment.id} className={`${depth > 0 ? 'mr-8 mt-4' : 'mb-6'}`}>
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <img
              src={comment.author.avatar || '/placeholder-avatar.jpg'}
              alt={comment.author.username}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-white">{comment.author.username}</span>
                {comment.author.role === 'admin' && (
                  <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded">מנהל</span>
                )}
                {comment.author.role === 'editor' && (
                  <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded">עורך</span>
                )}
              </div>
              <p className="text-sm text-gray-400">{formatDate(comment.created_at)}</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-300">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <p className="text-gray-300 mb-3 whitespace-pre-wrap">{comment.content}</p>

        <div className="flex items-center gap-4 text-sm">
          <button
            onClick={() => handleLikeComment(comment.id)}
            className={`flex items-center gap-1 transition-colors ${
              likedComments.has(comment.id) 
                ? 'text-red-500' 
                : 'text-gray-400 hover:text-red-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${likedComments.has(comment.id) ? 'fill-current' : ''}`} />
            <span>{comment.likes_count}</span>
          </button>
          
          {currentUser && depth < 2 && (
            <button
              onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
              className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors"
            >
              <Reply className="w-4 h-4" />
              <span>השב</span>
            </button>
          )}
          
          <button className="text-gray-400 hover:text-yellow-400 transition-colors">
            <Flag className="w-4 h-4" />
          </button>
        </div>

        {replyTo === comment.id && currentUser && (
          <form onSubmit={handleSubmitComment} className="mt-4">
            <div className="flex gap-3">
              <img
                src={currentUser.avatar || '/placeholder-avatar.jpg'}
                alt={currentUser.username}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={`תגובה ל-${comment.author.username}...`}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                  rows={3}
                  required
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setReplyTo(null);
                      setNewComment('');
                    }}
                    className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    disabled={submittingComment || !newComment.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {submittingComment ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    שלח
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      {comment.replies && comment.replies.map(reply => renderComment(reply, depth + 1))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">שגיאה</h1>
          <p className="text-gray-400 mb-4">{error || 'פוסט לא נמצא'}</p>
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Post Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs">
              {post.category}
            </span>
            {post.is_pinned && (
              <span className="px-2 py-1 bg-yellow-600 text-white rounded text-xs">
                נעוץ
              </span>
            )}
            {post.anime && (
              <span 
                className="text-blue-400 hover:text-blue-300 cursor-pointer"
                onClick={() => router.push(`/anime/${post.anime!.id}`)}
              >
                {post.anime.title}
              </span>
            )}
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar || '/placeholder-avatar.jpg'}
                alt={post.author.username}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{post.author.username}</span>
                  {post.author.role === 'admin' && (
                    <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded">מנהל</span>
                  )}
                  {post.author.role === 'editor' && (
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded">עורך</span>
                  )}
                </div>
                <p className="text-sm text-gray-400">{formatDate(post.created_at)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{post.views_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{post.comments_count}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          {post.image_url && (
            <div className="mb-6">
              <Image
                src={post.image_url}
                alt={post.title}
                width={800}
                height={400}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
          </div>
        </div>

        {/* Post Actions */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLikePost}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                likedPost 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${likedPost ? 'fill-current' : ''}`} />
              <span>{post.likes_count}</span>
            </button>
            
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <Share className="w-5 h-5" />
              <span>שתף</span>
            </button>
          </div>
          
          <button className="text-gray-400 hover:text-yellow-400 transition-colors">
            <Flag className="w-5 h-5" />
          </button>
        </div>

        {/* Comments Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            תגובות ({comments.length})
          </h2>

          {/* Comment Form */}
          {currentUser && !replyTo && (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <div className="flex gap-3">
                <img
                  src={currentUser.avatar || '/placeholder-avatar.jpg'}
                  alt={currentUser.username}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="כתוב תגובה..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                    rows={4}
                    required
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      type="submit"
                      disabled={submittingComment || !newComment.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {submittingComment ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      שלח תגובה
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {!currentUser && (
            <div className="mb-8 bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-400 mb-4">התחבר כדי להגיב על הפוסט</p>
              <button
                onClick={() => router.push('/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                התחבר
              </button>
            </div>
          )}

          {/* Comments List */}
          <div>
            {comments.length > 0 ? (
              comments.map(comment => renderComment(comment))
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">עדיין אין תגובות על הפוסט הזה</p>
                <p className="text-gray-500">היה הראשון להגיב!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;