import { Router, Request, Response } from "express";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/check", authenticateToken, (req: Request, res: Response) => {
  // If middleware passes, user is authenticated
  res.status(200).json({
    authenticated: true,
    user: req.user,
  });
});

export default router;
