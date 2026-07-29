import apiClient from "@/lib/api-client";

export const adminApi = {
    // Dashboard
    getDashboard: () => apiClient.get("/admin/dashboard"),

    // Users
    getUsers: (params?: { search?: string; role?: string; isPremium?: string; page?: number }) =>
        apiClient.get("/admin/users", { params }),
    getUserDetail: (id: string) => apiClient.get(`/admin/users/${id}`),
    updateUserRole: (id: string, role: string) => apiClient.patch(`/admin/users/${id}/role`, { role }),
    togglePremium: (id: string, data: { isPremiumActive: boolean; tier?: string; expiryDate?: string }) =>
        apiClient.patch(`/admin/users/${id}/premium`, data),
    deleteUser: (id: string) => apiClient.delete(`/admin/users/${id}`),

    // Categories
    getCategories: () => apiClient.get("/admin/categories"),
    createCategory: (data: { name: string; slug: string; parentId?: string; sortOrder?: number }) =>
        apiClient.post("/admin/categories", data),
    updateCategory: (id: string, data: any) => apiClient.patch(`/admin/categories/${id}`, data),
    deleteCategory: (id: string) => apiClient.delete(`/admin/categories/${id}`),

    // Questions
    getQuestions: (params?: { search?: string; difficulty?: string; categoryId?: string; fieldId?: string; page?: number }) =>
        apiClient.get("/admin/questions", { params }),
    createQuestion: (data: any) => apiClient.post("/admin/questions", data),
    updateQuestion: (id: string, data: any) => apiClient.patch(`/admin/questions/${id}`, data),

    // Purchases
    getPurchases: (params?: { page?: number }) => apiClient.get("/admin/purchases", { params }),

    // Coupons
    getCoupons: () => apiClient.get("/admin/coupons"),
    createCoupon: (data: any) => apiClient.post("/admin/coupons", data),
    deleteCoupon: (id: string) => apiClient.delete(`/admin/coupons/${id}`),
};
