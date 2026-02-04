import { X, Mail, Briefcase, Award, Link2, FileCheck } from "lucide-react";
import { Creator } from "@/interface/admin/creatorInterface";
import { useState } from "react";
import { S3Media } from "@/compoents/reusable/s3Media";

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
  console.log("ekbxp", creator);
  const handleApprove = async () => {
    try {
      setIsApproving(true);
      await onApprove(creator._id);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div className="bg-gray-50 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 text-gray-600 hover:text-gray-900 
                     bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
          >
            <X size={20} />
          </button>

          <div className="grid md:grid-cols-3 gap-0">
            <div className="bg-white p-8 border-r border-gray-200">
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
                    className="w-32 h-32 rounded-2xl object-cover mx-auto shadow-lg 
                             ring-4 ring-gray-100 group-hover:ring-gray-300 transition-all"
                  />
                  <div
                    className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/10 
                               transition-all flex items-center justify-center"
                  >
                    <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-semibold">
                      PREVIEW
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {creator.fullName}
                </h3>
                <div className="flex items-center justify-center gap-1.5 text-gray-600 text-sm">
                  <Mail size={14} />
                  <p className="truncate">{creator.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Briefcase size={16} />
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Experience
                    </span>
                  </div>
                  <p className="text-gray-900 font-bold text-lg">
                    {creator.yearsOfExperience
                      ? `${creator.yearsOfExperience} Years`
                      : "N/A"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Award size={16} />
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Specialties
                    </span>
                  </div>
                  <p className="text-gray-900 font-bold text-lg">
                    {creator.specialties?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-white">
              <div className="p-8">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 pb-3 border-b border-gray-200">
                  Application Details
                </h4>

                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                  <div className="bg-gray-50 rounded-xl p-5">
                    <h5 className="font-semibold text-gray-900 mb-2">Bio</h5>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {creator.bio || "No bio provided"}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5">
                    <h5 className="font-semibold text-gray-900 mb-3">
                      Specializations
                    </h5>
                    {creator.specialties?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {creator.specialties.map((item, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-white text-gray-800 rounded-lg text-sm 
                                     font-medium border border-gray-200 shadow-sm"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">
                        No specializations listed
                      </p>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5">
                    <h5 className="font-semibold text-gray-900 mb-3">
                      Phone Number
                    </h5>

                    {creator?.phone ? (
                      <div className="flex flex-wrap gap-2">
                        <p className="text-sm text-gray-700">{creator.phone}</p>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">
                        No phone number listed
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5">
                    <h5 className="font-semibold text-gray-900 mb-3">
                      Portfolio
                    </h5>
                    {creator.portfolioLink ? (
                      <button
                        onClick={() =>
                          window.open(creator.portfolioLink, "_blank")
                        }
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white 
                                 text-sm font-medium rounded-lg hover:bg-gray-800 transition-all 
                                 shadow-sm hover:shadow-md"
                      >
                        <Link2 size={16} />
                        Open Portfolio
                      </button>
                    ) : (
                      <p className="text-gray-400 text-sm">
                        No portfolio link provided
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5">
                    <h5 className="font-semibold text-gray-900 mb-3">
                      Government ID
                    </h5>
                    <div
                      className="cursor-pointer inline-block group"
                      onClick={() =>
                        setPreview({
                          title: "Government ID",
                          s3Key: creator.governmentId || "",
                        })
                      }
                    >
                      <div className="relative overflow-hidden rounded-lg">
                        <S3Media
                          s3Key={creator.governmentId || ""}
                          className="w-40 h-28 object-cover border-2 border-gray-200 
                                   group-hover:border-gray-400 transition-all shadow-sm"
                        />
                        <div
                          className="absolute inset-0 bg-black/0 group-hover:bg-black/20 
                                     transition-all flex items-center justify-center"
                        >
                          <span
                            className="text-white opacity-0 group-hover:opacity-100 
                                       text-xs font-bold tracking-wide"
                          >
                            CLICK TO VIEW
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 p-6 bg-gray-50">
                {creator.status === "pending" ? (
                  <div className="flex gap-3">
                    <button
                      onClick={onReject}
                      className="flex-1 px-6 py-3.5 bg-white text-gray-900 font-bold rounded-xl 
                               border-2 border-gray-300 hover:border-red-400 hover:text-red-600 
                               transition-all shadow-sm hover:shadow-md"
                    >
                      Reject
                    </button>
                    <button
                      onClick={handleApprove}
                      disabled={isApproving}
                      className={`
    flex-1 px-6 py-3.5 rounded-xl font-bold 
    flex items-center justify-center gap-2
    transition-all shadow-md
    ${
      isApproving
        ? "bg-gray-700 cursor-not-allowed"
        : "bg-black text-white hover:bg-gray-800 hover:shadow-lg"
    }
  `}
                    >
                      {isApproving ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                          </svg>
                          Approving...
                        </>
                      ) : (
                        <>
                          <FileCheck size={18} />
                          Approve
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-2 bg-white rounded-lg border border-gray-200 px-4">
                    <p className="text-sm text-gray-600">
                      Application status:{" "}
                      <span className="capitalize font-bold text-gray-900">
                        {creator.status}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {preview && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-[60] p-8"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative animate-[fadeIn_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white p-4 pb-16 shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <div className="relative bg-gray-100">
                <S3Media
                  s3Key={preview.s3Key}
                  className="w-auto h-auto max-w-3xl max-h-[70vh] object-contain"
                />
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-gray-700 font-handwriting text-lg tracking-wide">
                  {preview.title}
                </p>
              </div>
            </div>

            <button
              onClick={() => setPreview(null)}
              className="absolute -top-16 right-0 text-white/80 hover:text-white 
                       transition-all flex items-center gap-3 group"
            >
              <span className="text-sm font-medium tracking-wider opacity-70 group-hover:opacity-100">
                CLOSE
              </span>
              <div className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3">
                <X size={20} />
              </div>
            </button>

            <div
              className="absolute -top-3 left-1/2 transform -translate-x-1/2 
                         w-24 h-8 bg-white/10 backdrop-blur-sm rotate-2 
                         border-t border-b border-white/20"
            ></div>
          </div>
        </div>
      )}
    </>
  );
};
