import React from "react";
import { X, ShieldAlert, CheckCircle2, Clock, Wallet, ArrowRight, XCircle } from "lucide-react";
import { Complaint } from "@/interface/user/userComplaintInterface";

interface ComplaintStatusModalProps {
    complaint: Complaint;
    onClose: () => void;
}

const ComplaintStatusModal: React.FC<ComplaintStatusModalProps> = ({ complaint, onClose }) => {
    const getStatusConfig = () => {
        switch (complaint.status) {
            case "resolved":
                return {
                    icon: <CheckCircle2 className="w-8 h-8" />,
                    color: "text-emerald-500",
                    bgColor: "bg-emerald-500/10",
                    borderColor: "border-emerald-500/20",
                    title: "Refund Initiated",
                    description: "Your complaint has been resolved. The booking amount has been refunded to your wallet."
                };
            case "dismissed":
                return {
                    icon: <XCircle className="w-8 h-8" />,
                    color: "text-rose-500",
                    bgColor: "bg-rose-500/10",
                    borderColor: "border-rose-500/20",
                    title: "Complaint Dismissed",
                    description: "After careful review, this complaint has been dismissed. No refund was issued."
                };
            default:
                return {
                    icon: <Clock className="w-8 h-8" />,
                    color: "text-amber-500",
                    bgColor: "bg-amber-500/10",
                    borderColor: "border-amber-500/20",
                    title: "Under Review",
                    description: "Our moderation team is currently investigating your report. We'll update you soon."
                };
        }
    };

    const config = getStatusConfig();

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-xl bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.05)]">
                {/* Header Section */}
                <div className={`p-10 ${config.bgColor} border-b border-zinc-900 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[80px] rounded-full" />
                    
                    <div className="flex justify-between items-start relative z-10 text-white">
                        <div className="space-y-6">
                            <div className={`w-16 h-16 rounded-2xl ${config.bgColor} border ${config.borderColor} flex items-center justify-center ${config.color}`}>
                                {config.icon}
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black tracking-tighter uppercase italic leading-none">
                                    {config.title}
                                </h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Status: {complaint.status}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-black/20 rounded-full transition-colors opacity-60 hover:opacity-100">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-10 space-y-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-zinc-600" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Determination Details</span>
                        </div>
                        <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                            {config.description}
                        </p>
                    </div>

                    {complaint.adminComment && (
                        <div className="p-8 rounded-[2rem] bg-zinc-900/50 border border-white/5 space-y-4">
                            <div className="flex items-center gap-2">
                                <ArrowRight className="w-4 h-4 text-emerald-500" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Moderator Feedback</span>
                            </div>
                            <p className="text-white font-bold leading-relaxed">
                                "{complaint.adminComment}"
                            </p>
                        </div>
                    )}

                    {complaint.status === 'resolved' && (
                        <div className="flex items-center gap-4 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <Wallet className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 mb-0.5">Wallet Credit</h4>
                                <p className="text-sm font-bold text-white uppercase tracking-tight">Full Refund Processed</p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="w-full py-5 rounded-[1.5rem] bg-white text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all duration-300 active:scale-95"
                    >
                        Dismiss Review
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComplaintStatusModal;
