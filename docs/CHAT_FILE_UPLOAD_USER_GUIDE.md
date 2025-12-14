# Chat File Upload - Quick Reference

## ✅ What You Can Upload

### File Types

- 📷 **Images**: JPG, PNG, GIF, WebP, SVG
- 📄 **PDFs**: PDF documents
- 📝 **Word Docs**: DOC, DOCX

### Size Limit

- **Maximum:** 5 MB per file
- Files larger than 5MB will be rejected
- Admin will be notified via email if you try to upload oversized files

## 📤 How to Upload

1. Open a chat conversation
2. Click the **paperclip icon** (📎) at the bottom
3. Select your file
4. File will be automatically uploaded and sent

## ⚠️ Error Messages

### "File too large"

- Your file exceeds 5MB
- Contact admin for assistance with large files
- Email notification sent to admin automatically

### "Invalid file type"

- Only images, PDFs, and Word documents allowed
- Convert your file to a supported format
- Contact admin if you need help

## 💡 Tips

- **Compress images** before uploading if they're too large
- **Use PDF format** for documents when possible
- **Check file size** before attempting upload
- **Contact admin** for files larger than 5MB

## 📧 Admin Email for Large Files

If you need to share a file larger than 5MB:

- Admin receives automatic notification when you try
- Contact admin directly via the configured email
- Admin can arrange alternative file sharing method

## ✨ Features

- ✅ Instant validation before upload
- ✅ Clear error messages
- ✅ Automatic retry after fixing issues
- ✅ File preview in chat
- ✅ Download links for shared files
- ✅ Secure file storage

## 🔒 Security

All uploaded files are:

- Scanned for valid file types
- Stored securely on the server
- Accessible only via direct link
- Named uniquely to prevent conflicts

## 🆘 Need Help?

If you encounter issues:

1. Check file size (must be ≤ 5MB)
2. Check file type (images, PDF, Word only)
3. Try refreshing the page
4. Contact admin if problem persists

---

**Environment Variable Required:**

```env
ADMIN_EMAIL=your-admin@example.com
```

Add this to your `.env` file to receive notifications about oversized file upload attempts.
