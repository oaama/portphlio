import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

/**
 * POST /api/upload
 * Upload image to Cloudinary
 */
export async function POST(request: NextRequest) {
  try {
    // Verify Cloudinary is configured
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      console.error('ERROR: Cloudinary cloud name not configured');
      return NextResponse.json(
        { success: false, error: 'Cloudinary not configured' },
        { headers: corsHeaders, status: 500 }
      );
    }

    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('ERROR: Cloudinary API credentials not configured');
      return NextResponse.json(
        { success: false, error: 'Cloudinary credentials not configured' },
        { headers: corsHeaders, status: 500 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('ERROR: No file provided');
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { headers: corsHeaders, status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.error('ERROR: Invalid file type:', file.type);
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { headers: corsHeaders, status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error('ERROR: File too large:', file.size);
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 5MB.' },
        { headers: corsHeaders, status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio/projects',
          resource_type: 'auto',
          quality: 'auto',
          fetch_format: 'auto'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    if (!result) {
      throw new Error('Upload failed');
    }

    const uploadResult = result as any;

    return NextResponse.json(
      {
        success: true,
        data: {
          secure_url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          width: uploadResult.width,
          height: uploadResult.height,
          size: uploadResult.bytes
        }
      },
      { headers: corsHeaders, status: 200 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to upload image';
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { headers: corsHeaders, status: 500 }
    );
  }
}

/**
 * DELETE /api/upload?publicId=xxx
 * Delete image from Cloudinary
 */
export async function DELETE(request: NextRequest) {
  try {
    const publicId = request.nextUrl.searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: 'publicId parameter required' },
        { headers: corsHeaders, status: 400 }
      );
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    return NextResponse.json(
      {
        success: result.result === 'ok',
        data: result
      },
      { headers: corsHeaders, status: 200 }
    );
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { headers: corsHeaders, status: 500 }
    );
  }
}
