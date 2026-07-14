import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";

const service = new AuthService();

export class AuthController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await service.register(req.body);
            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const result = await service.login(email, password);
            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    async googleLogin(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await service.loginWithGoogle(req.body.idToken);
            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    async me(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await service.getMe((req as any).user.id);
            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }
}