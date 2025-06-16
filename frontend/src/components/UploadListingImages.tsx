// components/UploadListingImages.tsx
import React, { useState } from "react";
import axios from "axios";

interface Props {
  listingId: string;
}

const UploadListingImages: React.FC<Props> = ({ listingId }) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [preview, setPreview] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    setFiles(fileList);
    const previewUrls = Array.from(fileList).map((file) =>
      URL.createObjectURL(file)
    );
    setPreview(previewUrls);
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("images", file); // field name should match Multer
    });

    setIsUploading(true);
    try {
      const res = await axios.post(
        `/api/listing/upload-images/${listingId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Uploaded images:", res.data.images);
      alert("Upload successful!");
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" multiple onChange={handleChange} />
      <div className="flex gap-2 flex-wrap">
        {preview.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt="preview"
            className="w-24 h-24 object-cover rounded"
          />
        ))}
      </div>
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload Images"}
      </button>
    </div>
  );
};

export default UploadListingImages;
