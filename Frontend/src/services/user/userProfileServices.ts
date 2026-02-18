import api from "@/axios/axiosConfig";
import { EditProfilePayload, UserProfileResponse } from "@/interface/user/userProfileInterface";
import { S3Service } from "@/services/s3Service";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const UserProfileService = {
  getProfile: async (): Promise<{ success: boolean; user: UserProfileResponse }> => {
    const res = await api.get(API_ENDPOINTS.USER.PROFILE)
    return res.data
  },
  editProfile: async (payload: EditProfilePayload): Promise<{ success: boolean, user: UserProfileResponse }> => {
    const res = await api.patch(API_ENDPOINTS.USER.PROFILE, payload)
    return res.data
  },
  changePassword: async (payload: { currentPassword: string; newPassword: string; }): Promise<{ success: boolean; message: string }> => {
    const res = await api.patch(API_ENDPOINTS.USER.CHANGE_PASSWORD, payload);
    return res.data;
  },
  // Check if a new email is available before sending OTP
  checkEmailAvailability: async (email: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.post(API_ENDPOINTS.USER.CHECK_EMAIL, { email });
    return res.data;
  },
  sendEmailChangeOtp: async (email: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.post(API_ENDPOINTS.USER.RESEND_OTP, { email });
    return res.data;
  },
  verifyEmailChangeOtp: async (email: string, otp: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.post(API_ENDPOINTS.USER.VERIFY_EMAIL_OTP, { email, otp });
    return res.data;
  },
  getUploadUrl: S3Service.getPresignedUrl,
  uploadToS3: S3Service.uploadFile,
  getViewUrl: S3Service.getViewUrl,
}