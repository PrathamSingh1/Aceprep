import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";
import { env } from "../config/env.js";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
            prompt: "select_account",
        },
    },
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google"],
        },
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
        password: {
            hash: async (password: string) => {
                const bcrypt = await import("bcrypt");
                return bcrypt.hash(password, 12);
            },
            verify: async (data: { password: string; hash: string }) => {
                const bcrypt = await import("bcrypt");
                return bcrypt.compare(data.password, data.hash);
            },
        },
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    advanced: {
        disableOriginCheck: env.NODE_ENV !== "production",
        defaultCookieAttributes: {
            sameSite: "lax",
            secure: false,
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "USER",
                input: false,
            },
            referralCode: {
                type: "string",
                required: false,
                unique: true,
            },
            walletBalance: {
                type: "number",
                required: false,
                defaultValue: 0,
                input: false,
            },
            isPremiumActive: {
                type: "boolean",
                required: false,
                defaultValue: false,
                input: false,
            },
            currentPremiumTier: {
                type: "string",
                required: false,
                input: false,
            },
            premiumExpiryDate: {
                type: "date",
                required: false,
                input: false,
            },
        },
    },
});
