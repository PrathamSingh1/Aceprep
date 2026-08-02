import { prisma } from "../../lib/prisma.js";

// ─── Jobs ─────────────────────────────────────────

export async function findJobs(params: {
    type?: string;
    search?: string;
    tag?: string;
    companyId?: string;
    userId?: string;
    filter?: string;
    page: number;
    pageSize: number;
}) {
    const where: any = { isActive: true };
    if (params.type) where.type = params.type;
    if (params.companyId) where.companyId = params.companyId;
    if (params.search) {
        where.OR = [
            { title: { contains: params.search, mode: "insensitive" } },
            { company: { name: { contains: params.search, mode: "insensitive" } } },
        ];
    }
    if (params.tag) {
        if (params.tag === "Startup") where.isStartup = true;
        else if (params.tag === "Remote") where.isRemote = true;
        else if (params.tag === "HFT") where.isHFT = true;
        else where.tags = { has: params.tag };
    }

    if (params.userId && params.filter) {
        if (params.filter === "saved") {
            where.savedJobs = { some: { userId: params.userId } };
        } else if (params.filter === "applied") {
            where.jobApplications = { some: { userId: params.userId, status: "APPLIED" } };
        } else if (params.filter === "in_progress") {
            where.jobApplications = { some: { userId: params.userId, status: "IN_PROGRESS" } };
        }
    }

    const [jobs, total] = await Promise.all([
        prisma.job.findMany({
            where,
            skip: (params.page - 1) * params.pageSize,
            take: params.pageSize,
            orderBy: { postedAt: "desc" },
            include: {
                company: { select: { id: true, name: true, slug: true, logo: true } },
            },
        }),
        prisma.job.count({ where }),
    ]);

    let enrichedJobs = jobs;

    if (params.userId) {
        const jobIds = jobs.map((j) => j.id);
        const [savedRecords, applicationRecords] = await Promise.all([
            prisma.savedJob.findMany({
                where: { userId: params.userId, jobId: { in: jobIds } },
                select: { jobId: true },
            }),
            prisma.jobApplication.findMany({
                where: { userId: params.userId, jobId: { in: jobIds } },
                select: { jobId: true, status: true },
            }),
        ]);

        const savedSet = new Set(savedRecords.map((r) => r.jobId));
        const statusMap = new Map(applicationRecords.map((r) => [r.jobId, r.status]));

        enrichedJobs = jobs.map((job) => ({
            ...job,
            isSaved: savedSet.has(job.id),
            applicationStatus: statusMap.get(job.id) || null,
        }));
    } else {
        enrichedJobs = jobs.map((job) => ({
            ...job,
            isSaved: false,
            applicationStatus: null,
        }));
    }

    return { jobs: enrichedJobs, total, totalPages: Math.ceil(total / params.pageSize) };
}

export async function findJobCountsByType() {
    const where = { isActive: true };
    const [allJobs, internships] = await Promise.all([
        prisma.job.count({ where: { ...where, type: "FULL_TIME" } }),
        prisma.job.count({ where: { ...where, type: "INTERNSHIP" } }),
    ]);
    return { allJobs, internships };
}

export async function findCompanyJobCounts() {
    const companies = await prisma.company.findMany({
        where: { jobs: { some: { isActive: true } } },
        select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            website: true,
            _count: { select: { jobs: { where: { isActive: true } } } },
        },
        orderBy: { name: "asc" },
    });
    return companies;
}

export async function findCompanyById(id: string) {
    return prisma.company.findUnique({
        where: { id },
        include: {
            jobs: {
                where: { isActive: true },
                orderBy: { postedAt: "desc" },
            },
        },
    });
}

// ─── Save / Apply ────────────────────────────────

export async function toggleSaveJob(userId: string, jobId: string) {
    const existing = await prisma.savedJob.findUnique({
        where: { userId_jobId: { userId, jobId } },
    });

    if (existing) {
        await prisma.savedJob.delete({ where: { id: existing.id } });
        return { saved: false };
    }

    await prisma.savedJob.create({ data: { userId, jobId } });
    return { saved: true };
}

export async function setJobApplicationStatus(userId: string, jobId: string, status: string | null) {
    if (!status) {
        const existing = await prisma.jobApplication.findUnique({
            where: { userId_jobId: { userId, jobId } },
        });
        if (existing) {
            await prisma.jobApplication.delete({ where: { id: existing.id } });
        }
        return { status: null };
    }

    const existing = await prisma.jobApplication.findUnique({
        where: { userId_jobId: { userId, jobId } },
    });

    if (existing) {
        const updated = await prisma.jobApplication.update({
            where: { id: existing.id },
            data: { status: status as any },
        });
        return { status: updated.status };
    }

    const created = await prisma.jobApplication.create({
        data: { userId, jobId, status: status as any },
    });
    return { status: created.status };
}

export async function getUserJobStatuses(userId: string) {
    const [saved, applications] = await Promise.all([
        prisma.savedJob.findMany({
            where: { userId },
            select: { jobId: true },
        }),
        prisma.jobApplication.findMany({
            where: { userId },
            select: { jobId: true, status: true },
        }),
    ]);

    return {
        saved: saved.map((r) => r.jobId),
        applied: applications.filter((a) => a.status === "APPLIED").map((a) => a.jobId),
        inProgress: applications.filter((a) => a.status === "IN_PROGRESS").map((a) => a.jobId),
    };
}
