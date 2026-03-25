import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/health
 * Health check endpoint - verify environment variables are set
 * 
 * SECURITY: This is for debugging only - delete after testing!
 * It shows which env vars are configured (without showing actual values)
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      cloudinaryConfigured: {
        cloudName: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        apiKey: !!process.env.CLOUDINARY_API_KEY,
        apiSecret: !!process.env.CLOUDINARY_API_SECRET,
        cloudinaryUrl: !!process.env.CLOUDINARY_URL,
      },
      allEnvVars: Object.keys(process.env)
        .filter(key => key.includes('CLOUDINARY') || key.includes('NEXT_PUBLIC'))
        .map(key => ({ key, hasValue: !!process.env[key] }))
    }
  });
}
