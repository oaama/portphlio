import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * Configure Cloudinary with validation
 * Called inside handlers to ensure env vars are available in serverless environment
 */
function initializeCloudinary() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  // Log env var existence (NOT actual values for security)
  console.log('[Cloudinary Config Check]', {
    cloudNameSet: !!cloudName,
    apiKeySet: !!apiKey,
    apiSecretSet: !!apiSecret,
  });

  // Validate all required env vars
  if (!cloudName) {
    throw new Error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME environment variable is not set');
  }
  if (!apiKey) {
    throw new Error('CLOUDINARY_API_KEY environment variable is not set');
  }
  if (!apiSecret) {
    throw new Error('CLOUDINARY_API_SECRET environment variable is not set');
  }

  // Configure Cloudinary
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });

  console.log('[Cloudinary] Initialized successfully');
  return { cloudName, apiKey, apiSecret };
}

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
    console.log('[Upload] Starting...');
    
    // Initialize Cloudinary
    initializeCloudinary();

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('[Upload] No file');
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { headers: corsHeaders, status: 400 }
      );
    }

    console.log('[Upload] File:', { name: file.name, type: file.type, size: file.size });

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.error('[Upload] Invalid type:', file.type);
      return NextResponse.json(
        { success: false, error: 'Invalid file type' },
        { headers: corsHeaders, status: 400 }
      );
    }

    // Validate file size (max 3MB for Netlify limits)
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error('[Upload] File too large:', file.size);
      return NextResponse.json(
        { success: false, error: 'File too large (max 3MB)' },
        { headers: corsHeaders, status: 400 }
      );
    }

    // Convert to buffer
    console.log('[Upload] Converting to buffer...');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using buffer directly (no base64 bloat)
    console.log('[Upload] Uploading to Cloudinary...');
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio/projects',
          resource_type: 'auto',
          quality: 'auto',
          fetch_format: 'auto',
        },
        (error, result) => {
          if (error) {
            console.error('[Upload] Stream error:', error.message);
            reject(error);
          } else {
            console.log('[Upload] Stream success:', result?.public_id);
            resolve(result);
          }
        }
      );
      
      uploadStream.end(buffer);
    });

    if (!result) {
      throw new Error('No result from upload');
    }

    const uploadResult = result as any;

    console.log('[Upload] Complete:', uploadResult.public_id);
    return NextResponse.json(
      {
        success: true,
        data: {
          secure_url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          width: uploadResult.width,
          height: uploadResult.height,
          size: uploadResult.bytes,
        }
      },
      { headers: corsHeaders, status: 200 }
    );

  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Upload] ERROR:', msg);
    return NextResponse.json(
      { success: false, error: msg },
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
    console.log('[Delete] Starting image deletion...');

    // Initialize Cloudinary
    initializeCloudinary();

    const publicId = request.nextUrl.searchParams.get('publicId');

    if (!publicId) {
      console.error('[Delete] publicId parameter missing');
      return NextResponse.json(
        { success: false, error: 'publicId parameter is required' },
        { headers: corsHeaders, status: 400 }
      );
    }

    console.log('[Delete] Deleting image:', publicId);

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    console.log('[Delete] Result:', result.result);

    return NextResponse.json(
      {
        success: result.result === 'ok',
        data: result
      },
      { headers: corsHeaders, status: 200 }
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[Delete] ERROR:', errorMsg);

    return NextResponse.json(
      { success: false, error: errorMsg || 'Failed to delete image' },
      { headers: corsHeaders, status: 500 }
    );
  }
}
