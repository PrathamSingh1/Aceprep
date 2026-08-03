import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import * as premiumController from "./premium.controller.js";

const router = Router();

router.post("/create-order", authMiddleware, premiumController.createOrder);
router.post("/verify", authMiddleware, premiumController.verifyPayment);
router.get("/status", authMiddleware, premiumController.getPremiumStatus);

export default router;
