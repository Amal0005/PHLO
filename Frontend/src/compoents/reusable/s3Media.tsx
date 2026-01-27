import { useEffect, useState } from "react";
import { fetchSignedUrl } from "@/services/s3Service";

interface Props {
  s3Key: string;
  className?: string;
  alt?: string;
  type?: "image" | "document";
}

export const S3Media = ({ s3Key, className, alt, type = "image" }: Props) => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!s3Key) return;

    let isMounted = true;
    setLoading(true);

    fetchSignedUrl(s3Key)
      .then((signedUrl) => {
        if (isMounted) {
          setUrl(signedUrl);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [s3Key]);

  if (loading) {
    return <div className={`${className} bg-zinc-800 animate-pulse flex items-center justify-center text-xs text-gray-500`}>Loading...</div>;
  }

  if (!url) {
    return <div className={`${className} bg-zinc-800 flex items-center justify-center text-xs text-gray-600 italic`}>No file</div>;
  }

  if (type === "document") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-blue-400 hover:text-blue-300 underline text-sm transition-colors flex items-center gap-2"
      >
        View Document →
      </a>
    );
  }

  return <img src={url} alt={alt} className={`${className} object-cover`} />;
};