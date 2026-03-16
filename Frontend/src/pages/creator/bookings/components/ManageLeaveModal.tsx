import React, { useState } from "react";
import { toast } from "react-toastify";
import { creatorLeaveService } from "@/services/creator/leaveService";
import { X, Loader2, AlertCircle } from "lucide-react";
import { startOfDay } from "date-fns";

import { CustomCalendar } from "@/compoents/reusable/CustomCalendar";
import { format } from "date-fns";

interface ManageLeaveModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const ManageLeaveModal: React.FC<ManageLeaveModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const handleAddLeave = async () => {
        if (!selectedDate) {
            toast.warning("Please select a date");
            return;
        }

        const dateObj = new Date(selectedDate);
        if (startOfDay(dateObj) < startOfDay(new Date())) {
            toast.warning("Cannot block past dates");
            return;
        }

        try {
            setLoading(true);
            await creatorLeaveService.addLeave(dateObj);
            toast.success("Date blocked successfully");
            if (onSuccess) onSuccess();
            onClose();
            setSelectedDate("");
        } catch (error: unknown) {
            const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to add leave";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-zinc-900 border border-white/10 p-6 md:p-8 rounded-3xl w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-white leading-none mb-2">
                            Manage Absence
                        </h2>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Block dates on your calendar</p>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                        <p className="text-[11px] text-amber-500/80 leading-relaxed font-medium">
                            Blocking a date will prevent any new bookings for that specific day. Existing bookings will not be affected.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                            Select Date to Block
                        </label>
                        <CustomCalendar
                            selectedDate={selectedDate ? new Date(selectedDate) : undefined}
                            onChange={(date) => {
                                if (!date) {
                                    setSelectedDate("");
                                    return;
                                }
                                setSelectedDate(format(date, "yyyy-MM-dd"));
                            }}
                            minDate={new Date()}
                            placeholder="Select date to block"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-4 bg-zinc-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-700 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddLeave}
                            disabled={loading || !selectedDate}
                            className="flex-1 px-6 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Block Date"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
