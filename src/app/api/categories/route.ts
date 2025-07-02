// src/app/api/categories/route.ts - עם PostgreSQL
import { NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';

export async function GET() {
  try {
    console.log('📋 Fetching categories...');
    
    // בדוק אם יש קטגוריות
    const countResult = await db.query('SELECT COUNT(*) FROM categories');
    const categoryCount = parseInt(countResult.rows[0].count);
    
    // אם אין קטגוריות, צור ברירות מחדל
    if (categoryCount === 0) {
      console.log('📝 Creating default categories...');
      
      const defaultCategories = [
        { name: "הכרזות", color: "#6366F1" },
        { name: "דיונים", color: "#DC2626" },
        { name: "המלצות", color: "#F59E0B" },
        { name: "ביקורות", color: "#10B981" },
        { name: "שאלות", color: "#EF4444" },
        { name: "מימים", color: "#8B5CF6" }
      ];

      for (const category of defaultCategories) {
        await db.query(
          'INSERT INTO categories (name, color) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
          [category.name, category.color]
        );
      }
      
      console.log('✅ Created default categories');
    }
    
    // קבל את כל הקטגוריות
    const result = await db.query(`
      SELECT 
        id,
        name,
        color,
        (SELECT COUNT(*) FROM posts WHERE category_id = categories.id) as posts_count
      FROM categories 
      ORDER BY name ASC
    `);
    
    const formattedCategories = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      color: row.color,
      posts_count: parseInt(row.posts_count) || 0
    }));
    
    console.log(`✅ Found ${formattedCategories.length} categories`);
    
    return NextResponse.json({
      categories: formattedCategories,
      success: true,
      count: formattedCategories.length
    });
    
  } catch (error: any) {
    console.error('❌ Error fetching categories:', error);
    
    // החזר קטגוריות ברירת מחדל במקרה של שגיאה
    const fallbackCategories = [
      { id: 1, name: "דיונים", color: "#DC2626", posts_count: 0 },
      { id: 2, name: "המלצות", color: "#F59E0B", posts_count: 0 },
      { id: 3, name: "ביקורות", color: "#10B981", posts_count: 0 }
    ];
    
    return NextResponse.json({
      categories: fallbackCategories,
      success: false,
      error: 'שגיאה בטעינת קטגוריות, מוצגות קטגוריות ברירת מחדל',
      details: error.message
    });
  }
}

// POST - יצירת קטגוריה חדשה
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, color = '#6366F1' } = body;
    
    // בדיקות תקינות
    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'שם הקטגוריה נדרש' },
        { status: 400 }
      );
    }
    
    // בדוק אם הקטגוריה כבר קיימת
    const existingResult = await db.query(
      'SELECT id FROM categories WHERE name = $1',
      [name.trim()]
    );
    
    if (existingResult.rows.length > 0) {
      return NextResponse.json(
        { error: 'קטגוריה עם השם הזה כבר קיימת' },
        { status: 409 }
      );
    }
    
    // צור קטגוריה חדשה
    const result = await db.query(
      'INSERT INTO categories (name, color) VALUES ($1, $2) RETURNING *',
      [name.trim(), color]
    );
    
    const newCategory = result.rows[0];
    console.log('✅ Created new category:', newCategory.name);
    
    return NextResponse.json({
      category: {
        id: newCategory.id,
        name: newCategory.name,
        color: newCategory.color,
        posts_count: 0
      },
      message: 'הקטגוריה נוצרה בהצלחה'
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('❌ Error creating category:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת קטגוריה: ' + error.message },
      { status: 500 }
    );
  }
}