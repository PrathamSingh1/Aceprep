import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { registerSchema, loginSchema, googleLoginSchema } from "./auth.validation.js";
import * as authController from "./auth.controller.js";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/google", validate(googleLoginSchema), authController.googleLogin);
router.get("/me", authMiddleware, authController.me);

export default router;