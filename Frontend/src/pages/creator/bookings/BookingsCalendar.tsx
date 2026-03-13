import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreatorNavbar from "@/compoents/reusable/creatorNavbar";
import { CreatorBookingService } from "@/services/creator/creatorBookingService";
import { UserBooking } from "@/interface/user/userBookingInterface";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    MapPin,
    Package as PackageIcon,
    MessageSquare
} from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO, startOfDay } from "date-fns";
import { toast } from "react-toastify";
import { creatorLeaveService } from "@/services/creator/leaveService";
import { LeaveResponse } from "@/interface/creator/creatorLeaveInterface";
import { ROUTES } from "@/constants/routes";

const BookingsCalendar: React.FC = () => {
    const navigate = useNavigate();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [bookings, setBookings] = useState<UserBooking[]>([]);
    const [leaves, setLeaves] = useState<LeaveResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [bookingsRes, leavesData] = await Promise.all([
                CreatorBookingService.getCreatorBookings(),
                creatorLeaveService.getLeaves()
            ]);
            if (bookingsRes.success) {
                setBookings(bookingsRes.data);
            }
            if (Array.isArray(leavesData)) {
                setLeaves(leavesData);
            }
        } catch (error) {
            console.error("Failed to fetch creator bookings or leaves:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleToggleLeave = async () => {
        try {
            setActionLoading(true);
            const isLeaveDate = leaves.some(l => l.date.split('T')[0] === format(selectedDate, "yyyy-MM-dd"));
            if (isLeaveDate) {
                await creatorLeaveService.removeLeave(selectedDate);
                toast.success("Date unblocked successfully");
            } else {
                await creatorLeaveService.addLeave(selectedDate);
                toast.success("Date blocked successfully");
            }
            fetchData();
        } catch (error: any) {
            console.error("Failed to toggle leave:", error);
            const message = error.response?.data?.message || "Action failed";
            toast.error(message);
        } finally {
            setActionLoading(false);
        }
    };

    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-500">
                        Booking Schedule
                    </h2>
                    <h1 className="text-3xl font-black tracking-tight text-white uppercase">
                        {format(currentMonth, "MMMM yyyy")}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        className="p-3 rounded-xl bg-zinc-900/50 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all"
                    >
                        <ChevronLeft className="w-4 h-4 text-white" />
                    </button>
                    <button
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        className="p-3 rounded-xl bg-zinc-900/50 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all"
                    >
                        <ChevronRight className="w-4 h-4 text-white" />
                    </button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return (
            <div className="grid grid-cols-7 mb-4">
                {days.map((day) => (
                    <div key={day} className="text-center text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-600">
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
                const dayBookings = bookings.filter(b => b.bookingDate.split('T')[0] === format(cloneDay, "yyyy-MM-dd"));
                const isLeaveDay = leaves.some(l => l.date.split('T')[0] === format(cloneDay, "yyyy-MM-dd"));
                const hasBookings = dayBookings.length > 0;

                days.push(
                    <div
                        key={day.toString()}
                        className={`relative h-24 sm:h-32 border border-white/5 p-2 transition-all cursor-pointer ${!isSameMonth(day, monthStart) ? "opacity-20 pointer-events-none" : "hover:bg-white/[0.02]"
                            } ${isSameDay(day, selectedDate) ? "bg-white/[0.05] border-white/20" : ""} ${isLeaveDay ? "bg-rose-950/20" : ""}`}
                        onClick={() => setSelectedDate(cloneDay)}
                    >
                        <span className={`text-xs font-bold ${isSameDay(day, new Date()) ? "text-white" : "text-zinc-500"}`}>
                            {formattedDate}
                        </span>
                        {isLeaveDay && (
                            <div className="absolute top-2 right-2 flex items-center gap-1 text-rose-500/50">
                                <span className="text-[8px] font-bold uppercase tracking-widest hidden sm:block">Unavailable</span>
                            </div>
                        )}
                        {hasBookings && !isLeaveDay && (
                            <div className="mt-2 space-y-1">
                                {dayBookings.slice(0, 2).map((booking, idx) => (
                                    <div
                                        key={idx}
                                        className={`px-2 py-1 rounded-md text-[9px] font-black truncate uppercase tracking-tight ${booking.status === 'cancelled'
                                            ? "bg-rose-500/20 text-rose-500 border border-rose-500/30"
                                            : "bg-white text-black"
                                            }`}
                                    >
                                        {booking.packageDetails?.title || "Booking"}
                                    </div>
                                ))}
                                {dayBookings.length > 2 && (
                                    <div className="text-[8px] font-bold text-zinc-500 pl-1">
                                        + {dayBookings.length - 2} more
                                    </div>
                                )}
                            </div>
                        )}
                        {isSameDay(day, new Date()) && (
                            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
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
        return <div className="rounded-3xl overflow-hidden border border-white/10 bg-zinc-900/20 backdrop-blur-xl">{rows}</div>;
    };

    const renderDetails = () => {
        const selectedDateBookings = bookings.filter(b => b.bookingDate.split('T')[0] === format(selectedDate, "yyyy-MM-dd"));
        const isLeaveDate = leaves.some(l => l.date.split('T')[0] === format(selectedDate, "yyyy-MM-dd"));

        // can only block if it's future or today, and no bookings exist. 
        // to simplify, let's just allow blocking if no bookings for that day.
        const hasBookingsOnDate = selectedDateBookings.length > 0;
        const isPastDate = startOfDay(selectedDate) < startOfDay(new Date());

        return (
            <div className="mt-12">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <CalendarIcon className="w-5 h-5 text-white/40" />
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">
                            Details for {format(selectedDate, "MMMM d, yyyy")}
                        </h2>
                    </div>

                    {!isPastDate && (
                        <button
                            onClick={handleToggleLeave}
                            disabled={actionLoading || (hasBookingsOnDate && !isLeaveDate)}
                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${actionLoading ? "opacity-50 cursor-not-allowed" : ""
                                } ${isLeaveDate
                                    ? "bg-white/10 hover:bg-white/20 text-white"
                                    : hasBookingsOnDate
                                        ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                        : "bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20"
                                }`}
                        >
                            {actionLoading ? "Processing..." : isLeaveDate ? "Unblock Date" : "Mark as Leave"}
                        </button>
                    )}
                </div>

                {isLeaveDate ? (
                    <div className="py-12 px-8 rounded-3xl bg-rose-950/20 border border-rose-500/10 border-dashed text-center">
                        <p className="text-rose-500 font-bold tracking-widest uppercase">You are on leave this day</p>
                        <p className="text-rose-500/60 text-xs mt-2 font-medium">No bookings can be scheduled for this date.</p>
                    </div>
                ) : selectedDateBookings.length === 0 ? (
                    <div className="py-12 px-8 rounded-3xl bg-zinc-900/30 border border-white/5 border-dashed text-center">
                        <p className="text-zinc-500 text-sm font-medium">No bookings scheduled for this date.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {selectedDateBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="group p-6 rounded-3xl bg-zinc-900/40 border border-white/10 hover:border-white/20 transition-all relative overflow-hidden"
                            >
                                <div className="mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <PackageIcon className="w-8 h-8 text-white/20 group-hover:scale-110 transition-transform" />
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-lg font-bold text-white group-hover:text-zinc-200 transition-colors">
                                                    {booking.packageDetails?.title}
                                                </h3>
                                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${booking.status === 'completed'
                                                        ? (startOfDay(parseISO(booking.bookingDate)) < startOfDay(new Date()) 
                                                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                            : "bg-blue-500/10 text-blue-500 border-blue-500/20")
                                                        : booking.status === 'cancelled'
                                                            ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                                        }`}>
                                                        {booking.status === 'completed'
                                                            ? (startOfDay(parseISO(booking.bookingDate)) < startOfDay(new Date()) ? 'Completed' : 'Confirmed')
                                                            : booking.status}
                                                    </span>
                                            </div>
                                            {/* <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                                                Package Reference: {booking.id.toUpperCase()}
                                            </p> */}
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Client Information</span>
                                            <p className="text-sm font-black text-white">{booking.userDetails?.name || "Anonymous Client"}</p>
                                            <p className="text-[11px] text-zinc-400 font-medium">{booking.userDetails?.email}</p>
                                            {booking.userDetails?.phone && (
                                                <p className="text-[11px] text-zinc-500">{booking.userDetails.phone}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-x-4 gap-y-6 mb-6">
                                    <div className="space-y-1">
                                        <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Scheduled Date</span>
                                        <div className="flex items-center gap-2 text-white">
                                            <CalendarIcon className="w-3 h-3 text-zinc-500" />
                                            <span className="text-xs font-bold">{format(parseISO(booking.bookingDate), "MMM d, yyyy")}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Booked On</span>
                                        <div className="flex items-center gap-2 text-white">
                                            <CalendarIcon className="w-3 h-3 text-zinc-500" />
                                            <span className="text-xs font-bold">{format(parseISO(booking.createdAt), "MMM d, yyyy")}</span>
                                        </div>
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Location</span>
                                        <div
                                            className="flex items-center gap-2 text-white cursor-pointer group/loc"
                                            onClick={() => {
                                                if (booking.location && booking.location !== "Online/TBD") {
                                                    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.location)}`, '_blank');
                                                }
                                            }}
                                        >
                                            <MapPin className="w-3 h-3 text-zinc-500 group-hover/loc:text-white transition-colors" />
                                            <span className="text-xs font-bold group-hover/loc:underline decoration-white/20 underline-offset-4">
                                                {booking.location || "Online/TBD"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Total Amount</span>
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="w-3.5 h-3.5 text-zinc-500" />
                                            <span className="text-base font-black text-white">₹{booking.amount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    {booking.status === 'completed' && (
                                        <button
                                            onClick={() => navigate(`${ROUTES.CREATOR.CHAT}?bookingId=${booking.id}`)}
                                            className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group/msg"
                                            title="Message Client"
                                        >
                                            <MessageSquare className="w-4 h-4 text-white group-hover/msg:scale-110 transition-transform" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
            <CreatorNavbar />
            <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <div className="flex items-center gap-2">
                            {[0, 150, 300].map((d, i) => (
                                <div key={i} className="w-1 bg-white animate-pulse rounded-full"
                                    style={{ height: i === 1 ? 40 : 24, animationDelay: `${d}ms` }} />
                            ))}
                        </div>
                        <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-zinc-500">Syncing Schedule</p>
                    </div>
                ) : (
                    <>
                        {renderHeader()}
                        {renderDays()}
                        {renderCells()}
                        {renderDetails()}
                    </>
                )}
            </main>
        </div>
    );
};

export default BookingsCalendar;
