import * as categoriesRepo from "./categories.repository.js";
import { prisma } from "../../lib/prisma.js";

export async function getCategoryTree() {
    return categoriesRepo.findRootCategories();
}

export async function getCategoryQuestions(
    slug: string,
    filters: { page?: number; difficulty?: string; fieldId?: string; tag?: string },
    userId?: string
) {
    const PAGE_SIZE = 10;
    const page = filters.page || 1;

    if (page > 1) {
        if (!userId) {
            return {
                questions: [],
                pagination: { page, totalPages: 1, totalQuestions: 0, isPremiumRequired: true, isLoggedIn: false },
            };
        }
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user?.isPremiumActive) {
            return {
                questions: [],
                pagination: { page, totalPages: 1, totalQuestions: 0, isPremiumRequired: true, isLoggedIn: true },
            };
        }
    }

    const { questions, total } = await categoriesRepo.findQuestionsByCategorySlug(slug, {
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        difficulty: filters.difficulty,
        fieldId: filters.fieldId,
        tag: filters.tag,
        userId,
    });

    const totalPages = Math.ceil(total / PAGE_SIZE);

    return {
        questions,
        pagination: { page, totalPages, totalQuestions: total, isPremiumRequired: false, isLoggedIn: !!userId },
    };
}