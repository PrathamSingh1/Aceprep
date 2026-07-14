import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await authService.register(req.body);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function googleLogin(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await authService.loginWithGoogle(req.body.idToken);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function me(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await authService.getMe((req as any).user.id);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}