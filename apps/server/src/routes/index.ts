import express from "express";
import authRoutes from "../features/auth/auth.routes"

const router = express.Router();

router.use("/auth", authRoutes);

// Future routes:
// router.use("/questions", questionRoutes);
// router.use("/premium", premiumRoutes);
// router.use("/referral", referralRoutes);
// router.use("/experiences", experienceRoutes);
// router.use("/admin", adminRoutes);



export default router;