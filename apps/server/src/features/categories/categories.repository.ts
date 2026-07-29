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
    options: { skip: number; take: number; difficulty?: string; fieldId?: string }
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

    const [questions, total] = await Promise.all([
        prisma.question.findMany({
            where,
            skip: options.skip,
            take: options.take,
            orderBy: { order: "asc" },
            include: {
                category: true,
                field: true,
                progress: true,
            },
        }),
        prisma.question.count({ where }),
    ]);

    return { questions, total };
}

export async function countQuestionsByCategory(categoryIds: string[], difficulty?: string) {
    const where: any = { categoryId: { in: categoryIds } };
    if (difficulty) where.difficulty = difficulty;
    return prisma.question.count({ where });
}