import React from "react";
import { X } from "lucide-react";

interface PoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

const PoliciesModal: React.FC<PoliciesModalProps> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/50 backdrop-blur-md">
          <h3 className="text-xl font-black uppercase tracking-tighter text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar text-zinc-400 space-y-6 leading-relaxed">
          {content}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all active:scale-95"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default PoliciesModal;
