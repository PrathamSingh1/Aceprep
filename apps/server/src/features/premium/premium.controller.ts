import { Request, Response, NextFunction } from "express";
import * as premiumService from "./premium.service.js";

export async function createOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user.id;
        const { tier, couponCode } = req.body;

        if (!tier || !["TIER_1", "TIER_2", "TIER_3"].includes(tier)) {
            return res.status(400).json({ success: false, message: "Invalid tier" });
        }

        const result = await premiumService.createOrder(userId, { tier, couponCode });
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user.id;
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            return res.status(400).json({ success: false, message: "Missing payment details" });
        }

        const result = await premiumService.verifyPayment(userId, {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
        });
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function getPremiumStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user.id;
        const result = await premiumService.getPremiumStatus(userId);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}
