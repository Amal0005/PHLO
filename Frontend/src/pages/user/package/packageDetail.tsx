import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package as PackageIcon } from "lucide-react";
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

  useEffect(() => {
    if (packageId) {
      fetchPackageDetail();
    }
  }, [packageId]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <PackageIcon size={48} className="text-gray-600 mb-4" />
        <h3 className="text-2xl font-black mb-2">Package Not Found</h3>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-white text-black rounded-xl font-bold mt-4"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <UserNavbar />

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-bold">Back to Packages</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="h-96 bg-zinc-900 rounded-3xl overflow-hidden mb-4">
              {packageData.images?.length > 0 ? (
                <S3Media
                  s3Key={packageData.images[selectedImage]}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-700">
                  <PackageIcon size={60} />
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {packageData.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {packageData.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`h-24 bg-zinc-900 rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === index
                        ? "border-white"
                        : "border-white/10 hover:border-white/30"
                      }`}
                  >
                    <S3Media s3Key={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Package Details */}
          <div>
            {/* Category Badge */}
            <span className="inline-block px-4 py-2 bg-white/10 text-white text-sm font-bold rounded-full mb-4">
              {typeof packageData.category === 'object' ? packageData.category.name : packageData.category}
            </span>

            <h1 className="text-5xl font-black mb-4">{packageData.title}</h1>

            {/* Creator Info */}
            {typeof packageData.creatorId === 'object' && (
              <div className="text-lg text-gray-400 mb-6">
                by <span className="text-white font-semibold">{packageData.creatorId.fullName}</span>
                {packageData.creatorId.city && <span> • {packageData.creatorId.city}</span>}
              </div>
            )}

            <div className="text-4xl font-black mb-8">
              ₹ {packageData.price.toLocaleString()}
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-black mb-3">Description</h3>
              <p className="text-gray-400 leading-relaxed">
                {packageData.description}
              </p>
            </div>

            {/* Call to Action */}
            <div className="space-y-4">
              <button className="w-full px-6 py-4 bg-white text-black rounded-2xl font-black text-lg hover:bg-gray-200 transition-colors">
                Book This Package
              </button>
              <button className="w-full px-6 py-4 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-colors">
                Contact Creator
              </button>
            </div>

            {/* Package Info */}
            <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
              <h4 className="font-black mb-4">Package Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Created</span>
                  <span className="font-bold">
                    {new Date(packageData.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Updated</span>
                  <span className="font-bold">
                    {new Date(packageData.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PackageDetailPage;
