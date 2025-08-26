/**
 * Utility functions for handling image URLs
 */

/**
 * Converts an image URL to the correct format for serving
 * - If it's already a full URL (starts with http/https), return as is
 * - If it's an uploaded image (starts with /uploads/), serve via API route
 * - If it's a placeholder image (starts with /images/), serve directly from public
 */
export const getImageUrl = (imageUrl: string): string => {
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it's an uploaded image, serve via API route
  if (imageUrl.startsWith('/uploads/')) {
    return `/api${imageUrl}`;
  }

  // If it's a placeholder image, serve directly from public
  if (imageUrl.startsWith('/images/')) {
    return imageUrl;
  }

  // Default fallback - assume it's a placeholder image
  return imageUrl;
};

/**
 * Checks if an image URL is an uploaded image
 */
export const isUploadedImage = (imageUrl: string): boolean => {
  return imageUrl.startsWith('/uploads/');
};

/**
 * Checks if an image URL is a placeholder image
 */
export const isPlaceholderImage = (imageUrl: string): boolean => {
  return imageUrl.startsWith('/images/');
};
