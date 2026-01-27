import { X } from "lucide-react";
import { Creator } from "@/interface/admin/creatorInterface";
import { S3Media } from "@/compoents/reusable/S3Media";
import { useState } from "react";

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
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const openPreview = (key?: string | null) => {
    if (key) setPreviewImage(key);
  };

  return (
    <>
      {/* MAIN MODAL */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* HEADER */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Creator Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* PROFILE */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                <div
                  onClick={() => openPreview(creator.profilePhoto)}
                  className={`w-full h-full ${
                    creator.profilePhoto
                      ? "cursor-pointer hover:opacity-80"
                      : "cursor-not-allowed opacity-60"
                  } transition`}
                >
                  <S3Media
                    s3Key={creator.profilePhoto}
                    alt={creator.fullName}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg">{creator.fullName}</h3>
                <p className="text-gray-600">{creator.email}</p>
              </div>
            </div>

            {/* BIO */}
            <div>
              <h4 className="font-medium mb-2">Bio</h4>
              <p className="text-gray-700">{creator.bio || "-"}</p>
            </div>

            {/* EXPERIENCE */}
            <div>
              <h4 className="font-medium mb-2">Experience</h4>
              <p className="text-gray-700">{creator.experience || "-"}</p>
            </div>

            {/* PORTFOLIO */}
            <div>
              <h4 className="font-medium mb-2">Portfolio</h4>
              {creator.portfolioLink ? (
                <a
                  href={creator.portfolioLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View Portfolio →
                </a>
              ) : (
                <p className="text-gray-400">-</p>
              )}
            </div>

            {/* GOVERNMENT ID */}
            <div>
              <h4 className="font-medium mb-2">Government ID</h4>
              <div
                onClick={() => openPreview(creator.governmentId)}
                className={`inline-block ${
                  creator.governmentId
                    ? "cursor-pointer hover:opacity-80"
                    : "cursor-not-allowed opacity-60"
                } transition`}
              >
                <S3Media
                  s3Key={creator.governmentId}
                  alt="Government ID"
                  className="max-w-full h-auto rounded-lg pointer-events-none"
                />
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={onReject}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Reject
              </button>
              <button
                onClick={() => onApprove(creator._id)}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* IMAGE PREVIEW */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60]"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 text-white hover:text-gray-300"
            >
              <X size={32} />
            </button>

            <S3Media
              s3Key={previewImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain pointer-events-none"
            />
          </div>
        </div>
      )}
    </>
  );
};
