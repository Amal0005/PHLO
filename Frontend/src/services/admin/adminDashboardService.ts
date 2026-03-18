import api from "@/axios/axiosConfig";

export interface RecentBooking {
  id: string;
  userName: string;
  packageName: string;
  amount: number;
  status: string;
  createdAt: string | Date;
}

export interface RecentCreator {
  id: string;
  name: string;
  email: string;
  createdAt: string | Date;
}

export interface RecentTransaction {
  id: string;
  source: string;
  description: string;
  type: string;
  amount: number;
  timestamp: string | Date;
}

export interface TimeFrameData {
  label: string;
  amount: number;
}

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
    revenueData: TimeFrameData[];
    userGrowthData: TimeFrameData[];
    bookingStatusStats: { status: string; count: number }[];
    bookingCategoryStats: { category: string; count: number }[];
    recentBookings: RecentBooking[];
    recentCreators: RecentCreator[];
    recentTransactions: RecentTransaction[];
  };
}

export const getDashboardStats = async (timeframe: string = "monthly"): Promise<DashboardStatsResponse> => {
  const response = await api.get<DashboardStatsResponse>("/admin/dashboard-stats", {
    params: { timeframe }
  });
  return response.data;
};
