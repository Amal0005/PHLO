import api from "@/axios/axiosConfig";
import { CreatorProfileResponse, EditCreatorProfilePayload } from "@/interface/creator/creatorProfileInterface";
import { S3Service } from "@/services/s3Service";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";

export const CreatorProfileServices = {
    getProfile: async (): Promise<{ success: boolean, creator: CreatorProfileResponse }> => {
        const res = await api.get(FRONTEND_ROUTES.CREATOR.PROFILE)
        return res.data
    },
    editProfile: async (payload: EditCreatorProfilePayload): Promise<{ success: boolean, creator: CreatorProfileResponse }> => {
        const res = await api.patch(FRONTEND_ROUTES.CREATOR.PROFILE, payload)
        return res.data
    },
    getCreatorBookings: async (): Promise<{ success: boolean, data: Record<string, unknown>[] }> => {
        const res = await api.get(FRONTEND_ROUTES.CREATOR.GET_BOOKINGS)
        return res.data
    }
    ,
    getUploadUrl: S3Service.getPresignedUrl,
    uploadToS3: S3Service.uploadFile,
    getViewUrl: S3Service.getViewUrl,
}
