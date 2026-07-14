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

    console.log("Seeded languages and fields");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());