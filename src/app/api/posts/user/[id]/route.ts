// src/app/api/posts/user/[id]/route.ts - Get posts by user ID עם PostgreSQL
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userIdOrName = params.id;
    let userId: number;
    
    // בדוק אם זה מספר או שם משתמש
    if (isNaN(parseInt(userIdOrName))) {
      // זה שם משתמש - קבל את ה-ID
      const userResult = await db.query(
        'SELECT id FROM users WHERE LOWER(username) = LOWER($1)',
        [userIdOrName]
      );
      
      if (userResult.rows.length === 0) {
        return NextResponse.json(
          { error: 'משתמש לא נמצא' },
          { status: 404 }
        );
      }
      
      userId = userResult.rows[0].id;
    } else {
      userId = parseInt(userIdOrName);
    }
    
    
    // בדוק שהמשתמש קיים
    const userResult = await db.query(
      'SELECT id, username, email, avatar, role FROM users WHERE id = $1',
      [userId]
    );
    
    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'משתמש לא נמצא' },
        { status: 404 }
      );
    }
    
    const user = userResult.rows[0];

    // קבל פוסטים של המשתמש
    const postsResult = await db.query(`
      SELECT 
        p.id,
        p.title,
        p.content,
        p.image_url,
        p.likes_count,
        p.comments_count,
        p.views_count,
        p.created_at,
        u.username as author_username,
        u.avatar as author_avatar,
        c.name as category_name,
        c.color as category_color
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.author_id = $1
      ORDER BY p.created_at DESC
    `, [userId]);

    const formattedPosts = postsResult.rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
      image_url: row.image_url,
      likes_count: row.likes_count || 0,
      comments_count: row.comments_count || 0,
      views_count: row.views_count || 0,
      created_at: row.created_at,
      author: {
        username: row.author_username || 'משתמש',
        avatar: row.author_avatar
      },
      category: {
        name: row.category_name || 'כללי',
        color: row.category_color || '#6366F1'
      }
    }));
    
    return NextResponse.json({ 
      posts: formattedPosts,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      },
      count: formattedPosts.length
    });
    
  } catch (error: any) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת פוסטים של המשתמש: ' + error.message },
      { status: 500 }
    );
  }
}