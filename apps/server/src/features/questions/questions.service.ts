import * as questionsRepo from "./questions.repository";
import { prisma } from "../../lib/prisma.js";

export async function getLanguages() {
    return questionsRepo.findManyLanguages({ isActive: true });
}

export async function getFields() {
    return questionsRepo.findManyFields({ isActive: true });
}

export async function getQuestions(
    filters: {
        languageId?: string;
        fieldId?: string;
        difficulty?: string;
        search?: string;
        page?: number;
    },
    userId?: string,
) {
    const PAGE_SIZE = 10;
    const page = filters.page || 1;

    const where: any = {};
    if (filters.languageId) where.languageId = filters.languageId;
    if (filters.fieldId) where.fieldId = filters.fieldId;
    if (filters.difficulty) where.difficulty = filters.difficulty;
    if (filters.search) where.search = filters.search;

    const totalQuestions = await questionsRepo.countQuestions(where);
    const totalPages = Math.ceil(totalQuestions / PAGE_SIZE);

    if (page > 1) {
        if (!userId) {
            return {
                questions: [],
                pagination: { page, totalPages, totalQuestions, isPremiumRequired: true, isLoggedIn: false },
            };
        }
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user?.isPremiumActive) {
            return {
                questions: [],
                pagination: { page, totalPages, totalQuestions, isPremiumRequired: true, isLoggedIn: true },
            };
        }
    }

    const questions = await questionsRepo.findQuestions(where, {
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
    });

    let questionsWithProgress = questions;
    if (userId) {
        const progress = await questionsRepo.getUserProgress(
            userId,
            questions.map((q: any) => q.id),
        );
        questionsWithProgress = questions.map((q: any) => ({
            ...q,
            isBookmarked: progress.find((p: any) => p.questionId === q.id)?.isBookmarked || false,
            isSolved: progress.find((p: any) => p.questionId === q.id)?.isSolved || false,
        }));
    }

    return {
        questions: questionsWithProgress,
        pagination: { page, totalPages, totalQuestions, isPremiumRequired: false, isLoggedIn: !!userId },
    };
}

export async function createSet(data: {
    title: string;
    description?: string;
    languageId: string;
    fieldId: string;
    isPremium?: boolean;
}) {
    return questionsRepo.createSet(data);
}

export async function addQuestion(data: {
    content: string;
    answer: string;
    difficulty?: string;
    tags?: string[];
    questionSetId: string;
}) {
    const set = await questionsRepo.findSetById(data.questionSetId);
    if (!set) throw new Error("Question set not found");

    const order = set.totalQuestions + 1;
    const question = await questionsRepo.createQuestion({
        content: data.content,
        answer: data.answer,
        difficulty: data.difficulty || "MEDIUM",
        tags: data.tags || [],
        questionSetId: data.questionSetId,
        order,
    });

    await questionsRepo.incrementQuestionCount(data.questionSetId);
    return question;
}

export async function deleteQuestion(id: string) {
    return questionsRepo.deleteQuestion(id);
}

export async function deleteSet(id: string) {
    return questionsRepo.deleteSet(id);
}