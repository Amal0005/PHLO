import { X, AlertCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { motion, AnimatePresence } from "framer-motion";
interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: "pending" | "rejected" | "blocked" | null;
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

  return (
    <AnimatePresence>
      {isOpen && status && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-zinc-950/90 backdrop-blur-2xl w-full max-w-md rounded-3xl p-8 border border-white/10 relative shadow-[0_32px_120px_-15px_rgba(0,0,0,0.8)]"
          >
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
              {status === "rejected" || status === "blocked" ? (
        <AlertCircle className="w-8 h-8 text-red-500" />
      ) : (
        <Clock className="w-8 h-8 text-yellow-500" />
      )}
    </div>
    <h2 className="text-2xl font-bold text-white mb-2">
      {status === "rejected"
        ? "Application Rejected"
        : status === "blocked"
          ? "Account Blocked"
          : "Application Pending"}
    </h2>
              <p className="text-gray-400 text-sm">{message}</p>
            </div>
            {status === "rejected" && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 mb-8">
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
                    navigate(ROUTES.CREATOR.REGISTER);
                  }}
                  className="w-full bg-white hover:bg-gray-200 text-black py-3.5 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Retry / Re-register
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full bg-white/5 hover:bg-white/10 text-white py-3.5 rounded-xl font-semibold transition-all border border-white/10 hover:scale-[1.02] active:scale-[0.98]"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
