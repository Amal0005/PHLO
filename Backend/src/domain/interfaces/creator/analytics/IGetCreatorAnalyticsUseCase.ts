export interface CreatorAnalytics {
    revenueByMonth: { month: string; amount: number }[];
    bookingStatusDistribution: { status: string; count: number }[];
    recentEarningStats: {
        totalRevenue: number;
        totalBookings: number;
        averageOrderValue: number;
    };
    popularPackages: { name: string; count: number }[];
}

export interface IGetCreatorAnalyticsUseCase {
    getAnalytics(creatorId: string): Promise<CreatorAnalytics>;
}
