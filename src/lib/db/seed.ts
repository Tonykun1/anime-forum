import { connectDB } from './connection';
import { User } from './models/User';
import { Category } from './models/Category';
import { Post } from './models/Post';

export async function seedDatabase() {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...');

    // Create default user
    let defaultUser = await User.findOne({ email: 'user@example.com' });
    if (!defaultUser) {
      defaultUser = await User.create({
        username: 'משתמש',
        email: 'user@example.com',
        role: 'user'
      });
      console.log('✅ Default user created');
    }

    // Create categories
    const categoriesData = [
      { name: 'דיונים', color: '#3B82F6' },
      { name: 'ביקורות', color: '#10B981' },
      { name: 'המלצות', color: '#F59E0B' },
      { name: 'שאלות', color: '#8B5CF6' },
      { name: 'חדשות', color: '#EF4444' },
      { name: 'מימים', color: '#EC4899' }
    ];

    for (const categoryData of categoriesData) {
      const existingCategory = await Category.findOne({ name: categoryData.name });
      if (!existingCategory) {
        await Category.create(categoryData);
        console.log(`✅ Category "${categoryData.name}" created`);
      }
    }

    // Create default posts
    const defaultCategory = await Category.findOne({ name: 'דיונים' });
    if (defaultCategory) {
      const postsData = [
        {
          title: 'ברוכים הבאים לפורום!',
          content: 'זהו הפוסט הראשון בפורום האנימה שלנו. אנו מקווים שתיהנו כאן!',
          author: defaultUser._id,
          category: defaultCategory._id
        },
        {
          title: 'איך לכתוב ביקורת טובה',
          content: 'כמה טיפים לכתיבת ביקורות איכות על אנימה...',
          author: defaultUser._id,
          category: defaultCategory._id
        }
      ];

      for (const postData of postsData) {
        const existingPost = await Post.findOne({ title: postData.title });
        if (!existingPost) {
          await Post.create(postData);
          console.log(`✅ Post "${postData.title}" created`);
        }
      }
    }

    console.log('🎉 Database seeding completed!');
    return { success: true, message: 'Database seeded successfully!' };

  } catch (error: any) {
    console.error('❌ Seeding failed:', error);
    return { success: false, error: error.message };
  }
}