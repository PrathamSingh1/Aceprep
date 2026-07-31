import * as adminRepo from "./admin.repository.js";

// ─── Dashboard ────────────────────────────────────

export async function getDashboardStats() {
    return adminRepo.getDashboardStats();
}

// ─── Users ────────────────────────────────────────

export async function getUsers(params: {
    search?: string;
    role?: string;
    isPremium?: string;
    page?: number;
}) {
    const page = params.page || 1;
    const pageSize = 20;
    const isPremium = params.isPremium === "true" ? true : params.isPremium === "false" ? false : undefined;
    return adminRepo.findUsers({ ...params, isPremium, page, pageSize });
}

export async function getUserDetail(id: string) {
    const user = await adminRepo.findUserById(id);
    if (!user) throw new Error("User not found");
    return user;
}

export async function updateUserRole(id: string, role: string) {
    return adminRepo.updateUserRole(id, role);
}

export async function toggleUserPremium(id: string, body: { isPremiumActive: boolean; tier?: string; expiryDate?: string }) {
    return adminRepo.togglePremium(
        id,
        body.isPremiumActive,
        body.tier,
        body.expiryDate ? new Date(body.expiryDate) : undefined,
    );
}

export async function deleteUser(id: string) {
    return adminRepo.deleteUser(id);
}

// ─── Categories ───────────────────────────────────

export async function getCategories() {
    return adminRepo.findAllCategories();
}

export async function createCategory(data: { name: string; slug: string; parentId?: string; sortOrder?: number }) {
    return adminRepo.createCategory(data);
}

export async function updateCategory(id: string, data: any) {
    return adminRepo.updateCategory(id, data);
}

export async function deleteCategory(id: string) {
    return adminRepo.deleteCategory(id);
}

// ─── Questions ────────────────────────────────────

export async function getQuestions(params: {
    search?: string;
    difficulty?: string;
    categoryId?: string;
    fieldId?: string;
    page?: number;
}) {
    const page = params.page || 1;
    const pageSize = 20;
    return adminRepo.findAllQuestions({ ...params, page, pageSize });
}

export async function createQuestion(data: {
    content: string;
    answer: string;
    difficulty?: string;
    categoryId?: string;
    fieldId?: string;
    tags?: string[];
}) {
    return adminRepo.createQuestion(data);
}

export async function updateQuestion(id: string, data: any) {
    return adminRepo.updateQuestion(id, data);
}

// ─── Purchases ────────────────────────────────────

export async function getPurchases(params: { page?: number }) {
    const page = params.page || 1;
    const pageSize = 20;
    return adminRepo.findAllPurchases({ page, pageSize });
}

// ─── Coupons ──────────────────────────────────────

export async function getCoupons() {
    return adminRepo.findAllCoupons();
}

export async function createCoupon(data: {
    code: string;
    type: string;
    value: number;
    maxUses?: number;
    validUntil?: string;
}) {
    return adminRepo.createCoupon({
        code: data.code,
        type: data.type,
        value: data.value,
        maxUses: data.maxUses,
        validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
    });
}

export async function deleteCoupon(id: string) {
    return adminRepo.deleteCoupon(id);
}

// ─── Companies ────────────────────────────────────

export async function getCompanies(params: { search?: string; page?: number }) {
    const page = params.page || 1;
    const pageSize = 20;
    return adminRepo.findAllCompanies({ search: params.search, page, pageSize });
}

export async function createCompany(data: { name: string; slug: string; logo?: string; website?: string }) {
    return adminRepo.createCompany(data);
}

export async function updateCompany(id: string, data: any) {
    return adminRepo.updateCompany(id, data);
}

export async function deleteCompany(id: string) {
    return adminRepo.deleteCompany(id);
}

// ─── Jobs ─────────────────────────────────────────

export async function getJobs(params: { search?: string; type?: string; companyId?: string; page?: number }) {
    const page = params.page || 1;
    const pageSize = 20;
    return adminRepo.findJobs({ ...params, page, pageSize });
}

export async function createJob(data: any) {
    return adminRepo.createJob(data);
}

export async function updateJob(id: string, data: any) {
    return adminRepo.updateJob(id, data);
}

export async function deleteJob(id: string) {
    return adminRepo.deleteJob(id);
}
