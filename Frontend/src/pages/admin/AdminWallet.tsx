import { useEffect, useState } from "react";
import { fetchAdminWalletTransactions } from "@/services/admin/adminWalletService";
import { Wallet } from "../../interface/admin/walletInterface";
import { WalletTransaction } from "../../interface/admin/walletTransactionInterface";
import { ArrowUpRight, ArrowDownLeft, Wallet as WalletIcon, Clock, Filter, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Pagination from "@/compoents/reusable/pagination";
import { useDebounce } from "@/hooks/useDebounce";

export default function AdminWallet() {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [filterSource, setFilterSource] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 10;

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, filterSource]);

    useEffect(() => {
        fetchWalletData(debouncedSearch, filterSource, currentPage);
    }, [debouncedSearch, filterSource, currentPage]);

    const fetchWalletData = async (search = "", source = "", page = 1) => {
        try {
            setLoading(true);
            const data = await fetchAdminWalletTransactions(page, LIMIT, search, source);

            const responseBody = data?.data || data;
            const resultData = responseBody?.result || responseBody;

            if (resultData?.wallet) setWallet(resultData.wallet);
            if (resultData?.transactions) setTransactions(resultData.transactions);
            if (resultData?.totalTransactions) {
                setTotalPages(Math.ceil(resultData.totalTransactions / LIMIT));
            }

            setError("");
        } catch (err: unknown) {
            console.error("Wallet fetch error:", err);
            const errorMessage = (err as Error)?.message || "Failed to load wallet data";
            setError(typeof err === "string" ? err : errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="rounded-full h-12 w-12 border-t-2 border-b-2 border-white"
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-rose-500">
                <p className="text-xl font-semibold mb-4">{error}</p>
                <button
                    onClick={() => fetchWalletData()}
                    className="px-6 py-2 bg-white text-black rounded-full font-medium transition hover:bg-zinc-200"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-6 lg:p-10 bg-black min-h-screen text-white font-outfit"
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                     <h1 className="text-6xl font-black italic uppercase tracking-tighter bg-gradient-to-r from-white via-white to-white/20 bg-clip-text text-transparent">
          Wallet
        </h1>
                    <p className="text-zinc-500 mt-2">Manage platform revenue and transactions</p>
                </div>
            </motion.div>

            {/* Main Stats Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-1 bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-8 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-all duration-700"></div>
                    <div className="flex items-center justify-between mb-8">
                        <div className="p-3 bg-white/10 rounded-xl">
                            <WalletIcon className="text-white" size={24} />
                        </div>
                        <span className="text-xs font-medium text-zinc-500 tracking-wider uppercase">Platform Balance</span>
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-5xl font-bold tracking-tight">
                            ₹{(typeof wallet?.balance === 'number' ? wallet.balance : 0).toLocaleString('en-IN')}
                        </h2>
                        <p className="text-zinc-500 text-sm flex items-center gap-2">
                            <span className="text-emerald-500 flex items-center font-medium">
                                <ArrowUpRight size={14} /> 12%
                            </span>
                            from last month
                        </p>
                    </div>
                    <div className="mt-8 pt-6 border-t border-zinc-800/50 flex justify-between items-center text-sm text-zinc-500">
                        <span>Last updated: {wallet ? new Date(wallet.lastUpdated).toLocaleDateString() : 'Never'}</span>
                    </div>
                </motion.div>

                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants} className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                                <ArrowDownLeft size={20} />
                            </div>
                            <span className="text-xs text-zinc-500 uppercase">Incoming Revenue</span>
                        </div>
                        <div>
                            <p className="text-3xl font-bold">
                                ₹{(Array.isArray(transactions) ? transactions : []).filter(t => t.type === 'credit').reduce((acc, t) => acc + t.amount, 0).toLocaleString('en-IN')}
                            </p>
                            <p className="text-zinc-500 text-xs mt-1">Total revenue processed</p>
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                                <ArrowUpRight size={20} />
                            </div>
                            <span className="text-xs text-zinc-500 uppercase">Outgoing Payouts</span>
                        </div>
                        <div>
                            <p className="text-3xl font-bold">
                                ₹{(Array.isArray(transactions) ? transactions : []).filter(t => t.type === 'debit').reduce((acc, t) => acc + t.amount, 0).toLocaleString('en-IN')}
                            </p>
                            <p className="text-zinc-500 text-xs mt-1">Total withdrawals/refunds</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Transaction History */}
            <motion.div
                variants={itemVariants}
                className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl overflow-hidden backdrop-blur-sm"
            >
                <div className="p-6 border-b border-zinc-800/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold">Transaction History</h3>
                        <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded-md">
                            {(Array.isArray(transactions) ? transactions.length : 0)} total
                        </span>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by creator name..."
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition"
                            />
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`p-2 border rounded-lg transition ${filterSource ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800'}`}
                            >
                                <Filter size={18} />
                            </button>
                            {isFilterOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden">
                                    <div className="p-2 border-b border-zinc-800 text-[10px] uppercase font-bold text-zinc-500 tracking-widest px-4">
                                        Filter by Source
                                    </div>
                                    <div className="py-1">
                                        {[
                                            { id: "", label: "All Sources" },
                                            { id: "booking", label: "Bookings" },
                                            { id: "wallpaper", label: "Wallpapers" },
                                            { id: "subscription", label: "Subscriptions" }
                                        ].map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => {
                                                    setFilterSource(opt.id);
                                                    setIsFilterOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2.5 text-sm transition hover:bg-zinc-800 ${filterSource === opt.id ? 'text-white font-medium' : 'text-zinc-400'}`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-zinc-900/20 text-zinc-500 text-xs uppercase tracking-widest border-b border-zinc-800/30">
                                <th className="px-6 py-4 font-medium">Transaction</th>
                                <th className="px-6 py-4 font-medium">Provider</th>
                                <th className="px-6 py-4 font-medium">Source</th>
                                <th className="px-6 py-4 font-medium">Amount</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/30">
                            <AnimatePresence>
                                {Array.isArray(transactions) && transactions.length > 0 ? (
                                    transactions.map((transaction, index) => (
                                        <motion.tr
                                            key={transaction.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-zinc-800/20 transition-colors group"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-2 rounded-lg ${transaction.type === 'credit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                        {transaction.type === 'credit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white group-hover:translate-x-1 transition-transform">{transaction.description}</p>
                                                        <p className="text-xs text-zinc-500 font-mono mt-0.5">#{transaction.sourceId.slice(0, 8)}...</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 truncate max-w-[150px]">
                                                <span className="text-sm text-zinc-300 font-medium">
                                                    {transaction.relatedName ||
                                                        transaction.description.split(' by ')[1] ||
                                                        transaction.description.split(' for ')[1] ||
                                                        'Platform'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-xs font-medium px-2 py-1 bg-zinc-800/50 text-zinc-400 rounded-md capitalize border border-zinc-700/30">
                                                    {transaction.source}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`text-sm font-bold ${transaction.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    {transaction.type === 'credit' ? '+' : '-'} ₹{transaction.amount.toLocaleString('en-IN')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-zinc-400">
                                                    <Clock size={14} />
                                                    <span className="text-sm">{new Date(transaction.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                    Success
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center text-zinc-600">
                                            <div className="flex flex-col items-center gap-3">
                                                <Clock size={40} className="text-zinc-800" />
                                                <p>No transactions found on this account.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
                <div className="p-6 border-t border-zinc-800/50">
                    <Pagination
                        page={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
}
