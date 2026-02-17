import api from "@/axios/axiosConfig";
import {
  Subscription,
  SubscriptionForm,
} from "@/interface/admin/subscriptionInterface";

export const AdminSubscriptionService = {
  getSubscriptions: async (type?: string) => {
    const res = await api.get<{
      success: boolean;
      result: Subscription[];
    }>("/admin/subscription", { params: { type } });
    return res.data;
  },
  addSubscription: async (data: SubscriptionForm) => {
    const response = await api.post<{
      success: boolean;
      subscription: Subscription;
    }>("/admin/subscription", data);
    return response.data;
  },
  updateSubscription: async (id: string, data: Partial<SubscriptionForm>) => {
    const response = await api.patch<{
      success: boolean;
      subscription: Subscription;
    }>(`/admin/subscription/${id}`, data);
    return response.data;
  },
  deleteSubscription: async (id: string) => {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/admin/subscription/${id}`,
    );
    return response.data;
  },
};
