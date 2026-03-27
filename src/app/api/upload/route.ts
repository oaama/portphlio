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
 * Upload image to Cloudinary using direct API call
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[Upload] Starting...');
    
    // Initialize Cloudinary (to verify env vars)
    const config = initializeCloudinary();

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

    // Validate file size (max 3MB)
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error('[Upload] File too large:', file.size);
      return NextResponse.json(
        { success: false, error: 'File too large (max 3MB)' },
        { headers: corsHeaders, status: 400 }
      );
    }

    // Convert file to buffer
    console.log('[Upload] Converting to buffer...');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create FormData for Cloudinary API
    console.log('[Upload] Uploading to Cloudinary API...');
    const uploadFormData = new FormData();
    
    // Add file as Blob
    const blob = new Blob([buffer], { type: file.type });
    uploadFormData.append('file', blob, file.name);
    
    // Add other parameters
    uploadFormData.append('folder', 'portfolio/projects');
    uploadFormData.append('quality', 'auto');
    uploadFormData.append('fetch_format', 'auto');
    uploadFormData.append('upload_preset', 'unsigned_upload'); // or use API key auth below

    // If upload_preset not configured, use API auth
    if (!process.env.CLOUDINARY_API_KEY) {
      throw new Error('CLOUDINARY_API_KEY not configured');
    }

    // Use API authentication instead of unsigned upload
    const timestamp = Math.floor(Date.now() / 1000);
    const api_key = process.env.CLOUDINARY_API_KEY;
    const api_secret = process.env.CLOUDINARY_API_SECRET;
    const cloud_name = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    // Sign the request
    const params = {
      folder: 'portfolio/projects',
      quality: 'auto',
      fetch_format: 'auto',
      timestamp,
      api_key,
    };

    // Create signature
    const paramsStr = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key as keyof typeof params]}`)
      .join('&') + api_secret;

    const crypto = require('crypto');
    const signature = crypto.createHash('sha1').update(paramsStr).digest('hex');

    // Build upload URL
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

    // Create final FormData
    const finalFormData = new FormData();
    finalFormData.append('file', blob, file.name);
    finalFormData.append('folder', 'portfolio/projects');
    finalFormData.append('quality', 'auto');
    finalFormData.append('fetch_format', 'auto');
    finalFormData.append('timestamp', timestamp.toString());
    finalFormData.append('api_key', api_key);
    finalFormData.append('signature', signature);

    console.log('[Upload] Calling Cloudinary API:', uploadUrl);

    // Call Cloudinary API
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: finalFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Upload] API error:', response.status, errorText);
      throw new Error(`Cloudinary API error: ${response.status}`);
    }

    const result = await response.json();
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
