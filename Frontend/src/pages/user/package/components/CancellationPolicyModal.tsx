import React from 'react';
import { X, ShieldAlert, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CancellationPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CancellationPolicyModal: React.FC<CancellationPolicyModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl z-10"
            style={{
              background: "rgba(10, 10, 10, 0.95)",
              backdropFilter: "blur(30px)",
            }}
          >
            {/* Header */}
            <div className="p-10 pb-6 border-b border-white/5 flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E2B354]/5 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="flex flex-col relative z-20">
                <span className="text-[#E2B354] text-[10px] font-black uppercase tracking-[0.4em] mb-2 font-mono">Terms & Conditions</span>
                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Cancellation Terms</h2>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-10 space-y-4">
              <p className="text-[12px] text-zinc-500 font-medium leading-relaxed mb-6 italic">
                By clicking "Proceed", you acknowledge and agree to the following refund structural timeline:
              </p>

              <div className="space-y-3">
                {[
                  {
                    title: "Full Refund (100%)",
                    desc: "Cancellations made 10+ days prior to schedule.",
                    icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
                    bg: "bg-emerald-500/5",
                    border: "border-emerald-500/10",
                    accent: "emerald-400"
                  },
                  {
                    title: "Partial Refund (50%)",
                    desc: "Cancellations made 5-10 days prior to schedule.",
                    icon: <Info className="w-5 h-5 text-amber-300" />,
                    bg: "bg-amber-300/5",
                    border: "border-amber-300/10",
                    accent: "amber-300"
                  },
                  {
                    title: "Non-Refundable (0%)",
                    desc: "Cancellations made < 5 days prior to schedule.",
                    icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
                    bg: "bg-rose-500/5",
                    border: "border-rose-500/10",
                    accent: "rose-400"
                  }
                ].map((policy, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * (idx + 1) }}
                    className={`p-6 rounded-[2.5rem] border ${policy.bg} ${policy.border} flex items-start gap-5 group transition-all duration-500 hover:border-white/20`}
                  >
                    <div className={`mt-0.5 p-3 rounded-2xl bg-black/40 border border-${policy.accent}/20 shadow-lg`}>
                      {policy.icon}
                    </div>
                    <div className="flex flex-col gap-1.5 pt-0.5">
                      <h3 className="text-[13px] font-black text-white italic tracking-widest uppercase">{policy.title}</h3>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{policy.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 mt-8">
                 <p className="text-[9px] text-zinc-600 leading-relaxed italic uppercase tracking-widest text-center">
                   *All refunds are processed instantly to your PHLO Wallet*
                 </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-10 pb-10 flex flex-col gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                className="w-full h-18 rounded-3xl bg-[#E2B354] text-black font-black text-[13px] uppercase tracking-[0.5em] shadow-[0_20px_60px_rgba(226,179,84,0.15)] italic transition-all"
              >
                Proceed & Pay
              </motion.button>
              <button
                onClick={onClose}
                className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.5em] hover:text-white transition-all mt-2 italic"
              >
                Return to Package Details
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CancellationPolicyModal;
