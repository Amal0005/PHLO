import React, { useState, useEffect } from "react";
import { Star, MessageSquare, Send, Trash2, User as UserIcon } from "lucide-react";
import { Review } from "@/interface/user/reviewInterface";
import { BookingService } from "@/services/user/bookingService";
import { UserBooking } from "@/interface/user/userBookingInterface";
import { toast } from "react-toastify";
import { S3Media } from "@/compoents/reusable/s3Media";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { motion, AnimatePresence } from "framer-motion";
import { ReviewService } from "@/services/user/reviewService";

interface ReviewSectionProps {
    packageId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ packageId }) => {
    const user = useSelector((state: RootState) => state.user.user);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [reviewableBookingId, setReviewableBookingId] = useState<string | null>(null);

    // Form State
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [hoverRating, setHoverRating] = useState(0);

    const fetchReviews = async () => {
        try {
            const response = await ReviewService.getPackageReviews(packageId);
            if (response.success) {
                setReviews(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setLoading(false);
        }
    };

    const checkReviewEligibility = async () => {
        if (!user) return;
        try {
            const response = await BookingService.getUserBookings();
            if (response.success) {
                const eligibleBooking = response.data.find(
                    (b: UserBooking) =>
                        b.packageId === packageId &&
                        b.status === "completed" &&
                        new Date(b.bookingDate) < new Date()
                );

                if (eligibleBooking) {
                    setReviewableBookingId(eligibleBooking.id);
                }
            }
        } catch (error) {
            console.error("Failed to check review eligibility", error);
        }
    };

    useEffect(() => {
        fetchReviews();
        checkReviewEligibility();
    }, [packageId, user]);

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please login to submit a review");
            return;
        }
        if (rating === 0) {
            toast.warning("Please select a rating");
            return;
        }
        if (!comment.trim()) {
            toast.warning("Please enter a comment");
            return;
        }
        if (!reviewableBookingId) {
            toast.error("You are not eligible to review this package");
            return;
        }

        try {
            setSubmitting(true);
            const response = await ReviewService.addReview({
                packageId,
                bookingId: reviewableBookingId,
                rating,
                comment,
            });

            if (response.success) {
                toast.success("Review submitted successfully!");
                setRating(0);
                setComment("");
                setReviewableBookingId(null);
                fetchReviews();
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || "Failed to submit review";
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        try {
            const response = await ReviewService.deleteReview(reviewId);
            if (response.success) {
                toast.success("Review deleted");
                fetchReviews();
            }
        } catch (error) {
            toast.error("Failed to delete review");
        }
    };

    return (
        <div className="mt-10 w-full pt-10" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-lg font-black uppercase tracking-tight text-white">Guest Reviews</h2>
                    <p className="text-[8px] font-bold tracking-[0.3em] uppercase opacity-30 mt-1">
                        {reviews.length} Feedbacks
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-xl font-black text-white">
                            {reviews.length > 0
                                ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                                : "0.0"}
                        </span>
                        <div className="flex gap-0.5 mt-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                    key={s}
                                    className={`w-2 h-2 ${s <= (reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1))
                                            ? "text-yellow-500 fill-yellow-500"
                                            : "text-zinc-800"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {reviewableBookingId && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="mb-10 p-6 rounded-2xl relative overflow-hidden group"
                        style={{
                            background: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            backdropFilter: "blur(12px)"
                        }}
                    >
                        <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 mb-5 flex items-center gap-2">
                            <MessageSquare className="w-3 h-3" />
                            Write a review
                        </h3>

                        <form onSubmit={handleSubmitReview} className="relative z-10">
                            <div className="flex flex-col gap-5">
                                <div>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onMouseEnter={() => setHoverRating(s)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                onClick={() => setRating(s)}
                                                className="transition-transform active:scale-95"
                                            >
                                                <Star
                                                    className={`w-6 h-6 transition-all duration-300 ${s <= (hoverRating || rating)
                                                            ? "text-yellow-500 fill-yellow-500 scale-110"
                                                            : "text-zinc-800"
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Your feedback..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-[12px] text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all min-h-[100px] resize-none placeholder:text-white/10"
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        disabled={submitting}
                                        className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {submitting ? "..." : "Submit"}
                                        <Send className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white/10 border-t-white rounded-full"
                        />
                    </div>
                ) : reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={review.id}
                            className="p-5 rounded-xl transition-all duration-500 hover:bg-white/[0.02]"
                            style={{
                                border: "1px solid rgba(255, 255, 255, 0.04)"
                            }}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-zinc-900 flex items-center justify-center">
                                        {review.userPhoto ? (
                                            <S3Media s3Key={review.userPhoto} className="w-full h-full object-cover" />
                                        ) : (
                                            <UserIcon className="w-4 h-4 text-white/10" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-bold text-white uppercase">{review.userName}</h4>
                                        <p className="text-[8px] font-medium text-white/30 uppercase tracking-widest">
                                            {new Date(review.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} className={`w-2 h-2 ${s <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-zinc-800"}`} />
                                        ))}
                                    </div>
                                    {user && user.id === review.userId && (
                                        <button
                                            onClick={() => handleDeleteReview(review.id)}
                                            className="p-1.5 hover:bg-rose-500/10 rounded-lg group/del"
                                        >
                                            <Trash2 className="w-3 h-3 text-rose-500/40 group-hover/del:text-rose-400" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <p className="text-[11px] leading-relaxed text-white/50 font-medium">
                                {review.comment}
                            </p>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-10 border border-dashed border-white/5 rounded-2xl">
                        <MessageSquare className="w-6 h-6 text-white/5 mx-auto mb-3" />
                        <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/20">No reviews yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewSection;
