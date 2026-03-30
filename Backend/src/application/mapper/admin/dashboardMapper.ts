import type { User } from "@/domain/entities/userEntities";
import type { CreatorEntity } from "@/domain/entities/creatorEntities";
import type { BookingEntity } from "@/domain/entities/bookingEntity";
import type { WalletTransaction } from "@/domain/entities/walletTransactionEntity";
import type { 
  RecentBooking, 
  RecentUser, 
  RecentCreator, 
  RecentTransaction, 
  DashboardResponseDTO, 
  TimeFrameData 
} from "@/domain/dto/admin/dashboardResponseDto";

export class DashboardMapper {
  static toRecentUser(user: User): RecentUser {
    return {
      id: user._id || "",
      name: user.name,
      email: user.email,
      createdAt: user.createdAt || new Date(),
    };
  }

  static toRecentCreator(creator: CreatorEntity): RecentCreator {
    const creatorData = creator as unknown as Record<string, unknown>;
    return {
      id: creator._id || "",
      name: String(creatorData.fullName || creatorData.name || creatorData.userName || "Unknown"),
      email: String(creatorData.email || creatorData.creatorEmail || "Unknown"),
      createdAt: creator.createdAt || new Date(),
    };
  }

  static toRecentBooking(booking: BookingEntity): RecentBooking {
    const user = typeof booking.userId === 'object' ? (booking.userId as unknown as { name: string }) : null;
    const pkg = typeof booking.packageId === 'object' ? (booking.packageId as unknown as { title: string }) : null;
    
    return {
      id: booking.id || "",
      userName: user?.name || "Unknown",
      packageName: pkg?.title || "Unknown",
      amount: booking.amount,
      status: booking.status || "confirmed",
      createdAt: booking.createdAt || booking.bookingDate,
    };
  }

  static toRecentTransaction(tx: WalletTransaction): RecentTransaction {
    const txData = tx as unknown as { _id?: { toString(): string } };
    return {
      id: tx.id || txData._id?.toString() || "",
      source: tx.source || "Unknown",
      description: tx.description || "",
      type: tx.type || "debit",
      amount: tx.amount || 0,
      timestamp: tx.timestamp || new Date(),
    };
  }

  static toDashboardStats(params: {
    totalUsers: number;
    totalCreators: number;
    totalBookings: number;
    totalRevenue: number;
    totalPackages: number;
    totalWallpapers: number;
    totalComplaints: number;
    pendingCreators: number;
    revenueData: TimeFrameData[];
    userGrowthData: TimeFrameData[];
    bookingStatusStats: { status: string; count: number }[];
    bookingCategoryStats: { category: string; count: number }[];
    recentBookings: BookingEntity[];
    recentUsers: User[];
    recentCreators: CreatorEntity[];
    recentTransactions: WalletTransaction[];
  }): DashboardResponseDTO {
    return {
      ...params,
      recentBookings: params.recentBookings.map(b => this.toRecentBooking(b)),
      recentUsers: params.recentUsers.map(u => this.toRecentUser(u)),
      recentCreators: params.recentCreators.map(c => this.toRecentCreator(c)),
      recentTransactions: params.recentTransactions.map(tx => this.toRecentTransaction(tx)),
    };
  }
}
