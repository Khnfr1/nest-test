import express from "express";
import { Request, Response } from "express";
import { upload } from "../middleware/multer";
import { supabase } from "../lib/supabaseClient";
import { prisma } from "../config/db";

export const ppimageutil = async (req: Request, res: Response) => {
  const { userId } = parseInt(req.params.userId);

  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const file = req.file;
  const fileName = `avatar-${userId}-${Date.now()}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (uploadError) return res.status(500).json({ error: uploadError.message });

  const { data: urlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(fileName);

  await prisma.user.update({
    where: { id: userId },
    data: { photoAvatarUrl: urlData.publicUrl },
  });

  res.json({ avatarUrl: urlData.publicUrl });
};
