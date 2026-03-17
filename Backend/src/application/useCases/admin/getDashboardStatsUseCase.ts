import {
  IDashboardStats,
  IDashboardStatsUseCase,
  RecentBooking,
  RecentUser,
  RecentCreator,
  RecentTransaction
} from "@/domain/interface/admin/IDashboardStatsUseCase";
import { IUserRepository } from "@/domain/interface/repository/IUserRepository";
import { ICreatorRepository } from "@/domain/interface/repository/ICreatorRepository";
import { IBookingRepository } from "@/domain/interface/repository/IBookingRepository";
import { IWalletRepository } from "@/domain/interface/repository/IWalletRepository";
import { IPackageRepository } from "@/domain/interface/repository/IPackageRepository";
import { IWallpaperRepository } from "@/domain/interface/repository/IWallpaperRepository";
import { IComplaintRepository } from "@/domain/interface/repository/IComplaintRepository";

export class GetDashboardStatsUseCase implements IDashboardStatsUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private _creatorRepo: ICreatorRepository,
    private _bookingRepo: IBookingRepository,
    private _walletRepo: IWalletRepository,
    private _packageRepo: IPackageRepository,
    private _wallpaperRepo: IWallpaperRepository,
    private _complaintRepo: IComplaintRepository
  ) { }

  async getStats(): Promise<IDashboardStats> {
    const [
      users,
      creators,
      bookings,
      packages,
      wallpapers,
      complaints,
      wallet,
      populatedBookings
    ] = await Promise.all([
      this._userRepo.findAll({ role: "user" }),
      this._creatorRepo.findAll({}),
      this._bookingRepo.findAll({}),
      this._packageRepo.findAll({}),
      this._wallpaperRepo.findAll({}),
      this._complaintRepo.findAll(),
      this._walletRepo.getWallet("admin", "admin"),
      this._bookingRepo.findAllPopulated({})
    ]);

    // Fetch recent wallet transactions (5)
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

    // Monthly Revenue Calculation (last 6 months)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    const last6MonthsIndices: number[] = [];
    for (let i = 5; i >= 0; i--) {
      let m = currentMonth - i;
      if (m < 0) m += 12;
      last6MonthsIndices.push(m);
    }

    const monthlyRevenueMap: Record<number, number> = {};
    last6MonthsIndices.forEach(m => monthlyRevenueMap[m] = 0);

    bookings.forEach(booking => {
      const date = booking.createdAt || booking.bookingDate;
      const month = new Date(date).getMonth();
      if (monthlyRevenueMap[month] !== undefined && booking.status !== "cancelled") {
        monthlyRevenueMap[month] += booking.amount;
      }
    });

    const monthlyRevenue = last6MonthsIndices.map(m => ({
      month: months[m],
      amount: monthlyRevenueMap[m]
    }));

    // Recent activities (Users)
    const recentUsers: RecentUser[] = users
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 5)
      .map(u => ({
        id: u._id || "",
        name: u.name,
        email: u.email,
        createdAt: u.createdAt || new Date()
      }));

    // Recent activities (Creators)
    const recentCreators: RecentCreator[] = creators
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 5)
      .map(c => {
        // Safe access based on CreatorEntity definition (fullName/email)
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
      totalComplaints: complaints.length,
      pendingWallpapers: wallpapers.filter(w => w.status === "pending").length,
      pendingCreators: creators.filter(c => c.status === "pending").length,
      monthlyRevenue,
      recentBookings,
      recentUsers,
      recentCreators,
      recentTransactions
    };
  }
}
