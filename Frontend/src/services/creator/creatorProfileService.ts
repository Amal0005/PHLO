import api from "@/axios/axiosConfig";
import { CreatorProfileResponse, EditCreatorProfilePayload } from "@/interface/creator/creatorProfileInterface";
import { S3Service } from "../s3Service";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const CreatorProfileServices = {
    getProfile: async (): Promise<{ success: boolean, creator: CreatorProfileResponse }> => {
        const res = await api.get(API_ENDPOINTS.CREATOR.PROFILE)
        return res.data
    },
    editProfile: async (payload: EditCreatorProfilePayload): Promise<{ success: boolean, creator: CreatorProfileResponse }> => {
        const res = await api.patch(API_ENDPOINTS.CREATOR.PROFILE, payload)
        return res.data
    },
    // Delegate S3 operations to the unified service
    getUploadUrl: S3Service.getPresignedUrl,
    uploadToS3: S3Service.uploadFile,
    getViewUrl: S3Service.getViewUrl,
}