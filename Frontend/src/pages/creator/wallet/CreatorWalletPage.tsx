import React, { useEffect, useState, useCallback } from "react";
import { Wallet, ArrowUpRight, ArrowDownLeft, Search, Filter, Clock, Receipt, CreditCard } from "lucide-react";
import { WalletService, WalletData, WalletTransaction } from "@/services/walletService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const CreatorWalletPage: React.FC = () => {
    const [data, setData] = useState<WalletData | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const fetchWallet = useCallback(async () => {
        try {
            setLoading(true);
            const result = await WalletService.getWallet("creator", { page, search });
            setData(result);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch wallet data");
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        fetchWallet();
    }, [fetchWallet]);

    return (
        <div className="min-h-screen bg-black text-white p-8 lg:p-12 space-y-12 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
                            Revenue <br /> Dashboard
                        </h1>
                    </div>
                    <p className="text-zinc-500 text-sm font-medium tracking-wide uppercase">Track your earnings and released payments</p>
                </div>

                {/* Balance Card - Premium Design */}
                <div className="relative group overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-8 rounded-[2.5rem] border border-white/10 w-full md:w-96 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all hover:scale-105 duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[80px] rounded-full group-hover:bg-white/10 transition-colors" />
                    <div className="relative z-10 space-y-4">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Creator Earnings</span>
                            <CreditCard className="w-5 h-5 text-white/20" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black tracking-tighter">₹{data?.wallet.balance.toLocaleString('en-IN') || "0"}</span>
                            <span className="text-xs font-black uppercase text-zinc-500 tracking-widest">INR</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 w-fit">
                            <Clock className="w-3 h-3" />
                            Last updated {data?.wallet.lastUpdated ? format(new Date(data.wallet.lastUpdated), 'MMM dd, HH:mm') : 'recently'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions Section */}
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-zinc-900/30 p-4 rounded-3xl border border-white/5 backdrop-blur-xl">
                    <div className="flex items-center gap-4 w-full md:w-auto px-4">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] whitespace-nowrap">Revenue Streams</h3>
                        <div className="h-4 w-px bg-white/10" />
                        <span className="text-xs font-bold text-zinc-500">{data?.totalTransactions || 0} Records</span>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search earnings..."
                                className="w-full bg-black border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold focus:border-white/20 transition-all outline-none"
                            />
                        </div>
                        <button className="p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-24 bg-zinc-900/50 rounded-3xl animate-pulse border border-white/5" />
                        ))
                    ) : data?.transactions.length === 0 ? (
                        <div className="text-center py-24 bg-zinc-900/20 rounded-[3rem] border border-dashed border-white/10 space-y-6">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                <Receipt className="w-8 h-8 text-zinc-600" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-lg font-black uppercase tracking-tight">No Financial Activity</p>
                                <p className="text-zinc-500 text-sm">Earnings from bookings will appear here after release</p>
                            </div>
                        </div>
                    ) : (
                        data?.transactions.map((tx) => (
                            <TransactionItem key={tx.id} tx={tx} />
                        ))
                    )}
                </div>

                {/* Pagination */}
                {data && data.totalTransactions > 10 && (
                    <div className="flex justify-center items-center gap-6 py-8">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-6 py-3 bg-white/5 rounded-2xl text-xs font-black uppercase tracking-widest border border-white/5 hover:bg-white/10 disabled:opacity-30 transition-all"
                        >
                            Previous
                        </button>
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Page {page} of {Math.ceil(data.totalTransactions / 10)}</span>
                        <button
                            disabled={page >= Math.ceil(data.totalTransactions / 10)}
                            onClick={() => setPage(p => p + 1)}
                            className="px-6 py-3 bg-white/5 rounded-2xl text-xs font-black uppercase tracking-widest border border-white/5 hover:bg-white/10 disabled:opacity-30 transition-all"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const TransactionItem: React.FC<{ tx: WalletTransaction }> = ({ tx }) => {
    const isCredit = tx.type === "credit";
    return (
        <div className="group bg-zinc-900/40 hover:bg-zinc-900/60 p-6 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all duration-300 flex items-center justify-between gap-6">
            <div className="flex items-center gap-6 flex-1">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110 ${
                    isCredit 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                    : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                }`}>
                    {isCredit ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}
                </div>
                
                <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-3">
                        <h4 className="text-sm font-black uppercase tracking-tight text-white">{tx.description}</h4>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white/5 text-zinc-500 tracking-widest border border-white/5">{tx.source}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        <span>{format(new Date(tx.timestamp), 'MMMM dd, yyyy • HH:mm')}</span>
                        {tx.relatedName && (
                            <>
                                <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                                <span className="text-zinc-600">Client: {tx.relatedName}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="text-right space-y-1">
                <p className={`text-xl font-black tracking-tighter ${isCredit ? "text-emerald-500" : "text-rose-500"}`}>
                    {isCredit ? "+" : "-"} ₹{tx.amount.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">ID: {tx.sourceId.slice(-8).toUpperCase()}</p>
            </div>
        </div>
    );
};

export default CreatorWalletPage;
