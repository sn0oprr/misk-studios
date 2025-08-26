# Image Serving Implementation

This document describes how images are served in the Misk Studios application.

## Overview

The application handles two types of images:
1. **Placeholder images** - Static images stored in `/public/images/`
2. **Uploaded images** - User-uploaded images stored in `/public/uploads/`

## Implementation Details

### API Route for Uploaded Images

Created a new API route at `/api/uploads/[...filename]` that serves uploaded images from the `public/uploads/` directory.

**File**: `src/app/api/uploads/[...filename]/route.ts`

**Features**:
- Serves images with proper content-type headers
- Includes security measures to prevent directory traversal attacks
- Implements caching headers for better performance
- Supports common image formats (jpg, jpeg, png, gif, webp, svg)

### Image URL Utility

Created a utility function to handle image URL transformation.

**File**: `src/lib/imageUtils.ts`

**Functions**:
- `getImageUrl(imageUrl: string)` - Converts image URLs to the correct format
- `isUploadedImage(imageUrl: string)` - Checks if an image is uploaded
- `isPlaceholderImage(imageUrl: string)` - Checks if an image is a placeholder

### URL Transformation Logic

The `getImageUrl()` function handles URL transformation as follows:

1. **Full URLs** (http/https) - Returned as-is
2. **Uploaded images** (`/uploads/filename`) - Transformed to `/api/uploads/filename`
3. **Placeholder images** (`/images/filename`) - Returned as-is
4. **Fallback** - Assumed to be placeholder images

## Updated Components

The following components have been updated to use the new image serving system:

1. **StudioCard** (`src/components/StudioCard.tsx`)
   - Updated to use `getImageUrl()` for studio images

2. **PhotoGallery** (`src/components/PhotoGallery.tsx`)
   - Updated to use `getImageUrl()` for both main image and thumbnails

3. **StudioModal** (`src/components/StudioModal.tsx`)
   - Updated to use `getImageUrl()` for image previews

## Testing

A test page has been created at `/test-images` to verify the image serving functionality.

**Features**:
- Displays both uploaded and placeholder images
- Shows original and processed URLs
- Demonstrates the URL transformation logic

## Security Considerations

1. **Directory Traversal Protection**: The API route prevents access to files outside the uploads directory
2. **File Type Validation**: Only image files are served with appropriate content-type headers
3. **Path Validation**: Invalid characters and patterns are blocked

## Performance Optimizations

1. **Caching**: Images are served with cache headers for 1 year
2. **Content-Type Headers**: Proper MIME types are set for better browser handling
3. **Error Handling**: Graceful fallbacks for missing or invalid files

## Usage Examples

```typescript
import { getImageUrl } from '@/lib/imageUtils';

// Uploaded image
const uploadedImage = getImageUrl('/uploads/abc123.jpg');
// Result: '/api/uploads/abc123.jpg'

// Placeholder image
const placeholderImage = getImageUrl('/images/studio.jpg');
// Result: '/images/studio.jpg'

// Full URL
const fullUrl = getImageUrl('https://example.com/image.jpg');
// Result: 'https://example.com/image.jpg'
```

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── uploads/
│   │       └── [...filename]/
│   │           └── route.ts          # Image serving API route
│   └── test-images/
│       └── page.tsx                  # Test page
├── components/
│   ├── StudioCard.tsx               # Updated for image serving
│   ├── PhotoGallery.tsx             # Updated for image serving
│   └── StudioModal.tsx              # Updated for image serving
└── lib/
    └── imageUtils.ts                # Image URL utility functions
```

## Next.js Configuration

The `next.config.ts` has been updated to include:
- `unoptimized: true` for images to work with our custom serving logic
- Support for remote patterns (for external images)

This configuration ensures that both uploaded and placeholder images are served correctly while maintaining compatibility with Next.js Image optimization features.
