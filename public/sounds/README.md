# Notification Sound Setup

To add notification sounds to your chat system:

## Option 1: Use a Free Sound File

1. Download a free notification sound from:

   - https://notificationsounds.com/
   - https://freesound.org/
   - https://mixkit.co/free-sound-effects/notification/

2. Rename the file to `notification.mp3`

3. Place it in: `public/sounds/notification.mp3`

## Option 2: Use Browser's Default Audio

The chat system will attempt to play the notification sound if it exists.
If the file doesn't exist, it will silently fail (no errors).

## File Requirements

- Format: MP3, OGG, or WAV
- Size: < 500KB recommended
- Duration: 0.5-2 seconds
- Volume: Normalized

## Current Status

The chat page is configured to play: `/sounds/notification.mp3`

You can add this file anytime - the chat works perfectly without it!
