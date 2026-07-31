import * as jobsRepo from "./jobs.repository.js";

export async function getJobs(params: {
    type?: string;
    search?: string;
    tag?: string;
    companyId?: string;
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
