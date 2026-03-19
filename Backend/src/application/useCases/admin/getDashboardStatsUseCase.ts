import {
  IDashboardStats,
  IDashboardStatsUseCase,
  RecentBooking,
  RecentUser,
  RecentCreator,
  RecentTransaction,
  TimeFrameData
} from "@/domain/interface/admin/IDashboardStatsUseCase";
import { IUserRepository } from "@/domain/interface/repository/IUserRepository";
import { ICreatorRepository } from "@/domain/interface/repository/ICreatorRepository";
import { IBookingRepository } from "@/domain/interface/repository/IBookingRepository";
import { IWalletRepository } from "@/domain/interface/repository/IWalletRepository";
import { IPackageRepository } from "@/domain/interface/repository/IPackageRepository";
import { IWallpaperRepository } from "@/domain/interface/repository/IWallpaperRepository";
import { IComplaintRepository } from "@/domain/interface/repository/IComplaintRepository";
import { startOfDay, subDays, startOfMonth, subMonths, format, isAfter, endOfDay } from "date-fns";

export class GetDashboardStatsUseCase implements IDashboardStatsUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private _creatorRepo: ICreatorRepository,
    private _bookingRepo: IBookingRepository,
    private _walletRepo: IWalletRepository,
    private _packageRepo: IPackageRepository,
    private _wallpaperRepo: IWallpaperRepository,
    private _complaintRepo: IComplaintRepository
  ) {}

  async getStats(timeframe: string = "monthly"): Promise<IDashboardStats> {
    const [
      users,
      creators,
      bookings,
      packages,
      wallpapers,
      complaintResult,
      wallet,
      populatedBookings
    ] = await Promise.all([
      this._userRepo.findAll({ role: "user" }),
      this._creatorRepo.findAll({}),
      this._bookingRepo.findAll({}),
      this._packageRepo.findAll({}),
      this._wallpaperRepo.findAll({}),
      this._complaintRepo.findAll(1, 1),
      this._walletRepo.getWallet("admin", "admin"),
      this._bookingRepo.findAllPopulated({})
    ]);

    const totalComplaintsCount = (complaintResult as { total: number }).total;

    let recentTransactions: RecentTransaction[] = [];
    if (wallet && wallet.id) {
      const transactionResult = await this._walletRepo.getTransactions(wallet.id, "", "", 1, 5);
      recentTransactions = transactionResult.transactions.map(tx => ({
        id: tx.id || "",
        source: tx.source || "Unknown",
        description: tx.description || "",
        type: tx.type || "debit",
        amount: tx.amount || 0,
        timestamp: tx.timestamp || new Date()
      }));
    }

    const now = new Date();
    const revenueData: TimeFrameData[] = [];
    const userGrowthData: TimeFrameData[] = [];
    
    let statsStartDate: Date;
    if (timeframe === "weekly") {
      statsStartDate = startOfDay(subDays(now, 6));
      
      for (let i = 6; i >= 0; i--) {
        const date = subDays(now, i);
        const label = format(date, "EEE");
        const start = startOfDay(date);
        const end = endOfDay(date);

        const rev = bookings
          .filter(b => b.status !== "cancelled" && isAfter(new Date(b.createdAt || b.bookingDate), start) && !isAfter(new Date(b.createdAt || b.bookingDate), end))
          .reduce((acc, curr) => acc + curr.amount, 0);

        const uCount = users
          .filter(u => u.createdAt && isAfter(new Date(u.createdAt), start) && !isAfter(new Date(u.createdAt), end))
          .length;

        revenueData.push({ label, amount: rev });
        userGrowthData.push({ label, amount: uCount });
      }
    } else if (timeframe === "yearly") {
      statsStartDate = startOfMonth(subMonths(now, 11));
      
      for (let i = 11; i >= 0; i--) {
        const date = subMonths(now, i);
        const label = format(date, "MMM");
        const start = startOfMonth(date);
        const end = startOfMonth(subMonths(date, -1));

        const rev = bookings
          .filter(b => b.status !== "cancelled" && isAfter(new Date(b.createdAt || b.bookingDate), start) && !isAfter(new Date(b.createdAt || b.bookingDate), end))
          .reduce((acc, curr) => acc + curr.amount, 0);

        const uCount = users
          .filter(u => u.createdAt && isAfter(new Date(u.createdAt), start) && !isAfter(new Date(u.createdAt), end))
          .length;

        revenueData.push({ label, amount: rev });
        userGrowthData.push({ label, amount: uCount });
      }
    } else {
      statsStartDate = startOfMonth(subMonths(now, 5));
      
      for (let i = 5; i >= 0; i--) {
        const date = subMonths(now, i);
        const label = format(date, "MMM");
        const start = startOfMonth(date);
        const end = startOfMonth(subMonths(date, -1));

        const rev = bookings
          .filter(b => b.status !== "cancelled" && isAfter(new Date(b.createdAt || b.bookingDate), start) && !isAfter(new Date(b.createdAt || b.bookingDate), end))
          .reduce((acc, curr) => acc + curr.amount, 0);

        const uCount = users
          .filter(u => u.createdAt && isAfter(new Date(u.createdAt), start) && !isAfter(new Date(u.createdAt), end))
          .length;

        revenueData.push({ label, amount: rev });
        userGrowthData.push({ label, amount: uCount });
      }
    }

    const filteredBookings = bookings.filter(b => isAfter(new Date(b.createdAt || b.bookingDate), statsStartDate));
    const filteredPopulatedBookings = populatedBookings.filter(b => isAfter(new Date(b.createdAt || b.bookingDate), statsStartDate));

    const bookingStatusCounts: Record<string, number> = {};
    filteredBookings.forEach(b => {
      bookingStatusCounts[b.status || "confirmed"] = (bookingStatusCounts[b.status || "confirmed"] || 0) + 1;
    });
    const bookingStatusStats = Object.entries(bookingStatusCounts).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count
    }));

    const bookingCategoryCounts: Record<string, number> = {};
    filteredPopulatedBookings.forEach(b => {
      if (b.status === "completed") {
        const cat = (typeof b.packageId === 'object' && b.packageId?.category) ? b.packageId.category : "Uncategorized";
        bookingCategoryCounts[cat] = (bookingCategoryCounts[cat] || 0) + 1;
      }
    });

    const bookingCategoryStats = Object.entries(bookingCategoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    const recentUsers: RecentUser[] = users
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 5)
      .map(u => ({
        id: u._id || "",
        name: u.name,
        email: u.email,
        createdAt: u.createdAt || new Date()
      }));

    const recentCreators: RecentCreator[] = creators
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 5)
      .map(c => {
        const creatorData = c as unknown as Record<string, unknown>;
        return {
          id: c._id || "",
          name: String(creatorData.fullName || creatorData.name || creatorData.userName || "Unknown"),
          email: String(creatorData.email || creatorData.creatorEmail || "Unknown"),
          createdAt: c.createdAt || new Date()
        };
      });

    const recentBookings: RecentBooking[] = populatedBookings
      .slice(0, 5)
      .map(b => ({
        id: b.id || "",
        userName: typeof b.userId === 'object' ? b.userId.name : "Unknown",
        packageName: typeof b.packageId === 'object' ? b.packageId.title : "Unknown",
        amount: b.amount,
        status: b.status,
        createdAt: b.createdAt || b.bookingDate
      }));

    return {
      totalUsers: users.length,
      totalCreators: creators.length,
      totalBookings: bookings.length,
      totalPackages: packages.length,
      totalWallpapers: wallpapers.length,
      totalRevenue: wallet?.balance || 0,
      totalComplaints: totalComplaintsCount,
      pendingWallpapers: wallpapers.filter(w => w.status === "pending").length,
      pendingCreators: creators.filter(c => c.status === "pending").length,
      revenueData,
      userGrowthData,
      bookingStatusStats,
      bookingCategoryStats,
      recentBookings,
      recentUsers,
      recentCreators,
      recentTransactions
    };
  }
}
