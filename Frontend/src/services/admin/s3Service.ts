import api from "@/axios/axiosConfig";
export const fetchSignedUrl = async (key: string): Promise<string> => {
    try {
        const response = await api.get(`/upload/view-url?key=${key}`);
        return response.data.viewUrl;
    } catch (error) {
        console.error("Error fetching signed URL:", error);
        return "";
    }
};
