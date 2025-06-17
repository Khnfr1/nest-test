import React, { useRef, useState } from "react";

const categories = ["Dog", "Cat", "Bird", "Fish", "Reptile"];

const CreateListingButton: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      setError("You can upload up to 5 images only.");
      return;
    }
    setError("");
    const newImages = [...images, ...files].slice(0, 5);
    setImages(newImages);

    // Generate previews
    const newPreviews = [...previews];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === newImages.length) {
          setPreviews(newPreviews.slice(0, 5));
        }
      };
      reader.readAsDataURL(file);
    });
    // If no new files, just update previews to match images
    if (files.length === 0) setPreviews(newPreviews.slice(0, 5));
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newPreviews);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title || !description || !price || !category) {
      setError("All fields are required.");
      return;
    }
    if (images.length > 5) {
      setError("You can upload up to 5 images only.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    images.forEach((file) => formData.append("images", file));

    try {
      const response = await fetch(
        "http://localhost:5001/api/listings/create-listing",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to create listing.");
      } else {
        setSuccess("Listing created successfully!");
        setTitle("");
        setDescription("");
        setPrice("");
        setCategory(categories[0]);
        setImages([]);
        setPreviews([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch {
      setError("Something went wrong.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 space-y-4 bg-white rounded shadow"
    >
      <h2 className="text-xl font-bold mb-2">Create Listing</h2>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      <input
        type="text"
        placeholder="Title"
        className="w-full border rounded px-3 py-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        className="w-full border rounded px-3 py-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        className="w-full border rounded px-3 py-2"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        min="0"
        step="0.01"
      />
      <select
        className="w-full border rounded px-3 py-2"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className="w-full"
      />
      <div className="text-xs text-gray-500">
        You can upload up to 5 images.
      </div>
      {/* Image Previews */}
      <div className="flex flex-wrap gap-2">
        {previews.map((src, idx) => (
          <div key={idx} className="relative w-20 h-20">
            <img
              src={src}
              alt={`preview-${idx}`}
              className="w-full h-full object-cover rounded"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(idx)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              title="Remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Create Listing
      </button>
    </form>
  );
};

export default CreateListingButton;
