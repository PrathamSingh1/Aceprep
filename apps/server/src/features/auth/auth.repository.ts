import { prisma } from "../../lib/prisma";

export async function findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
}

export async function findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
}

export async function createUser(data: {
    email: string;
    name?: string;
    passwordHash?: string;
    image?: string;
    referralCode: string;
}) {
    return prisma.user.create({ data });
}

export async function upsertAccount(userId: string, provider: string, providerAccountId: string) {
    return prisma.account.upsert({
        where: {
            provider_providerAccountId: { provider, providerAccountId },
        },
        update: {},
        create: { userId, provider, providerAccountId },
    });
}