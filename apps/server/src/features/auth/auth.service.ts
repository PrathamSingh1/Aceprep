import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors/AppError.js";
import * as authRepo from "./auth.repository.js";

function createToken(userId: string): string {
    return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "30d" });
}

function sanitize(user: any) {
    const { passwordHash, ...rest } = user;
    return rest;
}

function generateReferralCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function register(data: { name: string; email: string; password: string }) {
    const existing = await authRepo.findByEmail(data.email);
    if (existing) throw new AppError("Email already registered");

    const passwordHash = await bcrypt.hash(data.password, 12);
    const referralCode = generateReferralCode();

    const user = await authRepo.createUser({
        email: data.email,
        name: data.name,
        passwordHash,
        referralCode,
    });

    const token = createToken(user.id);
    return { user: sanitize(user), token };
}

export async function login(email: string, password: string) {
    const user = await authRepo.findByEmail(email);
    if (!user || !user.passwordHash) {
        throw new AppError("Invalid credentials");
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new AppError("Invalid credentials");

    const token = createToken(user.id);
    return { user: sanitize(user), token };
}

export async function loginWithGoogle(idToken: string) {
    const { OAuth2Client } = await import("google-auth-library");
    const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
        idToken,
        audience: env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload()!;

    let user = await authRepo.findByEmail(payload.email!);
    if (!user) {
        const referralCode = generateReferralCode();
        user = await authRepo.createUser({
            email: payload.email!,
            name: payload.name,
            image: payload.picture,
            referralCode,
        });
    }

    await authRepo.upsertAccount(user.id, "google", payload.sub!);

    const token = createToken(user.id);
    return { user: sanitize(user), token };
}

export async function getMe(userId: string) {
    const user = await authRepo.findById(userId);
    if (!user) throw new AppError("User not found");
    return sanitize(user);
}