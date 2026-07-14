import { Router } from "express";
import { optionalAuthMiddleware, authMiddleware, adminMiddleware } from "../../middleware/auth.middleware";
import * as questionsController from "./questions.controller";

const router = Router();

// Public
router.get("/languages", questionsController.getLanguages);
router.get("/fields", questionsController.getFields);
router.get("/", optionalAuthMiddleware, questionsController.getQuestions);

// Admin only routes 
router.post("/sets", authMiddleware, adminMiddleware, questionsController.createSet);
router.post("/", authMiddleware, adminMiddleware, questionsController.addQuestion);
router.delete("/:id", authMiddleware, adminMiddleware, questionsController.deleteQuestion);
router.delete("/sets/:id", authMiddleware, adminMiddleware, questionsController.deleteSet);

export default router;