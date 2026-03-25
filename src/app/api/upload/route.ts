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
 * 
 * Expected request:
 * - Content-Type: multipart/form-data
 * - Body: FormData with 'file' field
 * 
 * Response:
 * - 200: { success: true, data: { secure_url, public_id, width, height, size } }
 * - 400/500: { success: false, error: string }
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[Upload] Starting image upload...');

    // Initialize Cloudinary (will throw if env vars missing)
    initializeCloudinary();

    // Parse form data
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (err) {
      console.error('[Upload] Failed to parse FormData:', err);
      return NextResponse.json(
        { success: false, error: 'Invalid form data' },
        { headers: corsHeaders, status: 400 }
      );
    }

    const file = formData.get('file') as File;

    // Validate file exists
    if (!file) {
      console.error('[Upload] No file provided in form data');
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { headers: corsHeaders, status: 400 }
      );
    }

    console.log('[Upload] File received:', { name: file.name, type: file.type, size: file.size });

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.error('[Upload] Invalid file type:', file.type);
      return NextResponse.json(
        { success: false, error: `Invalid file type: ${file.type}. Allowed: JPEG, PNG, GIF, WebP` },
        { headers: corsHeaders, status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error('[Upload] File too large:', file.size, 'bytes');
      return NextResponse.json(
        { success: false, error: `File too large (${Math.round(file.size / 1024 / 1024)}MB). Maximum: 5MB` },
        { headers: corsHeaders, status: 400 }
      );
    }

    // Convert file to buffer for upload
    console.log('[Upload] Converting file to buffer...');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using upload_stream
    console.log('[Upload] Uploading to Cloudinary...');
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio/projects',
          resource_type: 'auto',
          quality: 'auto',
          fetch_format: 'auto',
          chunk_size: 6000000, // 6MB chunks for large files
        },
        (error, result) => {
          if (error) {
            console.error('[Upload] Cloudinary error:', error);
            reject(error);
          } else {
            console.log('[Upload] Cloudinary success:', { public_id: result?.public_id });
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    if (!uploadResult) {
      throw new Error('Cloudinary upload returned no result');
    }

    const result = uploadResult as any;

    // Return success response
    return NextResponse.json(
      {
        success: true,
        data: {
          secure_url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          size: result.bytes,
        }
      },
      { headers: corsHeaders, status: 200 }
    );

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[Upload] ERROR:', errorMsg);

    // Determine status code based on error type
    const statusCode = errorMsg.includes('environment variable') ? 500 : 500;

    return NextResponse.json(
      {
        success: false,
        error: errorMsg || 'Failed to upload image'
      },
      { headers: corsHeaders, status: statusCode }
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
