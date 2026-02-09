import api from "@/axios/axiosConfig";
import { EditProfilePayload, UserProfileResponse } from "@/interface/user/userProfileInterface";
import { S3Service } from "@/services/s3Service";

export const UserProfileService = {
  getProfile: async (): Promise<{ success: boolean; user: UserProfileResponse }> => {
    const res = await api.get("/profile")
    return res.data
  },
  editProfile: async (payload: EditProfilePayload): Promise<{ success: boolean, user: UserProfileResponse }> => {
    const res = await api.patch("/profile", payload)
    return res.data
  },
  changePassword: async (payload: { currentPassword: string; newPassword: string; }): Promise<{ success: boolean; message: string }> => {
    const res = await api.patch("/change-password", payload);
    return res.data;
  },
  // Delegate S3 operations to the unified service
  getUploadUrl: S3Service.getPresignedUrl,
  uploadToS3: S3Service.uploadFile,
  getViewUrl: S3Service.getViewUrl,
}