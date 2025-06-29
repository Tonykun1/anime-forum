// src/lib/db/connection.ts - חיבור MongoDB מתוקן
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('אנא הגדר את משתנה הסביבה MONGODB_URI בקובץ .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB connection failed:', e);
    throw e;
  }

  return cached.conn;
}

// פונקציה לאתחול בסיס הנתונים עם נתוני דמה
export async function initializeDatabase() {
  try {
    await connectDB();
    
    const { User } = await import('./models/User');
    const { Category } = await import('./models/Category');
    const { Post } = await import('./models/Post');

    // בדוק אם כבר יש נתונים
    const existingCategories = await Category.countDocuments();
    const existingPosts = await Post.countDocuments();
    
    if (existingCategories > 0 && existingPosts > 0) {
      console.log('📊 Database already has data, skipping initialization');
      return;
    }

    console.log('🌱 Initializing database with sample data...');

    // יצירת משתמש ברירת מחדל
    const defaultUser = await User.findOneAndUpdate(
      { email: 'user@example.com' },
      {
        username: 'משתמש',
        email: 'user@example.com',
      },
      { upsert: true, new: true }
    );

    // יצירת קטגוריות
    const categories = [
      { name: "הכרזות", color: "#6366F1" },
      { name: "דיונים", color: "#DC2626" },
      { name: "המלצות", color: "#F59E0B" },
      { name: "ביקורות", color: "#10B981" },
      { name: "שאלות", color: "#EF4444" },
      { name: "מימים", color: "#8B5CF6" }
    ];

    const createdCategories = [];
    for (const catData of categories) {
      const category = await Category.findOneAndUpdate(
        { name: catData.name },
        catData,
        { upsert: true, new: true }
      );
      createdCategories.push(category);
    }

    // יצירת פוסטים לדמה
    const samplePosts = [
      {
        title: "ברוכים הבאים לפורום האנימה!",
        content: "זהו הפוסט הראשון בפורום שלנו. כאן תוכלו לדון על האנימות המועדפות עליכם ולהמליץ לחברים על סדרות חדשות.",
        imageUrl: "https://via.placeholder.com/800x200/6366F1/FFFFFF?text=Welcome+to+Anime+Forum",
        author: defaultUser._id,
        category: createdCategories[0]._id, // הכרזות
        likesCount: 15,
        commentsCount: 3,
        viewsCount: 47
      },
      {
        title: "מה דעתכם על Attack on Titan?",
        content: "זה עתה סיימתי לצפות בעונה האחרונה ואני פשוט מהומם. הסיום היה מדהים! מה דעתכם על הדרך שבה הסיפור הסתיים?",
        imageUrl: "https://via.placeholder.com/800x200/DC2626/FFFFFF?text=Attack+on+Titan",
        author: defaultUser._id,
        category: createdCategories[1]._id, // דיונים
        likesCount: 23,
        commentsCount: 8,
        viewsCount: 156
      },
      {
        title: "המלצות לאנימות אקשן",
        content: "אני מחפש אנימות אקשן טובות לצפייה. כבר צפיתי ב-Demon Slayer, Jujutsu Kaisen ו-One Piece. יש לכם המלצות נוספות?",
        imageUrl: "https://via.placeholder.com/800x200/F59E0B/FFFFFF?text=Action+Anime",
        author: defaultUser._id,
        category: createdCategories[2]._id, // המלצות
        likesCount: 12,
        commentsCount: 15,
        viewsCount: 89
      },
      {
        title: "Spirited Away - מסע קסום",
        content: "האם יש לנו כאן אוהבי סטודיו גיבלי? זה עתה צפיתי שוב ב-Spirited Away והבנתי כמה הסרט הזה מיוחד. הפרטים, המוזיקה, האנימציה - הכל מושלם!",
        imageUrl: "https://via.placeholder.com/800x200/10B981/FFFFFF?text=Studio+Ghibli",
        author: defaultUser._id,
        category: createdCategories[3]._id, // ביקורות
        likesCount: 31,
        commentsCount: 6,
        viewsCount: 203
      },
      {
        title: "מתי יוצא One Piece 1100?",
        content: "מישהו יודע מתי אמור לצאת פרק 1100 של One Piece? אני לא יכול לחכות לראות מה יקרה אחרי הקרב האחרון!",
        imageUrl: "https://via.placeholder.com/800x200/EF4444/FFFFFF?text=One+Piece+1100",
        author: defaultUser._id,
        category: createdCategories[4]._id, // שאלות
        likesCount: 8,
        commentsCount: 4,
        viewsCount: 67
      }
    ];

    for (const postData of samplePosts) {
      await Post.findOneAndUpdate(
        { title: postData.title },
        postData,
        { upsert: true, new: true }
      );
    }

    console.log('✅ Database initialized successfully with sample data');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}