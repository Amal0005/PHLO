import { X } from "lucide-react";
import { Creator } from "@/interface/admin/creatorInterface";
import { S3Media } from "@/compoents/reusable/S3Media";

interface Props {
    creator: Creator;
    onClose: () => void;
    onApprove: (id: string) => void;
    onReject: () => void;
}

export const CreatorDetailModal = ({ creator, onClose, onApprove, onReject }: Props) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 w-full max-w-lg rounded-xl p-6 border border-white/10 relative max-h-[90vh] overflow-y-auto">
                {/* CLOSE BUTTON */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-semibold text-white mb-6">
                    Creator Details
                </h2>

                {/* PROFILE PHOTO & NAME */}
                <div className="flex items-center gap-4 mb-6">
                    <S3Media
                        s3Key={creator.profilePhoto || ""}
                        className="w-20 h-20 rounded-full border-2 border-white/10"
                        alt="Profile"
                    />
                    <div>
                        <h3 className="text-white font-semibold text-lg">
                            {creator.fullName}
                        </h3>
                        <p className="text-gray-400 text-sm">
                            {creator.email}
                        </p>
                    </div>
                </div>

                {/* BIO */}
                <div className="mb-4 bg-zinc-800/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
                        Bio
                    </p>
                    <p className="text-white text-sm leading-relaxed">
                        {creator.bio || "-"}
                    </p>
                </div>

                {/* EXPERIENCE */}
                <div className="mb-4 bg-zinc-800/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
                        Experience
                    </p>
                    <p className="text-white text-sm">
                        {creator.experience || "-"}
                    </p>
                </div>

                {/* PORTFOLIO */}
                <div className="mb-4 bg-zinc-800/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
                        Portfolio
                    </p>
                    {creator.portfolioLink ? (
                        <a
                            href={creator.portfolioLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline text-sm transition-colors"
                        >
                            View Portfolio →
                        </a>
                    ) : (
                        <p className="text-white text-sm">-</p>
                    )}
                </div>

                {/* GOVERNMENT ID */}
                <div className="mb-6 bg-zinc-800/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
                        Government ID
                    </p>
                    <S3Media
                        s3Key={creator.governmentId || ""}
                        type="document"
                    />
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
                    <button
                        onClick={onReject}
                        className="flex-1 px-4 py-3 text-red-400 border border-red-400/30 rounded-lg hover:bg-red-500/10 transition-all font-medium"
                    >
                        Reject
                    </button>

                    <button
                        onClick={() => onApprove(creator._id)}
                        className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-medium"
                    >
                        Approve
                    </button>
                </div>
            </div>
        </div>
    );
};
