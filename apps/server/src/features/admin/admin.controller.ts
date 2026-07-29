import { Request, Response, NextFunction } from "express";
import * as adminService from "./admin.service.js";

// ─── Dashboard ────────────────────────────────────

export async function getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
        const stats = await adminService.getDashboardStats();
        res.json({ success: true, data: stats });
    } catch (error) {
        next(error);
    }
}

// ─── Users ────────────────────────────────────────

export async function getUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const { search, role, isPremium, page } = req.query;
        const result = await adminService.getUsers({
            search: search as string,
            role: role as string,
            isPremium: isPremium as string,
            page: page ? parseInt(page as string) : 1,
        });
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function getUserDetail(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await adminService.getUserDetail(req.params.id);
        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
}

export async function updateUserRole(req: Request, res: Response, next: NextFunction) {
    try {
        const { role } = req.body;
        if (!role || !["USER", "ADMIN"].includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role" });
        }
        const user = await adminService.updateUserRole(req.params.id, role);
        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
}

export async function toggleUserPremium(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await adminService.toggleUserPremium(req.params.id, req.body);
        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        await adminService.deleteUser(req.params.id);
        res.json({ success: true, message: "User deleted" });
    } catch (error) {
        next(error);
    }
}

// ─── Categories ───────────────────────────────────

export async function getCategories(req: Request, res: Response, next: NextFunction) {
    try {
        const categories = await adminService.getCategories();
        res.json({ success: true, data: categories });
    } catch (error) {
        next(error);
    }
}

export async function createCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const category = await adminService.createCategory(req.body);
        res.json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
}

export async function updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const category = await adminService.updateCategory(req.params.id, req.body);
        res.json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
        await adminService.deleteCategory(req.params.id);
        res.json({ success: true, message: "Category deleted" });
    } catch (error) {
        next(error);
    }
}

// ─── Questions ────────────────────────────────────

export async function getQuestions(req: Request, res: Response, next: NextFunction) {
    try {
        const { search, difficulty, categoryId, fieldId, page } = req.query;
        const result = await adminService.getQuestions({
            search: search as string,
            difficulty: difficulty as string,
            categoryId: categoryId as string,
            fieldId: fieldId as string,
            page: page ? parseInt(page as string) : 1,
        });
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function createQuestion(req: Request, res: Response, next: NextFunction) {
    try {
        const question = await adminService.createQuestion(req.body);
        res.json({ success: true, data: question });
    } catch (error) {
        next(error);
    }
}

export async function updateQuestion(req: Request, res: Response, next: NextFunction) {
    try {
        const question = await adminService.updateQuestion(req.params.id, req.body);
        res.json({ success: true, data: question });
    } catch (error) {
        next(error);
    }
}

// ─── Purchases ────────────────────────────────────

export async function getPurchases(req: Request, res: Response, next: NextFunction) {
    try {
        const { page } = req.query;
        const result = await adminService.getPurchases({
            page: page ? parseInt(page as string) : 1,
        });
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

// ─── Coupons ──────────────────────────────────────

export async function getCoupons(req: Request, res: Response, next: NextFunction) {
    try {
        const coupons = await adminService.getCoupons();
        res.json({ success: true, data: coupons });
    } catch (error) {
        next(error);
    }
}

export async function createCoupon(req: Request, res: Response, next: NextFunction) {
    try {
        const coupon = await adminService.createCoupon(req.body);
        res.json({ success: true, data: coupon });
    } catch (error) {
        next(error);
    }
}

export async function deleteCoupon(req: Request, res: Response, next: NextFunction) {
    try {
        await adminService.deleteCoupon(req.params.id);
        res.json({ success: true, message: "Coupon deleted" });
    } catch (error) {
        next(error);
    }
}
