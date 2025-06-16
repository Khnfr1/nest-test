// src/routes/user.ts
import express from "express";
import { Request, Response } from "express";
import { upload } from "../middleware/multer";
import { supabase } from "../lib/supabaseClient";
import { prisma } from "../config/db";

const router = express.Router();

router.post(
  "/upload-avatar/:userId",
  upload.single("avatar"),
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    try {
      const filePath = `avatars/${userId}/${Date.now()}-${file.originalname}`;

      const { error } = await supabase.storage
        .from("user-avatars")
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (error) throw error;

      const { data } = supabase.storage
        .from("user-avatars")
        .getPublicUrl(filePath);

      await prisma.user.update({
        where: { id: userId },
        data: { profileImage: data.publicUrl },
      });

      return res.json({ avatarUrl: data.publicUrl });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to upload avatar" });
    }
  }
);
