import { prisma } from "../../lib/prisma.js";

export async function findJobs(params: {
    type?: string;
    search?: string;
    tag?: string;
    companyId?: string;
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

    return { jobs, total, totalPages: Math.ceil(total / params.pageSize) };
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
