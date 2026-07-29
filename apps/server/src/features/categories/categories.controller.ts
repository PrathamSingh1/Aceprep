import { Request, Response, NextFunction } from "express";
import * as categoriesService from "./categories.service.js";

export async function getCategoryTree(req: Request, res: Response, next: NextFunction) {
    try {
        const tree = await categoriesService.getCategoryTree();
        res.json({ success: true, data: tree });
    } catch (error) {
        next(error);
    }
}

export async function getCategoryQuestions(req: Request, res: Response, next: NextFunction) {
    try {
        const { slug } = req.params;

        if (!slug || Array.isArray(slug)) {
            res.status(400).json({ success: false, message: "Invalid or missing slug parameter" });
            return;
        }

        const { page, difficulty } = req.query;
        const userId = (req as any).user?.id;

        const result = await categoriesService.getCategoryQuestions(
            slug,
            { page: page ? parseInt(page as string) : 1, difficulty: difficulty as string },
            userId
        );
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}