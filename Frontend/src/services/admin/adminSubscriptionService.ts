import api from "@/axios/axiosConfig";
import {
  Subscription,
  SubscriptionForm,
} from "@/interface/admin/subscriptionInterface";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const AdminSubscriptionService = {
  getSubscriptions: async (page: number = 1, limit: number = 10) => {
    const res = await api.get<{
      success: boolean;
      result: {
        data: Subscription[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(API_ENDPOINTS.ADMIN.SUBSCRIPTION, { params: { page, limit } });
    return res.data;
  },
  addSubscription: async (data: SubscriptionForm) => {
    const response = await api.post<{
      success: boolean;
      subscription: Subscription;
    }>(API_ENDPOINTS.ADMIN.SUBSCRIPTION, data);
    return response.data;
  },
  updateSubscription: async (id: string, data: Partial<SubscriptionForm>) => {
    const response = await api.patch<{
      success: boolean;
      subscription: Subscription;
    }>(`${API_ENDPOINTS.ADMIN.SUBSCRIPTION}/${id}`, data);
    return response.data;
  },
  deleteSubscription: async (id: string) => {
    const response = await api.delete<{ success: boolean; message: string }>(
      `${API_ENDPOINTS.ADMIN.SUBSCRIPTION}/${id}`,
    );
    return response.data;
  },
};
