// app/api/categories/route.ts - Categories API with Mongoose
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { Category } from '@/lib/db/models/Category';

export async function GET() {
  try {
    await connectDB();
    
    const categories = await Category.find().sort({ name: 1 }).lean();
    
    const formattedCategories = categories.map(category => ({
      id: category._id.toString(),
      name: category.name,
      color: category.color
    }));
    
    return NextResponse.json({
      categories: formattedCategories
    });
    
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת קטגוריות' },
      { status: 500 }
    );
  }
}