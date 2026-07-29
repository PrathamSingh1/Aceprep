import { Router } from "express";
import { authMiddleware, adminMiddleware } from "../../middleware/auth.middleware.js";
import * as adminController from "./admin.controller.js";

const router = Router();

// All admin routes require auth + admin role
router.use(authMiddleware, adminMiddleware);

// ─── Dashboard ────────────────────────────────────
router.get("/dashboard", adminController.getDashboardStats);

// ─── Users ────────────────────────────────────────
router.get("/users", adminController.getUsers);
router.get("/users/:id", adminController.getUserDetail);
router.patch("/users/:id/role", adminController.updateUserRole);
router.patch("/users/:id/premium", adminController.toggleUserPremium);
router.delete("/users/:id", adminController.deleteUser);

// ─── Categories ───────────────────────────────────
router.get("/categories", adminController.getCategories);
router.post("/categories", adminController.createCategory);
router.patch("/categories/:id", adminController.updateCategory);
router.delete("/categories/:id", adminController.deleteCategory);

// ─── Questions ────────────────────────────────────
router.get("/questions", adminController.getQuestions);
router.post("/questions", adminController.createQuestion);
router.patch("/questions/:id", adminController.updateQuestion);

// ─── Purchases ────────────────────────────────────
router.get("/purchases", adminController.getPurchases);

// ─── Coupons ──────────────────────────────────────
router.get("/coupons", adminController.getCoupons);
router.post("/coupons", adminController.createCoupon);
router.delete("/coupons/:id", adminController.deleteCoupon);

export default router;
