# Notification Sound Setup

## ✅ Current Status: CONFIGURED

The chat system is now using: **`/sounds/notification.wav`**

## Audio File Details

- **Format:** WAV (Web Audio)
- **Location:** `public/sounds/notification.wav`
- **Volume:** Set to 50% for optimal user experience
- **Status:** Ready to use! 🎵

## How It Works

When you receive a new message, the app will:

1. Play the notification sound (notification.wav)
2. Show a toast notification
3. Display the message in real-time

## Customization

Want to use a different sound? Simply replace `notification.wav` with your own file:

1. **Keep the filename:** `notification.wav`
2. **Supported formats:** WAV, MP3, OGG
3. **Recommended:**
   - Duration: 0.5-2 seconds
   - Size: < 500KB
   - Volume: Normalized

## Free Sound Sources

Download free notification sounds from:

- https://notificationsounds.com/
- https://freesound.org/
- https://mixkit.co/free-sound-effects/notification/
- https://pixabay.com/sound-effects/

## Technical Details

The notification sound is played when:

- ✅ New message received (from other users)
- ✅ File uploaded and shared
- ✅ System notifications

The sound will NOT play for:

- ❌ Your own messages
- ❌ System messages you send

## Browser Compatibility

Modern browsers may block autoplay. The app handles this gracefully:

- Sound plays automatically when allowed
- Silent fail if blocked (no errors shown)
- User interaction may be required first

---

**Note:** The chat works perfectly with or without the notification sound!
