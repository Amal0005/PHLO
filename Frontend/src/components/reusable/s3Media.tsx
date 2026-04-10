import { useEffect, useState } from "react";
import { S3Service } from "@/services/s3Service";
import { FileText, AlertCircle } from "lucide-react";
import logo from "@/assets/images/Logo_white.png";

interface Props {
  s3Key: string;
  className?: string;
  alt?: string;
  type?: "image" | "document";
}

export const S3Media = ({ s3Key, className, alt, type = "image" }: Props) => {
  const [url, setUrl] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [isBrowserLoading, setIsBrowserLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!s3Key) {
      setUrl(null);
      setHasError(false);
      setIsBrowserLoading(false);
      return;
    }

    let actualKey = s3Key;
    setHasError(false);
    setIsBrowserLoading(true);

    if (s3Key.startsWith("http")) {
      // If it already has a signature, don't try to re-sign it
      if (s3Key.includes("X-Amz-Signature") || s3Key.includes("Signature=")) {
        setUrl(s3Key);
        setIsSigning(false);
        setIsBrowserLoading(false);
        return;
      }

      const s3Match = s3Key.match(/amazonaws\.com\/(.+)$/);
      if (s3Match && s3Match[1]) {
        // Strip query params if any were captured
        actualKey = decodeURIComponent(s3Match[1].split('?')[0]);
      } else {
        setUrl(s3Key);
        setIsSigning(false);
        setIsBrowserLoading(false);
        return;
      }
    }

    let isMounted = true;
    setIsSigning(true);

    S3Service.getViewUrl(actualKey)
      .then((signedUrl) => {
        if (isMounted) {
          if (!signedUrl) {
            if (!s3Key.startsWith("http")) setHasError(true);
            else setUrl(s3Key);
          } else {
            setUrl(signedUrl);
          }
          setIsSigning(false);
        }
      })
      .catch((err) => {
        console.error(`[S3Media] S3 sign error for ${actualKey}:`, err);
        if (isMounted) {
          setIsSigning(false);
          if (s3Key.startsWith("http")) setUrl(s3Key);
          else setHasError(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [s3Key]);

  // Loading Placeholder
  if (isSigning) {
    return (
      <div className={`${className} bg-zinc-950 flex items-center justify-center overflow-hidden animate-pulse relative border border-white/5`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent w-1/2 phlo-image-shimmer" />
        <img src={logo} alt="PHLO" className="w-12 h-auto opacity-10 grayscale brightness-200" />
      </div>
    );
  }

  // Error State
  if (hasError || (!url && !isSigning)) {
    return (
      <div className={`${className} bg-zinc-950 flex flex-col items-center justify-center gap-2 border border-white/5`}>
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
          <AlertCircle className="w-5 h-5 text-zinc-700" />
        </div>
        <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest pl-1">Error Loading</span>
      </div>
    );
  }

  // Document Link
  if (type === "document") {
    return (
      <a
        href={url!}
        target="_blank"
        rel="noreferrer"
        className="text-white/80 hover:text-white underline text-xs transition-all flex items-center gap-3 font-bold group bg-white/5 px-4 py-2 rounded-xl border border-white/5"
      >
        <FileText size={16} className="text-white/40 group-hover:text-white group-hover:scale-110 transition-all" />
        VIEW DOCUMENT
      </a>
    );
  }

  // Main Image with Fade-in Effect
  return (
    <div className={`${className} relative overflow-hidden group`}>
      {/* Background Skeleton while browser is fetching pixel data */}
      {isBrowserLoading && (
        <div className="absolute inset-0 bg-zinc-950 flex items-center justify-center animate-pulse z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent w-full h-full phlo-image-shimmer" />
          <img src={logo} alt="PHLO" className="w-14 h-auto opacity-10 grayscale brightness-200" />
        </div>
      )}

      <img
        src={url!}
        alt={alt}
        className={`${className} object-cover transition-all duration-1000 ${isBrowserLoading ? 'opacity-0 scale-105 blur-lg' : 'opacity-100 scale-100 blur-0'}`}
        onLoad={() => setIsBrowserLoading(false)}
        onError={() => setHasError(true)}
      />

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes phlo-image-shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(250%) skewX(-20deg); }
        }
        .phlo-image-shimmer {
          animation: phlo-image-shimmer 2.5s infinite ease-in-out;
        }
      `}} />
    </div>
  );
};
