import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package as PackageIcon, MapPin, Calendar, Image as ImageIcon, X } from "lucide-react";
import { UserPackageService } from "@/services/user/userPackageService";
import { UserPackage } from "@/interface/user/userPackageInterface";
import { S3Media } from "@/compoents/reusable/s3Media";
import UserNavbar from "@/compoents/reusable/userNavbar";

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

    if (packageId) {
      fetchPackageDetail();
    }
  }, [packageId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg font-light tracking-wide">Loading...</div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <PackageIcon className="w-16 h-16 text-gray-700 mb-4" />
        <h2 className="text-white text-2xl mb-2 font-light tracking-wide">Package Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-white text-black rounded-full font-medium mt-4 hover:bg-gray-200 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        <UserNavbar />

        <div className="pt-24 pb-20">
          <div className="max-w-[1600px] mx-auto px-8">

            {/* Top Bar */}
            <div className="flex items-center justify-between mb-12">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center group-hover:border-white transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium tracking-wide">BACK</span>
              </button>

              <span className="px-5 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-bold uppercase tracking-widest text-gray-400">
                {typeof packageData.category === 'object'
                  ? packageData.category.name
                  : packageData.category}
              </span>
            </div>

            {/* Main Grid Layout */}
            <div className="grid lg:grid-cols-2 gap-16">

              {/* LEFT COLUMN - Content First */}
              <div className="space-y-10 lg:pr-8">

                {/* Title Section */}
                <div className="space-y-6">
                  <h1 className="text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight">
                    {packageData.title}
                  </h1>

                  {/* Creator Info */}
                  {typeof packageData.creatorId === 'object' && (
                    <div className="flex items-center gap-4 pt-4">
                      {packageData.creatorId.profilePhoto ? (
                        <div className="w-16 h-16 rounded-full overflow-hidden border border-zinc-800 shadow-xl">
                          <S3Media
                            s3Key={packageData.creatorId.profilePhoto}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xl shadow-xl">
                          {packageData.creatorId.fullName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Creator</div>
                        <div className="font-semibold text-xl">{packageData.creatorId.fullName}</div>
                        {packageData.placeName && (
                          <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>{packageData.placeName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

                {/* Description */}
                <div className="space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Package Overview</h2>
                  <p className="text-gray-300 text-lg leading-relaxed font-light">
                    {packageData.description}
                  </p>
                </div>

                {/* Package Details Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Created</div>
                    <div className="flex items-center gap-2 text-white font-medium">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{new Date(packageData.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}</span>
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Updated</div>
                    <div className="flex items-center gap-2 text-white font-medium">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{new Date(packageData.updatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}</span>
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 col-span-2">
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Total Images</div>
                    <div className="flex items-center gap-2 text-white font-medium">
                      <ImageIcon className="w-4 h-4 text-gray-500" />
                      <span>{packageData.images?.length || 0} Photos</span>
                    </div>
                  </div>
                </div>

                {/* Pricing Card */}
                <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-3xl p-8 space-y-6">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Package Investment</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-bold tracking-tight">₹{packageData.price.toLocaleString()}</span>
                      <span className="text-gray-500 font-medium text-lg">/pkg</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button className="w-full bg-white text-black py-5 rounded-2xl font-bold text-base hover:bg-gray-200 transition-all hover:scale-[1.02] shadow-2xl">
                      Book This Package
                    </button>
                    <button className="w-full bg-zinc-800 text-white py-5 rounded-2xl font-bold text-base hover:bg-zinc-700 transition-all border border-zinc-700">
                      Contact Creator
                    </button>
                  </div>

                  <div className="pt-6 border-t border-zinc-800">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span>Available for immediate booking</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN - Images */}
              <div className="space-y-4">

                {/* Main Image */}
                <div className="relative group">
                  <div className="aspect-[3/4] bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800">
                    {packageData.images?.length > 0 ? (
                      <S3Media
                        s3Key={packageData.images[selectedImage]}
                        alt={packageData.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PackageIcon className="w-24 h-24 text-gray-800" />
                      </div>
                    )}
                  </div>

                  {/* Floating View All Button */}
                  {packageData.images?.length > 1 && (
                    <button
                      onClick={() => setShowGallery(true)}
                      className="absolute top-6 right-6 px-6 py-3 bg-black/80 backdrop-blur-xl border border-white/20 rounded-full text-sm font-bold hover:bg-black transition-all flex items-center gap-2 shadow-2xl"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>VIEW ALL {packageData.images.length}</span>
                    </button>
                  )}
                </div>

                {/* Thumbnail Grid */}
                {packageData.images?.length > 1 && (
                  <div className="grid grid-cols-5 gap-3">
                    {packageData.images.slice(0, 5).map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-xl overflow-hidden transition-all border-2 ${selectedImage === index
                          ? "border-white scale-95 opacity-100"
                          : "border-transparent opacity-50 hover:opacity-100 hover:scale-105"
                          }`}
                      >
                        <S3Media
                          s3Key={img}
                          alt={`${packageData.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Image Counter */}
                {packageData.images?.length > 0 && (
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
                    <span>IMAGE {selectedImage + 1} OF {packageData.images.length}</span>
                  </div>
                )}

              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
          <div className="min-h-screen p-8">

            {/* Modal Header */}
            <div className="max-w-7xl mx-auto mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight mb-1">Photo Gallery</h3>
                  <p className="text-sm text-gray-500">{packageData.images?.length || 0} images available</p>
                </div>
                <button
                  onClick={() => setShowGallery(false)}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors border border-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packageData.images?.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index);
                      setShowGallery(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group relative aspect-square rounded-2xl overflow-hidden hover:scale-105 transition-all border border-zinc-800 hover:border-white"
                  >
                    <S3Media
                      s3Key={img}
                      alt={`${packageData.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {index + 1}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PackageDetailPage;
