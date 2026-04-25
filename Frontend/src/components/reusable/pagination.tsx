import { PaginationProps } from "@/interface/admin/pagination";

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* PHLO Futuristic Pagination Capsule */}
      <div className="relative flex items-center bg-zinc-900/40 backdrop-blur-2xl border border-white/5 rounded-full p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Progress Background */}
        <div className="absolute inset-x-10 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full text-white/40 hover:text-white disabled:opacity-10 transition-all active:scale-90 hover:bg-white/5 group"
          title="Previous Phase"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="px-6 flex items-center gap-4 relative z-10">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-1">Phase</span>
            <div className="flex items-center gap-3">
              <span className="text-xl font-black italic tracking-tighter text-white leading-none">{page}</span>
              <div className="w-1 h-1 bg-[#E2B354] rounded-full shadow-[0_0_8px_#E2B354]" />
              <span className="text-xl font-black italic tracking-tighter text-white/20 leading-none">{totalPages}</span>
            </div>
          </div>
        </div>

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full text-white/40 hover:text-white disabled:opacity-10 transition-all active:scale-90 hover:bg-white/5 group"
          title="Next Phase"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <p className="text-[8px] font-black uppercase tracking-[0.6em] text-gray-700 animate-pulse">
        Navigation Synchronized
      </p>
    </div>
  );
}
