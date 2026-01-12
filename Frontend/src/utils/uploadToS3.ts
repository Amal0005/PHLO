export async function uploadToS3(
  file: File,
  folder: "profile" | "id"
): Promise<string> {

  const presignRes = await fetch(
    "http://localhost:5000/api/upload/presign",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileType: file.type,
        folder,
      }),
    }
  );

  if (!presignRes.ok) {
    throw new Error("Failed to get upload URL");
  }

  const { uploadUrl, publicUrl }: {
    uploadUrl: string;
    publicUrl: string;
  } = await presignRes.json();

  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error("S3 upload failed");
  }

  return publicUrl;
}
