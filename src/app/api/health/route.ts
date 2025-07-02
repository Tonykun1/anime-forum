// src/app/api/health/route.ts - Health check עם PostgreSQL רגיל
import { NextResponse } from 'next/server';
import { db, testConnection } from '@/lib/db/connection';
import { verifySetup } from '@/lib/db/setup';

export async function GET() {
  try {
    const connectionOk = await testConnection();
    if (!connectionOk) {
      throw new Error('Database connection failed');
    }
    
    const verification = await verifySetup();
    const needsSetup = verification.dataCount?.categories === 0 || verification.dataCount?.users === 0;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      needsSetup,
      details: verification
    });

  } catch (error: any) {
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
      needsSetup: true
    }, { status: 503 });
  }
}