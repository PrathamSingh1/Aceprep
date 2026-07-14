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
};