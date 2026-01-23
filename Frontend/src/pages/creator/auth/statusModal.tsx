import { X, AlertCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: "pending" | "rejected" | null;
  message: string;
  reason?: string;
}
export default function StatusModal({
  isOpen,
  onClose,
  status,
  message,
  reason,
}: StatusModalProps) {
  const navigate = useNavigate();

  if (!isOpen || !status) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-zinc-900 w-full max-w-md rounded-2xl p-8 border border-white/10 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="text-center mb-6">
          <div
            className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              status === "rejected" ? "bg-red-500/10" : "bg-yellow-500/10"
            }`}
          >
            {status === "rejected" ? (
              <AlertCircle className="w-8 h-8 text-red-500" />
            ) : (
              <Clock className="w-8 h-8 text-yellow-500" />
            )}
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            {status === "rejected"
              ? "Application Rejected"
              : "Application Pending"}
          </h2>
          <p className="text-gray-400 text-sm">{message}</p>
        </div>
        {status === "rejected" && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-8">
            <h4 className="text-red-400 font-semibold text-xs uppercase tracking-wider mb-2">
              Reason for Rejection
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              {reason?.trim() || "No rejection reason provided by admin."}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {status === "rejected" && (
            <button
              onClick={() => {
                onClose();
                navigate("/creator/register");
              }}
              className="w-full bg-white hover:bg-gray-200 text-black py-3 rounded-lg font-bold transition-all"
            >
              Retry / Re-register
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-lg font-semibold transition-all border border-white/5"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
