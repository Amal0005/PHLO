import { X, Mail, Briefcase, Award, Link2, FileCheck } from "lucide-react";
import { Creator } from "@/interface/admin/creatorInterface";
import { useState } from "react";
import { S3Media } from "@/compoents/reusable/s3Media";
import { motion, AnimatePresence } from "framer-motion";

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
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
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
            className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden z-10"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-20 text-gray-500 hover:text-gray-900 
                       bg-white shadow-sm border border-gray-100 rounded-full p-2.5 
                       transition-all active:scale-90 hover:bg-gray-50"
            >
              <X size={20} />
            </button>

            <div className="grid md:grid-cols-3 gap-0">
              <div className="bg-gray-50/50 p-8 border-r border-gray-100">
                <div className="text-center mb-6">
                  <div
                    className="cursor-pointer inline-block group relative mb-4"
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
                      className="w-32 h-32 rounded-3xl object-cover mx-auto shadow-xl 
                               ring-4 ring-white group-hover:ring-gray-100 transition-all duration-300"
                    />
                    <div
                      className="absolute inset-0 rounded-3xl bg-black/0 group-hover:bg-black/20 
                                 transition-all duration-300 flex items-center justify-center"
                    >
                      <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-bold tracking-widest">
                        VIEW
                      </span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-gray-900 mb-1">
                    {creator.fullName}
                  </h3>
                  <div className="flex items-center justify-center gap-1.5 text-gray-500 text-sm font-medium">
                    <Mail size={14} className="text-gray-400" />
                    <p className="truncate">{creator.email}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Briefcase size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Experience
                      </span>
                    </div>
                    <p className="text-gray-900 font-extrabold text-xl">
                      {creator.yearsOfExperience
                        ? `${creator.yearsOfExperience} Years`
                        : "N/A"}
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Award size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Specialties
                      </span>
                    </div>
                    <p className="text-gray-900 font-extrabold text-xl">
                      {creator.specialties?.length || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 bg-white">
                <div className="p-8">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 pb-2 border-b border-gray-100">
                    Application Information
                  </h4>

                  <div className="space-y-6 max-h-[55vh] overflow-y-auto pr-4 custom-scrollbar">
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Bio
                      </h5>
                      <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100">
                        <p className="text-gray-700 text-sm leading-relaxed font-medium">
                          {creator.bio || "No bio provided"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Specializations
                      </h5>
                      {creator.specialties?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {creator.specialties.map((item, index) => (
                            <span
                              key={index}
                              className="px-4 py-2 bg-white text-gray-700 rounded-xl text-xs 
                                       font-bold border border-gray-100 shadow-sm"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm font-medium italic">
                          No specializations listed
                        </p>
                      )}
                    </div>

                    {creator.subscription && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Active Subscription
                        </h5>
                        <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 flex justify-between items-center">
                          <div>
                            <p className="text-gray-900 font-bold text-base">
                              {creator.subscription.planName} Plan
                            </p>
                            <p className="text-gray-500 text-xs mt-1 font-medium">
                              Expires on {new Date(creator.subscription.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${creator.subscription.status === 'active'
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : 'bg-red-100 text-red-700 border-red-200'
                            }`}>
                            {creator.subscription.status}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Phone
                        </h5>
                        <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
                          <p className="text-sm font-bold text-gray-700">
                            {creator?.phone || "Not provided"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Portfolio
                        </h5>
                        {creator.portfolioLink ? (
                          <button
                            onClick={() =>
                              window.open(creator.portfolioLink, "_blank")
                            }
                            className="w-full flex items-center justify-between px-4 py-3 bg-gray-900 text-white 
                                     text-xs font-bold rounded-xl hover:bg-black transition-all 
                                     active:scale-[0.98] shadow-lg shadow-black/10 group"
                          >
                            <span className="flex items-center gap-2">
                              <Link2 size={14} />
                              Open Link
                            </span>
                            <X
                              size={12}
                              className="rotate-45 group-hover:translate-x-0.5 transition-transform"
                            />
                          </button>
                        ) : (
                          <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
                            <p className="text-sm text-gray-400 font-medium">
                              No link
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Documents
                      </h5>
                      <div
                        className="cursor-pointer group relative inline-block"
                        onClick={() =>
                          setPreview({
                            title: "Government ID",
                            s3Key: creator.governmentId || "",
                          })
                        }
                      >
                        <div className="relative overflow-hidden rounded-2xl border-2 border-gray-100 group-hover:border-gray-300 transition-all shadow-md">
                          <S3Media
                            s3Key={creator.governmentId || ""}
                            className="w-48 h-32 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 text-[10px] font-black tracking-widest">
                              VIEW ID
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 p-8 bg-gray-50/30">
                  {creator.status === "pending" ? (
                    <div className="flex gap-4">
                      <button
                        onClick={onReject}
                        className="flex-1 px-6 py-4 bg-white text-gray-900 font-black rounded-2xl 
                                 border-2 border-gray-100 hover:border-red-100 hover:text-red-600 
                                 transition-all active:scale-[0.98] shadow-sm"
                      >
                        Decline
                      </button>
                      <button
                        onClick={handleApprove}
                        disabled={isApproving}
                        className={`
                          flex-1 px-6 py-4 rounded-2xl font-black 
                          flex items-center justify-center gap-3
                          transition-all shadow-xl shadow-black/10 active:scale-[0.98]
                          ${isApproving
                            ? "bg-gray-700 cursor-not-allowed"
                            : "bg-black text-white hover:bg-gray-800"
                          }
                        `}
                      >
                        {isApproving ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <FileCheck size={18} />
                            Approve Creator
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <div
                        className={`w-2 h-2 rounded-full ${creator.status === "approved" ? "bg-green-500" : "bg-red-500"}`}
                      />
                      <p className="text-sm font-bold text-gray-500">
                        Profile is{" "}
                        <span className="text-gray-900 uppercase tracking-tighter">
                          {creator.status}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {preview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[100] p-4 sm:p-8"
          onClick={() => setPreview(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-full max-h-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreview(null)}
              className="absolute -top-14 right-0 sm:-top-4 sm:-right-16 text-white/50 hover:text-white 
                       transition-all p-3 bg-white/5 hover:bg-white/10 rounded-full active:scale-90"
              title="Close"
            >
              <X size={24} />
            </button>

            <div className="relative group overflow-hidden rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10">
              <S3Media
                s3Key={preview.s3Key}
                className="max-w-full max-h-[80vh] object-contain block"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <p className="text-white text-center font-bold tracking-[0.2em] transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {preview.title.toUpperCase()}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
