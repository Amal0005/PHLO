import React from "react";
import { X } from "lucide-react";

interface ModalOption {
    label: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
    isPrimary?: boolean;
}

interface OptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    options: ModalOption[];
}

const OptionModal: React.FC<OptionModalProps> = ({
    isOpen,
    onClose,
    title,
    options,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-sm shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-black mb-6 tracking-tight text-white text-center">
                    {title}
                </h2>

                <div className="space-y-4">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                option.onClick();
                                onClose();
                            }}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group border ${option.isPrimary
                                    ? "bg-white/5 border-white/10 hover:bg-white/10"
                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                                }`}
                        >
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${option.isPrimary
                                        ? "bg-white text-black group-hover:scale-105"
                                        : "bg-zinc-800 group-hover:bg-zinc-700"
                                    }`}
                            >
                                {option.icon}
                            </div>
                            <div className="text-left">
                                <span className="block font-bold text-white">
                                    {option.label}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {option.description}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-6 py-2 text-gray-500 font-bold hover:text-white transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default OptionModal;
