import { Router } from "express";
import { optionalAuthMiddleware } from "../../middleware/auth.middleware.js";
import * as jobsController from "./jobs.controller.js";

const router = Router();

router.get("/counts", jobsController.getJobCountsByType);
router.get("/companies", jobsController.getCompanyJobCounts);
router.get("/companies/:id", jobsController.getCompanyJobs);
router.get("/", optionalAuthMiddleware, jobsController.getJobs);

export default router;
