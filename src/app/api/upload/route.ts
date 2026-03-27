import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import FormData from 'form-data';

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
 * Upload image to Cloudinary using REST API with form-data
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[Upload] Starting...');
    
    // Initialize Cloudinary (to verify env vars)
    const config = initializeCloudinary();

    // Get form data from client
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('[Upload] No file provided');
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { headers: corsHeaders, status: 400 }
      );
    }

    console.log('[Upload] File received:', { name: file.name, type: file.type, size: file.size });

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.error('[Upload] Invalid type:', file.type);
      return NextResponse.json(
        { success: false, error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` },
        { headers: corsHeaders, status: 400 }
      );
    }

    // Validate file size (max 3MB)
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error('[Upload] File too large:', file.size);
      return NextResponse.json(
        { success: false, error: `File too large. Max 3MB, got ${(file.size / 1024 / 1024).toFixed(2)}MB` },
        { headers: corsHeaders, status: 400 }
      );
    }

    // Convert file to buffer
    console.log('[Upload] Converting to buffer...');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Prepare Cloudinary API call
    console.log('[Upload] Preparing API request...');
    const timestamp = Math.floor(Date.now() / 1000);
    const api_key = config.apiKey;
    const api_secret = config.apiSecret;
    const cloud_name = config.cloudName;

    if (!api_key || !api_secret || !cloud_name) {
      throw new Error('Cloudinary credentials not configured');
    }

    // Build signature for authenticated upload
    const paramsStr = `folder=portfolio/projects&quality=auto&fetch_format=auto&timestamp=${timestamp}&api_key=${api_key}${api_secret}`;
    const crypto = require('crypto');
    const signature = crypto.createHash('sha1').update(paramsStr).digest('hex');

    // Create multipart FormData using the form-data package
    console.log('[Upload] Creating multipart FormData...');
    const uploadData = new FormData();
    uploadData.append('file', buffer, { filename: file.name, contentType: file.type });
    uploadData.append('folder', 'portfolio/projects');
    uploadData.append('quality', 'auto');
    uploadData.append('fetch_format', 'auto');
    uploadData.append('timestamp', timestamp.toString());
    uploadData.append('api_key', api_key);
    uploadData.append('signature', signature);

    // Call Cloudinary REST API
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;
    console.log('[Upload] Posting to Cloudinary:', uploadUrl);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: uploadData,
      headers: uploadData.getHeaders ? uploadData.getHeaders() : {},
    });

    const responseText = await response.text();
    console.log('[Upload] Response status:', response.status);

    if (!response.ok) {
      console.error('[Upload] API error response:', responseText);
      let errorMsg = `HTTP ${response.status}`;
      try {
        const json = JSON.parse(responseText);
        errorMsg = json.error?.message || json.message || errorMsg;
      } catch {
        errorMsg = responseText || errorMsg;
      }
      throw new Error(errorMsg);
    }

    const result = JSON.parse(responseText);
    console.log('[Upload] Success:', result.public_id);

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
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Upload] ERROR:', msg, error);
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
