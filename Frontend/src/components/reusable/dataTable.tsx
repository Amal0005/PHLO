import { ReactNode } from "react";

export interface Column<T> {
  header: string;
  key: string;
  render?: (item: T) => ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  keyExtractor: (item: T) => string;
}

export default function DataTable<T>({
  columns,
  data,
  loading,
  emptyMessage = "No data found.",
  keyExtractor,
}: DataTableProps<T>) {
  return (
    <div className="relative group/table">
      {/* Dynamic Glow Glow Background */}
      <div className="absolute -inset-4 bg-gradient-to-br from-white/5 via-transparent to-white/5 rounded-[3rem] blur-3xl opacity-0 group-hover/table:opacity-100 transition-opacity duration-1000"></div>
      
      <div className="relative bg-[#09090b]/60 border border-white/[0.08] rounded-3xl overflow-hidden backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
        {/* Top Shine */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/[0.05]">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-8 py-6 text-[11px] font-black italic uppercase tracking-[0.4em] text-gray-500 select-none ${
                      column.align === "right"
                        ? "text-right"
                        : column.align === "center"
                        ? "text-center"
                        : "text-left"
                    } ${column.className || ""}`}
                  >
                    <span className="relative inline-block">
                      {column.header}
                      <span className="absolute -bottom-1 left-0 w-8 h-[2px] bg-white/20 rounded-full scale-x-0 group-hover/table:scale-x-100 transition-transform duration-700 origin-left"></span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={`loading-${idx}`} className="animate-pulse">
                    {columns.map((_, colIdx) => (
                      <td key={`loading-cell-${colIdx}`} className="px-8 py-7">
                        <div className="h-3.5 bg-white/5 rounded-full w-24"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : !data || data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-8 py-28 text-center"
                  >
                    <div className="flex flex-col items-center gap-4 opacity-40">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 rotate-12 group-hover/table:rotate-0 transition-transform duration-700">
                        <span className="text-2xl">📁</span>
                      </div>
                      <p className="text-xs font-black tracking-[0.2em] uppercase italic text-gray-400">{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr
                    key={keyExtractor(item)}
                    className="hover:bg-white/[0.02] active:bg-white/[0.04] transition-all duration-300 group/row cursor-default"
                  >
                    {columns.map((column) => (
                      <td
                        key={`${keyExtractor(item)}-${column.key}`}
                        className={`px-8 py-7 text-sm text-gray-400 font-medium transition-colors duration-300 group-hover/row:text-gray-100 ${
                          column.align === "right"
                            ? "text-right"
                            : column.align === "center"
                            ? "text-center"
                            : "text-left"
                        } ${column.className || ""}`}
                      >
                        <div className="relative z-10">
                          {column.render ? column.render(item) : (item[column.key as keyof T] as ReactNode) || "-"}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
