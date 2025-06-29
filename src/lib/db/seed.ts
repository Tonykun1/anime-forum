// src/lib/db/seed.ts
import { connectDB } from './connection';
import { setupDatabase } from './setup';

export async function seedDatabase(): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    console.log('מתחיל זריעת מסד נתונים...');
    
    // השתמש בפונקציית setup הקיימת
    const result = await setupDatabase();
    
    if (result.success) {
      console.log('זריעת מסד הנתונים הושלמה בהצלחה ✅');
      return {
        success: true,
        message: 'מסד הנתונים נזרע בהצלחה עם נתונים ראשוניים'
      };
    } else {
      return result;
    }
    
  } catch (error: any) {
    console.error('שגיאה בזריעת מסד הנתונים:', error);
    return {
      success: false,
      message: 'שגיאה בזריעת מסד הנתונים',
      error: error.message
    };
  }
}