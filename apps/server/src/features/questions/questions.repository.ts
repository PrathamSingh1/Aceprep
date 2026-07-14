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

    return prisma.question.findMany({
        where: prismaWhere,
        skip: options.skip,
        take: options.take,
        orderBy: { order: "asc" },
        include: {
            questionSet: {
                include: { language: true, field: true },
            },
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