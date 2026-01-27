import api from "@/axios/axiosConfig";

/**
 * Fetches a signed view URL for a given S3 key from the backend.
 * @param key The S3 key (path) for the file.
 * @returns A promise that resolves to the signed URL string.
 */
export const fetchSignedUrl = async (key: string): Promise<string> => {
    try {
        const response = await api.get(`/upload/view-url?key=${key}`);
        return response.data.viewUrl;
    } catch (error) {
        console.error("Error fetching signed URL:", error);
        return "";
    }
};
