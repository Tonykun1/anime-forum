// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Return a default user for now
  return NextResponse.json({
    user: {
      id: 1,
      username: 'משתמש',
      email: 'user@example.com',
      role: 'user'
    }
  });
}
