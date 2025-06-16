import { Response, Request } from "express";
import express from "express";
import { prisma } from "../config/db";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

export const homepage = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    } // if undefined, user is not authenticated and redirect to login

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        userListings: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            category: true,
            createdAt: true,
            images: {
              select: {
                id: true,
                order: true,
                imageUrl: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      message: "Welcome to the homepage!",
      user,
    });
    return;
  } catch (error) {
    console.error("Homepage error:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

router.get("/", authenticateToken, homepage);

export default router;
