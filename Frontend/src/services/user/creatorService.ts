import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";
import api from "@/axios/axiosConfig";

export const CreatorService = {
  listCreators: async (page: number = 1, limit: number = 6, search?: string) => {
    try {
      const response = await api.get(FRONTEND_ROUTES.USER.CREATORS, {
        params: { page, limit, search }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching creators:", error);
      throw error;
    }
  }
};
