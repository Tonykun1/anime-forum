// src/app/api/setup/route.ts - Database setup API
import { NextResponse } from 'next/server';
import { setupDatabase, checkIfSetupNeeded } from '@/lib/db/setup';

export async function GET() {
  try {
    const needsSetup = await checkIfSetupNeeded();
    
    return NextResponse.json({
      needsSetup,
      message: needsSetup ? 'Database setup is required' : 'Database is already set up'
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to check setup status: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    console.log('🚀 Starting database setup via API...');
    
    const result = await setupDatabase();
    
    if (result.success) {
      return NextResponse.json({
        message: result.message,
        details: result.details
      }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Setup API error:', error);
    return NextResponse.json(
      { error: 'Database setup failed: ' + error.message },
      { status: 500 }
    );
  }
}