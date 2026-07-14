import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { AppError } from "../../shared/errors/AppError";
import { AuthRepository } from "./auth.repository";

export class AuthService {
    private repo = new AuthRepository();

    async register(data: { name: string; email: string; password: string }) {
        const existing = await this.repo.findByEmail(data.email);
        if (existing) throw new AppError("Email already registered");

        const passwordHash = await bcrypt.hash(data.password, 12);
        const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const user = await this.repo.create({
            email: data.email,
            name: data.name,
            passwordHash,
            referralCode,
        });

        const token = this.createToken(user.id);
        return { user: this.sanitize(user), token };
    }

    async login(email: string, password: string) {
        const user = await this.repo.findByEmail(email);
        if (!user || !user.passwordHash) {
            throw new AppError("Invalid credentials");
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) throw new AppError("Invalid credentials");

        const token = this.createToken(user.id);
        return { user: this.sanitize(user), token };
    }

    async loginWithGoogle(idToken: string) {
        const { OAuth2Client } = await import("google-auth-library");
        const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

        const ticket = await client.verifyIdToken({
            idToken,
            audience: env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload()!;

        let user = await this.repo.findByEmail(payload.email!);
        if (!user) {
            const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            user = await this.repo.create({
                email: payload.email!,
                name: payload.name,
                image: payload.picture,
                referralCode,
            });
        }

        await this.repo.upsertAccount(user.id, "google", payload.sub!);

        const token = this.createToken(user.id);
        return { user: this.sanitize(user), token };
    }

    async getMe(userId: string) {
        const user = await this.repo.findById(userId);
        if (!user) throw new AppError("User not found");
        return this.sanitize(user);
    }

    private createToken(userId: string): string {
        return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "30d" });
    }

    private sanitize(user: any) {
        const { passwordHash, ...rest } = user;
        return rest;
    }
}