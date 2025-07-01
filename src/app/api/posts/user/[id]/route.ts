// app/api/posts/user/[id]/route.ts - Get posts by user ID
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { Post } from '@/lib/db/models/Post';
import { User } from '@/lib/db/models/User';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const userId = params.id;
    
    // Find user first to validate
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'משתמש לא נמצא' },
        { status: 404 }
      );
    }

    // Get posts by this user
    const posts = await Post.find({ author: userId })
      .populate('author', 'username avatar')
      .populate('category', 'name color')
      .sort({ createdAt: -1 })
      .lean();

    const formattedPosts = posts.map(post => ({
      id: post._id,
      title: post.title,
      content: post.content,
      image_url: post.imageUrl,
      likes_count: post.likesCount || 0,
      comments_count: post.commentsCount || 0,
      views_count: post.viewsCount || 0,
      created_at: post.createdAt,
      category: {
        name: post.category?.name || 'כללי',
        color: post.category?.color || '#6366F1'
      }
    }));
    
    return NextResponse.json({ 
      posts: formattedPosts,
      user: {
        id: user._id.toString(),
        username: user.username,
        avatar: user.avatar
      },
      count: formattedPosts.length
    });
    
  } catch (error: any) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת פוסטים של המשתמש' },
      { status: 500 }
    );
  }
}