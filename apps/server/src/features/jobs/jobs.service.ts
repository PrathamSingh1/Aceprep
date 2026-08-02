import * as jobsRepo from "./jobs.repository.js";

export async function getJobs(params: {
    type?: string;
    search?: string;
    tag?: string;
    companyId?: string;
    userId?: string;
    filter?: string;
    page?: number;
}) {
    const page = params.page || 1;
    const pageSize = 20;
    return jobsRepo.findJobs({ ...params, page, pageSize });
}

export async function getJobCountsByType() {
    return jobsRepo.findJobCountsByType();
}

export async function getCompanyJobCounts() {
    return jobsRepo.findCompanyJobCounts();
}

export async function getCompanyJobs(companyId: string) {
    return jobsRepo.findCompanyById(companyId);
}

export async function toggleSaveJob(userId: string, jobId: string) {
    return jobsRepo.toggleSaveJob(userId, jobId);
}

export async function setJobApplicationStatus(userId: string, jobId: string, status: string | null) {
    return jobsRepo.setJobApplicationStatus(userId, jobId, status);
}

export async function getUserJobStatuses(userId: string) {
    return jobsRepo.getUserJobStatuses(userId);
}
