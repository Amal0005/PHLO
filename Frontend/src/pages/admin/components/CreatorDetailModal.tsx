import { X, Mail, Briefcase, Award, Link2, FileCheck } from "lucide-react";
import { Creator } from "@/interface/admin/creatorInterface";
import { useState } from "react";
import { S3Media } from "@/components/reusable/s3Media";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

interface Props {
  creator: Creator;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: () => void;
}

export const CreatorDetailModal = ({
  creator,
  onClose,
  onApprove,
  onReject,
}: Props) => {
  const [preview, setPreview] = useState<{
    title: string;
    s3Key: string;
  } | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  const handleApprove = async () => {
    try {
      setIsApproving(true);
      await onApprove(creator._id);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
            mass: 0.8,
          }}
          className="relative bg-[#0a0a0a] rounded-[2.5rem] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] border border-white/10 z-[101] m-4"
        >
          <div className="h-full overflow-y-auto custom-scrollbar">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-20 text-white/50 hover:text-white 
                       bg-white/5 border border-white/10 rounded-full p-2.5 
                       transition-all active:scale-90 hover:bg-white/10"
            >
              <X size={20} />
            </button>

            <div className="grid md:grid-cols-3 gap-0">
              {/* Sidebar */}
              <div className="bg-zinc-900/50 p-8 border-r border-white/5">
                <div className="text-center mb-10">
                  <div
                    className="cursor-pointer inline-block group relative mb-6"
                    onClick={() =>
                      setPreview({
                        title: "Profile Photo",
                        s3Key: creator.profilePhoto || "",
                      })
                    }
                  >
                    <S3Media
                      s3Key={creator.profilePhoto || ""}
                      alt={creator.fullName}
                      className="w-32 h-32 rounded-3xl object-cover mx-auto shadow-2xl 
                               ring-4 ring-white/5 group-hover:ring-blue-500/20 transition-all duration-300"
                    />
                    <div
                      className="absolute inset-0 rounded-3xl bg-black/0 group-hover:bg-blue-500/20 
                                 transition-all duration-300 flex items-center justify-center"
                    >
                      <span className="text-white opacity-0 group-hover:opacity-100 text-[10px] font-black tracking-[0.3em]">
                        VIEW
                      </span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-2 italic tracking-tight">
                    {creator.fullName.toUpperCase()}
                  </h3>
                  <div className="flex items-center justify-center gap-1.5 text-gray-400 text-xs font-bold tracking-tight">
                    <Mail size={12} className="text-blue-500" />
                    <p className="truncate opacity-70">{creator.email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/5 shadow-inner">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                      <Briefcase size={14} className="text-blue-500" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                        Expertise
                      </span>
                    </div>
                    <p className="text-white font-black text-2xl italic">
                      {creator.yearsOfExperience
                        ? `${creator.yearsOfExperience}YRS`
                        : "N/A"}
                    </p>
                  </div>

                  <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/5 shadow-inner">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                      <Award size={14} className="text-purple-500" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                        Assets
                      </span>
                    </div>
                    <p className="text-white font-black text-2xl italic">
                      {creator.specialties?.length || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="md:col-span-2 bg-[#0a0a0a]">
                <div className="p-8">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-8 pb-3 border-b border-white/5 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                    Creator Dossier / PHLO-ID: {creator._id.slice(-8).toUpperCase()}
                  </h4>

                  <div className="space-y-8 max-h-[55vh] overflow-y-auto pr-4 custom-scrollbar">
                    <section className="space-y-3">
                      <h5 className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                        Biography
                      </h5>
                      <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/5">
                        <p className="text-gray-300 text-sm leading-relaxed font-medium">
                          {creator.bio || "No biographical data available in records."}
                        </p>
                      </div>
                    </section>

                    <section className="space-y-3">
                      <h5 className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                        Disciplines
                      </h5>
                      {creator.specialties?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {creator.specialties.map((item, index) => (
                            <span
                              key={index}
                              className="px-4 py-2 bg-blue-500/5 text-blue-400 rounded-xl text-[10px] 
                                       font-black border border-blue-500/20 shadow-sm uppercase tracking-widest"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-xs font-bold italic">
                          No specializations recorded.
                        </p>
                      )}
                    </section>

                    {creator.subscription && (
                      <section className="space-y-3">
                        <h5 className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                          Network Tier
                        </h5>
                        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 flex justify-between items-center group">
                          <div>
                            <p className="text-white font-black text-lg italic tracking-tight uppercase">
                              {creator.subscription.planName} MEMBER
                            </p>
                            <p className="text-gray-500 text-[10px] mt-1 font-black uppercase tracking-widest">
                              Active until {format(new Date(creator.subscription.endDate), 'MMM dd, yyyy')}
                            </p>
                          </div>
                          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-2xl ${creator.subscription.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}>
                            {creator.subscription.status}
                          </div>
                        </div>
                      </section>
                    )}

                    <div className="grid sm:grid-cols-2 gap-6">
                      <section className="space-y-3">
                        <h5 className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                          Contact Node
                        </h5>
                        <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5 flex items-center justify-between">
                          <p className="text-[10px] font-black text-white tracking-widest">
                            {creator?.phone || "UNREGISTERED"}
                          </p>
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        </div>
                      </section>

                      <section className="space-y-3">
                        <h5 className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                          External Data
                        </h5>
                        {creator.portfolioLink ? (
                          <button
                            onClick={() =>
                              window.open(creator.portfolioLink, "_blank")
                            }
                            className="w-full flex items-center justify-between px-5 py-4 bg-white text-black 
                                     text-[10px] font-black rounded-2xl hover:bg-gray-200 transition-all 
                                     active:scale-[0.98] shadow-2xl uppercase tracking-[0.2em] group"
                          >
                            <span className="flex items-center gap-2">
                              <Link2 size={14} />
                              Open Portfolio
                            </span>
                            <ArrowUpRight
                              size={12}
                              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                            />
                          </button>
                        ) : (
                          <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5 bg-zinc-950">
                            <p className="text-[10px] text-gray-600 font-black tracking-widest italic">
                              NO LINK PROVIDED
                            </p>
                          </div>
                        )}
                      </section>
                    </div>

                    <section className="space-y-4">
                      <h5 className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                        Identification Artifact
                      </h5>
                      <div
                        className="cursor-pointer group relative inline-block p-1 rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent border border-white/5"
                        onClick={() =>
                          setPreview({
                            title: "Government ID",
                            s3Key: creator.governmentId || "",
                          })
                        }
                      >
                        <div className="relative overflow-hidden rounded-[1.8rem]">
                          <S3Media
                            s3Key={creator.governmentId || ""}
                            className="w-64 h-40 object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                          />
                          <div className="absolute inset-0 bg-black/60 group-hover:bg-blue-500/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <span className="text-white text-[10px] font-black tracking-[0.4em] translate-y-2 group-hover:translate-y-0 transition-transform">
                              ENLARGE SCAN
                            </span>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>

                <div className="border-t border-white/5 p-8 bg-white/[0.01]">
                  {creator.status === "pending" ? (
                    <div className="flex gap-4">
                      <button
                        onClick={onReject}
                        className="flex-1 px-8 py-5 bg-transparent text-rose-500 font-black rounded-3xl 
                                 border-2 border-rose-500/20 hover:border-rose-500 hover:bg-rose-500/5 
                                 transition-all active:scale-[0.98] text-xs uppercase tracking-[0.2em]"
                      >
                        Reject Node
                      </button>
                      <button
                        onClick={handleApprove}
                        disabled={isApproving}
                        className={`
                          flex-1 px-8 py-5 rounded-3xl font-black 
                          flex items-center justify-center gap-4
                          transition-all shadow-2xl active:scale-[0.98] text-xs uppercase tracking-[0.2em]
                          ${isApproving
                            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                            : "bg-white text-black hover:bg-gray-100 ring-4 ring-white/10"
                          }
                        `}
                      >
                        {isApproving ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <FileCheck size={18} />
                            Deploy Approval
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-4 py-6 bg-zinc-900/50 rounded-3xl border border-white/5 shadow-inner">
                      <div
                        className={`w-2 h-2 rounded-full animate-pulse ${creator.status === "approved" ? "bg-emerald-500" : "bg-rose-500"}`}
                      />
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
                        ACCESS:{" "}
                        <span className={creator.status === 'approved' ? 'text-emerald-400' : 'text-rose-400'}>
                          {creator.status}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-3xl flex items-center justify-center z-[100] p-4 sm:p-20"
            onClick={() => setPreview(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.5 }}
              className="relative max-w-full max-h-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreview(null)}
                className="absolute -top-16 right-0 text-white/40 hover:text-white 
                         transition-all p-3 bg-white/5 hover:bg-white/10 rounded-full"
                title="Deactivate Preview"
              >
                <X size={24} />
              </button>

              <div className="relative group overflow-hidden rounded-[3rem] shadow-[0_0_150px_rgba(0,0,0,1)] border border-white/10">
                <S3Media
                  s3Key={preview.s3Key}
                  className="max-w-[90vw] max-h-[75vh] object-contain block group-hover:scale-[1.02] transition-transform duration-700"
                />
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black via-black/40 to-transparent">
                  <p className="text-white text-center text-xs font-black tracking-[0.5em] italic uppercase">
                    PHLO ARTIFACT: {preview.title}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

// Internal Import for icons used in the dark mode
const ArrowUpRight = ({ size = 16, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);

