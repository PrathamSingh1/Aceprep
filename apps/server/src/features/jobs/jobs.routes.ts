import { Router } from "express";
import { optionalAuthMiddleware, authMiddleware } from "../../middleware/auth.middleware.js";
import * as jobsController from "./jobs.controller.js";

const router = Router();

// ─── Public / Optional Auth ──────────────────────
router.get("/counts", jobsController.getJobCountsByType);
router.get("/companies", jobsController.getCompanyJobCounts);
router.get("/companies/:id", jobsController.getCompanyJobs);
router.get("/", optionalAuthMiddleware, jobsController.getJobs);

// ─── Auth Required (Save / Apply) ────────────────
router.get("/user/statuses", authMiddleware, jobsController.getUserJobStatuses);
router.post("/:id/save", authMiddleware, jobsController.toggleSave);
router.post("/:id/apply", authMiddleware, jobsController.setApplicationStatus);

export default router;
