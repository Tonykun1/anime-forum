// src/app/api/setup/route.ts - Setup API with Mongoose
import { NextRequest, NextResponse } from 'next/server';
import { setupDatabase, checkIfSetupNeeded } from '@/lib/db/setup';

export async function GET() {
  try {
    // בדיקה אם נדרש setup
    const needsSetup = await checkIfSetupNeeded();
    
    if (!needsSetup) {
      return NextResponse.json({
        success: true,
        message: 'מסד הנתונים כבר מוגדר כראוי',
        alreadySetup: true,
        timestamp: new Date().toISOString()
      });
    }
    
    // הרצת setup
    const result = await setupDatabase();
    
    return NextResponse.json({
      ...result,
      timestamp: new Date().toISOString(),
      alreadySetup: false
    }, { status: result.success ? 200 : 500 });
    
  } catch (error: any) {
    console.error('Setup API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'שגיאה בהרצת setup',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { force = false } = body;
    
    if (!force) {
      // בדיקה אם נדרש setup
      const needsSetup = await checkIfSetupNeeded();
      
      if (!needsSetup) {
        return NextResponse.json({
          success: true,
          message: 'מסד הנתונים כבר מוגדר. השתמש ב-force: true כדי להריץ שוב',
          alreadySetup: true,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    // הרצת setup (גם אם כבר מוגדר עם force)
    const result = await setupDatabase();
    
    return NextResponse.json({
      ...result,
      timestamp: new Date().toISOString(),
      forced: force
    }, { status: result.success ? 201 : 500 });
    
  } catch (error: any) {
    console.error('Setup POST API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'שגיאה בהרצת setup',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}