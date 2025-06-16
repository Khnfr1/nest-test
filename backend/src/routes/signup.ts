import express from "express";
import { Request, Response } from "express";
import { prisma } from "../config/db";
// import bcrypt from 'bcrypt';

const router = express.Router();

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

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

    // Hash password
    const hashedPassword = password;

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,

        profileImage: "", // Default empty string for profile image
      },
      select: {
        id: true,
        name: true,
        email: true,
        // age: true,
        profileImage: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      message: "User created successfully", // if this true then frontend will redirect to signin page
      user,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
