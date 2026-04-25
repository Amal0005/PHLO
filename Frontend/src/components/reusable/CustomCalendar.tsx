import React, { useState } from "react";
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    isBefore,
    startOfDay,
    isAfter
} from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CustomCalendarProps {
    selectedDate?: Date;
    onChange: (date: Date) => void;
    minDate?: Date;
    maxDate?: Date;
    className?: string;
    placeholder?: string;
}

export const CustomCalendar: React.FC<CustomCalendarProps> = ({
    selectedDate,
    onChange,
    minDate = startOfDay(new Date()),
    maxDate,
    className = "",
    placeholder = "Select Date"
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

    const toggleCalendar = () => setIsOpen(!isOpen);

    const nextMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const prevMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const onDateClick = (day: Date) => {
        onChange(day);
        setIsOpen(false);
    };

    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <img src="/Logo_white.png" alt="PHLO" className="w-8 h-8 object-contain opacity-80 grayscale" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">
                            {format(currentMonth, "yyyy")}
                        </span>
                        <span className="text-sm font-black text-white uppercase tracking-tight leading-none">
                            {format(currentMonth, "MMMM")}
                        </span>
                    </div>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={prevMonth}
                        className="p-2 hover:bg-white/5 rounded-xl transition-colors text-zinc-400 hover:text-white"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-white/5 rounded-xl transition-colors text-zinc-400 hover:text-white"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        return (
            <div className="grid grid-cols-7 mb-2">
                {days.map((day, index) => (
                    <div key={index} className="text-center text-[9px] font-bold text-zinc-600 uppercase tracking-widest py-2">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, "d");
                const cloneDay = day;

                const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isToday = isSameDay(day, new Date());
                const isDisabled = (minDate && isBefore(startOfDay(day), startOfDay(minDate))) ||
                    (maxDate && isAfter(startOfDay(day), startOfDay(maxDate)));

                days.push(
                    <div
                        key={day.toString()}
                        className={`relative h-10 flex items-center justify-center text-xs cursor-pointer transition-all duration-200
              ${!isCurrentMonth ? "text-zinc-700" : "text-zinc-300"}
              ${isSelected ? "text-white font-bold" : ""}
              ${isDisabled ? "opacity-20 cursor-not-allowed" : "group hover:text-white"}
            `}
                        onClick={() => !isDisabled && onDateClick(cloneDay)}
                    >
                        {/* Hover/Selection Background */}
                        <div className={`absolute inset-1 rounded-xl transition-all duration-300
              ${isSelected ? "bg-white shadow-[0_0_20px_rgba(255,255,255,0.2)]" : "group-hover:bg-white/5"}
            `} />

                        {/* Content */}
                        <span className={`relative z-10 ${isSelected ? "text-black" : ""}`}>
                            {formattedDate}
                        </span>

                        {/* Today Indicator */}
                        {isToday && !isSelected && (
                            <div className="absolute bottom-1 w-1 h-1 bg-white rounded-full opacity-50" />
                        )}
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="px-2 pb-3">{rows}</div>;
    };

    return (
        <div className={`relative ${className}`}>
            {/* Input / Toggle */}
            <div
                onClick={toggleCalendar}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 h-[54px] text-[13px] text-white focus-within:ring-2 focus-within:ring-white/10 transition-all cursor-pointer group flex items-center justify-between"
            >
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 group-hover:text-zinc-300 transition-colors">
                    <CalendarIcon size={18} />
                </div>

                <span className={selectedDate ? "text-white" : "text-zinc-500"}>
                    {selectedDate ? format(selectedDate, "PPP") : placeholder}
                </span>
            </div>

            {/* Calendar Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm md:bg-transparent"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={window.innerWidth < 768 ? { y: "100%" } : { opacity: 0, y: -10, scale: 0.95 }}
                            animate={window.innerWidth < 768 ? { y: 0 } : { opacity: 1, y: -5, scale: 1 }}
                            exit={window.innerWidth < 768 ? { y: "100%" } : { opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed md:absolute bottom-0 md:bottom-full left-0 right-0 z-[110] md:mb-2 bg-[#121212] border-t md:border border-white/10 rounded-t-[2.5rem] md:rounded-3xl overflow-hidden shadow-2xl backdrop-blur-3xl"
                            style={{
                                background: "rgba(10, 10, 10, 0.95)",
                                backdropFilter: "blur(40px) saturate(2)",
                                maxHeight: "90vh"
                            }}
                        >
                            {/* Mobile Handle */}
                            <div className="md:hidden flex justify-center pt-4 pb-2">
                                <div className="w-12 h-1.5 bg-white/10 rounded-full" />
                            </div>

                            {renderHeader()}
                            <div className="relative pt-2 overflow-hidden">
                                {/* Logo Watermark */}
                                <div
                                    className="absolute inset-0 pointer-events-none opacity-[0.15] flex items-center justify-center p-8"
                                    style={{
                                        backgroundImage: `url("/Logo_white.png")`,
                                        backgroundPosition: "center",
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: "contain",
                                        filter: "grayscale(1) brightness(2.5)"
                                    }}
                                />
                                <div className="max-h-[60vh] overflow-y-auto">
                                    {renderDays()}
                                    {renderCells()}
                                </div>
                            </div>
                            <div className="flex items-center justify-between px-6 py-5 border-t border-white/5 pb-10 md:pb-6">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onChange(undefined as unknown as Date);
                                        setIsOpen(false);
                                    }}
                                    className="px-6 py-3 rounded-xl bg-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-colors"
                                >
                                    Clear
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const today = new Date();
                                        onChange(today);
                                        setIsOpen(false);
                                    }}
                                    className="px-8 py-3 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-opacity"
                                >
                                    Today
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
