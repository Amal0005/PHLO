import { X } from "lucide-react";

interface ViewProfileImageProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string | null;
}

export const ViewProfileImage = ({
    isOpen,
    onClose,
    imageUrl,
}: ViewProfileImageProps) => {
    if (!isOpen || !imageUrl) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            onClick={onClose}
            style={{
                background: `
                radial-gradient(
                    circle at center,
                    rgba(0,0,0,0) 0px,
                    rgba(51, 50, 50, 0) 320px,
                    rgba(42, 42, 42, 0.5) 520px,
                    rgba(50, 50, 50, 0.85) 100%
                )
                `
            }}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
            >
                <X className="w-5 h-5" />
            </button>

            {/* Image Container */}
            <div
                className="relative flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={imageUrl}
                    alt="Profile Full View"
                    className="w-110 h-110 object-cover rounded-full shadow-2xl"
                />
            </div>
        </div>
    );
};
