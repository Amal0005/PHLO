import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    description?: string;
    options: ModalOption[];
}

const OptionModal: React.FC<OptionModalProps> = ({
    isOpen,
    onClose,
    title,
    description,
    options,
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    {/* Darker Glass Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-lg"
                    >
                        <div 
                            className="relative bg-[#080808]/80 border border-white/10 p-10 sm:p-12 rounded-[56px] shadow-[0_80px_160px_rgba(0,0,0,1)]"
                            style={{
                                backdropFilter: "blur(40px) saturate(2)",
                                WebkitBackdropFilter: "blur(40px) saturate(2)",
                            }}
                        >
                            {/* Signature Glow */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-[#E2B354]/5 blur-[120px] rounded-full pointer-events-none" />
                            
                            {/* Simple Close */}
                            <button
                                onClick={onClose}
                                className="absolute top-10 right-10 text-white/20 hover:text-white transition-all hover:scale-125 active:scale-90"
                            >
                                <X size={24} strokeWidth={1.5} />
                            </button>

                            {/* Header Section */}
                            <div className="flex flex-col items-center mb-12 text-center">
                                <span className="text-[#E2B354] text-[10px] font-black uppercase tracking-[0.6em] mb-4">Choose Action</span>
                                <h1 className="text-3xl sm:text-4xl font-[950] tracking-tighter uppercase text-white leading-tight">
                                    {title}
                                </h1>
                                {description && (
                                    <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 max-w-[280px]">
                                        {description}
                                    </p>
                                )}
                            </div>

                            {/* Options Grid */}
                            <div className={`grid ${options.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                                {options.map((option, index) => (
                                    <motion.button
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 + 0.2 }}
                                        onClick={() => {
                                            option.onClick();
                                            onClose();
                                        }}
                                        className="group relative flex flex-col items-center justify-center p-8 rounded-[40px] transition-all bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-[#E2B354]/40 hover:-translate-y-2 active:scale-95 shadow-2xl overflow-hidden"
                                    >
                                        {/* Hover Overlay Glow */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-[#E2B354]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        {/* Icon Container */}
                                        <div className="relative w-16 h-16 mb-6 rounded-3xl bg-white/5 flex items-center justify-center text-[#E2B354] transition-all group-hover:scale-110 group-hover:bg-[#E2B354]/10">
                                            <div className="scale-[1.8] group-hover:rotate-6 transition-transform duration-500">
                                                {option.icon}
                                            </div>
                                        </div>

                                        {/* Text Info */}
                                        <div className="relative text-center">
                                            <span className="block text-xs font-black uppercase tracking-widest text-white mb-2 group-hover:text-[#E2B354] transition-colors">
                                                {option.label}
                                            </span>
                                            <span className="block text-[9px] font-bold uppercase tracking-wider text-white/20 leading-relaxed group-hover:text-white/40">
                                                {option.description}
                                            </span>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full mt-12 py-2 text-[9px] font-black uppercase tracking-[0.5em] text-white/20 hover:text-white transition-colors"
                            >
                                Back to safety
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default OptionModal;
