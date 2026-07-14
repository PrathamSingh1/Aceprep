import apiClient from "@/lib/api-client";

export const authApi = {
    register: (data: { name: string; email: string; password: string }) =>
        apiClient.post("/auth/register", data),

    login: (data: { email: string; password: string }) =>
        apiClient.post("/auth/login", data),

    googleLogin: (idToken: string) =>
        apiClient.post("/auth/google", { idToken }),

    getMe: () => apiClient.get("/auth/me"),
};