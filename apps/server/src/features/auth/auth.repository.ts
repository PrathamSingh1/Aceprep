import { prisma } from "../../lib/prisma";

export class AuthRepository {
    async findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
    }

    async findById(id: string) {
        return prisma.user.findUnique({ where: { id } });
    }

    async create(data: {
        email: string;
        name?: string;
        passwordHash?: string;
        image?: string;
        referralCode: string;
    }) {
        return prisma.user.create({ data });
    }

    async upsertAccount(userId: string, provider: string, providerAccountId: string) {
        return prisma.account.upsert({
            where: {
                provider_providerAccountId: { provider, providerAccountId },
            },
            update: {},
            create: { userId, provider, providerAccountId },
        });
    }
}