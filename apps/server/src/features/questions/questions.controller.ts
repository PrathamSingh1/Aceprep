import { Request, Response, NextFunction } from "express";
import * as questionsService from "./questions.service.js";

export async function getLanguages(req: Request, res: Response, next: NextFunction) {
    try {
        const languages = await questionsService.getLanguages();
        res.json({ success: true, data: languages });
    } catch (error) {
        next(error);
    }
}

export async function getFields(req: Request, res: Response, next: NextFunction) {
    try {
        const fields = await questionsService.getFields();
        res.json({ success: true, data: fields });
    } catch (error) {
        next(error);
    }
}

export async function getQuestions(req: Request, res: Response, next: NextFunction) {
    try {
        const { languageId, fieldId, difficulty, search, page } = req.query;
        const userId = (req as any).user?.id;

        const result = await questionsService.getQuestions(
            {
                languageId: languageId as string,
                fieldId: fieldId as string,
                difficulty: difficulty as string,
                search: search as string,
                page: page ? parseInt(page as string) : 1,
            },
            userId,
        );
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function createSet(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await questionsService.createSet(req.body);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function addQuestion(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await questionsService.addQuestion(req.body);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function deleteQuestion(req: Request, res: Response, next: NextFunction) {
    try {
        await questionsService.deleteQuestion(req.params.id as string);
        res.json({ success: true, message: "Question deleted" });
    } catch (error) {
        next(error);
    }
}

export async function deleteSet(req: Request, res: Response, next: NextFunction) {
    try {
        await questionsService.deleteSet(req.params.id as string);
        res.json({ success: true, message: "Set deleted" });
    } catch (error) {
        next(error);
    }
}