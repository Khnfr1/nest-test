import express from "express";
import { Router, Request, Response } from "express";
import { prisma } from "../config/db";
import { upload } from "../middleware/multer";
import { supabase } from "../lib/supabaseClient";
import { authenticateToken } from "../middleware/auth";

const router = Router();

export const updateProfileImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const profileImage = req.file;
    if (!profileImage) {
      res.status(400).json({ error: "Profile image is required" });
      return;
    }

    // Get current user to check for old image
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const oldImageUrl = user?.profileImage;

    // Upload the new profile image
    const fileName = `profiles/${userId}/${Date.now()}-${
      profileImage.originalname
    }`;
    const { error: uploadError } = await supabase.storage
      .from("user-avatars")
      .upload(fileName, profileImage.buffer, {
        contentType: profileImage.mimetype,
        upsert: true,
      });

    if (uploadError) {
      res.status(500).json({ error: "Failed to upload image" });
      return;
    }

    const { data: publicURL } = supabase.storage
      .from("user-avatars")
      .getPublicUrl(fileName);

    // Optionally: Delete old image from storage
    if (oldImageUrl) {
      const oldPath = oldImageUrl.split("/user-avatars/")[1];
      if (oldPath) {
        await supabase.storage.from("user-avatars").remove([oldPath]);
      }
    }

    // Update the user's profile image in the database
    await prisma.user.update({
      where: { id: userId },
      data: { profileImage: publicURL.publicUrl },
    });

    res.json({
      message: "Profile image updated successfully",
      profileImage: publicURL,
    });
  } catch (error) {
    console.error("Update Profile Image Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
router.put(
  "/update-profile-image",
  upload.single("profileImage"),
  authenticateToken,
  updateProfileImage
);
export default router;
