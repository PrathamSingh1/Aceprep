export interface GetQuestionsInput {
    languageId?: string;
    fieldId?: string;
    difficulty?: "EASY" | "MEDIUM" | "HARD";
    search?: string;
    page?: number;
}