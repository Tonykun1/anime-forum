// src/app/api/users/[username]/posts/route.ts - מעודכן למסד הנתונים שלך
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    console.log('API: Fetching posts for user:', username);

    // שליפת הפוסטים של המשתמש מהמסד הנתונים שלך
    const postsQuery = `
      SELECT 
        p.id,
        p.title,
        p.content,
        p.image_url,
        p.likes_count,
        p.comments_count,
        p.views_count,
        p.created_at,
        p.updated_at,
        p.category_id,
        p.author_id,
        u.username,
        u.avatar,
        c.name as category_name
      FROM posts p
      JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE u.username = $1
      ORDER BY p.created_at DESC
    `;

    const result = await db.query(postsQuery, [username]);
    
    console.log(`Found ${result.rows.length} posts for user: ${username}`);
    
    // המרת הפוסטים לפורמט הנדרש
    const posts = result.rows.map(post => {
      const timeAgo = getTimeAgo(post.created_at);
      
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        author: post.username,
        authorAvatar: post.avatar || `https://via.placeholder.com/50x50/6366F1/FFFFFF?text=${post.username.substring(0, 2).toUpperCase()}`,
        image_url: post.image_url,
        category: post.category_name || 'כללי',
        likes_count: parseInt(post.likes_count) || 0,
        comments_count: parseInt(post.comments_count) || 0,
        views_count: parseInt(post.views_count) || 0,
        created_at: post.created_at,
        updated_at: post.updated_at,
        time_ago: timeAgo,
        category_id: post.category_id,
        author_id: post.author_id
      };
    });

    return NextResponse.json({
      posts,
      totalPosts: posts.length,
      username: username
    });
    
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת הפוסטים: ' + error.message },
      { status: 500 }
    );
  }
}

// פונקציה לחישוב זמן יחסי
function getTimeAgo(dateString: string): string {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInMs = now.getTime() - postDate.getTime();
  
  const minutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  
  if (minutes < 1) {
    return 'עכשיו';
  } else if (minutes < 60) {
    return `לפני ${minutes} דקות`;
  } else if (hours < 24) {
    return `לפני ${hours} שעות`;
  } else if (days < 7) {
    return `לפני ${days} ימים`;
  } else if (weeks < 4) {
    return `לפני ${weeks} שבועות`;
  } else if (months < 12) {
    return `לפני ${months} חודשים`;
  } else {
    return postDate.toLocaleDateString('he-IL');
  }
}