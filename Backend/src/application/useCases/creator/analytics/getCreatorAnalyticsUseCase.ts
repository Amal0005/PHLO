import type { IGetCreatorAnalyticsUseCase, CreatorAnalytics } from "@/domain/interfaces/creator/analytics/IGetCreatorAnalyticsUseCase";
import { BookingModel } from "@/framework/database/model/bookingModel";
import { PackageModel } from "@/framework/database/model/packageModel";
import { ReviewModel } from "@/framework/database/model/reviewModel";
import { Types } from "mongoose";

export class GetCreatorAnalyticsUseCase implements IGetCreatorAnalyticsUseCase {
    async getAnalytics(creatorId: string): Promise<CreatorAnalytics> {
        // 1. Get all package IDs for this creator
        const packages = await PackageModel.find({ creatorId }).select("_id title");
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

        // 5. Recent Earning Stats & KPI Base
        const overall = await BookingModel.aggregate([
            {
                $match: {
                    packageId: { $in: packageIds }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$amount", 0] } },
                    totalBookings: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
                    allBookings: { $sum: 1 },
                    uniqueUsers: { $addToSet: "$userId" }
                }
            }
        ]);

        const reviews = await ReviewModel.aggregate([
            {
                $match: { packageId: { $in: packageIds } }
            },
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);

        const stats = overall[0] || { totalRevenue: 0, totalBookings: 0, allBookings: 0, uniqueUsers: [] };
        const reviewStats = reviews[0] || { avgRating: 0, totalReviews: 0 };
        
        const totalUniqueClients = stats.uniqueUsers.length;
        const repeatCount = (stats.allBookings - totalUniqueClients);
        const repeatRate = stats.allBookings > 0 ? (repeatCount / stats.allBookings) * 100 : 0;

        return {
            revenueByMonth: formattedRevenue || [],
            bookingStatusDistribution: formattedStatus || [],
            popularPackages: formattedPopular || [],
            recentEarningStats: {
                totalRevenue: stats.totalRevenue || 0,
                totalBookings: stats.totalBookings || 0,
                averageOrderValue: stats.totalBookings > 0 ? (stats.totalRevenue / stats.totalBookings) : 0,
                totalClients: totalUniqueClients,
                satisfactionRate: reviewStats.avgRating || 0
            },
            marketPerformance: {
                conversionRate: stats.allBookings > 0 ? (stats.totalBookings / stats.allBookings) * 100 : 0,
                satisfaction: (reviewStats.avgRating / 5) * 100,
                repeatClients: repeatRate,
                growth: 15 // Mock growth percentage until we have historical comparisons
            }
        };
    }

    private getMonthName(month: number): string {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months[month - 1];
    }
}
