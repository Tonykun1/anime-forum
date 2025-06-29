// src/app/api/posts/route.ts - כפיית reset של המשתמשים
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { Post } from '@/lib/db/models/Post';
import { User } from '@/lib/db/models/User';
import { Category } from '@/lib/db/models/Category';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// פונקציה לקבלת משתמש מ-token
async function getUserFromToken(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return null;
    
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await User.findById(decoded.userId);
    return user;
  } catch (error) {
    return null;
  }
}

// פונקציה לכפיית reset מלא של המשתמשים
async function forceResetUsers() {
  try {
    console.log('🔄 Starting force reset of users...');
    
    // מחק את כל המשתמשים הקיימים
    const deletedUsers = await User.deleteMany({});
    console.log(`🗑️ Deleted ${deletedUsers.deletedCount} existing users`);
    
    // מחק את כל הפוסטים הקיימים (כי הם מחוברים למשתמשים שנמחקו)
    const deletedPosts = await Post.deleteMany({});
    console.log(`🗑️ Deleted ${deletedPosts.deletedCount} existing posts`);
    
    // צור משתמשים חדשים עם סיסמאות
    console.log('👥 Creating new users with passwords...');
    
    const newUsers = await User.create([
      {
        username: 'tonykun',
        email: 'tonykun@example.com',
        password: '123456',
        role: 'admin'
      },
      {
        username: 'אוהב_אנימה',
        email: 'anime@example.com',
        password: '123456',
        role: 'user'
      },
      {
        username: 'משתמש_דמה',
        email: 'demo@example.com',
        password: '123456',
        role: 'user'
      }
    ]);
    
    console.log('✅ Created new users with passwords:');
    newUsers.forEach(user => {
      console.log(`   - ${user.username} (${user.email}) - Password: ${user.password ? 'YES' : 'NO'}`);
    });
    
    return newUsers;
    
  } catch (error) {
    console.error('❌ Error in force reset:', error);
    throw error;
  }
}

// פונקציה לאתחול נתוני דמה
async function initializeBasicData() {
  try {
    // בדוק אם יש משתמשים
    const userCount = await User.countDocuments();
    
    let adminUser, demoUser;
    
    if (userCount === 0) {
      // אין משתמשים - צור חדשים
      const newUsers = await forceResetUsers();
      adminUser = newUsers.find(u => u.role === 'admin');
      demoUser = newUsers.find(u => u.username === 'אוהב_אנימה');
    } else {
      // בדוק אם המשתמשים הקיימים יש להם סיסמאות
      const usersWithPassword = await User.find({ password: { $exists: true, $ne: null } });
      
      if (usersWithPassword.length === 0) {
        console.log('⚠️ Found users without passwords - forcing reset...');
        const newUsers = await forceResetUsers();
        adminUser = newUsers.find(u => u.role === 'admin');
        demoUser = newUsers.find(u => u.username === 'אוהב_אנימה');
      } else {
        console.log('✅ Users with passwords already exist');
        adminUser = await User.findOne({ role: 'admin' });
        demoUser = await User.findOne({ username: 'אוהב_אנימה' });
      }
    }

    // בדוק אם יש קטגוריות
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      const categories = [
        { name: "הכרזות", color: "#6366F1" },
        { name: "דיונים", color: "#DC2626" },
        { name: "המלצות", color: "#F59E0B" },
        { name: "ביקורות", color: "#10B981" },
        { name: "שאלות", color: "#EF4444" },
        { name: "מימים", color: "#8B5CF6" }
      ];

      await Category.insertMany(categories);
      console.log('✅ Created categories');
    }

    // בדוק אם יש פוסטים לדמה
    const postCount = await Post.countDocuments();
    if (postCount === 0 && adminUser && demoUser) {
      const welcomeCategory = await Category.findOne({ name: "הכרזות" });
      const discussionCategory = await Category.findOne({ name: "דיונים" });
      const recommendationCategory = await Category.findOne({ name: "המלצות" });

      if (welcomeCategory && discussionCategory && recommendationCategory) {
        const samplePosts = [
          {
            title: "ברוכים הבאים לפורום האנימה החדש!",
            content: "זהו הפוסט הראשון בפורום שלנו. כאן תוכלו לדון על האנימות המועדפות עליכם ולהמליץ לחברים על סדרות חדשות. הפורום כולל מערכת התחברות מלאה!",
            imageUrl: "https://via.placeholder.com/800x200/6366F1/FFFFFF?text=Welcome+to+Anime+Forum",
            author: adminUser._id,
            category: welcomeCategory._id,
            likesCount: 15,
            commentsCount: 3,
            viewsCount: 47
          },
          {
            title: "מה דעתכם על Attack on Titan?",
            content: "זה עתה סיימתי לצפות בעונה האחרונה ואני פשוט מהומם. הסיום היה מדהים! מה דעתכם על הדרך שבה הסיפור הסתיים?",
            imageUrl: "https://via.placeholder.com/800x200/DC2626/FFFFFF?text=Attack+on+Titan",
            author: demoUser._id,
            category: discussionCategory._id,
            likesCount: 23,
            commentsCount: 8,
            viewsCount: 156
          },
          {
            title: "המלצות לאנימות אקשן טובות",
            content: "אני מחפש אנימות אקשן טובות לצפייה. כבר צפיתי ב-Demon Slayer, Jujutsu Kaisen ו-One Piece. יש לכם המלצות נוספות?",
            imageUrl: "https://via.placeholder.com/800x200/F59E0B/FFFFFF?text=Action+Anime",
            author: demoUser._id,
            category: recommendationCategory._id,
            likesCount: 12,
            commentsCount: 15,
            viewsCount: 89
          }
        ];

        await Post.insertMany(samplePosts);
        console.log('✅ Created sample posts');
      }
    }
  } catch (error) {
    console.error('❌ Error initializing data:', error);
  }
}

