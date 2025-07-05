// 2. תקן את lib/db/seed.ts - PostgreSQL בלבד
import { db } from './connection';
import bcrypt from 'bcryptjs';

export const seedUsers = async () => {
  try {
    // בדוק אם יש כבר משתמשים
    const existingUsers = await db.query('SELECT COUNT(*) FROM users');
    if (parseInt(existingUsers.rows[0].count) > 0) {
      console.log('👥 Users already exist, skipping...');
      return;
    }

    const passwordHash = await bcrypt.hash('123456', 12);
    
    await db.query(`
      INSERT INTO users (username, email, password, bio, avatar, cover_image, posts_count, likes_count) 
      VALUES 
        ('AnimeOtaku', 'otaku@example.com', $1, 'חובב אנימה ומנגה מזה 10 שנים. אוהב במיוחד שונן ואקשן!',
         'https://via.placeholder.com/100x100/3B82F6/FFFFFF?text=AO',
         'https://via.placeholder.com/800x200/1E40AF/FFFFFF?text=Anime+Lover', 45, 234),
        ('ActionFan', 'action@example.com', $1, 'כל מה שקשור לקרבות ואקשן - אני כאן!',
         'https://via.placeholder.com/100x100/EF4444/FFFFFF?text=AF',
         'https://via.placeholder.com/800x200/DC2626/FFFFFF?text=Action+Hero', 78, 456)
    `, [passwordHash]);
    
    console.log('👥 Users seeded successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

export const seedCategories = async () => {
  try {
    const existingCategories = await db.query('SELECT COUNT(*) FROM categories');
    if (parseInt(existingCategories.rows[0].count) > 0) {
      console.log('📂 Categories already exist, skipping...');
      return;
    }

    await db.query(`
      INSERT INTO categories (name, color) 
      VALUES 
        ('דיונים', '#3B82F6'),
        ('ביקורות', '#10B981'),
        ('המלצות', '#F59E0B'),
        ('שאלות', '#8B5CF6'),
        ('חדשות', '#EF4444'),
        ('מימים', '#EC4899')
    `);
    
    console.log('📂 Categories seeded successfully');
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
};

export const allSeedData = [seedUsers, seedCategories];