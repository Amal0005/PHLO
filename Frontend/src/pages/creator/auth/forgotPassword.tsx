import { useEffect, useState } from "react";

function A() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  useEffect(() => {
    async function fetchImage() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/upload/view?email=amal@gmail.com`
        );

        if (!res.ok) {
          throw new Error("Failed to get view URL");
        }

        const data = await res.json();
        console.log(data)
        setImageUrl(data.profilePhoto);
      } catch (err) {
        console.error(err);
      }
    }

    fetchImage();
  }, []);

  return (
    <div className="p-6">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Private Image"
          className="w-64 rounded-md border"
        />
      ) : (
        <p>No image available</p>
      )}
    </div>
  );
}

export default A;
