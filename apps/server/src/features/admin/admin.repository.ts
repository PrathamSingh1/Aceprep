import { prisma } from "../../lib/prisma.js";

// ─── Dashboard Stats ──────────────────────────────

export async function getDashboardStats() {
    const [
        totalUsers,
        premiumUsers,
        totalQuestions,
        totalCategories,
        totalCompanies,
        recentPurchases,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { isPremiumActive: true } }),
        prisma.question.count(),
        prisma.category.count(),
        prisma.company.count(),
        prisma.premiumPurchase.findMany({
            orderBy: { createdAt: "desc" },
            take: 5,
            include: { user: { select: { id: true, name: true, email: true } } },
        }),
    ]);

    return {
        totalUsers,
        premiumUsers,
        totalQuestions,
        totalCategories,
        totalCompanies,
        recentPurchases,
    };
}

// ─── Users ────────────────────────────────────────

export async function findUsers(params: {
    search?: string;
    role?: string;
    isPremium?: boolean;
    page: number;
    pageSize: number;
}) {
    const where: any = {};
    if (params.search) {
        where.OR = [
            { name: { contains: params.search, mode: "insensitive" } },
            { email: { contains: params.search, mode: "insensitive" } },
        ];
    }
    if (params.role) where.role = params.role;
    if (params.isPremium !== undefined) where.isPremiumActive = params.isPremium;

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip: (params.page - 1) * params.pageSize,
            take: params.pageSize,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isPremiumActive: true,
                currentPremiumTier: true,
                premiumExpiryDate: true,
                walletBalance: true,
                referralCode: true,
                createdAt: true,
            },
        }),
        prisma.user.count({ where }),
    ]);

    return { users, total, totalPages: Math.ceil(total / params.pageSize) };
}

export async function findUserById(id: string) {
    return prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isPremiumActive: true,
            currentPremiumTier: true,
            premiumExpiryDate: true,
            walletBalance: true,
            referralCode: true,
            createdAt: true,
            _count: { select: { questionProgress: true, purchases: true, referredUsers: true } },
        },
    });
}

export async function updateUserRole(id: string, role: string) {
    return prisma.user.update({ where: { id }, data: { role: role as any } });
}

export async function togglePremium(id: string, isPremiumActive: boolean, tier?: string, expiryDate?: Date) {
    return prisma.user.update({
        where: { id },
        data: {
            isPremiumActive,
            currentPremiumTier: tier as any || null,
            premiumExpiryDate: expiryDate || null,
        },
    });
}

export async function deleteUser(id: string) {
    return prisma.user.delete({ where: { id } });
}

// ─── Categories ───────────────────────────────────

export async function findAllCategories() {
    return prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
        include: {
            _count: { select: { questions: true, children: true } },
            parent: { select: { id: true, name: true } },
        },
    });
}

export async function createCategory(data: { name: string; slug: string; parentId?: string; sortOrder?: number }) {
    return prisma.category.create({ data });
}

export async function updateCategory(id: string, data: { name?: string; slug?: string; parentId?: string | null; sortOrder?: number; isActive?: boolean }) {
    return prisma.category.update({ where: { id }, data });
}

export async function deleteCategory(id: string) {
    return prisma.category.delete({ where: { id } });
}

// ─── Questions (admin view) ───────────────────────

export async function findAllQuestions(params: {
    search?: string;
    difficulty?: string;
    categoryId?: string;
    fieldId?: string;
    page: number;
    pageSize: number;
}) {
    const where: any = {};
    if (params.search) where.content = { contains: params.search, mode: "insensitive" };
    if (params.difficulty) where.difficulty = params.difficulty;
    if (params.categoryId) where.categoryId = params.categoryId;
    if (params.fieldId) where.fieldId = params.fieldId;

    const [questions, total] = await Promise.all([
        prisma.question.findMany({
            where,
            skip: (params.page - 1) * params.pageSize,
            take: params.pageSize,
            orderBy: { createdAt: "desc" },
            include: {
                category: { select: { id: true, name: true } },
                field: { select: { id: true, name: true } },
            },
        }),
        prisma.question.count({ where }),
    ]);

    return { questions, total, totalPages: Math.ceil(total / params.pageSize) };
}

export async function createQuestion(data: {
    content: string;
    answer: string;
    difficulty?: string;
    categoryId?: string;
    fieldId?: string;
    tags?: string[];
}) {
    const maxOrder = await prisma.question.aggregate({ _max: { order: true } });
    return prisma.question.create({
        data: {
            content: data.content,
            answer: data.answer,
            difficulty: (data.difficulty as any) || "MEDIUM",
            categoryId: data.categoryId || null,
            fieldId: data.fieldId || null,
            tags: data.tags || [],
            order: (maxOrder._max.order || 0) + 1,
        },
    });
}

