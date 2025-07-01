// lib/db/setup.ts - MongoDB setup functions
import { connectDB } from './connection';
import { User } from './models/User';
import { Category } from './models/Category';
import { Post } from './models/Post';

export async function setupDatabase(): Promise<{ success: boolean; message: string; details?: any }> {
  try {
    console.log('🚀 Starting MongoDB setup...');

    await connectDB();
    
    // The setup is actually done in the seed function
    // This function mainly verifies the connection
    const verification = await verifySetup();
    
    console.log('✅ MongoDB setup verification completed!');
    
    return {
      success: true,
      message: 'MongoDB connection verified!',
      details: verification
    };

  } catch (error: any) {
    console.error('❌ MongoDB setup failed:', error);
    return {
      success: false,
      message: 'MongoDB setup failed: ' + error.message
    };
  }
}

export async function verifySetup(): Promise<any> {
  try {
    await connectDB();
    
    // Count documents
    const [usersCount, categoriesCount, postsCount] = await Promise.all([
      User.countDocuments(),
      Category.countDocuments(),
      Post.countDocuments()
    ]);

    return {
      collections: ['users', 'categories', 'posts'],
      dataCount: {
        users: usersCount,
        categories: categoriesCount,
        posts: postsCount
      }
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function checkIfSetupNeeded(): Promise<boolean> {
  try {
    await connectDB();
    
    const [usersCount, categoriesCount] = await Promise.all([
      User.countDocuments(),
      Category.countDocuments()
    ]);

    // Need setup if no users or categories exist
    return usersCount === 0 || categoriesCount === 0;
  } catch (error) {
    console.error('Error checking setup status:', error);
    return true; // Assume setup needed if we can't check
  }
}