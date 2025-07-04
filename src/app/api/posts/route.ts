// src/app/api/posts/route.ts - מעודכן למסד הנתונים הקיים
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // בדיקת אימות
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'נדרש להתחבר כדי ליצור פוסט' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, image_url, category_name } = body;

    console.log('Creating post:', { title, content, image_url, category_name, userId: user.id });

    // ולידציה
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'כותרת ותוכן הפוסט נדרשים' },
        { status: 400 }
      );
    }

    // מציאת category_id בהתבסס על השם
    let categoryId = 1; // ברירת מחדל
    if (category_name) {
      try {
        const categoryQuery = 'SELECT id FROM categories WHERE name = $1';
        const categoryResult = await db.query(categoryQuery, [category_name]);
        if (categoryResult.rows.length > 0) {
          categoryId = categoryResult.rows[0].id;
        }
      } catch (err) {
        console.log('Category lookup failed, using default:', err);
      }
    }

    // יצירת הפוסט
    const postQuery = `
      INSERT INTO posts (title, content, image_url, author_id, category_id, likes_count, comments_count, views_count)
      VALUES ($1, $2, $3, $4, $5, 0, 0, 0)
      RETURNING *
    `;

    const postResult = await db.query(postQuery, [
      title.trim(),
      content.trim(),
      image_url || null,
      user.id,
      categoryId
    ]);

    const newPost = postResult.rows[0];
    console.log('Post created:', newPost);

    // החזרת הפוסט החדש
    const responsePost = {
      id: newPost.id,
      title: newPost.title,
      content: newPost.content,
      image_url: newPost.image_url,
      created_at: newPost.created_at,
      author: {
        id: user.id,
        username: user.username,
        avatar: user.avatar
      }
    };

    return NextResponse.json({
      message: 'הפוסט נוצר בהצלחה',
      post: responsePost
    });

  } catch (error: any) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת הפוסט: ' + error.message },
      { status: 500 }
    );
  }
}

// קבלת כל הפוסטים מהמסד הנתונים הקיים
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    console.log('🔄 Fetching posts from database...');

    // שאילתה לקבלת הפוסטים עם פרטי המשתמש והקטגוריה
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
        u.username,
        u.avatar,
        c.name as category_name
      FROM posts p
      JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const result = await db.query(postsQuery, [limit, offset]);
    
    console.log(`✅ Found ${result.rows.length} posts`);

    // המרת הפוסטים לפורמט הנדרש
    const posts = result.rows.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.username,
      authorId: null, // לא שמור במבנה הנוכחי
      authorAvatar: post.avatar || `https://via.placeholder.com/50x50/6366F1/FFFFFF?text=${post.username.substring(0, 2).toUpperCase()}`,
      postImage: post.image_url || generatePlaceholderImage(post.title),
      category: post.category_name || 'כללי',
      likes: parseInt(post.likes_count) || 0,
      replies: parseInt(post.comments_count) || 0,
      views: parseInt(post.views_count) || 0,
      time: getTimeAgo(post.created_at),
      created_at: post.created_at
    }));

    // ספירת סך הפוסטים
    const countResult = await db.query('SELECT COUNT(*) FROM posts');
    const totalPosts = parseInt(countResult.rows[0].count);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit)
      }
    });

  } catch (error: any) {
    console.error('❌ Get posts error:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת הפוסטים: ' + error.message },
      { status: 500 }
    );
  }
}

// פונקציה ליצירת תמונת placeholder
function generatePlaceholderImage(title: string): string {
  const colors = [
    '3B82F6', 'EF4444', '10B981', 'F59E0B', 
    '8B5CF6', 'F97316', 'EC4899', '06B6D4'
  ];
  
  const colorIndex = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  const color = colors[colorIndex];
  const shortText = title.substring(0, 15).replace(/\s+/g, '+');
  
  return `https://via.placeholder.com/800x200/${color}/FFFFFF?text=${encodeURIComponent(shortText)}`;
}

// פונקציה לחישוב זמן יחסי
function getTimeAgo(dateString: string): string {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInMs = now.getTime() - postDate.getTime();
  
  const minutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) {
    return 'עכשיו';
  } else if (minutes < 60) {
    return `לפני ${minutes} דקות`;
  } else if (hours < 24) {
    return `לפני ${hours} שעות`;
  } else if (days < 30) {
    return `לפני ${days} ימים`;
  } else {
    return postDate.toLocaleDateString('he-IL');
  }
}