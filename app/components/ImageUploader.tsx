'use client';

import { useState } from 'react';
import { ImageData } from '@/lib/validations/property';

interface ImageUploaderProps {
  images: ImageData[];
  onChange: (images: ImageData[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ images, onChange, maxImages = 10 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedImages: ImageData[] = [];
      const totalFiles = files.length;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        uploadedImages.push({
          url: data.url,
          caption: '',
          isMain: images.length === 0 && i === 0, // First image is main by default
        });

        setUploadProgress(((i + 1) / totalFiles) * 100);
      }

      onChange([...images, ...uploadedImages]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleSetMainImage = (index: number) => {
    onChange(
      images.map((img, i) => ({
        ...img,
        isMain: i === index,
      }))
    );
  };

  const handleUpdateCaption = (index: number, caption: string) => {
    onChange(
      images.map((img, i) => (i === index ? { ...img, caption } : img))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Property Images</h3>
        <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
          {uploading ? 'Uploading...' : '+ Upload Images'}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading || images.length >= maxImages}
            className="hidden"
          />
        </label>
      </div>

      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative border-2 rounded-lg overflow-hidden ${
              image.isMain ? 'border-green-500' : 'border-gray-300'
            }`}
          >
            <img
              src={image.url}
              alt={image.caption || `Property image ${index + 1}`}
              className="w-full h-48 object-cover"
            />

            {image.isMain && (
              <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                Main Image
              </div>
            )}

            <div className="absolute top-2 right-2 flex gap-2">
              {!image.isMain && (
                <button
                  type="button"
                  onClick={() => handleSetMainImage(index)}
                  className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                  title="Set as main image"
                >
                  ⭐
                </button>
              )}
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                title="Remove image"
              >
                ✕
              </button>
            </div>

            <div className="p-2 bg-white">
              <input
                type="text"
                placeholder="Add caption (optional)"
                value={image.caption || ''}
                onChange={(e) => handleUpdateCaption(index, e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              />
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && !uploading && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No images uploaded yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Click &quot;Upload Images&quot; to add property photos
          </p>
        </div>
      )}

      <p className="text-sm text-gray-600">
        {images.length} / {maxImages} images uploaded
        {images.length > 0 && !images.some((img) => img.isMain) && (
          <span className="text-red-600 ml-2">⚠️ Please set a main image</span>
        )}
      </p>
    </div>
  );
}