// GET /api/posts
export async function GET() {
  try {
    await connectDB();
    await initializeBasicData();
    
    const posts = await Post.find()
      .populate('author', 'username avatar')
      .populate('category', 'name color')
      .sort({ createdAt: -1 })
      .lean();

    const formattedPosts = posts.map((post: any) => ({
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      image_url: post.imageUrl,
      likes_count: post.likesCount || 0,
      comments_count: post.commentsCount || 0,
      views_count: post.viewsCount || 0,
      created_at: post.createdAt,
      author: {
        username: post.author?.username || 'משתמש'
      },
      category: {
        name: post.category?.name || 'כללי',
        color: post.category?.color || '#6366F1'
      }
    }));
    
    return NextResponse.json({ 
      posts: formattedPosts,
      success: true
    });
    
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת פוסטים: ' + error.message },
      { status: 500 }
    );
  }
}

// POST /api/posts
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    await initializeBasicData();
    
    // קבל משתמש מחובר
    const currentUser = await getUserFromToken(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'נדרש להתחבר כדי ליצור פוסט' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { title, content, image_url, category_name } = body;
    
    console.log('Creating new post by:', currentUser.username);
    
    // ולידציה
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'כותרת ותוכן הפוסט נדרשים' },
        { status: 400 }
      );
    }

    if (title.trim().length < 5) {
      return NextResponse.json(
        { error: 'כותרת חייבת להיות לפחות 5 תווים' },
        { status: 400 }
      );
    }

    if (content.trim().length < 10) {
      return NextResponse.json(
        { error: 'תוכן חייב להיות לפחות 10 תווים' },
        { status: 400 }
      );
    }
    
    // מצא קטגוריה
    let category = await Category.findOne({ name: category_name });
    if (!category) {
      category = await Category.findOne();
    }
    
    if (!category) {
      return NextResponse.json(
        { error: 'לא נמצאה קטגוריה מתאימה' },
        { status: 400 }
      );
    }
    
    // צור פוסט חדש עם המשתמש המחובר
    const newPost = await Post.create({
      title: title.trim(),
      content: content.trim(),
      imageUrl: image_url || `https://via.placeholder.com/800x200/${category.color.substring(1)}/FFFFFF?text=${encodeURIComponent(category.name)}`,
      author: currentUser._id,
      category: category._id,
      likesCount: 0,
      commentsCount: 0,
      viewsCount: 1
    });
    
    // קבל את הפוסט עם populate
    const populatedPost = await Post.findById(newPost._id)
      .populate('author', 'username avatar')
      .populate('category', 'name color');
    
    if (!populatedPost) {
      throw new Error('Failed to create post');
    }
    
    const formattedPost = {
      id: populatedPost._id.toString(),
      title: populatedPost.title,
      content: populatedPost.content,
      image_url: populatedPost.imageUrl,
      likes_count: populatedPost.likesCount,
      comments_count: populatedPost.commentsCount,
      views_count: populatedPost.viewsCount,
      created_at: populatedPost.createdAt,
      author: {
        username: (populatedPost.author as any).username
      },
      category: {
        name: (populatedPost.category as any).name,
        color: (populatedPost.category as any).color
      }
    };
    
    console.log('✅ Post created successfully by', currentUser.username);
    
    return NextResponse.json({
      message: 'הפוסט נוצר בהצלחה! 🎉',
      post: formattedPost,
      success: true
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת פוסט: ' + error.message },
      { status: 500 }
    );
  }
}