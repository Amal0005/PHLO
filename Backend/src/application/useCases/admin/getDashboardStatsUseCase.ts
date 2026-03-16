import { IDashboardStats, IDashboardStatsUseCase } from "@/domain/interface/admin/IDashboardStatsUseCase";
import { IUserRepository } from "@/domain/interface/repository/IUserRepository";
import { ICreatorRepository } from "@/domain/interface/repository/ICreatorRepository";
import { IBookingRepository } from "@/domain/interface/repository/IBookingRepository";
import { IWalletRepository } from "@/domain/interface/repository/IWalletRepository";

export class GetDashboardStatsUseCase implements IDashboardStatsUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private _creatorRepo: ICreatorRepository,
    private _bookingRepo: IBookingRepository,
    private _walletRepo: IWalletRepository
  ) {}

  async getStats(): Promise<IDashboardStats> {
    const [users, creators, bookings, wallet] = await Promise.all([
      this._userRepo.findAll({}),
      this._creatorRepo.findAll({}),
      this._bookingRepo.findAll({}),
      this._walletRepo.getWallet("admin", "admin")
    ]);

    return {
      totalUsers: users.length,
      totalCreators: creators.length,
      totalBookings: bookings.length,
      totalRevenue: wallet.balance,
      monthlyRevenue: [
        { month: "Jan", amount: 4000 },
        { month: "Feb", amount: 3000 },
        { month: "Mar", amount: 5000 },
      ],
      userGrowth: [
        { month: "Jan", count: 100 },
        { month: "Feb", count: 150 },
        { month: "Mar", count: 200 },
      ]
    };
  }
}
