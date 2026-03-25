'use client';

import { useState, useCallback } from 'react';
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
  getCloudinaryUrl
} from '@/lib/cloudinary-utils';

export interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
  size: number;
}

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File): Promise<UploadedImage | null> => {
    setUploading(true);
    setError(null);

    try {
      const response = await uploadImageToCloudinary(file);

      if (!response.success || !response.data) {
        setError(response.error || 'Upload failed');
        return null;
      }

      return {
        url: response.data.secure_url,
        publicId: response.data.public_id,
        width: response.data.width,
        height: response.data.height,
        size: response.data.size
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  const deleteImage = useCallback(
    async (publicId: string): Promise<boolean> => {
      try {
        const response = await deleteImageFromCloudinary(publicId);
        return response.success;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Deletion failed';
        setError(message);
        return false;
      }
    },
    []
  );

  const getUrl = useCallback(
    (publicId: string, transformations?: any): string => {
      return getCloudinaryUrl(publicId, transformations);
    },
    []
  );

  return {
    uploading,
    error,
    upload,
    deleteImage,
    getUrl
  };
}
