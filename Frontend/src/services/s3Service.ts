import api from "@/axios/axiosConfig";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const S3Service = {
    /**
     * Fetches a signed view URL for a given S3 key from the backend.
     * @param key The S3 key (path) for the file.
     * @returns A promise that resolves to the signed URL string.
     */
    getViewUrl: async (key: string): Promise<string> => {
        try {
            if (!key) return "";
            const response = await api.get(API_ENDPOINTS.UPLOAD.VIEW_URL, {
                params: { key }
            });
            return response.data.viewUrl;
        } catch (error) {
            console.error("Error fetching signed URL:", error);
            return "";
        }
    },

    /**
     * Fetches a presigned upload URL and public URL for a given file type and folder.
     * @param fileType The MIME type of the file.
     * @param folder The target folder ("profile", "id", "user-profiles", etc.)
     */
    getPresignedUrl: async (
        fileType: string,
        folder: string
    ): Promise<{ uploadUrl: string; publicUrl: string }> => {
        const res = await api.post(API_ENDPOINTS.UPLOAD.PRESIGN, { fileType, folder });
        return res.data;
    },

    /**
     * Uploads a file directly to S3 using a presigned URL.
     */
    uploadFile: async (url: string, file: File): Promise<void> => {
        console.log(url);
        const response = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
        });

        if (!response.ok) {
            throw new Error(`S3 upload failed with status ${response.status}`);
        }
    },

    /**
     * Combines getting a presigned URL and uploading the file.
     * @returns The public URL of the uploaded file.
     */
    uploadToS3: async (
        file: File,
        folder: "profile" | "id" | "user-profiles" | "creator-profiles" | "packages"
    ): Promise<string> => {
        const { uploadUrl, publicUrl } = await S3Service.getPresignedUrl(
            file.type,
            folder
        );
        await S3Service.uploadFile(uploadUrl, file);
        return publicUrl;
    },
};
