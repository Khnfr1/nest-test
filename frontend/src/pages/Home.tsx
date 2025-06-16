import React from "react";
import UploadAvatar from "../components/UploadAvatar";
import UploadListingImages from "../components/UploadListingImages";

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <UploadAvatar userId="example-user-id" />
      <UploadListingImages listingId="example-listing-id" />
    </div>
  );
};

export default Home;
