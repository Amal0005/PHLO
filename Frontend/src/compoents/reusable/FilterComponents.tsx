import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- FILTER SELECT ---
interface Option {
    value: string;
    label: string;
}

interface FilterSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    className?: string;
    icon?: React.ReactNode;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
    value,
    onChange,
    options,
    placeholder = "Select Option",
    className = "",
    icon
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between gap-3 px-5 py-3 bg-zinc-900 border border-white/10 rounded-2xl text-[13px] font-bold tracking-wide transition-all duration-300 hover:border-white/20 active:scale-[0.98] ${value ? "text-white" : "text-zinc-500"
                    }`}
            >
                <div className="flex items-center gap-2.5 truncate">
                    {icon && <span className="opacity-40">{icon}</span>}
                    <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
                </div>
                <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 opacity-40 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 5, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-50 left-0 right-0 max-h-[300px] overflow-y-auto bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl"
                        style={{ scrollbarWidth: "none" }}
                    >
                        <div className="p-1.5 flex flex-col gap-1">
                            {options.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-[12px] font-bold transition-all text-left group/item relative overflow-hidden ${value === opt.value
                                        ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                        }`}
                                >
                                    <span className="relative z-10 truncate">{opt.label}</span>
                                    {value === opt.value && <Check size={14} className="relative z-10" />}

                                    {value !== opt.value && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/0 to-white/0 group-hover/item:via-white/5 transition-all duration-300" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- FILTER SEARCH ---
interface FilterSearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export const FilterSearch: React.FC<FilterSearchProps> = ({
    value,
    onChange,
    placeholder = "Search...",
    className = "",
}) => {
    return (
        <div className={`relative ${className}`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none group-focus-within:text-white transition-colors">
                <Search size={18} />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-zinc-900 border border-white/10 rounded-2xl pl-12 pr-12 py-3 text-[13px] font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 focus:ring-4 focus:ring-white/5 transition-all duration-300"
            />
            {value && (
                <button
                    onClick={() => onChange("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-zinc-600 hover:text-white transition-colors"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
};

// --- FILTER BUTTON ---
interface FilterButtonProps {
    onClick: () => void;
    active?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "danger" | "success";
}

export const FilterButton: React.FC<FilterButtonProps> = ({
    onClick,
    active = false,
    loading = false,
    icon,
    children,
    className = "",
    variant = "default",
}) => {
    const getVariantStyles = () => {
        switch (variant) {
            case "danger":
                return "bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/20";
            case "success":
                return "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20";
            default:
                return active
                    ? "bg-white border-white text-black shadow-[0_0_20px_rgba(255,255,254,0.15)]"
                    : "bg-zinc-900 border-white/10 text-white hover:border-white/20";
        }
    };

    return (
        <button
            onClick={onClick}
            disabled={loading}
            className={`px-5 py-3 rounded-2xl font-bold text-[12px] tracking-wide transition-all duration-300 border flex items-center justify-center gap-2.5 disabled:opacity-50 active:scale-[0.98] ${getVariantStyles()} ${className}`}
        >
            {loading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
                icon && <span className={!active && variant === 'default' ? "opacity-40" : ""}>{icon}</span>
            )}
            <span className="truncate">{children}</span>
        </button>
    );
};
