export interface RecentBooking {
  id: string;
  userName: string;
  packageName: string;
  amount: number;
  status: string;
  createdAt: Date;
}

export interface RecentUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface RecentCreator {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface RecentTransaction {
  id: string;
  source: string;
  description: string;
  type: string;
  amount: number;
  timestamp: Date;
}

export interface IDashboardStats {
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
  recentBookings: RecentBooking[];
  recentUsers: RecentUser[];
  recentCreators: RecentCreator[];
  recentTransactions: RecentTransaction[];
}

export interface IDashboardStatsUseCase {
  getStats(): Promise<IDashboardStats>;
}
