import { prisma } from "../../lib/prisma.js";


export async function findRootCategories() {
    return prisma.category.findMany({
        where: { parentId: null, isActive: true },
        orderBy: { sortOrder: "asc" },
        include: {
            children: {
                where: { isActive: true },
                orderBy: { sortOrder: "asc" },
            },
        },
    });
}

export async function findCategoryBySlug(slug: string) {
    return prisma.category.findUnique({
        where: { slug },
        include: { children: true },
    });
}

export async function findQuestionsByCategorySlug(
    slug: string,
    options: { skip: number; take: number; difficulty?: string; fieldId?: string; tag?: string; userId?: string }
) {
    const category = await prisma.category.findUnique({ where: { slug } });
    if (!category) return { questions: [], total: 0 };

    const categoryIds = [category.id];
    const children = await prisma.category.findMany({
        where: { parentId: category.id },
    });
    categoryIds.push(...children.map((c) => c.id));

    const where: any = {
        categoryId: { in: categoryIds },
    };
    if (options.difficulty) where.difficulty = options.difficulty;
    if (options.fieldId) where.fieldId = options.fieldId;
    if (options.tag) where.tags = { has: options.tag };

    const [questions, total] = await Promise.all([
        prisma.question.findMany({
            where,
            skip: options.skip,
            take: options.take,
            orderBy: { order: "asc" },
            include: {
                category: true,
                field: true,
                ...(options.userId ? { progress: { where: { userId: options.userId }, take: 1 } } : {}),
            },
        }),
        prisma.question.count({ where }),
    ]);

    const flattened = questions.map((q: any) => ({
        ...q,
        isBookmarked: q.progress?.[0]?.isBookmarked || false,
        isSolved: q.progress?.[0]?.isSolved || false,
        progress: undefined,
    }));

    return { questions: flattened, total };
}

export async function countQuestionsByCategory(categoryIds: string[], difficulty?: string) {
    const where: any = { categoryId: { in: categoryIds } };
    if (difficulty) where.difficulty = difficulty;
    return prisma.question.count({ where });
}