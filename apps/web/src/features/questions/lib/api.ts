import apiClient from "@/lib/api-client";

export const questionsApi = {
    getLanguages: () => apiClient.get("/questions/languages"),
    getFields: () => apiClient.get("/questions/fields"),
    getQuestions: (params: {
        languageId?: string;
        fieldId?: string;
        difficulty?: string;
        search?: string;
        page?: number;
    }) => apiClient.get("/questions", { params }),
    toggleSolved: (questionId: string) =>
        apiClient.post(`/questions/${questionId}/toggle-solved`),
    toggleBookmark: (questionId: string) =>
        apiClient.post(`/questions/${questionId}/toggle-bookmark`),
    getStats: (categorySlug?: string) =>
        apiClient.get("/questions/stats", { params: categorySlug ? { categorySlug } : {} }),
    getSolvedQuestions: (page?: number) =>
        apiClient.get("/questions/solved", { params: { page } }),
    getBookmarkedQuestions: (page?: number) =>
        apiClient.get("/questions/saved", { params: { page } }),
};
