// src/lib/db/index.ts
export { connectDB, disconnectDB } from './connection';
export { setupDatabase, checkIfSetupNeeded } from './setup';
export { seedDatabase } from './seed';

// ייבוא המודלים רק כשהם נדרשים (lazy loading)
export const getModels = async () => {
  const { User } = await import('./models/User');
  const { Category } = await import('./models/Category');
  const { Post } = await import('./models/Post');
  
  return { User, Category, Post };
};

// ייבוא סטנדרטי (ודא שהקבצים קיימים)
export { User } from './models/User';
export { Category } from './models/Category';
export { Post } from './models/Post';

// Types
export type { IUser } from './models/User';
export type { ICategory } from './models/Category';
export type { IPost } from './models/Post';

// פונקציית עזר לספירת מסמכים
export const getModelCounts = async () => {
  try {
    const { connectDB } = await import('./connection');
    const { User, Category, Post } = await getModels();
    
    await connectDB();
    
    const [usersCount, categoriesCount, postsCount] = await Promise.all([
      User.countDocuments(),
      Category.countDocuments(),
      Post.countDocuments()
    ]);
    
    return {
      users: usersCount,
      categories: categoriesCount,
      posts: postsCount,
      total: usersCount + categoriesCount + postsCount
    };
  } catch (error) {
    console.error('שגיאה בקבלת ספירת מודלים:', error);
    return {
      users: 0,
      categories: 0,
      posts: 0,
      total: 0
    };
  }
};