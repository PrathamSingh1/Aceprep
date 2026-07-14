import express from "express";
import authRoutes from "../features/auth/auth.routes"
import questionRoutes from "../features/questions/questions.routes"

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/questions", questionRoutes);
// router.use("/premium", premiumRoutes);
// router.use("/referral", referralRoutes);
// router.use("/experiences", experienceRoutes);
// router.use("/admin", adminRoutes);



export default router;