import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package as PackageIcon, MapPin, Calendar, Image as ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { UserPackageService } from "@/services/user/userPackageService";
import { UserPackage } from "@/interface/user/userPackageInterface";
import { S3Media } from "@/compoents/reusable/s3Media";
import UserNavbar from "@/compoents/reusable/userNavbar";
import { BookingService } from "@/services/user/bookingService";
import { toast } from "react-toastify";

const PackageDetailPage: React.FC = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState<UserPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    const fetchPackageDetail = async () => {
      try {
        setLoading(true);
        const response = await UserPackageService.getPackageById(packageId!);
        if (response?.success) {
          setPackageData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch package details", error);
      } finally {
        setLoading(false);
      }
    };
    if (packageId) fetchPackageDetail();
  }, [packageId]);

  const handleBooking = async () => {
    try {
      const baseUrl = window.location.origin;
      const response = await BookingService.createBooking(packageId!, baseUrl);
      if (response.url) window.location.href = response.url;
    } catch (error) {
      toast.error("Failed to initiate booking. Please try again.");
      console.error("Booking failed", error);
    }
  };

  const prevImage = () => {
    if (!packageData?.images?.length) return;
    setSelectedImage((prev) => (prev - 1 + packageData.images.length) % packageData.images.length);
  };

  const nextImage = () => {
    if (!packageData?.images?.length) return;
    setSelectedImage((prev) => (prev + 1) % packageData.images.length);
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#080808] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-white animate-pulse" style={{ animationDelay: "0ms" }} />
          <div className="w-1 h-10 bg-white animate-pulse" style={{ animationDelay: "150ms" }} />
          <div className="w-1 h-6 bg-white animate-pulse" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="h-screen bg-[#080808] flex flex-col items-center justify-center gap-4">
        <PackageIcon className="w-12 h-12 text-zinc-700" />
        <p className="text-zinc-400 text-sm tracking-widest uppercase">Package not found</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2 border border-zinc-700 text-white text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all">
          Go Back
        </button>
      </div>
    );
  }

  const totalImages = packageData.images?.length || 0;

  return (
    <>
      {/* Full-screen container — no scroll */}
      <div className="h-screen bg-[#080808] text-white flex flex-col overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* Navbar */}
        <UserNavbar />

        {/* Spacer to account for fixed navbar height (~80px) */}
        <div className="flex-shrink-0 h-20" />

        {/* Content — fills remaining height */}
        <div className="flex-1 overflow-hidden flex flex-col px-6 lg:px-10 pb-4 pt-2" style={{ minHeight: 0 }}>

          {/* Top bar */}
          <div className="flex items-center justify-between py-2 flex-shrink-0">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center group-hover:border-zinc-500 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
              </div>
              <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-zinc-500 group-hover:text-zinc-300 transition-colors">Back to Explore</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                {typeof packageData.category === 'object' ? packageData.category.name : packageData.category}
              </span>
            </div>
          </div>

          {/* Main 3-column grid */}
          <div className="flex-1 grid grid-cols-[1fr_auto_1fr] lg:grid-cols-[5fr_1px_4fr] gap-0 overflow-hidden" style={{ minHeight: 0 }}>

            {/* ── LEFT: Info Panel ── */}
            <div className="flex flex-col justify-between pr-8 lg:pr-12 overflow-hidden py-2 gap-4">

              {/* Title */}
              <div>
                <h1
                  className="font-black leading-[0.88] tracking-tighter uppercase text-white"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 3.5rem)", letterSpacing: "-0.03em" }}
                >
                  {packageData.title}
                </h1>
              </div>

              {/* Creator row */}
              {typeof packageData.creatorId === 'object' && (
                <div className="flex items-center gap-3 py-3 border-y border-zinc-900">
                  <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-zinc-800 flex-shrink-0">
                    {packageData.creatorId.profilePhoto ? (
                      <S3Media s3Key={packageData.creatorId.profilePhoto} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-white font-black text-sm">
                        {packageData.creatorId.fullName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-black tracking-wider uppercase text-white">{packageData.creatorId.fullName}</div>
                    {packageData.placeName && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 text-zinc-600" />
                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-semibold">{packageData.placeName}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description card */}
              <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-4 flex-1 overflow-hidden">
                <p className="text-[9px] font-black tracking-[0.3em] uppercase text-zinc-600 mb-2">Overview</p>
                <p className="text-zinc-300 text-[11px] leading-[1.75] overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical' }}>
                  {packageData.description}
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                  </div>
                  <div>
                    <div className="text-[8px] text-zinc-600 uppercase tracking-widest font-bold">Established</div>
                    <div className="text-white text-[10px] font-black uppercase tracking-tight mt-0.5">
                      {new Date(packageData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="w-3.5 h-3.5 text-zinc-600" />
                  </div>
                  <div>
                    <div className="text-[8px] text-zinc-600 uppercase tracking-widest font-bold">Assets</div>
                    <div className="text-white text-[10px] font-black uppercase tracking-tight mt-0.5">
                      {totalImages} Photos
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing + CTA */}
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] text-emerald-500 font-bold uppercase tracking-[0.2em]">Active Package</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[10px] text-zinc-500 font-bold">₹</span>
                    <span className="font-black text-white tracking-tighter" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                      {packageData.price.toLocaleString()}
                    </span>
                    <span className="text-zinc-600 text-[9px] font-bold uppercase tracking-wider">/pkg</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 items-end">
                  <button
                    onClick={handleBooking}
                    className="px-6 py-3 bg-white text-black font-black text-[10px] tracking-[0.2em] uppercase rounded-xl hover:bg-zinc-100 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                  >
                    Book Package
                  </button>
                  <button className="text-[9px] text-zinc-600 hover:text-white font-bold tracking-widest uppercase transition-colors">
                    Contact Creator →
                  </button>
                </div>
              </div>
            </div>

            {/* ── CENTER: Divider ── */}
            <div className="w-px bg-zinc-900 mx-2 self-stretch" />

            {/* ── RIGHT: Image Panel ── */}
            <div className="flex flex-col pl-8 lg:pl-12 py-2 overflow-hidden" style={{ minHeight: 0 }}>

              {/* Main image */}
              <div className="relative flex-1 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-900 group" style={{ minHeight: 0 }}>
                {totalImages > 0 ? (
                  <S3Media
                    s3Key={packageData.images[selectedImage]}
                    alt={packageData.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PackageIcon className="w-16 h-16 text-zinc-800" />
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Gallery button */}
                {totalImages > 1 && (
                  <button
                    onClick={() => setShowGallery(true)}
                    className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/70 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-black tracking-[0.2em] hover:bg-black/90 transition-all"
                  >
                    <ImageIcon className="w-3 h-3" />
                    GALLERY
                  </button>
                )}

                {/* Prev/Next arrows */}
                {totalImages > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Image counter badge */}
                {totalImages > 0 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/70 backdrop-blur-md rounded-full">
                    <span className="text-[9px] font-black tracking-[0.3em] text-zinc-300 uppercase">
                      {selectedImage + 1} / {totalImages}
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail strip */}
              {totalImages > 1 && (
                <div className="flex items-center gap-2 mt-3 flex-shrink-0 overflow-x-auto pb-1 scrollbar-hide">
                  {packageData.images.slice(0, 6).map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImage === index
                          ? "border-white scale-110 shadow-lg shadow-white/10"
                          : "border-zinc-800 opacity-40 hover:opacity-80 hover:scale-105"
                      }`}
                    >
                      <S3Media s3Key={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                  {totalImages > 6 && (
                    <button
                      onClick={() => setShowGallery(true)}
                      className="flex-shrink-0 w-10 h-10 rounded-lg border border-zinc-800 flex items-center justify-center text-[9px] font-black text-zinc-500 hover:text-white hover:border-white transition-all bg-zinc-950/50"
                    >
                      +{totalImages - 6}
                    </button>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 overflow-y-auto">
          <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black tracking-tight uppercase">{packageData.title}</h3>
                  <p className="text-xs text-zinc-500 tracking-widest uppercase mt-1">{totalImages} images</p>
                </div>
                <button
                  onClick={() => setShowGallery(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors border border-zinc-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {packageData.images?.map((img, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(index);
                    setShowGallery(false);
                  }}
                  className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.02] ${
                    selectedImage === index ? "border-white" : "border-zinc-800 hover:border-zinc-600"
                  }`}
                >
                  <S3Media s3Key={img} alt={`${packageData.title} ${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-black/80 flex items-center justify-center text-[9px] font-black opacity-0 group-hover:opacity-100 transition-opacity">
                    {index + 1}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PackageDetailPage;