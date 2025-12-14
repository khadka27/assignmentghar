# Chat Image Preview Feature

## Overview

The chat system now includes a full-screen image preview modal with download functionality. This feature is available for both student and admin chat interfaces.

## Features

### 1. **Image Preview Modal**

- Click on any image in chat messages to open a full-screen preview
- Modal displays the image at maximum quality
- Optimized for both desktop and mobile devices

### 2. **User Interface Elements**

#### Close Options

- **X Button**: Located at the top-right corner of the modal
- **Click Outside**: Click anywhere on the dark background to close
- **ESC Key**: Press the Escape key on your keyboard to close

#### Visual Feedback

- **Hover Effect**: Images show a subtle zoom and search icon on hover (desktop only)
- **Smooth Transitions**: All interactions include smooth animations
- **Backdrop Blur**: Dark semi-transparent background with blur effect

### 3. **Download Functionality**

- Download button displayed below the image
- Downloads the original file with the correct filename
- Available for all image formats (JPG, PNG, GIF, WebP, SVG)

### 4. **Mobile Responsiveness**

- Touch-friendly interface
- Proper sizing on all screen sizes
- Swipe gestures supported (click to close)
- Responsive button layout

## User Guide

### Viewing an Image

1. Navigate to a conversation with image attachments
2. Find any message containing an image
3. Click directly on the image thumbnail
4. The full-screen preview modal will open

### Downloading an Image

1. Open the image preview (see above)
2. Locate the download button below the image
3. Click the "Download" button
4. The image will be saved to your device's default download location

### Closing the Preview

Choose any of these methods:

- Click the **X** button in the top-right corner
- Click anywhere on the dark background
- Press the **ESC** key on your keyboard

## Technical Details

### File Paths

- **Student Chat**: `src/app/(platform)/chat/page.tsx`
- **Admin Chat**: `src/app/admin/chat-students/page.tsx`

### Implementation Features

```typescript
// State Management
const [previewImage, setPreviewImage] = useState<{
  url: string;
  name: string;
} | null>(null);

// ESC Key Support
useEffect(() => {
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape" && previewImage) {
      setPreviewImage(null);
    }
  };
  window.addEventListener("keydown", handleEsc);
  return () => window.removeEventListener("keydown", handleEsc);
}, [previewImage]);
```

### Styling Classes

- **Modal Container**: `z-[100]` ensures it appears above all other content
- **Backdrop**: `bg-black/90 backdrop-blur-sm` for darkened blurred background
- **Image Container**: `max-h-[90vh]` prevents images from exceeding viewport
- **Responsive Design**: Tailwind classes for mobile and desktop optimization

### Icons Used

- **Search**: Hover indicator on image thumbnails
- **X**: Close button
- **Download**: Download button icon

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Keyboard Shortcuts

| Key | Action                    |
| --- | ------------------------- |
| ESC | Close image preview modal |

## Notes

- Images are displayed at their original quality
- Download preserves the original filename
- Modal prevents body scrolling while open
- Works with all supported image formats (JPG, PNG, GIF, WebP, SVG)
- Available for both sent and received messages

## Future Enhancements

Potential improvements for future versions:

- Image zoom controls (zoom in/out)
- Swipe between multiple images in a conversation
- Image rotation controls
- Share functionality
- Gallery view for all images in a conversation
