import express from "express";
import { Request, Response } from "express";
import { prisma } from "../config/db";
import { upload } from "../middleware/multer";
import { supabase } from "../lib/supabaseClient";

const router = express.Router();

router.post(
  "/signup",
  upload.single("profileImage"),
  async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const profileImage = req.file;

      // Basic validation
      if (!name || !email || !password) {
        res.status(400).json({ error: "All fields are required" });
        return;
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        res.status(400).json({ error: "Email already registered" });
        return;
      }

      // First, create the user without the profileImage
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password,
          // profileImage will be updated after upload
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });

      // Then, upload the image if provided
      let profileImageUrl = "";
      if (profileImage) {
        // Use user.id in the file path
        const fileName = `profiles/${user.id}/${Date.now()}-${
          profileImage.originalname
        }`;
        const { error: uploadError } = await supabase.storage
          .from("user-avatars")
          .upload(fileName, profileImage.buffer, {
            contentType: profileImage.mimetype,
            upsert: true,
          });

        if (uploadError) {
          throw new Error(`Error uploading image: ${uploadError.message}`);
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("user-avatars").getPublicUrl(fileName);

        profileImageUrl = publicUrl;

        // Update user with profileImage URL
        await prisma.user.update({
          where: { id: user.id },
          data: { profileImage: profileImageUrl },
        });
      }

      res.status(201).json({
        message: "User created successfully",
        user,
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
