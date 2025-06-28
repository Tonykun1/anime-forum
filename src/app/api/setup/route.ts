// app/api/setup/route.ts - Setup API with Mongoose
import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/db/seed';

export async function GET() {
  const result = await seedDatabase();
  
  if (result.success) {
    return NextResponse.json(result);
  } else {
    return NextResponse.json(result, { status: 500 });
  }
}

export async function POST() {
  return GET();
}