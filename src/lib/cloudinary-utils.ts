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
    // Validate file before upload
    if (!file) {
      return {
        success: false,
        error: 'No file provided'
      };
    }

    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: 'File is too large (max 5MB)'
      };
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: `Invalid file type: ${file.type}`
      };
    }

    console.log('[uploadImageToCloudinary] Uploading:', { name: file.name, size: file.size });

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    console.log('[uploadImageToCloudinary] Response status:', response.status);

    if (!response.ok) {
      let errorMsg = `Upload failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.error || errorMsg;
        console.error('[uploadImageToCloudinary] API Error:', errorData);
      } catch (e) {
        console.error('[uploadImageToCloudinary] Could not parse error response');
      }
      return {
        success: false,
        error: errorMsg
      };
    }

    const result = await response.json();
    console.log('[uploadImageToCloudinary] Success:', { publicId: result?.data?.public_id });
    return result;

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Upload failed';
    console.error('[uploadImageToCloudinary] Exception:', errorMsg, error);
    return {
      success: false,
      error: errorMsg
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
    if (!publicId) {
      return {
        success: false,
        error: 'Public ID is required'
      };
    }

    console.log('[deleteImageFromCloudinary] Deleting:', publicId);

    const response = await fetch(`/api/upload?publicId=${encodeURIComponent(publicId)}`, {
      method: 'DELETE'
    });

    console.log('[deleteImageFromCloudinary] Response status:', response.status);

    if (!response.ok) {
      let errorMsg = `Deletion failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.error || errorMsg;
      } catch {
        // If response is not JSON, use default error message
      }
      console.error('[deleteImageFromCloudinary] Error:', errorMsg);
      return {
        success: false,
        error: errorMsg
      };
    }

    const result = await response.json();
    console.log('[deleteImageFromCloudinary] Success');
    return result;

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Deletion failed';
    console.error('[deleteImageFromCloudinary] Exception:', errorMsg);
    return {
      success: false,
      error: errorMsg
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

  if (!publicId) {
    throw new Error('publicId is required');
  }

  let url = `https://res.cloudinary.com/${cloudName}/image/upload`;

  // Add transformations if provided
  if (transformations && Object.keys(transformations).length > 0) {
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
  } else {
    // Default transformations for better performance
    url += '/q_auto,f_auto';
  }

  url += `/${publicId}`;

  return url;
}
