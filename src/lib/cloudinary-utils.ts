/**
 * Cloudinary upload utility
 * Handles image uploads to Cloudinary via our serverless API
 */

export interface UploadResponse {
  success: boolean;
  data?: {
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
    size: number;
  };
  error?: string;
}

/**
 * Upload image file to Cloudinary
 * @param file - Image file to upload
 * @returns Upload response with image URL and metadata
 */
export async function uploadImageToCloudinary(
  file: File
): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error || 'Upload failed'
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}

/**
 * Delete image from Cloudinary
 * @param publicId - Cloudinary public ID of the image
 * @returns Deletion response
 */
export async function deleteImageFromCloudinary(
  publicId: string
): Promise<UploadResponse> {
  try {
    const response = await fetch(`/api/upload?publicId=${publicId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error || 'Deletion failed'
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Deletion failed'
    };
  }
}

/**
 * Get Cloudinary image URL with transformations
 * @param publicId - Cloudinary public ID
 * @param transformations - Optional transformation parameters
 * @returns Cloudinary URL
 */
export function getCloudinaryUrl(
  publicId: string,
  transformations?: {
    width?: number;
    height?: number;
    quality?: 'auto' | 'low' | 'medium' | 'high';
    format?: string;
  }
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME not configured');
  }

  let url = `https://res.cloudinary.com/${cloudName}/image/upload`;

  // Add transformations if provided
  if (transformations) {
    const transforms = [];

    if (transformations.width || transformations.height) {
      transforms.push(
        `c_scale,w_${transformations.width || 'auto'},h_${transformations.height || 'auto'}`
      );
    }

    if (transformations.quality) {
      transforms.push(`q_${transformations.quality}`);
    }

    if (transformations.format) {
      transforms.push(`f_${transformations.format}`);
    }

    if (transforms.length > 0) {
      url += '/' + transforms.join('/');
    }
  }

  url += `/${publicId}`;

  return url;
}
