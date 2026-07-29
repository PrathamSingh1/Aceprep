import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,

})

const prisma = new PrismaClient({
    adapter
});


async function main() {
    await prisma.language.createMany({
        data: [
            { name: "JavaScript", slug: "javascript", icon: "🟨", sortOrder: 1 },
            { name: "TypeScript", slug: "typescript", icon: "🔷", sortOrder: 2 },
            { name: "React", slug: "react", icon: "⚛️", sortOrder: 3 },
            { name: "Next.js", slug: "nextjs", icon: "▲", sortOrder: 4 },
            { name: "Node.js", slug: "nodejs", icon: "🟩", sortOrder: 5 },
            { name: "Python", slug: "python", icon: "🐍", sortOrder: 6 },
        ],
    });

    await prisma.field.createMany({
        data: [
            { name: "Frontend", slug: "frontend", icon: "🎨", sortOrder: 1 },
            { name: "Backend", slug: "backend", icon: "⚙️", sortOrder: 2 },
            { name: "System Design", slug: "system-design", icon: "🏗️", sortOrder: 3 },
            { name: "DSA", slug: "dsa", icon: "📊", sortOrder: 4 },
            { name: "DevOps", slug: "devops", icon: "🚀", sortOrder: 5 },
        ],
    });

    // Top-level groups (parentId: null)
    const hiring = await prisma.category.create({
        data: { name: "Hiring", slug: "hiring", icon: "💼", sortOrder: 1 },
    });
    const library = await prisma.category.create({
        data: { name: "Library", slug: "library", icon: "📚", sortOrder: 2 },
    });
    const aiMl = await prisma.category.create({
        data: { name: "AI and Machine Learning", slug: "ai-ml", icon: "🤖", sortOrder: 3 },
    });
    const systemDesign = await prisma.category.create({
        data: { name: "System Design", slug: "system-design", icon: "🏗️", sortOrder: 4 },
    });
    const fundamentals = await prisma.category.create({
        data: { name: "Fundamentals", slug: "fundamentals", icon: "📐", sortOrder: 5 },
    });

    // Hiring children
    await prisma.category.createMany({
        data: [
            { name: "All Jobs", slug: "all-jobs", icon: "💼", parentId: hiring.id, sortOrder: 1 },
            { name: "Internships", slug: "internships", icon: "🎓", parentId: hiring.id, sortOrder: 2 },
            { name: "Companies", slug: "companies", icon: "🏢", parentId: hiring.id, sortOrder: 3 },
        ],
    });

    // Library children
    await prisma.category.createMany({
        data: [
            { name: "Interview Questions", slug: "interview-questions", icon: "❓", parentId: library.id, sortOrder: 1 },
            { name: "DSA", slug: "dsa", icon: "🧮", parentId: library.id, sortOrder: 2 },
            { name: "Projects", slug: "projects", icon: "📁", parentId: library.id, sortOrder: 3 },
            { name: "HR Questions", slug: "hr-questions", icon: "🗣️", parentId: library.id, sortOrder: 4 },
            { name: "Scenario Based Questions", slug: "scenario-based", icon: "📋", parentId: library.id, sortOrder: 5 },
            { name: "Aptitude Questions", slug: "aptitude", icon: "🧩", parentId: library.id, sortOrder: 6 },
            { name: "Core CS Subjects", slug: "core-cs", icon: "💻", parentId: library.id, sortOrder: 7 },
        ],
    });

    // AI and Machine Learning children
    await prisma.category.createMany({
        data: [
            { name: "Agentic AI", slug: "agentic-ai", icon: "🧠", parentId: aiMl.id, sortOrder: 1 },
            { name: "AI & ML Questions", slug: "ai-ml-questions", icon: "📊", parentId: aiMl.id, sortOrder: 2 },
            { name: "SQL Questions", slug: "sql", icon: "🗃️", parentId: aiMl.id, sortOrder: 3 },
        ],
    });

    // System Design children
    await prisma.category.createMany({
        data: [
            { name: "High Level Design", slug: "high-level-design", icon: "🔍", parentId: systemDesign.id, sortOrder: 1 },
            { name: "Low Level Design", slug: "low-level-design", icon: "🔬", parentId: systemDesign.id, sortOrder: 2 },
        ],
    });

    // Fundamentals children
    await prisma.category.createMany({
        data: [
            { name: "OOPs Concepts", slug: "oops", icon: "🔷", parentId: fundamentals.id, sortOrder: 1 },
            { name: "Computer Network", slug: "computer-network", icon: "🌐", parentId: fundamentals.id, sortOrder: 2 },
            { name: "Operating System", slug: "operating-system", icon: "⚙️", parentId: fundamentals.id, sortOrder: 3 },
            { name: "DBMS", slug: "dbms", icon: "🗄️", parentId: fundamentals.id, sortOrder: 4 },
        ],
    });

    // =====================
    // SEED SAMPLE COMPANIES
    // =====================
    await prisma.company.createMany({
        data: [
            { name: "Google", slug: "google" },
            { name: "Microsoft", slug: "microsoft" },
            { name: "Amazon", slug: "amazon" },
            { name: "Meta", slug: "meta" },
            { name: "Apple", slug: "apple" },
        ],
    });

    // =====================
    // SEED SAMPLE QUESTIONS PER CATEGORY
    // =====================

    // Get category IDs for seeding questions
    const interviewQs = await prisma.category.findUnique({ where: { slug: "interview-questions" } });
    const dsa = await prisma.category.findUnique({ where: { slug: "dsa" } });
    const hrQs = await prisma.category.findUnique({ where: { slug: "hr-questions" } });
    const scenarioQs = await prisma.category.findUnique({ where: { slug: "scenario-based" } });
    const oops = await prisma.category.findUnique({ where: { slug: "oops" } });
    const cn = await prisma.category.findUnique({ where: { slug: "computer-network" } });
    const os = await prisma.category.findUnique({ where: { slug: "operating-system" } });
    const dbms = await prisma.category.findUnique({ where: { slug: "dbms" } });
    const sql = await prisma.category.findUnique({ where: { slug: "sql" } });
    const hld = await prisma.category.findUnique({ where: { slug: "high-level-design" } });
    const lld = await prisma.category.findUnique({ where: { slug: "low-level-design" } });
    const agentic = await prisma.category.findUnique({ where: { slug: "agentic-ai" } });

    const sampleQuestions = [
        // Interview Questions
        { content: "What is a closure?", answer: "A closure is a function that...", difficulty: "EASY" as const, categoryId: interviewQs!.id },
        { content: "Explain the event loop", answer: "The event loop is...", difficulty: "MEDIUM" as const, categoryId: interviewQs!.id },

        // DSA
        { content: "Explain Big O notation", answer: "Big O notation describes...", difficulty: "EASY" as const, categoryId: dsa!.id },
        { content: "Implement a binary search tree", answer: "A BST is a tree where...", difficulty: "HARD" as const, categoryId: dsa!.id },

        // HR Questions
        { content: "Tell me about yourself", answer: "Start with your background...", difficulty: "EASY" as const, categoryId: hrQs!.id },

        // Scenario Based
        { content: "How would you design a URL shortener?", answer: "Use a hash function...", difficulty: "MEDIUM" as const, categoryId: scenarioQs!.id },

        // OOPs
        { content: "What is polymorphism?", answer: "Polymorphism allows...", difficulty: "EASY" as const, categoryId: oops!.id },

        // Computer Network
        { content: "What is the difference between TCP and UDP?", answer: "TCP is connection-oriented...", difficulty: "MEDIUM" as const, categoryId: cn!.id },

        // OS
        { content: "What is a deadlock?", answer: "A deadlock occurs when...", difficulty: "MEDIUM" as const, categoryId: os!.id },

        // DBMS
        { content: "What is normalization?", answer: "Normalization is the process...", difficulty: "EASY" as const, categoryId: dbms!.id },

        // SQL
        { content: "What is the difference between DELETE and TRUNCATE?", answer: "DELETE removes rows one by one...", difficulty: "EASY" as const, categoryId: sql!.id },

        // HLD
        { content: "Design a chat application", answer: "Use WebSockets for real-time...", difficulty: "HARD" as const, categoryId: hld!.id },

        // LLD
        { content: "Design a parking lot system", answer: "Use OOP principles...", difficulty: "HARD" as const, categoryId: lld!.id },

        // Agentic AI
        { content: "What is an AI agent?", answer: "An AI agent is...", difficulty: "MEDIUM" as const, categoryId: agentic!.id },
    ];

    for (let i = 0; i < sampleQuestions.length; i++) {
        const q = sampleQuestions[i];
        await prisma.question.create({
            data: {
                content: q.content,
                answer: q.answer,
                difficulty: q.difficulty,
                categoryId: q.categoryId,
                order: i + 1,
            },
        });
    }

    console.log("Seeded categories, companies, and sample questions");
}


main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());