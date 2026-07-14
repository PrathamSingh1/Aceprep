import { NextFunction, Request, Response } from "express";
import { AppError } from "../shared/errors/AppError";


export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
            code: err.code,
        });
    }

    console.error("Unhandled error:", err);
    return res.status(500).json({
        message: "Internal server error",
    });
};