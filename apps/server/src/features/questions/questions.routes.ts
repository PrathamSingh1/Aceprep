import { Router } from "express";
import { optionalAuthMiddleware, authMiddleware, adminMiddleware } from "../../middleware/auth.middleware.js";
import * as questionsController from "./questions.controller.js";

const router = Router();

// Public
router.get("/languages", questionsController.getLanguages);
router.get("/fields", questionsController.getFields);
router.get("/", optionalAuthMiddleware, questionsController.getQuestions);

// Authenticated user routes
router.get("/stats", optionalAuthMiddleware, questionsController.getQuestionStats);
router.get("/solved", authMiddleware, questionsController.getSolvedQuestions);
router.get("/saved", authMiddleware, questionsController.getBookmarkedQuestions);
router.post("/:id/toggle-solved", authMiddleware, questionsController.toggleSolved);
router.post("/:id/toggle-bookmark", authMiddleware, questionsController.toggleBookmark);

// Admin only routes 
router.post("/sets", authMiddleware, adminMiddleware, questionsController.createSet);
router.post("/", authMiddleware, adminMiddleware, questionsController.addQuestion);
router.delete("/:id", authMiddleware, adminMiddleware, questionsController.deleteQuestion);
router.delete("/sets/:id", authMiddleware, adminMiddleware, questionsController.deleteSet);

export default router;