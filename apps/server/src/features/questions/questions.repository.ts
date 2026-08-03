import { prisma } from "../../lib/prisma.js";

export async function findManyLanguages(where: any) {
    return prisma.language.findMany({ where, orderBy: { sortOrder: "asc" } });
}

export async function findManyFields(where: any) {
    return prisma.field.findMany({ where, orderBy: { sortOrder: "asc" } });
}

export async function countQuestions(where: any) {
    const prismaWhere: any = {};

    if (where.languageId || where.fieldId) {
        prismaWhere.questionSet = {};
        if (where.languageId) prismaWhere.questionSet.languageId = where.languageId;
        if (where.fieldId) prismaWhere.questionSet.fieldId = where.fieldId;
    }
    if (where.difficulty) prismaWhere.difficulty = where.difficulty;
    if (where.search) prismaWhere.content = { contains: where.search, mode: "insensitive" };
    if (where.categoryId) prismaWhere.categoryId = where.categoryId;

    return prisma.question.count({ where: prismaWhere });
}

export async function findQuestions(where: any, options: { skip: number; take: number }) {
    const prismaWhere: any = {};

    if (where.languageId || where.fieldId) {
        prismaWhere.questionSet = {};
        if (where.languageId) prismaWhere.questionSet.languageId = where.languageId;
        if (where.fieldId) prismaWhere.questionSet.fieldId = where.fieldId;
    }
    if (where.difficulty) prismaWhere.difficulty = where.difficulty;
    if (where.search) prismaWhere.content = { contains: where.search, mode: "insensitive" };
    if (where.categoryId) prismaWhere.categoryId = where.categoryId;

    return prisma.question.findMany({
        where: prismaWhere,
        skip: options.skip,
        take: options.take,
        orderBy: { order: "asc" },
        include: {
            questionSet: {
                include: { language: true, field: true },
            },
            category: true,
        },
    });
}

export async function getUserProgress(userId: string, questionIds: string[]) {
    return prisma.questionProgress.findMany({
        where: { userId, questionId: { in: questionIds } },
    });
}

export async function createSet(data: any) {
    return prisma.questionSet.create({ data });
}

export async function createQuestion(data: any) {
    return prisma.question.create({ data });
}

export async function incrementQuestionCount(setId: string) {
    return prisma.questionSet.update({
        where: { id: setId },
        data: { totalQuestions: { increment: 1 } },
    });
}

export async function findSetById(id: string) {
    return prisma.questionSet.findUnique({ where: { id } });
}

export async function deleteQuestion(id: string) {
    return prisma.question.delete({ where: { id } });
}

export async function deleteSet(id: string) {
    return prisma.questionSet.delete({ where: { id } });
}

export async function toggleSolved(userId: string, questionId: string) {
    const existing = await prisma.questionProgress.findUnique({
        where: { userId_questionId: { userId, questionId } },
    });
    if (existing) {
        return prisma.questionProgress.update({
            where: { userId_questionId: { userId, questionId } },
            data: { isSolved: !existing.isSolved },
        });
    }
    return prisma.questionProgress.create({
        data: { userId, questionId, isSolved: true, isBookmarked: false },
    });
}

export async function toggleBookmark(userId: string, questionId: string) {
    const existing = await prisma.questionProgress.findUnique({
        where: { userId_questionId: { userId, questionId } },
    });
    if (existing) {
        return prisma.questionProgress.update({
            where: { userId_questionId: { userId, questionId } },
            data: { isBookmarked: !existing.isBookmarked },
        });
    }
    return prisma.questionProgress.create({
        data: { userId, questionId, isBookmarked: true, isSolved: false },
    });
}

export async function getQuestionStats(userId?: string, categorySlug?: string) {
    let categoryIds: string[] | null = null;
    if (categorySlug) {
        const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
        if (category) {
            const children = await prisma.category.findMany({ where: { parentId: category.id } });
            categoryIds = [category.id, ...children.map((c) => c.id)];
        } else {
            return { total: 0, easy: 0, medium: 0, hard: 0, solved: 0, bookmarked: 0, solvedEasy: 0, solvedMedium: 0, solvedHard: 0 };
        }
    }

    const questionWhere: any = categoryIds ? { categoryId: { in: categoryIds } } : {};

    const totalCounts = await prisma.question.groupBy({
        by: ["difficulty"],
        where: questionWhere,
        _count: true,
    });

    const total = totalCounts.reduce((sum, r) => sum + r._count, 0);
    const easy = totalCounts.find((r) => r.difficulty === "EASY")?._count || 0;
    const medium = totalCounts.find((r) => r.difficulty === "MEDIUM")?._count || 0;
    const hard = totalCounts.find((r) => r.difficulty === "HARD")?._count || 0;

    let solved = 0;
    let bookmarked = 0;
    let solvedEasy = 0;
    let solvedMedium = 0;
    let solvedHard = 0;

    if (userId) {
        const progressQuestionWhere = categoryIds ? { categoryId: { in: categoryIds } } : {};

        const allSolved = await prisma.questionProgress.findMany({
            where: { userId, isSolved: true, question: progressQuestionWhere },
            select: { question: { select: { difficulty: true } } },
        });

        solved = allSolved.length;
        solvedEasy = allSolved.filter((p) => p.question.difficulty === "EASY").length;
        solvedMedium = allSolved.filter((p) => p.question.difficulty === "MEDIUM").length;
        solvedHard = allSolved.filter((p) => p.question.difficulty === "HARD").length;

        bookmarked = await prisma.questionProgress.count({
            where: { userId, isBookmarked: true, question: progressQuestionWhere },
        });
    }

    return { total, easy, medium, hard, solved, bookmarked, solvedEasy, solvedMedium, solvedHard };
}

export async function findSolvedQuestions(userId: string, options: { skip: number; take: number }) {
    const [progress, total] = await Promise.all([
        prisma.questionProgress.findMany({
            where: { userId, isSolved: true },
            include: {
                question: {
                    include: {
                        questionSet: { include: { language: true, field: true } },
                        category: true,
                    },
                },
            },
            orderBy: { viewedAt: "desc" },
            skip: options.skip,
            take: options.take,
        }),
        prisma.questionProgress.count({ where: { userId, isSolved: true } }),
    ]);

    const questions = progress.map((p: any) => ({
        ...p.question,
        isSolved: true,
        isBookmarked: p.isBookmarked,
    }));

    return { questions, total };
}

export async function findBookmarkedQuestions(userId: string, options: { skip: number; take: number }) {
    const [progress, total] = await Promise.all([
        prisma.questionProgress.findMany({
            where: { userId, isBookmarked: true },
            include: {
                question: {
                    include: {
                        questionSet: { include: { language: true, field: true } },
                        category: true,
                    },
                },
            },
            orderBy: { viewedAt: "desc" },
            skip: options.skip,
            take: options.take,
        }),
        prisma.questionProgress.count({ where: { userId, isBookmarked: true } }),
    ]);

    const questions = progress.map((p: any) => ({
        ...p.question,
        isSolved: p.isSolved,
        isBookmarked: true,
    }));

    return { questions, total };
}