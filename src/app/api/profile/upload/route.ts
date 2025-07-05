// 2. צור: app/api/profile/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function POST(request: NextRequest) {
  try {
    console.log('File upload API called');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'לא נמצא קובץ' },
        { status: 400 }
      );
    }
    
    console.log('Processing file:', file.name, 'size:', file.size, 'type:', file.type);
    
    // בדוק סוג קובץ
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'רק קבצי תמונה מותרים (JPEG, PNG, GIF)' },
        { status: 400 }
      );
    }
    
    // בדוק גודל קובץ (5MB מקסימום)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'הקובץ גדול מדי (מקסימום 5MB)' },
        { status: 400 }
      );
    }
    
    // הכן תיקייה
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profiles');
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }
    
    // שמור קובץ
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.name);
    const filename = `profile-${uniqueSuffix}${extension}`;
    const filepath = path.join(uploadDir, filename);
    
    await fs.writeFile(filepath, buffer);
    
    const fileUrl = `/uploads/profiles/${filename}`;
    
    console.log('File uploaded successfully:', fileUrl);
    
    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: filename
    });
    
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, error: 'שגיאה בהעלאת הקובץ: ' + error.message },
      { status: 500 }
    );
  }
}