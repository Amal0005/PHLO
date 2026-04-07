import type { IGetCreatorAnalyticsUseCase, CreatorAnalytics } from "@/domain/interfaces/creator/analytics/IGetCreatorAnalyticsUseCase";
import { BookingModel } from "@/framework/database/model/bookingModel";
import { PackageModel } from "@/framework/database/model/packageModel";
import { WallpaperDownloadModel } from "@/framework/database/model/wallpaperDownloadModel";
import { Types } from "mongoose";

export class GetCreatorAnalyticsUseCase implements IGetCreatorAnalyticsUseCase {
    async getAnalytics(creatorId: string): Promise<CreatorAnalytics> {
        const creatorObjectId = new Types.ObjectId(creatorId);

        // 1. Get all package IDs for this creator
        const packages = await PackageModel.find({ creatorId: creatorObjectId }).select("_id title");
        const packageIds = packages.map(p => p._id);
        const packageMap = packages.reduce((map, pkg) => {
            map[pkg._id.toString()] = pkg.title;
            return map;
        }, {} as Record<string, string>);

        // 2. Revenue By Month (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const revenueByMonth = await BookingModel.aggregate([
            {
                $match: {
                    packageId: { $in: packageIds },
                    status: "completed",
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    totalAmount: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const formattedRevenue = revenueByMonth.map(item => ({
            month: `${this.getMonthName(item._id.month)} ${item._id.year}`,
            amount: item.totalAmount
        }));

        // 3. Booking Status Distribution
        const statusDistribution = await BookingModel.aggregate([
            {
                $match: {
                    packageId: { $in: packageIds }
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const formattedStatus = statusDistribution.map(item => ({
            status: item._id,
            count: item.count
        }));

        // 4. Popular Packages (Top 5)
        const popularPackages = await BookingModel.aggregate([
            {
                $match: {
                    packageId: { $in: packageIds }
                }
            },
            {
                $group: {
                    _id: "$packageId",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const formattedPopular = popularPackages.map(item => ({
            name: packageMap[item._id.toString()] || "Unknown",
            count: item.count
        }));

        // 5. Overall Stats
        const overall = await BookingModel.aggregate([
            {
                $match: {
                    packageId: { $in: packageIds },
                    status: "completed"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$amount" },
                    totalBookings: { $sum: 1 }
                }
            }
        ]);

        const stats = overall[0] || { totalRevenue: 0, totalBookings: 0 };

        return {
            revenueByMonth: formattedRevenue,
            bookingStatusDistribution: formattedStatus,
            popularPackages: formattedPopular,
            recentEarningStats: {
                totalRevenue: stats.totalRevenue,
                totalBookings: stats.totalBookings,
                averageOrderValue: stats.totalBookings > 0 ? stats.totalRevenue / stats.totalBookings : 0
            }
        };
    }

    private getMonthName(month: number): string {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months[month - 1];
    }
}
