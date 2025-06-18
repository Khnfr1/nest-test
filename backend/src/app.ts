import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { PrismaClient } from "./generated/prisma";
import frontendAuth from "./routes/auth";
import createListingData from "./routes/createListing";
import homepageUserInfo from "./routes/homepage";
import signinLogout from "./routes/signin";
import signupUser from "./routes/signup";
import { updateProfileImage } from "./routes/updateProfileImage";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware for CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true, // Important for cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/v1/authForFrontend", frontendAuth);
// http://localhost:5001/api/v1/authForFrontend/check
app.use("/api/v1/create-listing", createListingData);
// http://localhost:5001/api/v1/create-listing/submit
app.use("/api/v1/homepage", homepageUserInfo);
// http://localhost:5001/api/v1/homepage/user-info
// http://localhost:5001/api/v1/homepage/user-listings
app.use("/api/v1/signin-logout", signinLogout);
// http://localhost:5001/api/v1/signin-logout/signin
// http://localhost:5001/api/v1/signin-logout/logout
app.use("/api/v1/signup-button", signupUser);
// http://localhost:5001/api/v1/signup-button/signup
app.use("/api/v1/updateImage", updateProfileImage);
// http://localhost:5001/api/v1/updateImage/update-profile-image
export default app;
