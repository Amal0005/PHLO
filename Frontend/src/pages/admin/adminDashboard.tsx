import { useEffect, useState, useCallback } from "react";
import {
  Users,
  Camera,
  Calendar,
  RefreshCw,
  Image as ImageIcon,
  Box,
  AlertCircle,
  ArrowUpRight,
  TrendingUp,
  UserPlus,
  IndianRupee
} from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { getDashboardStats } from "@/services/admin/adminDashboardService";
import { format } from "date-fns";

interface RecentBooking {
  id: string;
  userName: string;
  packageName: string;
  amount: number;
  status: string;
  createdAt: string | Date;
}

interface RecentCreator {
  id: string;
  name: string;
  email: string;
  createdAt: string | Date;
}

interface RecentTransaction {
  id: string;
  source: string;
  description: string;
  type: string;
  amount: number;
  timestamp: string | Date;
}

interface DashboardStats {
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
  recentCreators: RecentCreator[];
  recentTransactions: RecentTransaction[];
}

const AnimatedNumber = ({ value, prefix = "" }: { value: number; prefix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const start = displayValue;
    const end = value;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutExpo = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

      const current = Math.floor(start + (end - start) * easeOutExpo(progress));
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span>{prefix}{displayValue.toLocaleString()}</span>;
};

const GlassCard = ({ children, className = "", title }: { children: React.ReactNode; className?: string; title?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden ${className}`}
  >
    {title && (
      <div className="px-8 pt-6 pb-2">
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">{title}</h3>
      </div>
    )}
    {children}
  </motion.div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async (isInitial = false) => {
    if (!isInitial) setRefreshing(true);
    try {
      const data = await getDashboardStats();
      if (data.success) {
        setStats(data.result);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      if (isInitial) setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats(true);
  }, [fetchStats]);

  const mainStats = [
    {
      label: "Gross Revenue",
      value: stats?.totalRevenue || 0,
      prefix: "₹",
      icon: IndianRupee,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      trend: "+12.5%"
    },
    {
      label: "Active Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      trend: "+5.2%"
    },
    {
      label: "Total Bookings",
      value: stats?.totalBookings || 0,
      icon: Calendar,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      trend: "+8.1%"
    }
  ];

  const secondaryStats = [
    { label: "Pending Wallpapers", value: stats?.pendingWallpapers || 0, icon: ImageIcon, color: "text-pink-400" },
    { label: "Total Wallpapers", value: stats?.totalWallpapers || 0, icon: ImageIcon, color: "text-pink-400" },
    { label: "Pending Creators", value: stats?.pendingCreators || 0, icon: Camera, color: "text-emerald-400" },
    { label: "Total Complaints", value: stats?.totalComplaints || 0, icon: AlertCircle, color: "text-red-400" },
    { label: "Total Packages", value: stats?.totalPackages || 0, icon: Box, color: "text-indigo-400" },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] gap-6">
        <div className="relative w-16 h-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-t-2 border-r-2 border-blue-500 rounded-full"
          />
        </div>
        <p className="text-gray-400 font-medium tracking-widest uppercase text-xs animate-pulse">PHLO</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-white p-6 lg:p-10 pb-20 overflow-x-hidden">
      {/* Decorative Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 space-y-10 max-w-[1700px] mx-auto">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent italic uppercase">Command Center</h1>
            <p className="text-gray-400 font-medium mt-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Platform Intelligence Overview
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#f3f4f6" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fetchStats()}
            disabled={refreshing}
            className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-3xl text-sm font-black shadow-2xl shadow-white/5 disabled:opacity-50 transition-all font-mono"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            SYNCHRONIZE SYSTEMS
          </motion.button>
        </header>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mainStats.map((stat) => (
            <GlassCard key={stat.label} className="p-10 group relative border-white/5 hover:border-white/20 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-5 rounded-3xl ${stat.bg} ${stat.color} border border-white/5 ring-1 ring-white/10`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black tracking-widest border border-emerald-500/20">
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em] mb-2">{stat.label}</p>
                <div className="text-5xl font-black tracking-tight flex items-baseline gap-1">
                  <AnimatedNumber value={stat.value} prefix={stat.prefix} />
                  <span className="text-sm font-medium text-gray-600 ml-2">Total</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </GlassCard>
          ))}
        </div>

        {/* Dynamic Visualization Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <GlassCard title="Revenue Velocity" className="xl:col-span-2 p-8">
            <div className="h-[350px] w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.monthlyRevenue}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: 12, fontWeight: 700 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: 12, fontWeight: 700 }}
                    tickFormatter={(val) => `₹${val / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0a0a0a',
                      borderColor: '#ffffff10',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '700'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <div className="space-y-8">
            <GlassCard title="Operational Status" className="p-8">
              <div className="space-y-6 mt-4">
                {secondaryStats.map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{stat.label}</span>
                    </div>
                    <div className="text-xl font-black">{stat.value}</div>
                  </div>
                ))}
              </div>
            </GlassCard>


          </div>
        </div>

        {/* Activity Row */}
        <div className="grid grid-cols-1 gap-8">
          <GlassCard title="Latest Creator Onboards" className="p-0">
            <div className="p-8 space-y-6">
              {stats?.recentCreators.map((creator) => (
                <div key={creator.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-blue-500/50 transition-colors">
                        <Camera className="w-6 h-6 text-gray-500" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#050505] flex items-center justify-center">
                        <UserPlus className="w-2 h-2 text-white" />
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-black leading-none mb-1">{creator.name}</h5>
                      <p className="text-[10px] text-gray-500 font-bold tracking-tight">{creator.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{format(new Date(creator.createdAt), 'MMM dd')}</p>
                    <button className="mt-1 text-blue-400 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-[0.2em]">Profile</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 text-center border-t border-white/5 bg-white/[0.01]">
              <button className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2 mx-auto">
                Audit Creator Directory <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </GlassCard>
        </div>

        <GlassCard title="Recent Wallet Activity" className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-500 font-black">Source</th>
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-500 font-black">Description</th>
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-500 font-black">Type</th>
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-500 font-black">Amount</th>
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-500 font-black text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentTransactions?.map((tx) => (
                  <tr key={tx.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-4">
                      <span className="text-[10px] font-black text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-400/20">
                        {tx.source}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <p className="text-sm font-bold text-gray-300">{tx.description}</p>
                    </td>
                    <td className="px-8 py-4">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${tx.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <span className={`text-sm font-black tracking-tight ${tx.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                        {format(new Date(tx.timestamp), 'MMM dd, HH:mm')}
                      </span>
                    </td>
                  </tr>
                ))}
                {!stats?.recentTransactions?.length && (
                  <tr>
                    <td colSpan={5} className="px-8 py-10 text-center text-gray-500 font-bold uppercase tracking-widest text-xs italic">
                      No recent wallet activity detected.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <footer className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700 italic">Phlo Advanced Intelligence Dashboard v2.4.0</p>
          <div className="flex gap-6">
            <span className="text-[10px] font-black text-emerald-500/50 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1 h-1 bg-emerald-500 animate-pulse rounded-full" />
              API Status: Optimal
            </span>
            <span className="text-[10px] font-black text-blue-500/50 uppercase tracking-widest">Global Node: ID-44</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
