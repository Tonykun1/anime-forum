// src/app/api/categories/route.ts - עם המודלים הקיימים שלך
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { Category } from '@/lib/db/models/Category';

export async function GET() {
  try {
    await connectDB();
    
    // וודא שיש קטגוריות בסיסיות
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      const defaultCategories = [
        { name: "הכרזות", color: "#6366F1" },
        { name: "דיונים", color: "#DC2626" },
        { name: "המלצות", color: "#F59E0B" },
        { name: "ביקורות", color: "#10B981" },
        { name: "שאלות", color: "#EF4444" },
        { name: "מימים", color: "#8B5CF6" }
      ];

      await Category.insertMany(defaultCategories);
      console.log('✅ Created default categories');
    }
    
    const categories = await Category.find().sort({ name: 1 }).lean();
    
    const formattedCategories = categories.map((category: any) => ({
      id: category._id.toString(),
      name: category.name,
      color: category.color
    }));
    
    return NextResponse.json({
      categories: formattedCategories,
      success: true
    });
    
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת קטגוריות: ' + error.message },
      { status: 500 }
    );
  }
}