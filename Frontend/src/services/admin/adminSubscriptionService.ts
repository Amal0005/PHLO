import api from "@/axios/axiosConfig";
import {
  Subscription,
  SubscriptionForm,
} from "@/interface/admin/subscriptionInterface";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";

export const AdminSubscriptionService = {
  getSubscriptions: async (page: number = 1, limit: number = 10, search?: string, isActive?: boolean) => {
    const res = await api.get<{
      success: boolean;
      result: {
        data: Subscription[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(FRONTEND_ROUTES.ADMIN.SUBSCRIPTION, { params: { page, limit, search, isActive } });
    return res.data;
  },
  addSubscription: async (data: SubscriptionForm) => {
    const response = await api.post<{
      success: boolean;
      subscription: Subscription;
    }>(FRONTEND_ROUTES.ADMIN.SUBSCRIPTION, data);
    return response.data;
  },
  updateSubscription: async (id: string, data: Partial<SubscriptionForm>) => {
    const response = await api.patch<{
      success: boolean;
      subscription: Subscription;
    }>(`${FRONTEND_ROUTES.ADMIN.SUBSCRIPTION}/${id}`, data);
    return response.data;
  },
  deleteSubscription: async (id: string) => {
    const response = await api.delete<{ success: boolean; message: string }>(
      `${FRONTEND_ROUTES.ADMIN.SUBSCRIPTION}/${id}`,
    );
    return response.data;
  },
};
