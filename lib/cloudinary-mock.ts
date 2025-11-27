// Mock Cloudinary for testing without credentials
export const mockCloudinaryUpload = async (file: File): Promise<string> => {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock Cloudinary URL format
  return `https://res.cloudinary.com/demo/image/upload/v1/${file.name}`;
};

export const mockCloudinaryDelete = async (publicId: string): Promise<void> => {
  // Simulate delete delay
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('Mock delete:', publicId);
};

// Check if Cloudinary is configured
export const isCloudinaryConfigured = (): boolean => {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

// Use mock or real Cloudinary based on configuration
export const getUploadFunction = (): 'real' | 'mock' => {
  if (isCloudinaryConfigured()) {
    return 'real'; // Use real Cloudinary
  }
  return 'mock'; // Use mock for testing
};
