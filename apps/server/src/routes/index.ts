import express from "express";
import authRoutes from "../features/auth/auth.routes.js"
import questionRoutes from "../features/questions/questions.routes.js"
import categoryRoutes from "../features/categories/categories.routes.js"
import adminRoutes from "../features/admin/admin.routes.js"
import jobRoutes from "../features/jobs/jobs.routes.js"

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/questions", questionRoutes);
router.use("/categories", categoryRoutes);
router.use("/admin", adminRoutes);
router.use("/jobs", jobRoutes);
// router.use("/premium", premiumRoutes);
// router.use("/referral", referralRoutes);
// router.use("/experiences", experienceRoutes);



export default router;