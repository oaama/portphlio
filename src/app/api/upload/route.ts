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
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] POST /api/upload started`);

  try {
    // Step 1: Initialize Cloudinary
    console.log(`[${requestId}] Step 1: Initializing Cloudinary...`);
    let config;
    try {
      config = initializeCloudinary();
      console.log(`[${requestId}] ✓ Cloudinary initialized`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[${requestId}] ✗ Cloudinary init error: ${msg}`);
      return NextResponse.json(
        { success: false, error: `Config error: ${msg}` },
        { headers: corsHeaders, status: 500 }
      );
    }

    // Step 2: Parse form data
    console.log(`[${requestId}] Step 2: Parsing form data...`);
    let formData: FormData;
    try {
      formData = await request.formData();
      console.log(`[${requestId}] ✓ Form data parsed`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[${requestId}] ✗ Form parse error: ${msg}`);
      return NextResponse.json(
        { success: false, error: `Form parse error: ${msg}` },
        { headers: corsHeaders, status: 400 }
      );
    }

    // Step 3: Get file
    console.log(`[${requestId}] Step 3: Getting file from form...`);
    const file = formData.get('file') as File;

    if (!file) {
      console.error(`[${requestId}] ✗ No file in form data`);
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { headers: corsHeaders, status: 400 }
      );
    }

    console.log(`[${requestId}] ✓ File found: ${file.name} (${file.type}, ${file.size} bytes)`);

    // Step 4: Validate file type
    console.log(`[${requestId}] Step 4: Validating file type...`);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.error(`[${requestId}] ✗ Invalid type: ${file.type}`);
      return NextResponse.json(
        { success: false, error: `Invalid type: ${file.type}` },
        { headers: corsHeaders, status: 400 }
      );
    }
    console.log(`[${requestId}] ✓ File type valid`);

    // Step 5: Validate file size
    console.log(`[${requestId}] Step 5: Validating file size...`);
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error(`[${requestId}] ✗ File too large: ${file.size} bytes`);
      return NextResponse.json(
        { success: false, error: `File too large: ${Math.round(file.size / 1024 / 1024)}MB (max 5MB)` },
        { headers: corsHeaders, status: 400 }
      );
    }
    console.log(`[${requestId}] ✓ File size valid`);

    // Step 6: Convert to buffer
    console.log(`[${requestId}] Step 6: Converting to buffer...`);
    let buffer: Buffer;
    try {
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
      console.log(`[${requestId}] ✓ Buffer created: ${buffer.length} bytes`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[${requestId}] ✗ Buffer conversion error: ${msg}`);
      return NextResponse.json(
        { success: false, error: `Buffer error: ${msg}` },
        { headers: corsHeaders, status: 500 }
      );
    }

    // Step 7: Upload to Cloudinary
    console.log(`[${requestId}] Step 7: Uploading to Cloudinary...`);
    console.log(`[${requestId}] Using config: cloud_name=${config.cloudName}, apiKeySet=${!!config.apiKey}, apiSecretSet=${!!config.apiSecret}`);

    let uploadResult;
    try {
      const uploadOptions = {
        folder: 'portfolio/projects',
        resource_type: 'auto' as const,
        quality: 'auto' as const,
        fetch_format: 'auto' as const,
        timeout: 120000,
      };
      
      console.log(`[${requestId}] Calling cloudinary.uploader.upload() with buffer (${buffer.length} bytes)...`);
      uploadResult = await cloudinary.uploader.upload(buffer, uploadOptions);
      console.log(`[${requestId}] ✓ Cloudinary upload successful: ${uploadResult.public_id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[${requestId}] ✗ Cloudinary upload error: ${msg}`);
      console.error(`[${requestId}] Full error:`, err);
      return NextResponse.json(
        { success: false, error: `Cloudinary error: ${msg}` },
        { headers: corsHeaders, status: 500 }
      );
    }

    // Step 8: Validate result
    console.log(`[${requestId}] Step 8: Validating upload result...`);
    if (!uploadResult) {
      console.error(`[${requestId}] ✗ Empty result from Cloudinary`);
      return NextResponse.json(
        { success: false, error: 'Empty upload result' },
        { headers: corsHeaders, status: 500 }
      );
    }

    // Step 9: Return success
    console.log(`[${requestId}] Step 9: Returning success response`);
    const result = uploadResult as any;
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
    console.error(`[${requestId}] UNCAUGHT ERROR: ${errorMsg}`);
    console.error(`[${requestId}] Full error:`, error);

    return NextResponse.json(
      {
        success: false,
        error: `Server error: ${errorMsg}`
      },
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
