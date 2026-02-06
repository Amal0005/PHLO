import api from "@/axios/axiosConfig";
import { EditProfilePayload, UserProfileResponse } from "@/interface/user/userProfileInterface";

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
  getUploadUrl: async (fileType: string, folder: string): Promise<{ uploadUrl: string; publicUrl: string }> => {
  const res = await api.post("/upload/presign", { fileType, folder });
  return res.data;
},
uploadToS3: async (url: string, file: File): Promise<void> => {
  await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  })
  
},
getViewUrl: async (key: string): Promise<string> => {
  const res = await api.get(`/upload/view-url?key=${key}`);
  return res.data.viewUrl;
},
}