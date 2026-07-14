import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        (req as any).user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export const optionalAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
            const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
            const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
            (req as any).user = user;
        }
    } catch {
        // ignore invalid tokens for optional auth
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