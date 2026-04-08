import api from "@/axios/axiosConfig";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";

export interface CreatorAnalytics {
    revenueByMonth: { month: string; amount: number }[];
    bookingStatusDistribution: { status: string; count: number }[];
    recentEarningStats: {
        totalRevenue: number;
        totalBookings: number;
        averageOrderValue: number;
        totalClients: number;
        satisfactionRate: number;
    };
    marketPerformance: {
        conversionRate: number;
        satisfaction: number;
        repeatClients: number;
        growth: number;
    };
    popularPackages: { name: string; count: number }[];
}

export const AnalyticsService = {
    getCreatorAnalytics: async (): Promise<{ success: boolean; data: CreatorAnalytics }> => {
        const res = await api.get(FRONTEND_ROUTES.CREATOR.ANALYTICS);
        return res.data;
    }
};
