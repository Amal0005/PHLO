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
  IndianRupee,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  ChevronDown,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "@/services/admin/adminDashboardService";
import { format } from "date-fns";
import { fetchAdminCreators, approveCreator } from "@/services/admin/adminCreatorService";
import { Creator } from "@/interface/admin/creatorInterface";
import { CreatorDetailModal } from "./components/CreatorDetailModal";
import { toast } from "react-toastify";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";

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

interface TimeFrameData {
  label: string;
  amount: number;
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
  revenueData: TimeFrameData[];
  userGrowthData: TimeFrameData[];
  bookingStatusStats: { status: string; count: number }[];
  bookingCategoryStats: { category: string; count: number }[];
  recentBookings: RecentBooking[];
  recentCreators: RecentCreator[];
  recentTransactions: RecentTransaction[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981', '#6366f1'];

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

const GlassCard = ({ children, className = "", title, icon: Icon, action }: { children: React.ReactNode; className?: string; title?: string; icon?: any; action?: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl ${className}`}
  >
    {title && (
      <div className="px-8 pt-6 pb-4 flex items-center justify-between border-b border-white/5">
        <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">{title}</h3>
        <div className="flex items-center gap-4">
          {action}
          {Icon && <Icon className="w-4 h-4 text-gray-600" />}
        </div>
      </div>
    )}
    <div className="p-8">
      {children}
    </div>
  </motion.div>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [fetchingCreator, setFetchingCreator] = useState(false);
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "yearly">("monthly");
  const [showTimeframeDropdown, setShowTimeframeDropdown] = useState(false);

  const fetchStats = useCallback(async (isInitial = false, currentTf = timeframe) => {
    if (!isInitial) setRefreshing(true);
    try {
      const data = await getDashboardStats(currentTf);
      if (data.success) {
        setStats(data.result);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      if (isInitial) setLoading(false);
      setRefreshing(false);
    }
  }, [timeframe]);

  useEffect(() => {
    fetchStats(true);
  }, []); // Initial load only

  // Refresh when timeframe changes
  useEffect(() => {
    fetchStats(false, timeframe);
  }, [timeframe, fetchStats]);

  const handleShowProfile = async (email: string) => {
    try {
      setFetchingCreator(true);
      const response = await fetchAdminCreators(1, 1, email, "all");
      if (response.data && response.data.length > 0) {
        setSelectedCreator(response.data[0]);
      } else {
        toast.error("Creator details not found");
      }
    } catch (error) {
      console.error("Failed to fetch creator details:", error);
      toast.error("Failed to load creator profile");
    } finally {
      setFetchingCreator(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveCreator(id);
      toast.success("Creator approved successfully");
      setSelectedCreator(null);
      fetchStats();
    } catch (error) {
      console.error("Approve error:", error);
      toast.error("Failed to approve creator");
    }
  };

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
    <div className="relative min-h-screen bg-[#050505] text-white p-6 lg:p-10 pb-20 overflow-x-hidden font-mono">
      {/* Decorative Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[180px] rounded-full" />
      </div>

      <div className="relative z-10 space-y-12 max-w-[1800px] mx-auto">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-r from-white via-white to-white/20 bg-clip-text text-transparent italic uppercase">Analytics Dash</h1>
            <p className="text-gray-500 font-black mt-3 flex items-center gap-3 uppercase text-[10px] tracking-[0.5em]">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
              System Status: Optimal / {timeframe} Analysis
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Timeframe Selector */}
            <div className="relative">
              <button 
                onClick={() => setShowTimeframeDropdown(!showTimeframeDropdown)}
                className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                {timeframe} Report <ChevronDown className={`w-3 h-3 transition-transform ${showTimeframeDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showTimeframeDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 backdrop-blur-xl"
                  >
                    {["weekly", "monthly", "yearly"].map((tf) => (
                      <button
                        key={tf}
                        onClick={() => {
                          setTimeframe(tf as any);
                          setShowTimeframeDropdown(false);
                        }}
                        className={`w-full px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-colors ${timeframe === tf ? 'text-blue-500 bg-blue-500/5' : 'text-gray-400'}`}
                      >
                        {tf}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#fff" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fetchStats()}
              disabled={refreshing}
              className="flex items-center gap-4 px-10 py-5 bg-white text-black rounded-full text-xs font-black shadow-[0_10px_40px_rgba(255,255,255,0.1)] disabled:opacity-50 transition-all uppercase tracking-widest"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              Sync intelligence
            </motion.button>
          </div>
        </header>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mainStats.map((stat) => (
            <GlassCard key={stat.label} className="group relative border-white/5 hover:border-white/20 transition-all">
              <div className="flex justify-between items-start mb-8">
                <div className={`p-5 rounded-3xl ${stat.bg} ${stat.color} border border-white/5 shadow-2xl`}>
                  <stat.icon className="w-10 h-10" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black tracking-widest border border-emerald-500/20 shadow-inner">
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mb-3">{stat.label}</p>
                <div className="text-5xl font-black tracking-tighter flex items-baseline gap-2 italic">
                  <AnimatedNumber value={stat.value} prefix={stat.prefix} />
                  <span className="text-xs font-black text-gray-700 uppercase tracking-widest not-italic">TOTAL</span>
                </div>
              </div>
              <div className="mt-8 h-1 w-full bg-white/[0.02] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full w-2/3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" 
                />
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Dynamic Visualization Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <GlassCard title={`Revenue Velocity (${timeframe})`} icon={TrendingUp}>
            <div className="h-[400px] w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.revenueData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                  <XAxis 
                    dataKey="label" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#444', fontSize: 10, fontWeight: 900 }} 
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#444', fontSize: 10, fontWeight: 900 }}
                    tickFormatter={(val) => `₹${val/1000}K`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0a0a0a', 
                      borderColor: '#ffffff10', 
                      borderRadius: '24px',
                      fontSize: '10px',
                      fontWeight: '900',
                      textTransform: 'uppercase',
                      padding: '20px'
                    }} 
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ marginBottom: '10px', color: '#666' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#3b82f6" 
                    strokeWidth={6}
                    fillOpacity={1} 
                    fill="url(#colorAmount)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard title={`Personnel Expansion (${timeframe})`} icon={BarChartIcon}>
            <div className="h-[400px] w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.userGrowthData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                  <XAxis 
                    dataKey="label" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#444', fontSize: 10, fontWeight: 900 }} 
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#444', fontSize: 10, fontWeight: 900 }}
                  />
                  <Tooltip 
                     contentStyle={{ 
                      backgroundColor: '#0a0a0a', 
                      borderColor: '#ffffff10', 
                      borderRadius: '24px',
                      fontSize: '10px',
                      fontWeight: '900',
                      textTransform: 'uppercase',
                      padding: '20px'
                    }} 
                  />
                  <Bar dataKey="amount" fill="#8b5cf6" radius={[10, 10, 0, 0]} maxBarSize={40}>
                    {stats?.userGrowthData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Secondary Charts & Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <GlassCard title="Booking Distribution" icon={PieChartIcon}>
            <div className="h-[300px] w-full mt-4 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.bookingStatusStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="count"
                    nameKey="status"
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {stats?.bookingStatusStats.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="stroke-black/50 stroke-2 outline-none" />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ 
                      backgroundColor: '#111', 
                      borderColor: 'rgba(255,255,255,0.05)', 
                      borderRadius: '16px',
                      fontSize: '10px',
                      fontWeight: '900'
                    }} 
                  />
                  <Legend 
                     verticalAlign="bottom" 
                     align="center"
                     iconType="circle"
                     formatter={(value) => <span className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-2">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard title="Top Booking Categories" icon={Target}>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.bookingCategoryStats}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="count"
                    nameKey="category"
                    labelLine={false}
                  >
                    {stats?.bookingCategoryStats.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ 
                      backgroundColor: '#111', 
                      borderColor: 'rgba(255,255,255,0.05)', 
                      borderRadius: '16px',
                      fontSize: '10px',
                      fontWeight: '900'
                    }} 
                  />
                   <Legend 
                     verticalAlign="bottom" 
                     align="center"
                     iconType="circle"
                     formatter={(value) => <span className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-2">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard title="Global Health Metrics">
            <div className="space-y-6 mt-2">
              {[
                { label: "Pending Wallpapers", value: stats?.pendingWallpapers || 0, icon: ImageIcon, color: "text-pink-400" },
                { label: "Complaint Threshold", value: stats?.totalComplaints || 0, icon: AlertCircle, color: "text-red-400" },
                { label: "Active Packages", value: stats?.totalPackages || 0, icon: Box, color: "text-indigo-400" },
                { label: "Pending Verification", value: stats?.pendingCreators || 0, icon: Camera, color: "text-emerald-400" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between group p-3 rounded-2xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5">
                  <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-xl bg-white/[0.03] ${stat.color} group-hover:scale-110 transition-transform shadow-lg`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-white transition-colors">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-black italic tracking-tighter">{stat.value}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GlassCard title="Latest Personnel Onboarding" className="p-0 overflow-hidden">
            <div className="p-10 space-y-8">
              {stats?.recentCreators.map((creator) => (
                <div key={creator.id} className="flex items-center justify-between group border-b border-white/[0.02] pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div 
                        className="w-16 h-16 rounded-3xl bg-white/[0.03] flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-blue-500 transition-all cursor-pointer shadow-2xl"
                        onClick={() => handleShowProfile(creator.email)}
                      >
                        <Camera className="w-8 h-8 text-gray-700" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-600 rounded-full border-4 border-[#0a0a0a] flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                        <UserPlus className="w-2 h-2 text-white" />
                      </div>
                    </div>
                    <div onClick={() => handleShowProfile(creator.email)} className="cursor-pointer">
                      <h5 className="text-base font-black leading-none mb-2 uppercase italic text-gray-200">{creator.name}</h5>
                      <p className="text-[10px] text-gray-600 font-black tracking-[0.2em] uppercase">{creator.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest italic">{format(new Date(creator.createdAt), 'MMM dd')}</p>
                    <button 
                      onClick={() => handleShowProfile(creator.email)}
                      className={`mt-2 text-blue-500 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-all uppercase tracking-[0.3em] hover:text-white ${fetchingCreator ? 'animate-pulse' : ''}`}
                    >
                      {fetchingCreator ? 'ACCESSING...' : 'PERSONNEL FILE'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-10 py-8 text-center border-t border-white/5 bg-white/[0.01]">
              <button 
                onClick={() => navigate(FRONTEND_ROUTES.ADMIN.CREATORS)}
                className="text-[10px] font-black text-gray-600 hover:text-white uppercase tracking-[0.4em] transition-all flex items-center gap-3 mx-auto italic"
              >
                EXPLORE FULL DIRECTORY <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>

          <GlassCard title="System Ledger Activity" className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="px-10 py-6 text-[10px] uppercase tracking-[0.4em] text-gray-600 font-black">Origin</th>
                    <th className="px-10 py-6 text-[10px] uppercase tracking-[0.4em] text-gray-600 font-black">Record</th>
                    <th className="px-10 py-6 text-[10px] uppercase tracking-[0.4em] text-gray-600 font-black text-right">Delta</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentTransactions?.map((tx) => (
                    <tr key={tx.id} className="border-b border-white/[0.02] hover:bg-white/[0.03] transition-colors group">
                      <td className="px-10 py-6">
                        <span className="text-[10px] font-black text-blue-400/80 bg-blue-500/5 px-4 py-2 rounded-full uppercase tracking-widest border border-blue-500/10">
                          {tx.source}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{tx.description}</p>
                        <span className="text-[8px] font-black text-gray-700 uppercase tracking-[0.2em] italic">
                          {format(new Date(tx.timestamp), 'MMM dd, HH:mm:ss')}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <span className={`text-sm font-black italic tracking-tighter ${
                          tx.type === 'credit' ? 'text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'text-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                        }`}>
                          {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!stats?.recentTransactions?.length && (
                    <tr>
                      <td colSpan={3} className="px-10 py-12 text-center text-gray-700 font-black uppercase tracking-[0.5em] text-[10px] italic">
                        No temporal data detected.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Creator Detail Modal */}
        {selectedCreator && (
          <CreatorDetailModal
            creator={selectedCreator}
            onClose={() => setSelectedCreator(null)}
            onApprove={handleApprove}
            onReject={() => toast.info("USE CORE MANAGEMENT CONSOLE FOR REJECTION PROTOCOLS")}
          />
        )}

        <footer className="pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40 hover:opacity-100 transition-opacity">
          <p className="text-[8px] font-black uppercase tracking-[0.8em] text-gray-600 italic">PHLO Advanced Intelligence Core v3.0.0-PRO / System Overlook</p>
          <div className="flex gap-10">
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-emerald-500 animate-pulse rounded-full shadow-[0_0_8px_#10b981]" />
              Encryption: Active
            </span>
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em]">Neural Node: PN-7728-ALPHA</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
