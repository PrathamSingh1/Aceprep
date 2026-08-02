import dotenv from "dotenv";
import z from "zod";
dotenv.config();

const envSchema = z.object({
    PORT: z.string().default("5000"),
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.string().url(),
    FRONTEND_URL: z.string().default("http://localhost:3000"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    RAZORPAY_KEY_ID: z.string(),
    RAZORPAY_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
