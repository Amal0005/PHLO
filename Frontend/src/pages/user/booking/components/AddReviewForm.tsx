import React, { useState, useEffect } from "react";
import { Star, MessageSquare, Send, Trash2 } from "lucide-react";
import { ReviewService } from "@/services/user/reviewService";
import { toast } from "react-toastify";
import { Review } from "@/interface/user/reviewInterface";
import ConfirmModal from "@/components/reusable/ConfirmModal";

interface AddReviewFormProps {
    packageId: string | object;
    bookingId: string;
    onSuccess?: () => void;
}

const AddReviewForm: React.FC<AddReviewFormProps> = ({ packageId, bookingId, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [hoverRating, setHoverRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [existingReview, setExistingReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchExistingReview = async () => {
            try {
                setLoading(true);
                const response = await ReviewService.getBookingReview(bookingId);
                if (response.success && response.data) {
                    setExistingReview(response.data);
                    setRating(response.data.rating);
                    setComment(response.data.comment);
                }
            } catch (error) {
                console.error("Failed to fetch existing review:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExistingReview();
    }, [bookingId]);

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.warning("Please select a rating");
            return;
        }
        if (!comment.trim()) {
            toast.warning("Please enter a comment");
            return;
        }

        try {
            setSubmitting(true);
            
            // Ensure packageId is an ID string, even if the prop is a populated object
            const cleanPackageId = typeof packageId === 'object' 
                ? (packageId as { _id?: string; id?: string })._id || (packageId as { _id?: string; id?: string }).id 
                : packageId;

            let response;
            if (existingReview) {
                response = await ReviewService.updateReview(existingReview.id, {
                    rating,
                    comment,
                });
            } else {
                response = await ReviewService.addReview({
                    packageId: cleanPackageId!,
                    bookingId,
                    rating,
                    comment,
                });
            }

            if (response.success) {
                toast.success(existingReview ? "Review updated successfully!" : "Review submitted successfully!");
                setIsEditing(false);
                const fresh = await ReviewService.getBookingReview(bookingId);
                if (fresh.success) setExistingReview(fresh.data);
                if (onSuccess) onSuccess();
            }
        } catch (error: unknown) {
            let msg = existingReview ? "Failed to update review" : "Failed to submit review";
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response: { data: { message?: string } } };
                msg = axiosError.response?.data?.message || msg;
            }
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async () => {
        if (!existingReview) return;
        try {
            setSubmitting(true);
            const response = await ReviewService.deleteReview(existingReview.id);
            if (response.success) {
                toast.success("Review deleted");
                setExistingReview(null);
                setRating(0);
                setComment("");
                setIsEditing(false);
            }
        } catch {
            toast.error("Failed to delete review");
        } finally {
            setSubmitting(false);
            setIsDeleteModalOpen(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-zinc-500 text-xs font-bold uppercase tracking-widest">Loading Review...</div>;
    }

    if (existingReview && !isEditing) {
        return (
            <>
                <div className="p-8 rounded-[2.5rem] bg-zinc-900/30 border border-zinc-800 backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
                            <MessageSquare className="w-3.5 h-3.5" />
                            Your Review
                        </h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 sm:p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl sm:rounded-2xl transition-all active:scale-90"
                                title="Edit Review"
                            >
                                <Send className="w-3 sm:w-3.5 h-3 sm:h-3.5 -rotate-45" />
                            </button>
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                disabled={submitting}
                                className="p-2 sm:p-3 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl sm:rounded-2xl transition-all active:scale-90 disabled:opacity-50"
                                title="Delete Review"
                            >
                                <Trash2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                    key={s}
                                    className={`w-6 h-6 ${s <= existingReview.rating ? "text-yellow-500 fill-yellow-500" : "text-zinc-800"}`}
                                />
                            ))}
                        </div>
                        <p className="text-zinc-400 text-sm leading-relaxed font-medium break-all whitespace-pre-wrap">
                            "{existingReview.comment}"
                        </p>
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest pt-4 border-t border-zinc-800/50">
                            Posted on {new Date(existingReview.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <ConfirmModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteReview}
                    title="Delete Review"
                    message="Are you sure you want to delete your review? This action cannot be undone."
                    confirmLabel="Delete Review"
                    cancelLabel="Keep Review"
                    variant="danger"
                    loading={submitting}
                />
            </>
        );
    }

    return (
        <div className="p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-zinc-900/30 border border-zinc-800 backdrop-blur-xl relative overflow-hidden group transition-all duration-500">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

            <div className="flex justify-between items-center mb-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {isEditing ? "Update your review" : "Review your experience"}
                </h3>
                {isEditing && (
                    <button
                        onClick={() => setIsEditing(false)}
                        className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmitReview} className="relative z-10 space-y-8">
                <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-4 ml-1">Overall Rating</p>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <button
                                key={s}
                                type="button"
                                onMouseEnter={() => !('ontouchstart' in window) && setHoverRating(s)}
                                onMouseLeave={() => !('ontouchstart' in window) && setHoverRating(0)}
                                onClick={() => setRating(s)}
                                className="relative z-30 p-2 sm:p-2.5 transition-transform active:scale-95 touch-manipulation cursor-pointer"
                            >
                                <Star
                                    className={`w-9 h-9 sm:w-11 sm:h-11 transition-all duration-300 pointer-events-none ${s <= (hoverRating || rating)
                                        ? "text-yellow-500 fill-yellow-500 scale-110 drop-shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                                        : "text-zinc-800"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-4 ml-1">Your Feedback</p>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell us about the session... What did you love most?"
                        className="w-full bg-black/40 border border-zinc-800 rounded-[1.5rem] p-5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all min-h-[140px] resize-none placeholder:text-zinc-700 font-medium"
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 flex items-center justify-center gap-3 bg-white text-black py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:shadow-[0_10px_40px_rgba(255,255,255,0.1)] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {submitting ? (isEditing ? "Updating..." : "Sharing...") : (isEditing ? "Update Review" : "Post Review")}
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddReviewForm;