export async function updateQuestion(id: string, data: {
    content?: string;
    answer?: string;
    difficulty?: string;
    categoryId?: string | null;
    fieldId?: string | null;
}) {
    return prisma.question.update({ where: { id }, data: data as any });
}

// ─── Purchases ────────────────────────────────────

export async function findAllPurchases(params: { page: number; pageSize: number }) {
    const [purchases, total] = await Promise.all([
        prisma.premiumPurchase.findMany({
            skip: (params.page - 1) * params.pageSize,
            take: params.pageSize,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { id: true, name: true, email: true } } },
        }),
        prisma.premiumPurchase.count(),
    ]);

    return { purchases, total, totalPages: Math.ceil(total / params.pageSize) };
}

// ─── Coupons ──────────────────────────────────────

export async function findAllCoupons() {
    return prisma.discountCoupon.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createCoupon(data: {
    code: string;
    type: string;
    value: number;
    maxUses?: number;
    validUntil?: Date;
}) {
    return prisma.discountCoupon.create({
        data: {
            code: data.code.toUpperCase(),
            type: data.type as any,
            value: data.value,
            maxUses: data.maxUses || null,
            validUntil: data.validUntil || new Date(),
        },
    });
}

export async function deleteCoupon(id: string) {
    return prisma.discountCoupon.delete({ where: { id } });
}

// ─── Companies ────────────────────────────────────

export async function findAllCompanies(params: { search?: string; page: number; pageSize: number }) {
    const where: any = {};
    if (params.search) {
        where.OR = [
            { name: { contains: params.search, mode: "insensitive" } },
            { slug: { contains: params.search, mode: "insensitive" } },
        ];
    }

    const [companies, total] = await Promise.all([
        prisma.company.findMany({
            where,
            skip: (params.page - 1) * params.pageSize,
            take: params.pageSize,
            orderBy: { createdAt: "desc" },
            include: { _count: { select: { jobs: true } } },
        }),
        prisma.company.count({ where }),
    ]);

    return { companies, total, totalPages: Math.ceil(total / params.pageSize) };
}

export async function createCompany(data: { name: string; slug: string; logo?: string; website?: string }) {
    return prisma.company.create({ data });
}

export async function updateCompany(id: string, data: { name?: string; slug?: string; logo?: string; website?: string }) {
    return prisma.company.update({ where: { id }, data });
}

export async function deleteCompany(id: string) {
    return prisma.company.delete({ where: { id } });
}

// ─── Jobs ─────────────────────────────────────────

export async function findJobs(params: { search?: string; type?: string; companyId?: string; page: number; pageSize: number }) {
    const where: any = {};
    if (params.type) where.type = params.type;
    if (params.companyId) where.companyId = params.companyId;
    if (params.search) {
        where.OR = [
            { title: { contains: params.search, mode: "insensitive" } },
            { company: { name: { contains: params.search, mode: "insensitive" } } },
        ];
    }

    const [jobs, total] = await Promise.all([
        prisma.job.findMany({
            where,
            skip: (params.page - 1) * params.pageSize,
            take: params.pageSize,
            orderBy: { postedAt: "desc" },
            include: { company: { select: { id: true, name: true, slug: true } } },
        }),
        prisma.job.count({ where }),
    ]);

    return { jobs, total, totalPages: Math.ceil(total / params.pageSize) };
}

export async function createJob(data: {
    title: string;
    companyId: string;
    type: string;
    location?: string;
    description?: string;
    applyUrl?: string;
    salaryMin?: number;
    salaryMax?: number;
    isRemote?: boolean;
    isStartup?: boolean;
    isHFT?: boolean;
    tags?: string[];
}) {
    return prisma.job.create({
        data: {
            title: data.title,
            companyId: data.companyId,
            type: data.type as any,
            location: data.location || null,
            description: data.description || null,
            applyUrl: data.applyUrl || null,
            salaryMin: data.salaryMin || null,
            salaryMax: data.salaryMax || null,
            isRemote: data.isRemote || false,
            isStartup: data.isStartup || false,
            isHFT: data.isHFT || false,
            tags: data.tags || [],
        },
    });
}

export async function updateJob(id: string, data: any) {
    if (data.type) data.type = data.type as any;
    return prisma.job.update({ where: { id }, data });
}

export async function deleteJob(id: string) {
    return prisma.job.delete({ where: { id } });
}
