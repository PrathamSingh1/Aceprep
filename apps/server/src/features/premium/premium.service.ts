import Razorpay from "razorpay";
import crypto from "crypto";
import { prisma } from "../../lib/prisma.js";
import { getEnv } from "../../config/env.js";

let _razorpay: Razorpay;

function getRazorpay() {
    if (!_razorpay) {
        const env = getEnv();
        _razorpay = new Razorpay({
            key_id: env.RAZORPAY_KEY_ID,
            key_secret: env.RAZORPAY_SECRET,
        });
    }
    return _razorpay;
}

export interface CreateOrderInput {
    tier: "TIER_1" | "TIER_2" | "TIER_3";
    couponCode?: string;
}

const TIER_CONFIG = {
    TIER_1: { durationMonths: 1, amount: 29900, label: "1 Month Premium" },
    TIER_2: { durationMonths: 6, amount: 149900, label: "6 Month Premium" },
    TIER_3: { durationMonths: 12, amount: 249900, label: "1 Year Premium" },
};

export async function createOrder(userId: string, input: CreateOrderInput) {
    const tierConfig = TIER_CONFIG[input.tier];
    if (!tierConfig) throw new Error("Invalid tier");

    let amount = tierConfig.amount;
    let discountApplied = 0;

    if (input.couponCode) {
        const coupon = await prisma.discountCoupon.findUnique({
            where: { code: input.couponCode },
        });

        if (coupon && coupon.isActive && new Date() < coupon.validUntil) {
            if (!coupon.maxUses || coupon.usedCount < coupon.maxUses) {
                if (coupon.type === "PERCENTAGE") {
                    discountApplied = Math.round(amount * (coupon.value / 100));
                } else {
                    discountApplied = coupon.value * 100;
                }
                amount = Math.max(amount - discountApplied, 0);
            }
        }
    }

    const order = await getRazorpay().orders.create({
        amount,
        currency: "INR",
        receipt: `prem_${userId.slice(0, 6)}_${Date.now().toString(36)}`,
    });

    const purchase = await prisma.premiumPurchase.create({
        data: {
            userId,
            tier: input.tier,
            durationMonths: tierConfig.durationMonths,
            amountPaid: amount,
            discountApplied: discountApplied / 100,
            razorpayOrderId: order.id,
            paymentStatus: "PENDING",
            referralCodeUsed: input.couponCode || null,
        },
    });

    return {
        orderId: order.id,
        amount,
        currency: "INR",
        purchaseId: purchase.id,
        tierConfig,
    };
}

export interface VerifyPaymentInput {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}

export async function verifyPayment(userId: string, input: VerifyPaymentInput) {
    const body = input.razorpayOrderId + "|" + input.razorpayPaymentId;
    const expectedSignature = crypto
        .createHmac("sha256", getEnv().RAZORPAY_SECRET)
        .update(body)
        .digest("hex");

    if (expectedSignature !== input.razorpaySignature) {
        throw new Error("Invalid payment signature");
    }

    const purchase = await prisma.premiumPurchase.findFirst({
        where: {
            razorpayOrderId: input.razorpayOrderId,
            userId,
        },
    });

    if (!purchase) throw new Error("Purchase not found");

    const now = new Date();
    const expiryDate = new Date(now);
    expiryDate.setMonth(expiryDate.getMonth() + purchase.durationMonths);

    await prisma.$transaction([
        prisma.premiumPurchase.update({
            where: { id: purchase.id },
            data: {
                razorpayPaymentId: input.razorpayPaymentId,
                paymentStatus: "COMPLETED",
            },
        }),
        prisma.user.update({
            where: { id: userId },
            data: {
                isPremiumActive: true,
                currentPremiumTier: purchase.tier,
                premiumExpiryDate: expiryDate,
            },
        }),
    ]);

    if (purchase.referralCodeUsed) {
        const coupon = await prisma.discountCoupon.findUnique({
            where: { code: purchase.referralCodeUsed },
        });
        if (coupon) {
            await prisma.discountCoupon.update({
                where: { id: coupon.id },
                data: { usedCount: { increment: 1 } },
            });
        }
    }

    return { success: true, expiryDate };
}

export async function getPremiumStatus(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            isPremiumActive: true,
            currentPremiumTier: true,
            premiumExpiryDate: true,
        },
    });

    if (!user) throw new Error("User not found");

    if (user.premiumExpiryDate && new Date() > user.premiumExpiryDate) {
        await prisma.user.update({
            where: { id: userId },
            data: {
                isPremiumActive: false,
                currentPremiumTier: null,
                premiumExpiryDate: null,
            },
        });
        return {
            isPremiumActive: false,
            currentPremiumTier: null,
            premiumExpiryDate: null,
        };
    }

    return user;
}
