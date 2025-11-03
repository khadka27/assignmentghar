import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client
function getS3Client() {
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "AWS S3 is not configured. Set AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY in .env"
    );
  }

  return new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const FOLDER_PREFIX = process.env.AWS_S3_FOLDER_PREFIX || "assignments/";

// Upload file to S3
export async function uploadToS3(
  file: File,
  fileName: string
): Promise<{ fileKey: string; fileUrl: string; publicUrl?: string }> {
  try {
    if (!BUCKET_NAME) {
      throw new Error("AWS_S3_BUCKET_NAME is not configured. Set it in .env");
    }

    const s3Client = getS3Client();

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Construct S3 key with folder prefix
    const fileKey = `${FOLDER_PREFIX}${fileName}`;

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: buffer,
      ContentType: file.type,
      // Optional: Make files publicly readable (remove if you want private files)
      // ACL: "public-read",
    });

    await s3Client.send(command);

    // Construct file URL
    const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    console.log("File uploaded to S3:", {
      fileKey,
      fileName,
      fileUrl,
    });

    return {
      fileKey,
      fileUrl,
      publicUrl: fileUrl, // Same as fileUrl if public, or generate signed URL if private
    };
  } catch (error: any) {
    console.error("Error uploading to S3:", error);
    const message = error?.message || "Failed to upload file to S3";
    throw new Error(message);
  }
}

// Generate a pre-signed URL for private file access (valid for 1 hour)
export async function getSignedS3Url(fileKey: string): Promise<string> {
  try {
    if (!BUCKET_NAME) {
      throw new Error("AWS_S3_BUCKET_NAME is not configured");
    }

    const s3Client = getS3Client();

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    });

    // Generate signed URL valid for 1 hour
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return signedUrl;
  } catch (error: any) {
    console.error("Error generating signed URL:", error);
    throw new Error(error?.message || "Failed to generate signed URL");
  }
}

// Delete file from S3
export async function deleteFromS3(fileKey: string): Promise<void> {
  try {
    if (!BUCKET_NAME) {
      throw new Error("AWS_S3_BUCKET_NAME is not configured");
    }

    const s3Client = getS3Client();

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    });

    await s3Client.send(command);
    console.log("File deleted from S3:", fileKey);
  } catch (error: any) {
    console.error("Error deleting file from S3:", error);
    throw new Error(error?.message || "Failed to delete file from S3");
  }
}

// List files in assignments folder
export async function listAssignmentFiles() {
  try {
    if (!BUCKET_NAME) {
      throw new Error("AWS_S3_BUCKET_NAME is not configured");
    }

    const s3Client = getS3Client();

    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: FOLDER_PREFIX,
    });

    const response = await s3Client.send(command);

    const files = (response.Contents || []).map((item) => ({
      key: item.Key || "",
      name: item.Key?.replace(FOLDER_PREFIX, "") || "",
      size: item.Size || 0,
      lastModified: item.LastModified,
    }));

    return files;
  } catch (error: any) {
    console.error("Error listing files from S3:", error);
    throw new Error(error?.message || "Failed to list files from S3");
  }
}
