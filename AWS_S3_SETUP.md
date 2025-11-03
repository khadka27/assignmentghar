# Amazon S3 Setup Guide

## Environment Variables Required

Add these to your `.env` file:

```properties
# AWS S3 Configuration
AWS_REGION="us-east-1"                      # Your AWS region (e.g., us-east-1, eu-west-1, ap-south-1)
AWS_ACCESS_KEY_ID="your-access-key-id"      # Your AWS IAM access key ID
AWS_SECRET_ACCESS_KEY="your-secret-key"     # Your AWS IAM secret access key
AWS_S3_BUCKET_NAME="your-bucket-name"       # Your S3 bucket name
AWS_S3_FOLDER_PREFIX="assignments/"         # Optional: folder prefix in bucket (default: "assignments/")
```

## Setup Steps

### 1. Create an S3 Bucket

1. Go to [AWS S3 Console](https://console.aws.amazon.com/s3/)
2. Click **Create bucket**
3. Enter a unique bucket name (e.g., `assignmentghar-files`)
4. Select your preferred AWS region
5. **Block Public Access settings**:
   - Keep "Block all public access" CHECKED for private files
   - OR uncheck it if you want files publicly accessible
6. Enable versioning (optional but recommended)
7. Click **Create bucket**

### 2. Create IAM User with S3 Access

1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Click **Users** → **Create user**
3. Enter username (e.g., `assignmentghar-s3-user`)
4. Click **Next**
5. Select **Attach policies directly**
6. Search and select: **AmazonS3FullAccess** (or create custom policy below)
7. Click **Next** → **Create user**

### 3. Create Access Keys

1. Click on your newly created user
2. Go to **Security credentials** tab
3. Scroll to **Access keys** section
4. Click **Create access key**
5. Select **Application running outside AWS**
6. Click **Next** → **Create access key**
7. **IMPORTANT**: Copy both:
   - Access key ID
   - Secret access key (shown only once!)

### 4. (Optional) Create Custom IAM Policy

For better security, create a custom policy with minimal permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::your-bucket-name/*",
        "arn:aws:s3:::your-bucket-name"
      ]
    }
  ]
}
```

Replace `your-bucket-name` with your actual bucket name.

### 5. Configure Bucket CORS (if accessing from browser)

1. Go to your S3 bucket
2. Click **Permissions** tab
3. Scroll to **Cross-origin resource sharing (CORS)**
4. Click **Edit** and add:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### 6. Update .env File

Add the values you copied:

```properties
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
AWS_S3_BUCKET_NAME="assignmentghar-files"
AWS_S3_FOLDER_PREFIX="assignments/"
```

### 7. Restart Server

```bash
# Stop current server (Ctrl+C if running)
pnpm dev
```

### 8. Test Upload

1. Go to: http://localhost:3000/submit
2. Fill the form and upload a test file
3. Check:
   - Success toast appears
   - File shows in My Assignments
   - File appears in your S3 bucket under `assignments/` folder

## File Access Options

### Option 1: Public Files (Anyone with URL can access)

1. In S3 bucket settings, uncheck "Block all public access"
2. Add bucket policy for public read:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

3. Files will be accessible via: `https://your-bucket-name.s3.region.amazonaws.com/assignments/filename.pdf`

### Option 2: Private Files (Signed URLs)

Keep "Block all public access" enabled. The app will generate temporary signed URLs valid for 1 hour using the `getSignedS3Url()` function.

## Pricing Estimate

AWS S3 pricing (us-east-1):

- Storage: $0.023 per GB/month
- PUT requests: $0.005 per 1,000 requests
- GET requests: $0.0004 per 1,000 requests
- Data transfer: First 100 GB/month free

**Example**: 1000 files (50 MB each) = 50 GB

- Storage: ~$1.15/month
- 1000 uploads + 5000 downloads: ~$0.01/month
- Total: ~$1.16/month

## Security Best Practices

✅ **DO**:

- Use IAM user with minimal permissions
- Enable bucket versioning
- Enable server-side encryption (AES-256 or KMS)
- Use signed URLs for private files
- Rotate access keys periodically
- Monitor usage with CloudWatch

❌ **DON'T**:

- Commit AWS credentials to git
- Use root account access keys
- Make bucket fully public unless necessary
- Share access keys

## Troubleshooting

**"AWS S3 is not configured"**

- Check all required env vars are set
- Restart the dev server

**"Access Denied" errors**

- Verify IAM user has S3 permissions
- Check bucket policy if using public access
- Verify access keys are correct

**"Bucket does not exist"**

- Confirm bucket name matches exactly
- Check you're using the correct AWS region

**Upload fails silently**

- Check browser console and server logs
- Verify CORS settings if uploading from browser
- Check file size limits (default 5GB for single upload)

## Migration from Google Drive

Old Google Drive environment variables can be removed:

```properties
# DELETE THESE
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_OAUTH_REFRESH_TOKEN=...
GOOGLE_DRIVE_PARENT_FOLDER_ID=...
GOOGLE_DRIVE_PUBLIC=...
```

The database schema remains the same - `fileUrl` now stores S3 URLs instead of Google Drive links.
