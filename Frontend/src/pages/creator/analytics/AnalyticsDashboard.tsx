import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { AnalyticsService, CreatorAnalytics } from '@/services/creator/analyticsService';
import CreatorNavbar from '@/components/reusable/creatorNavbar';
import { TrendingUp, Users, DollarSign, Package, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const COLORS = ['#FFFFFF', '#3F3F46', '#71717A', '#A1A1AA', '#D4D4D8'];

const AnalyticsDashboard: React.FC = () => {
    const [analytics, setAnalytics] = useState<CreatorAnalytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await AnalyticsService.getCreatorAnalytics();
                if (response.success) {
                    setAnalytics(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-t-2 border-white rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            <CreatorNavbar />
            
            <main className="max-w-7xl mx-auto px-4 pt-32">
                <div className="mb-12">
                    <h1 className="text-4xl font-black tracking-tighter mb-2 italic">ANALYTICS OVERVIEW</h1>
                    <p className="text-zinc-500 font-medium tracking-wide uppercase text-xs">Real-time performance and revenue tracking</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <KpiCard 
                        title="Total Revenue" 
                        value={`₹${(analytics?.recentEarningStats?.totalRevenue || 0).toLocaleString()}`} 
                        icon={<DollarSign className="w-5 h-5" />}
                        trend="+12%"
                        isUp={true}
                    />
                    <KpiCard 
                        title="Total Bookings" 
                        value={(analytics?.recentEarningStats?.totalBookings || 0).toString()} 
                        icon={<Package className="w-5 h-5" />}
                        trend="+8%"
                        isUp={true}
                    />
                    <KpiCard 
                        title="Avg. Order Value" 
                        value={`₹${Math.round(analytics?.recentEarningStats?.averageOrderValue || 0).toLocaleString()}`} 
                        icon={<TrendingUp className="w-5 h-5" />}
                        trend="+5%"
                        isUp={true}
                    />
                    <KpiCard 
                        title="Active Clients" 
                        value={(analytics?.recentEarningStats?.totalClients || 0).toString()} 
                        icon={<Users className="w-5 h-5" />}
                        trend="+15%"
                        isUp={true}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Revenue Area Chart */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8 backdrop-blur-xl">
                        <h3 className="text-lg font-black tracking-tight mb-8 uppercase italic">Revenue Growth</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics?.revenueByMonth}>
                                    <defs>
                                        <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                                    <XAxis 
                                        dataKey="month" 
                                        stroke="#52525B" 
                                        fontSize={10} 
                                        tickLine={false} 
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis 
                                        stroke="#52525B" 
                                        fontSize={10} 
                                        tickLine={false} 
                                        axisLine={false}
                                        tickFormatter={(value) => `₹${value}`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#09090B', border: '1px solid #27272A', borderRadius: '12px', fontSize: '12px' }}
                                        itemStyle={{ color: '#FFFFFF' }}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="#FFFFFF" strokeWidth={2} fillOpacity={1} fill="url(#colorAmt)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Popular Packages Bar Chart */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8 backdrop-blur-xl">
                        <h3 className="text-lg font-black tracking-tight mb-8 uppercase italic">Top Performing Packages</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analytics?.popularPackages} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272A" horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis 
                                        dataKey="name" 
                                        type="category" 
                                        stroke="#FFFFFF" 
                                        fontSize={11} 
                                        tickLine={false} 
                                        axisLine={false}
                                        width={100}
                                    />
                                    <Tooltip 
                                        cursor={{ fill: '#ffffff10' }}
                                        contentStyle={{ backgroundColor: '#09090B', border: '1px solid #27272A', borderRadius: '12px', fontSize: '12px' }}
                                    />
                                    <Bar dataKey="count" fill="#FFFFFF" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Booking Status Pie Chart */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8 backdrop-blur-xl lg:col-span-1">
                        <h3 className="text-lg font-black tracking-tight mb-8 uppercase italic">Booking Status</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={analytics?.bookingStatusDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="count"
                                        nameKey="status"
                                    >
                                        {analytics?.bookingStatusDistribution.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#09090B', border: '1px solid #27272A', borderRadius: '12px', fontSize: '12px' }}
                                    />
                                    <Legend 
                                        verticalAlign="bottom" 
                                        align="center" 
                                        iconType="circle"
                                        formatter={(value) => <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-2">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Market Performance stats */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8 backdrop-blur-xl lg:col-span-2">
                        <h3 className="text-lg font-black tracking-tight mb-8 uppercase italic">Market Performance</h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Conversion Rate', value: `${(analytics?.marketPerformance?.conversionRate || 0).toFixed(1)}%`, color: 'bg-white' },
                                { label: 'Client Satisfaction', value: `${(analytics?.marketPerformance?.satisfaction || 0).toFixed(0)}%`, color: 'bg-zinc-400' },
                                { label: 'Repeat Clients', value: `${(analytics?.marketPerformance?.repeatClients || 0).toFixed(1)}%`, color: 'bg-zinc-600' },
                                { label: 'Growth indexing', value: `+${analytics?.marketPerformance?.growth || 0}%`, color: 'bg-zinc-800' }
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-1.5 h-8 ${stat.color} rounded-full`}></div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{stat.label}</p>
                                            <p className="text-xl font-bold tracking-tight">{stat.value}</p>
                                        </div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowUpRight className="w-5 h-5 text-zinc-600" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const KpiCard: React.FC<{ title: string; value: string; icon: React.ReactNode; trend: string; isUp: boolean }> = ({ title, value, icon, trend, isUp }) => (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2rem] p-6 backdrop-blur-xl group hover:border-white/20 transition-all">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-white group-hover:text-black transition-all">
                {icon}
            </div>
            <div className={`flex items-center gap-1 text-[10px] font-black ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {trend}
            </div>
        </div>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black tracking-tighter">{value}</p>
    </div>
);

export default AnalyticsDashboard;
