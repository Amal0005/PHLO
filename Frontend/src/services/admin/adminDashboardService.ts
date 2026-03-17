import api from "@/axios/axiosConfig";

export interface DashboardStatsResponse {
  success: boolean;
  message?: string;
  result: {
    totalUsers: number;
    totalCreators: number;
    totalBookings: number;
    totalRevenue: number;
    totalPackages: number;
    totalWallpapers: number;
    totalComplaints: number;
    pendingWallpapers: number;
    pendingCreators: number;
    monthlyRevenue: { month: string; amount: number }[];
    recentBookings: {
      id: string;
      userName: string;
      packageName: string;
      amount: number;
      status: string;
      createdAt: string | Date;
    }[];
    recentCreators: {
      id: string;
      name: string;
      email: string;
      createdAt: string | Date;
    }[];
    recentTransactions: {
      id: string;
      source: string;
      description: string;
      type: string;
      amount: number;
      timestamp: string | Date;
    }[];
  };
}

export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
  const response = await api.get<DashboardStatsResponse>("/admin/dashboard-stats");
  return response.data;
};
