import { Router } from "express";
import { validate } from "../../middleware/validate.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
import { registerSchema, loginSchema, googleLoginSchema } from "./auth.validation";
import { AuthController } from "./auth.controller";

const router = Router();
const controller = new AuthController();

router.post("/register", validate(registerSchema), (req, res, next) => controller.register(req, res, next));
router.post("/login", validate(loginSchema), (req, res, next) => controller.login(req, res, next));
router.post("/google", validate(googleLoginSchema), (req, res, next) => controller.googleLogin(req, res, next));
router.get("/me", authMiddleware, (req, res, next) => controller.me(req, res, next));

export default router;