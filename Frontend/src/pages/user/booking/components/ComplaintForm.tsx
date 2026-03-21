import React, { useState } from "react";
import { AlertCircle, X, ChevronRight, MessageSquare, Info } from "lucide-react";
import { UserComplaintService } from "@/services/user/userComplaintService";
import { toast } from "react-toastify";
import { MESSAGES } from "@/constants/messages";

interface ComplaintFormProps {
    bookingId: string;
    creatorId: string;
    onSuccess: () => void;
    onClose: () => void;
}

const REASONS = [
    "Service not provided",
    "Misbehavior",
    "Creator not arrived",
    "Other"
];

const ComplaintForm: React.FC<ComplaintFormProps> = ({ bookingId, creatorId, onSuccess, onClose }) => {
    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason) {
            toast.error(MESSAGES.COMPLAINT.SELECT_REASON);
            return;
        }
        if (description.length < 20) {
            toast.error(MESSAGES.COMPLAINT.DESCRIPTION_MIN_LENGTH);
            return;
        }

        try {
            setSubmitting(true);
            await UserComplaintService.registerComplaint({
                bookingId,
                creatorId,
                reason,
                description
            });
            toast.success(MESSAGES.COMPLAINT.REGISTERED_SUCCESS);
            onSuccess();
        } catch (error: unknown) {
            toast.error((error as { response?: { data?: { error?: string } } }).response?.data?.error || "Failed to register complaint");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(255,255,255,0.05)] animate-in fade-in zoom-in duration-500">
                {/* Visual Side */}
                <div className="md:w-1/3 p-10 bg-gradient-to-br from-zinc-900 to-black border-r border-zinc-900 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-[80px] rounded-full" />
                    
                    <div className="space-y-6 relative">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-black tracking-tighter uppercase leading-none italic">
                            Report <br /> An Issue
                        </h2>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 leading-relaxed">
                            We take your experience seriously. Tell us what went wrong.
                        </p>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 text-zinc-500 relative">
                        <Info className="w-4 h-4 shrink-0 mt-0.5" />
                        <p className="text-[9px] font-medium leading-relaxed">
                            Your complaint will be reviewed by PHLO moderation within 24-48 hours.
                        </p>
                    </div>
                </div>

                {/* Form Side */}
                <div className="md:w-2/3 p-10 space-y-8">
                    <div className="flex justify-end">
                        <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-500 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">The Concern</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {REASONS.map((r) => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => setReason(r)}
                                            className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 text-left ${
                                                reason === r 
                                                ? "bg-white text-black border-white" 
                                                : "bg-zinc-950 text-zinc-400 border-zinc-900 hover:border-zinc-700 hover:bg-zinc-900/50"
                                            }`}
                                        >
                                            <span className="text-xs font-bold uppercase tracking-widest">{r}</span>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${reason === r ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Detailed Insight</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Please provide a comprehensive description of the issue encountered during your session..."
                                    className="w-full h-32 bg-zinc-950 border border-zinc-900 rounded-3xl p-6 text-sm text-zinc-300 placeholder:text-zinc-700 outline-none focus:border-rose-500/50 transition-colors resize-none font-medium leading-relaxed"
                                />
                                <div className="flex justify-end">
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${description.length < 20 ? 'text-rose-500' : 'text-zinc-600'}`}>
                                        {description.length}/500 chars (Min 20)
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-5 rounded-[1.5rem] bg-rose-600 text-white font-black text-xs uppercase tracking-[0.3em] hover:bg-rose-500 transition-all duration-300 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 relative overflow-hidden group shadow-[0_20px_40px_rgba(225,29,72,0.2)]"
                        >
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-white opacity-20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            {submitting ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <MessageSquare className="w-4 h-4" />
                            )}
                            {submitting ? "Processing..." : "Submit Formal Complaint"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ComplaintForm;
