import { useState } from "react";
import {
  Menu,
  X,
  Home,
  Video,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Plus,
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageCircle,
} from "lucide-react";

/* ================= TYPES ================= */

type NavItem = {
  label: string;
  icon: React.ElementType;
};

type Stat = {
  label: string;
  value: string;
  change: string;
  icon: React.ElementType;
};

type Content = {
  id: number;
  title: string;
  type: "Video" | "Image";
  views: string;
  likes: string;
  comments: string;
  thumbnail: string;
};

/* ================= MOCK DATA (REPLACE WITH API) ================= */

const creatorData = {
  name: "John",
  stats: [
    { label: "Total Views", value: "125.4K", change: "+12.5%", icon: Eye },
    { label: "Followers", value: "8,432", change: "+8.2%", icon: Users },
    { label: "Engagement", value: "4.8%", change: "+2.3%", icon: Heart },
    { label: "Revenue", value: "$2,847", change: "+15.7%", icon: TrendingUp },
  ] as Stat[],

  recentContent: [
    {
      id: 1,
      title: "My Latest Travel Vlog",
      type: "Video",
      views: "12.5K",
      likes: "892",
      comments: "156",
      thumbnail:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400",
    },
    {
      id: 2,
      title: "Photography Tips & Tricks",
      type: "Image",
      views: "8.3K",
      likes: "654",
      comments: "89",
      thumbnail:
        "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400",
    },
    {
      id: 3,
      title: "Behind The Scenes",
      type: "Video",
      views: "15.2K",
      likes: "1.2K",
      comments: "234",
      thumbnail:
        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400",
    },
  ] as Content[],
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: Home },
  { label: "Content", icon: Video },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

/* ================= COMPONENT ================= */

export default function CreatorHomepage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ================= NAVBAR ================= */}
      <nav className="bg-zinc-900/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo + Desktop Nav */}
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold">
                Creator<span className="text-gray-400">Hub</span>
              </h1>

              <div className="hidden md:flex gap-6">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden sm:flex items-center gap-2 bg-zinc-800/50 px-3 py-2 rounded-lg border border-zinc-700">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  placeholder="Search..."
                  className="bg-transparent outline-none text-sm w-40"
                />
              </div>

              {/* Create */}
              <button className="hidden sm:flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-semibold">
                <Plus className="w-4 h-4" />
                Create
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-white">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* Profile */}
              <div className="hidden sm:flex w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 items-center justify-center font-semibold">
                JD
              </div>

              {/* Mobile Menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2"
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-zinc-900">
            <div className="px-4 py-3 space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  className="flex items-center gap-3 w-full text-gray-400 hover:text-white"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
              <button className="flex items-center gap-3 text-red-400 pt-3 border-t border-white/10">
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <h2 className="text-3xl font-bold mb-2">
          Welcome back, {creatorData.name}! 👋
        </h2>
        <p className="text-gray-400 mb-8">
          Here's what's happening with your content today.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {creatorData.stats.map((stat, index) => (
            <div
              key={index}
              className="bg-zinc-900/50 rounded-xl p-6 border border-white/10"
            >
              <div className="flex justify-between mb-4">
                <stat.icon className="w-8 h-8 text-gray-400" />
                <span className="text-green-400 text-sm">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Content */}
        <div className="bg-zinc-900/50 rounded-xl p-6 border border-white/10">
          <div className="flex justify-between mb-6">
            <h3 className="text-xl font-bold">Recent Content</h3>
            <button className="text-gray-400 hover:text-white text-sm">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {creatorData.recentContent.map((content) => (
              <div
                key={content.id}
                className="bg-zinc-800/50 rounded-lg overflow-hidden border border-zinc-700"
              >
                <img
                  src={content.thumbnail}
                  className="h-48 w-full object-cover"
                  alt={content.title}
                />
                <div className="p-4">
                  <h4 className="font-semibold mb-2">{content.title}</h4>
                  <div className="flex gap-4 text-gray-400 text-sm">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {content.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {content.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {content.comments}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
