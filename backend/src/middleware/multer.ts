// src/middleware/multer.ts
import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

const storage = multer.memoryStorage(); // store in memory, upload to Supabase directly

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed!"));
    }
  },
});
