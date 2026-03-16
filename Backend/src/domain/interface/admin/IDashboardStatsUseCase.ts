export interface IDashboardStats {
  totalUsers: number;
  totalCreators: number;
  totalBookings: number;
  totalRevenue: number;
  monthlyRevenue: { month: string; amount: number }[];
  userGrowth: { month: string; count: number }[];
}

export interface IDashboardStatsUseCase {
  getStats(): Promise<IDashboardStats>;
}
