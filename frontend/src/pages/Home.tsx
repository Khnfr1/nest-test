import React, { useEffect, useState } from "react";
import UploadAvatar from "../components/UploadAvatar";
import CreateListingButton from "../components/CreateListingButton";

interface User {
  name: string;
  email: string;
  profileImage?: string;
}

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images?: { id: string; imageUrl: string }[];
}

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(
          "http://localhost:5173/api/v1/homepage/user-info",
          {
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Failed to fetch user info");
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        setError("Could not load user info.");
      }
    };

    const fetchListings = async () => {
      try {
        const res = await fetch(
          "http://localhost:5173/api/v1/homepage/user-listings",
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to fetch listings");
        const data = await res.json();
        setListings(data.listings);
      } catch (err) {
        setError("Could not load listings.");
      }
    };

    Promise.all([fetchUserInfo(), fetchListings()]).finally(() =>
      setLoading(false)
    );
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Home</h1>
      {user && (
        <div className="mb-6 flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>
          <div>
            <div className="font-semibold">{user.name}</div>
            <div className="text-gray-600">{user.email}</div>
          </div>
        </div>
      )}

      {/* Avatar upload */}
      <UploadAvatar currentImage={user?.profileImage} />

      {/* Create listing */}
      <div className="my-8">
        <CreateListingButton />
      </div>

      {/* User Listings */}
      <h2 className="text-xl font-bold mb-2">Your Listings</h2>
      <div className="space-y-6">
        {listings.length === 0 && (
          <div className="text-gray-500">No listings yet.</div>
        )}
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="border rounded p-4 bg-white shadow space-y-2"
          >
            <div className="font-semibold text-lg">{listing.title}</div>
            <div className="text-gray-700">{listing.description}</div>
            <div>
              <span className="font-semibold">Price:</span> ${listing.price}
            </div>
            <div>
              <span className="font-semibold">Category:</span>{" "}
              {listing.category}
            </div>
            <div className="flex gap-2 flex-wrap mt-2">
              {listing.images && listing.images.length > 0 ? (
                listing.images.map((img: { id: string; imageUrl: string }) => (
                  <img
                    key={img.id}
                    src={img.imageUrl}
                    alt="listing"
                    className="w-24 h-24 object-cover rounded"
                  />
                ))
              ) : (
                <span className="text-gray-400">No images</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
