import express from "express";
import questionRoutes from "../features/questions/questions.routes.js";
import categoryRoutes from "../features/categories/categories.routes.js";
import adminRoutes from "../features/admin/admin.routes.js";
import jobRoutes from "../features/jobs/jobs.routes.js";

const router = express.Router();

router.use("/questions", questionRoutes);
router.use("/categories", categoryRoutes);
router.use("/admin", adminRoutes);
router.use("/jobs", jobRoutes);

export default router;
