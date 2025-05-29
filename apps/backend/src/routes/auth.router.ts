import { Router } from "express";

const authRouter = Router();

authRouter.get("/me", (req, res) => {
  try {
    res.status(200).json("good");
  } catch (error) {
    console.error("Token verification failed", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

export default authRouter;
