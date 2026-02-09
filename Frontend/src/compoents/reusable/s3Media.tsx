import { useEffect, useState } from "react";
import { S3Service } from "@/services/s3Service";

interface Props {
  s3Key: string;
  className?: string;
  alt?: string;
  type?: "image" | "document";
}

export const S3Media = ({ s3Key, className, alt, type = "image" }: Props) => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!s3Key) {
      setUrl(null);
      setHasError(false);
      return;
    }

    let actualKey = s3Key;
    setHasError(false);

    // If it's a full URL, check if it's an S3 URL that might have expired
    if (s3Key.startsWith("http")) {
      // Common S3 URL patterns:
      // https://bucket-name.s3.region.amazonaws.com/key
      // https://s3.region.amazonaws.com/bucket-name/key
      const s3Match = s3Key.match(/amazonaws\.com\/(.+)$/);
      if (s3Match && s3Match[1]) {
        // It's an S3 URL, extract the key and continue to sign it fresh
        actualKey = decodeURIComponent(s3Match[1]);
        // Remove bucket name if it's in the path style: s3.amazonaws.com/bucket/key
        if (actualKey.includes("/") && !s3Key.includes(`${actualKey.split("/")[0]}.s3`)) {
          // This is a rough guess, but often the first part is the bucket
          // actualKey = actualKey.split('/').slice(1).join('/');
          // Actually, let's just try to re-sign as is, and if it fails, fallback
        }
      } else {
        // Not an S3 URL, use as is
        setUrl(s3Key);
        setLoading(false);
        return;
      }
    }

    let isMounted = true;
    setLoading(true);

    S3Service.getViewUrl(actualKey)
      .then((signedUrl) => {
        if (isMounted) {
          setUrl(signedUrl);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("S3Media sign error:", err);
        if (isMounted) {
          setLoading(false);
          // If signing fails but it was a URL, maybe try using the original URL as last resort
          if (s3Key.startsWith("http")) setUrl(s3Key);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [s3Key]);

  if (loading) {
    return <div className={`${className} bg-zinc-800 animate-pulse flex items-center justify-center text-xs text-gray-400 font-medium tracking-tighter`}>LOADING...</div>;
  }

  if (hasError || !url) {
    return (
      <div className={`${className} bg-zinc-800/50 flex flex-col items-center justify-center text-[10px] text-gray-500 border border-white/5`}>
        <span className="opacity-50">NO IMAGE</span>
      </div>
    );
  }

  if (type === "document") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-white/80 hover:text-white underline text-xs transition-colors flex items-center gap-2 font-medium"
      >
        VIEW DOCUMENT →
      </a>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      className={`${className} object-cover`}
      onError={() => setHasError(true)}
    />
  );
};