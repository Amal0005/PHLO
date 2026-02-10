import React, { useEffect, useState } from "react";
import { ArrowLeft, Package as PackageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CreatorPackageService } from "@/services/creator/creatorPackageService";
import CreatorNavbar from "@/compoents/reusable/creatorNavbar";
import { ROUTES } from "@/constants/routes";
import { S3Media } from "@/compoents/reusable/s3Media";

const ViewPackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await CreatorPackageService.getPackage();
        if (response?.success) {
          setPackages(response.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch packages", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <CreatorNavbar />

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate(ROUTES.CREATOR.DASHBOARD)}
              className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>

            <div>
              <h1 className="text-4xl font-black mb-1">My Packages</h1>
              <p className="text-gray-500 font-medium">
                Manage and monitor your professional offerings
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-gray-400">
              {packages.length} Active Packages
            </span>
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
          </div>
        ) : packages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <PackageIcon size={48} className="text-gray-600 mb-4" />
            <h3 className="text-2xl font-black mb-2">No Packages Found</h3>
            <button
              onClick={() => navigate(ROUTES.CREATOR.DASHBOARD)}
              className="px-6 py-3 bg-white text-black rounded-xl font-bold"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg._id}
                className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all"
              >
                {/* IMAGE */}
                <div className="h-48 bg-zinc-800 relative">
                  {pkg.images?.length > 0 ? (
                    <S3Media
                      s3Key={pkg.images[0]}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                      <PackageIcon size={40} />
                    </div>
                  )}

                  {/* STATUS */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        pkg.status === "approved"
                          ? "bg-green-500 text-white"
                          : pkg.status === "rejected"
                          ? "bg-red-500 text-white"
                          : "bg-yellow-500 text-black"
                      }`}
                    >
                      {pkg.status || "pending"}
                    </span>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  <h4 className="font-black text-xl mb-2 line-clamp-1">
                    {pkg.title}
                  </h4>

                  <p className="text-gray-500 text-sm line-clamp-2 mb-6">
                    {pkg.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-black">
                      ₹ {pkg.price ? pkg.price.toLocaleString() : 0}
                    </div>

                    {/* EXTRA IMAGES */}
                    {pkg.images?.length > 1 && (
                      <div className="flex -space-x-3">
                        {pkg.images.slice(1, 4).map((img: string, i: number) => (
                          <div
                            key={i}
                            className="w-9 h-9 rounded-full border-2 border-zinc-900 overflow-hidden"
                          >
                            <S3Media s3Key={img} className="w-full h-full" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ViewPackagesPage;
