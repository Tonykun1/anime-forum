// app/api/setup/route.ts - Fixed Setup API with MongoDB
import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/db/seed';
import { setupDatabase } from '@/lib/db/setup';

export async function GET() {
  try {
    // First run setup (create indexes)
    const setupResult = await setupDatabase();
    
    if (!setupResult.success) {
      return NextResponse.json(setupResult, { status: 500 });
    }

    // Then seed the database
    const seedResult = await seedDatabase();
    
    if (seedResult.success) {
      return NextResponse.json({
        success: true,
        message: 'Database setup and seeding completed successfully!',
        setup: setupResult,
        seed: seedResult
      });
    } else {
      return NextResponse.json(seedResult, { status: 500 });
    }
  } catch (error: any) {
    console.error('Setup API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}