import { Router } from "express";
import { optionalAuthMiddleware } from "../../middleware/auth.middleware.js";
import * as categoriesController from "./categories.controller.js";

const router = Router();

router.get("/", categoriesController.getCategoryTree);
router.get("/:slug/questions", optionalAuthMiddleware, categoriesController.getCategoryQuestions);

export default router;