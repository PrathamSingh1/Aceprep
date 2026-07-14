import dotenv from "dotenv";
import z from "zod";
dotenv.config();

const envSchema = z.object({
    PORT: z.string().default("5000"),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(10),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    RAZORPAY_KEY_ID: z.string(),
    RAZORPAY_SECRET: z.string(),
    FRONTEND_URL: z.string().default('http://localhost:3000'),
});

export const env = envSchema.parse(process.env);