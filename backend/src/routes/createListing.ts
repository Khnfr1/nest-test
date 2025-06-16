import { Request, Response } from "express";
import { prisma } from "../config/db";
import { authenticateToken } from "../middleware/auth";
import { upload } from "../middleware/multer";
import { supabase } from "../lib/supabaseClient";
import express from "express";

const router = express.Router();

router.post(
  "/create-listing",
  authenticateToken,
  upload.array("images", 5), // Limit to 5 images
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { title, description, price, category } = req.body;

      // Validate required fields
      if (!title || !description || !price || !category) {
        res.status(400).json({ error: "All fields are required" });
        return;
      }

      // Validate category
      const validCategories = ["Dog", "Cat", "Bird", "Fish", "Reptile"];
      if (!validCategories.includes(category)) {
        res.status(400).json({ error: "Invalid category" });
        return;
      }

      // Create the listing first
      const listing = await prisma.userListing.create({
        data: {
          title,
          description,
          price: parseFloat(price),
          category: category as any, // Cast to Category enum
          userId,
        },
      });

      // Handle image uploads
      const files = req.files as Express.Multer.File[];
      if (files && files.length > 0) {
        const imagePromises = files.map(async (file, index) => {
          // Upload to Supabase storage
          const fileName = `listings/${listing.id}/${Date.now()}-${
            file.originalname
          }`;
          const { error: uploadError, data } = await supabase.storage
            .from("listings")
            .upload(fileName, file.buffer, {
              contentType: file.mimetype,
              upsert: true,
            });

          if (uploadError) {
            throw new Error(`Error uploading image: ${uploadError.message}`);
          }

          // Get public URL
          const {
            data: { publicUrl },
          } = supabase.storage.from("listings").getPublicUrl(fileName);

          // Create image record in database
          return prisma.listingImage.create({
            data: {
              order: index + 1,
              imageUrl: publicUrl,
              userListingId: listing.id,
            },
          });
        });

        await Promise.all(imagePromises);
      }

      // Fetch the complete listing with images
      const completeListingWithImages = await prisma.userListing.findUnique({
        where: { id: listing.id },
        include: {
          images: {
            orderBy: {
              order: "asc",
            },
          },
        },
      });

      res.status(201).json({
        message: "Listing created successfully",
        listing: completeListingWithImages,
      });
    } catch (error) {
      console.error("Error creating listing:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
