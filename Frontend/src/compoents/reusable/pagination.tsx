import { PaginationProps } from "@/interface/admin/pagination";

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex justify-between items-center mt-4">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-1 bg-zinc-800 text-white rounded disabled:opacity-50"
      >
        Previous
      </button>

      <span className="text-gray-400 text-sm">
        Page {page} of {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-1 bg-zinc-800 text-white rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
