# Chat File Upload Configuration

## Environment Variables

Add this to your `.env` file:

```env
# Admin Email for Notifications
ADMIN_EMAIL=your-admin-email@example.com

# Email Server Configuration (required for notifications)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@assignmentghar.com
```

## File Upload Settings

### Supported File Types

- **Images**: JPG, JPEG, PNG, GIF, WebP, SVG
- **Documents**: PDF, DOC, DOCX

### File Size Limit

- Maximum size: **5 MB** per file

### Email Notifications

When a user attempts to upload a file larger than 5MB, an email notification is automatically sent to the admin email address with:

- User information (name and email)
- File name and size
- Timestamp of the attempt

### Frontend Validation

Both student and admin chat pages include:

- ✅ Client-side file size validation (shows error before upload)
- ✅ Client-side file type validation
- ✅ Informative error messages
- ✅ File input reset after error or success

### Backend Validation

The API endpoint includes:

- ✅ Server-side file size validation
- ✅ Server-side file type validation (by MIME type and extension)
- ✅ Email notification system for oversized files
- ✅ Filename sanitization
- ✅ Unique filename generation with timestamps

## Usage

### For Users

1. Click the paperclip icon in the chat
2. Select an image, PDF, or Word document (max 5MB)
3. File will be validated and uploaded
4. If file is too large, contact support

### For Admins

- Receive email notifications when users attempt to upload files exceeding 5MB
- Can handle large file requests manually via email

## Testing

1. **Test valid upload:**

   - Upload a small image (< 5MB)
   - Should upload successfully

2. **Test file size limit:**

   - Try to upload a file > 5MB
   - Should show error message
   - Admin should receive email notification

3. **Test file type validation:**
   - Try to upload an unsupported file (.exe, .zip, etc.)
   - Should show error message

## File Storage Location

Uploaded chat files are stored in:

```
public/uploads/chat/
```

Files are publicly accessible via:

```
http://your-domain.com/uploads/chat/{filename}
```

## Security Considerations

- Files are sanitized to prevent directory traversal attacks
- File extensions are validated against allowed list
- MIME types are checked for additional security
- Maximum file size enforced to prevent DoS attacks
- Unique timestamps prevent filename collisions
