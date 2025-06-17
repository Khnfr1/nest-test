import React, { useRef, useState } from "react";

const UploadAvatar: React.FC<{ currentImage?: string }> = ({
  currentImage,
}) => {
  const [preview, setPreview] = useState<string | undefined>(currentImage);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setError("Only JPEG, PNG, or WEBP images allowed.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB.");
        return;
      }
      setError("");
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Please select an image.");
      return;
    }
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const response = await fetch(
        "http://localhost:5001/api/auth/update-profile-image",
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to update image.");
      } else {
        setSuccess("Profile image updated!");
        setPreview(data.profileImage);
      }
    } catch {
      setError("Something went wrong.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center space-y-4"
    >
      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 mb-2">
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp"
        onChange={handleImageChange}
        className="hidden"
        id="profile-image-upload"
      />
      <label
        htmlFor="profile-image-upload"
        className="cursor-pointer py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
      >
        {preview ? "Change Photo" : "Upload Photo"}
      </label>
      <button
        type="submit"
        className="py-2 px-4 rounded bg-green-600 text-white hover:bg-green-700"
      >
        Save
      </button>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
    </form>
  );
};

export default UploadAvatar;
