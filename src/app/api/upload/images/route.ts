import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Generate a simple UUID-like string
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];
    const uploadsDir = join(process.cwd(), 'public', 'uploads');

    // Ensure uploads directory exists
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        continue; // Skip non-image files
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        continue; // Skip files larger than 10MB
      }

      // Generate unique filename
      const uuid = generateUUID();
      const extension = file.name.split('.').pop() || 'jpg';
      const filename = `${uuid}.${extension}`;
      const filepath = join(uploadsDir, filename);

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);

      // Add URL to results (relative to public folder)
      uploadedUrls.push(`/uploads/${filename}`);
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        { error: 'No valid image files were uploaded' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      count: uploadedUrls.length
    });

  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    );
  }
}
