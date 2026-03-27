import React, { useRef, useState } from 'react';
import { useImageUpload } from '@/hooks/use-image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Upload, Loader2 } from 'lucide-react';

interface ImageUploadInputProps {
  onImageUpload?: (imageUrl: string, publicId: string) => void;
  accept?: string;
  maxSize?: number; // in MB
}

/**
 * Image Upload Component
 * 
 * Usage:
 * <ImageUploadInput 
 *   onImageUpload={(url, id) => {
 *     console.log('Uploaded:', url);
 *   }}
 * />
 */
export function ImageUploadInput({
  onImageUpload,
  accept = 'image/*',
  maxSize = 5
}: ImageUploadInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploading, error: uploadError, upload } = useImageUpload();
  const [preview, setPreview] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLocalError(null);

    // Validate file size
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setLocalError(`File is too large. Maximum: ${maxSize}MB`);
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    console.log('Starting upload for file:', file.name);
    const result = await upload(file);
    
    if (result) {
      console.log('Upload successful:', result);
      setSuccessMessage('Image uploaded successfully!');
      onImageUpload?.(result.url, result.publicId);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      console.error('Upload failed');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Upload Image</label>

        <div className="flex gap-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            size="sm"
            variant="outline"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Choose
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-gray-500">
          Max size: {maxSize}MB. Allowed: JPEG, PNG, GIF, WebP
        </p>
      </div>

      {preview && (
        <div className="relative w-full h-40 bg-gray-100 rounded border">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded"
          />
        </div>
      )}

      {localError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{localError}</AlertDescription>
        </Alert>
      )}

      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="border-green-500 bg-green-50">
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
