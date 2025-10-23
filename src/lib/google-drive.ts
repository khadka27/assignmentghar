import { google } from "googleapis";
import { Readable } from "stream";

// Initialize Google Drive API
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
      /\\n/g,
      "\n"
    ),
  },
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({ version: "v3", auth });

// Get or create the "Assignment" folder in Google Drive
async function getOrCreateAssignmentFolder(): Promise<string> {
  try {
    // Search for existing "Assignment" folder
    const response = await drive.files.list({
      q: "name='Assignment' and mimeType='application/vnd.google-apps.folder' and trashed=false",
      fields: "files(id, name)",
      spaces: "drive",
    });

    if (response.data.files && response.data.files.length > 0) {
      // Folder exists, return its ID
      return response.data.files[0].id!;
    }

    // Create new folder if it doesn't exist
    const folderMetadata = {
      name: "Assignment",
      mimeType: "application/vnd.google-apps.folder",
    };

    const folder = await drive.files.create({
      requestBody: folderMetadata,
      fields: "id",
    });

    console.log("Created Assignment folder with ID:", folder.data.id);
    return folder.data.id!;
  } catch (error) {
    console.error("Error getting/creating Assignment folder:", error);
    throw error;
  }
}

// Upload file to Google Drive
export async function uploadToGoogleDrive(
  file: File,
  fileName: string
): Promise<{ fileId: string; webViewLink: string; webContentLink: string }> {
  try {
    const folderId = await getOrCreateAssignmentFolder();

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create readable stream from buffer
    const stream = Readable.from(buffer);

    // File metadata
    const fileMetadata = {
      name: fileName,
      parents: [folderId], // Upload to Assignment folder
    };

    // Upload file
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType: file.type,
        body: stream,
      },
      fields: "id, webViewLink, webContentLink",
    });

    // Make file publicly accessible (optional - remove if you want private files)
    await drive.permissions.create({
      fileId: response.data.id!,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    console.log("File uploaded successfully:", {
      fileId: response.data.id,
      webViewLink: response.data.webViewLink,
    });

    return {
      fileId: response.data.id!,
      webViewLink: response.data.webViewLink!,
      webContentLink: response.data.webContentLink!,
    };
  } catch (error) {
    console.error("Error uploading to Google Drive:", error);
    throw new Error("Failed to upload file to Google Drive");
  }
}

// Delete file from Google Drive
export async function deleteFromGoogleDrive(fileId: string): Promise<void> {
  try {
    await drive.files.delete({
      fileId: fileId,
    });
    console.log("File deleted successfully:", fileId);
  } catch (error) {
    console.error("Error deleting file from Google Drive:", error);
    throw error;
  }
}

// Get file metadata from Google Drive
export async function getFileMetadata(fileId: string) {
  try {
    const response = await drive.files.get({
      fileId: fileId,
      fields: "id, name, mimeType, size, webViewLink, webContentLink, createdTime",
    });
    return response.data;
  } catch (error) {
    console.error("Error getting file metadata:", error);
    throw error;
  }
}

// List all files in Assignment folder
export async function listAssignmentFiles() {
  try {
    const folderId = await getOrCreateAssignmentFolder();
    
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: "files(id, name, mimeType, size, webViewLink, createdTime)",
      orderBy: "createdTime desc",
    });

    return response.data.files || [];
  } catch (error) {
    console.error("Error listing assignment files:", error);
    throw error;
  }
}
