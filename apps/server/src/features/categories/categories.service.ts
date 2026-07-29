import * as categoriesRepo from "./categories.repository.js";

export async function getCategoryTree() {
    return categoriesRepo.findRootCategories();
}

export async function getCategoryQuestions(
    slug: string,
    filters: { page?: number; difficulty?: string },
    userId?: string
) {
    const PAGE_SIZE = 10;
    const page = filters.page || 1;

    const { questions, total } = await categoriesRepo.findQuestionsByCategorySlug(slug, {
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        difficulty: filters.difficulty,
    });

    const totalPages = Math.ceil(total / PAGE_SIZE);

    return {
        questions,
        pagination: { page, totalPages, totalQuestions: total },
    };
}