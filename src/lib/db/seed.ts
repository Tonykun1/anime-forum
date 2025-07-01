// lib/db/seed.ts - Seed database with users and data
import { connectDB } from './connection';
import { User } from './models/User';
import { Category } from './models/Category';
import { Post } from './models/Post';

export async function seedDatabase() {
  try {
    await connectDB();
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data (optional - remove in production)
    // await User.deleteMany({});
    // await Category.deleteMany({});
    // await Post.deleteMany({});

    // Create users
    const usersData = [
      {
        username: 'AnimeOtaku',
        email: 'otaku@example.com',
        password: '123456',
        avatar: 'https://via.placeholder.com/100x100/3B82F6/FFFFFF?text=AO',
        coverImage: 'https://via.placeholder.com/800x200/1E40AF/FFFFFF?text=Profile+Cover',
        bio: 'חובב אנימה ומנגה מזה 10 שנים. אוהב במיוחד שונן ואקשן!',
        role: 'user',
        postsCount: 5,
        likesCount: 234
      },
      {
        username: 'ActionFan',
        email: 'action@example.com',
        password: '123456',
        avatar: 'https://via.placeholder.com/100x100/EF4444/FFFFFF?text=AF',
        coverImage: 'https://via.placeholder.com/800x200/DC2626/FFFFFF?text=Action+Fan+Cover',
        bio: 'כל מה שקשור לקרבות ואקשן - אני כאן!',
        role: 'user',
        postsCount: 8,
        likesCount: 456
      },
      {
        username: 'TonyKun',
        email: 'tonykun@example.com',
        password: '123456',
        avatar: 'https://via.placeholder.com/100x100/10B981/FFFFFF?text=TK',
        coverImage: 'https://via.placeholder.com/800x200/059669/FFFFFF?text=Tony+Cover',
        bio: 'מפתח ואוהב אנימה! תמיד מחפש חדש.',
        role: 'admin',
        postsCount: 12,
        likesCount: 89
      }
    ];

    // Create users if they don't exist
    const createdUsers = [];
    for (const userData of usersData) {
      let user = await User.findOne({ email: userData.email });
      if (!user) {
        user = await User.create(userData);
        console.log(`Created user: ${user.username}`);
      } else {
        console.log(`User already exists: ${user.username}`);
      }
      createdUsers.push(user);
    }

    // Create categories
    const categoriesData = [
      { name: 'דיונים', color: '#3B82F6' },
      { name: 'ביקורות', color: '#EF4444' },
      { name: 'המלצות', color: '#10B981' },
      { name: 'שאלות', color: '#F59E0B' },
      { name: 'חדשות', color: '#8B5CF6' },
      { name: 'מימים', color: '#EC4899' }
    ];

    const createdCategories = [];
    for (const categoryData of categoriesData) {
      let category = await Category.findOne({ name: categoryData.name });
      if (!category) {
        category = await Category.create(categoryData);
        console.log(`Created category: ${category.name}`);
      } else {
        console.log(`Category already exists: ${category.name}`);
      }
      createdCategories.push(category);
    }

    // Create sample posts
    const postsData = [
      {
        title: 'איזה אנימה הכי מומלץ לצפייה השנה?',
        content: 'אני מחפש המלצות לאנימות חדשות וטובות לצפייה. מה אתם הכי ממליצים השנה?',
        imageUrl: 'https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Anime+Recommendations',
        author: createdUsers[0]._id,
        category: createdCategories[2]._id,
        likesCount: 15,
        commentsCount: 8,
        viewsCount: 120
      },
      {
        title: 'ביקורת: Demon Slayer העונה החדשה',
        content: 'העונה החדשה של Demon Slayer פשוט מדהימה! האנימציה עלתה עוד רמה והעלילה מרתקת יותר מתמיד.',
        imageUrl: 'https://via.placeholder.com/800x400/EF4444/FFFFFF?text=Demon+Slayer+Review',
        author: createdUsers[1]._id,
        category: createdCategories[1]._id,
        likesCount: 23,
        commentsCount: 12,
        viewsCount: 95
      },
      {
        title: 'שאלה טכנית על הפרויקט',
        content: 'אני עובד על פרויקט אנימה ויש לי כמה שאלות טכניות. מישהו יכול לעזור?',
        imageUrl: 'https://via.placeholder.com/800x400/10B981/FFFFFF?text=Tech+Question',
        author: createdUsers[2]._id,
        category: createdCategories[3]._id,
        likesCount: 7,
        commentsCount: 5,
        viewsCount: 67
      }
    ];

    for (const postData of postsData) {
      const existingPost = await Post.findOne({ title: postData.title });
      if (!existingPost) {
        const post = await Post.create(postData);
        console.log(`Created post: ${post.title}`);
      } else {
        console.log(`Post already exists: ${existingPost.title}`);
      }
    }

    return {
      success: true,
      message: 'Database seeded successfully!',
      data: {
        users: createdUsers.length,
        categories: createdCategories.length,
        posts: postsData.length
      }
    };

  } catch (error: any) {
    console.error('Seeding error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}