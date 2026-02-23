import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
    icon?: React.ReactNode;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = 'danger',
    icon
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-8">
                            <div className="flex items-start justify-between mb-6">
                                <div className={`p-3 rounded-2xl ${variant === 'danger' ? 'bg-red-500/10 text-red-500' :
                                    variant === 'warning' ? 'bg-yellow-500/10 text-yellow-500' :
                                        'bg-blue-500/10 text-blue-500'
                                    }`}>
                                    {icon || <AlertTriangle size={28} />}
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                            <p className="text-gray-400 text-lg leading-relaxed mb-8">{message}</p>

                            <div className="flex gap-4">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-6 py-3.5 rounded-2xl bg-zinc-900 text-white font-semibold hover:bg-zinc-800 border border-white/5 transition-all text-center"
                                >
                                    {cancelLabel}
                                </button>
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={`flex-1 px-6 py-3.5 rounded-2xl font-semibold shadow-lg shadow-red-500/10 transition-all text-center ${variant === 'danger' ? 'bg-red-600 hover:bg-red-500 active:scale-95 text-white' :
                                        variant === 'warning' ? 'bg-yellow-600 hover:bg-yellow-500 text-black' :
                                            'bg-white hover:bg-gray-200 text-black'
                                        }`}
                                >
                                    {confirmLabel}
                                </button>
                            </div>
                        </div>

                        {/* Subtle glow effect */}
                        <div className={`absolute -bottom-24 -left-24 w-48 h-48 blur-[100px] opacity-20 pointer-events-none rounded-full ${variant === 'danger' ? 'bg-red-500' : 'bg-blue-500'
                            }`} />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal;
