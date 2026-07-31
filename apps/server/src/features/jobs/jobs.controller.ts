import { Request, Response, NextFunction } from "express";
import * as jobsService from "./jobs.service.js";

export async function getJobs(req: Request, res: Response, next: NextFunction) {
    try {
        const { type, search, tag, companyId, page } = req.query;
        const result = await jobsService.getJobs({
            type: type as string,
            search: search as string,
            tag: tag as string,
            companyId: companyId as string,
            page: page ? parseInt(page as string) : 1,
        });
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function getJobCountsByType(req: Request, res: Response, next: NextFunction) {
    try {
        const counts = await jobsService.getJobCountsByType();
        res.json({ success: true, data: counts });
    } catch (error) {
        next(error);
    }
}

export async function getCompanyJobCounts(req: Request, res: Response, next: NextFunction) {
    try {
        const companies = await jobsService.getCompanyJobCounts();
        res.json({ success: true, data: companies });
    } catch (error) {
        next(error);
    }
}

export async function getCompanyJobs(req: Request, res: Response, next: NextFunction) {
    try {
        const company = await jobsService.getCompanyJobs(req.params.id);
        if (!company) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }
        res.json({ success: true, data: company });
    } catch (error) {
        next(error);
    }
}
