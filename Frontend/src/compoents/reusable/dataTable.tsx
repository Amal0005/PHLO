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
        <div className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-6 py-4 text-sm font-semibold text-gray-400 ${column.align === "right"
                                        ? "text-right"
                                        : column.align === "center"
                                            ? "text-center"
                                            : "text-left"
                                        } ${column.className || ""}`}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-12 text-center text-gray-500 animate-pulse"
                                >
                                    Loading data...
                                </td>
                            </tr>
                        ) : !data || data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-12 text-center text-gray-500"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr
                                    key={keyExtractor(item)}
                                    className="hover:bg-white/5 transition-colors group"
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={`${keyExtractor(item)}-${column.key}`}
                                            className={`px-6 py-4 ${column.align === "right"
                                                ? "text-right"
                                                : column.align === "center"
                                                    ? "text-center"
                                                    : "text-left"
                                                } ${column.className || ""}`}
                                        >
                                            {column.render ? column.render(item) : (item[column.key as keyof T] as ReactNode) || "-"}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
