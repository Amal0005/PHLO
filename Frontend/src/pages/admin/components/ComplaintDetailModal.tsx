import React, { useState } from "react";
import { X, CheckCircle, ShieldAlert, BadgeInfo, MessageSquare, XCircle } from "lucide-react";
import { Complaint } from "@/interface/admin/AdminComplaintInterface";
import { AdminComplaintService } from "@/services/admin/adminComplaintService";
import { toast } from "react-toastify";

interface ComplaintDetailModalProps {
  complaint: Complaint;
  onClose: () => void;
  onUpdate: () => void;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({ complaint, onClose, onUpdate }) => {
  const [adminComment, setAdminComment] = useState(complaint.adminComment || "");
  const [processing, setProcessing] = useState(false);

  const handleResolution = async (action: "resolve" | "dismiss") => {
    if (!adminComment.trim()) {
      toast.error("Please provide an internal resolution comment");
      return;
    }
    try {
      setProcessing(true);
      await AdminComplaintService.resolveComplaint(complaint.id, action, adminComment);
      const message = action === "resolve" ? "Full Refund Issued to User" : "Case Dismissed & Payment Released to Creator";
      toast.success(message);
      onUpdate();
      onClose();
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data: { error: string } } };
        toast.error(axiosError.response.data.error || "Failed to process resolution");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-4xl bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(255,255,255,0.05)] max-h-[90vh]">

        {/* Sidebar Info */}
        <div className="md:w-1/3 p-10 bg-gradient-to-br from-zinc-900 to-black border-r border-zinc-900 overflow-y-auto">
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black tracking-tighter uppercase leading-none italic">
                Case <br /> Review
              </h2>
              <div className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${complaint.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                }`}>
                {complaint.status}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Complainant (User)</label>
                <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                  <p className="text-sm font-bold text-white">{complaint.userName}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Respondent (Creator)</label>
                <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                  <p className="text-sm font-bold text-white">{complaint.creatorName}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Booking Reference</label>
                <p className="text-xs font-mono text-zinc-400 p-2 rounded-lg bg-white/5 border border-white/5 truncate">
                  {complaint.bookingId.toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:w-2/3 p-10 flex flex-col h-full overflow-y-auto space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Subject Matter</h3>
              <p className="text-2xl font-black text-white uppercase tracking-tight">{complaint.reason}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BadgeInfo className="w-4 h-4 text-zinc-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Incident Details</span>
            </div>
            <div className="p-8 rounded-[2rem] bg-zinc-900/30 border border-zinc-900 text-zinc-400 text-sm leading-relaxed italic whitespace-pre-wrap">
              "{complaint.description}"
            </div>
          </div>

          {complaint.status === 'pending' ? (
            <div className="space-y-8 pt-8 border-t border-zinc-900">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-rose-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Moderator Determination</span>
                </div>
                <textarea
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  placeholder="Record internal notes and resolution rationale..."
                  className="w-full h-32 bg-zinc-950 border border-zinc-900 rounded-3xl p-6 text-sm text-zinc-300 placeholder:text-zinc-700 outline-none focus:border-rose-500/50 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button
                  onClick={() => handleResolution("resolve")}
                  disabled={processing}
                  className="flex flex-col items-center gap-4 p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all group disabled:opacity-50"
                >
                  <CheckCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <div className="text-center">
                    <span className="text-sm font-bold uppercase tracking-tight">Full Refund</span>
                  </div>
                </button>

                <button
                  onClick={() => handleResolution("dismiss")}
                  disabled={processing}
                  className="flex flex-col items-center gap-4 p-8 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white transition-all group disabled:opacity-50"
                >
                  <XCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <div className="text-center">
                    <span className="text-sm font-bold uppercase tracking-tight">Dismiss & Release Payment</span>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 pt-8 border-t border-zinc-900">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Moderation Outcome</span>
              </div>
              <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                <p className="text-zinc-400 text-sm italic">"{complaint.adminComment}"</p>
              </div>
              <div className="flex justify-center">
                <span className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] border ${complaint.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                  }`}>
                  {complaint.status === 'resolved' ? 'Case Resolved' : 'Complaint Dismissed'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
