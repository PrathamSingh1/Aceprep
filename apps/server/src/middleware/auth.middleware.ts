import { Request, Response, NextFunction } from "express";
import { getAuth } from "../lib/auth.js";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session = await getAuth().api.getSession({
            headers: req.headers as any,
        });
        if (!session) {
            return res.status(401).json({ success: false, message: "Not authenticated" });
        }
        (req as any).user = session.user;
        (req as any).session = session.session;
        next();
    } catch {
        return res.status(401).json({ success: false, message: "Invalid session" });
    }
};

export const optionalAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session = await getAuth().api.getSession({
            headers: req.headers as any,
        });
        if (session) {
            (req as any).user = session.user;
            (req as any).session = session.session;
        }
    } catch {
        // ignore invalid sessions for optional auth
    }
    next();
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || user.role !== "ADMIN") {
        return res.status(403).json({ success: false, message: "Admin access required" });
    }
    next();
};
