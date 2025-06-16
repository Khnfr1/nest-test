// components/UploadAvatar.tsx
import React, { useState } from "react";
import axios from "axios";

interface Props {
  userId: string;
}

const UploadAvatar: React.FC<Props> = ({ userId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file); // field name must match Multer

    setIsUploading(true);
    try {
      const res = await axios.post(
        `/api/user/upload-avatar/${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Avatar uploaded:", res.data.avatarUrl);
      alert("Avatar updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to upload avatar.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={handleChange} />
      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-32 h-32 object-cover rounded-full"
        />
      )}
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload Avatar"}
      </button>
    </div>
  );
};

export default UploadAvatar;
