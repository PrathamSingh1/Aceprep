import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    // Upsert languages (won't fail if they exist)
    const languages = ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python"];
    for (let i = 0; i < languages.length; i++) {
        const slug = languages[i].toLowerCase().replace(/[.\s]+/g, "-");
        await prisma.language.upsert({
            where: { slug },
            update: { sortOrder: i + 1 },
            create: { name: languages[i], slug, sortOrder: i + 1 },
        });
    }

    // Upsert fields
    const fieldData = [
        { name: "Frontend", slug: "frontend", sortOrder: 1 },
        { name: "Backend", slug: "backend", sortOrder: 2 },
        { name: "System Design", slug: "system-design", sortOrder: 3 },
        { name: "DSA", slug: "dsa", sortOrder: 4 },
        { name: "DevOps", slug: "devops", sortOrder: 5 },
    ];
    for (const f of fieldData) {
        await prisma.field.upsert({
            where: { slug: f.slug },
            update: { sortOrder: f.sortOrder },
            create: f,
        });
    }

    // Upsert categories (won't fail if they exist)
    const hiring = await prisma.category.upsert({
        where: { slug: "hiring" },
        update: {},
        create: { name: "Hiring", slug: "hiring", sortOrder: 1 },
    });
    const library = await prisma.category.upsert({
        where: { slug: "library" },
        update: {},
        create: { name: "Library", slug: "library", sortOrder: 2 },
    });
    const aiMl = await prisma.category.upsert({
        where: { slug: "ai-ml" },
        update: {},
        create: { name: "AI and Machine Learning", slug: "ai-ml", sortOrder: 3 },
    });
    const systemDesign = await prisma.category.upsert({
        where: { slug: "system-design" },
        update: {},
        create: { name: "System Design", slug: "system-design", sortOrder: 4 },
    });
    const fundamentals = await prisma.category.upsert({
        where: { slug: "fundamentals" },
        update: {},
        create: { name: "Fundamentals", slug: "fundamentals", sortOrder: 5 },
    });

    // Upsert child categories
    const childCategories = [
        { name: "All Jobs", slug: "all-jobs", parentId: hiring.id, sortOrder: 1 },
        { name: "Internships", slug: "internships", parentId: hiring.id, sortOrder: 2 },
        { name: "Companies", slug: "companies", parentId: hiring.id, sortOrder: 3 },
        { name: "Interview Questions", slug: "interview-questions", parentId: library.id, sortOrder: 1 },
        { name: "DSA", slug: "dsa", parentId: library.id, sortOrder: 2 },
        { name: "Projects", slug: "projects", parentId: library.id, sortOrder: 3 },
        { name: "HR Questions", slug: "hr-questions", parentId: library.id, sortOrder: 4 },
        { name: "Scenario Based Questions", slug: "scenario-based", parentId: library.id, sortOrder: 5 },
        { name: "Aptitude Questions", slug: "aptitude", parentId: library.id, sortOrder: 6 },
        { name: "Core CS Subjects", slug: "core-cs", parentId: library.id, sortOrder: 7 },
        { name: "Agentic AI", slug: "agentic-ai", parentId: aiMl.id, sortOrder: 1 },
        { name: "AI & ML Questions", slug: "ai-ml-questions", parentId: aiMl.id, sortOrder: 2 },
        { name: "SQL Questions", slug: "sql", parentId: aiMl.id, sortOrder: 3 },
        { name: "High Level Design", slug: "high-level-design", parentId: systemDesign.id, sortOrder: 1 },
        { name: "Low Level Design", slug: "low-level-design", parentId: systemDesign.id, sortOrder: 2 },
        { name: "OOPs Concepts", slug: "oops", parentId: fundamentals.id, sortOrder: 1 },
        { name: "Computer Network", slug: "computer-network", parentId: fundamentals.id, sortOrder: 2 },
        { name: "Operating System", slug: "operating-system", parentId: fundamentals.id, sortOrder: 3 },
        { name: "DBMS", slug: "dbms", parentId: fundamentals.id, sortOrder: 4 },
    ];
    for (const c of childCategories) {
        await prisma.category.upsert({
            where: { slug: c.slug },
            update: {},
            create: c,
        });
    }

    // Upsert companies
    const companyData = ["Google", "Microsoft", "Amazon", "Meta", "Apple"];
    for (const name of companyData) {
        const slug = name.toLowerCase();
        await prisma.company.upsert({
            where: { slug },
            update: {},
            create: { name, slug },
        });
    }

    // Delete ALL existing category-based questions (questions without questionSetId)
    await prisma.question.deleteMany({
        where: { questionSetId: null },
    });

    // Get IDs
    const interviewQs = await prisma.category.findUnique({ where: { slug: "interview-questions" } });
    const dsa = await prisma.category.findUnique({ where: { slug: "dsa" } });
    const hrQs = await prisma.category.findUnique({ where: { slug: "hr-questions" } });
    const scenarioQs = await prisma.category.findUnique({ where: { slug: "scenario-based" } });
    const oops = await prisma.category.findUnique({ where: { slug: "oops" } });
    const cn = await prisma.category.findUnique({ where: { slug: "computer-network" } });
    const os = await prisma.category.findUnique({ where: { slug: "operating-system" } });
    const dbmsCat = await prisma.category.findUnique({ where: { slug: "dbms" } });
    const sql = await prisma.category.findUnique({ where: { slug: "sql" } });
    const hld = await prisma.category.findUnique({ where: { slug: "high-level-design" } });
    const lld = await prisma.category.findUnique({ where: { slug: "low-level-design" } });
    const agentic = await prisma.category.findUnique({ where: { slug: "agentic-ai" } });

    const frontend = await prisma.field.findUnique({ where: { slug: "frontend" } });
    const backend = await prisma.field.findUnique({ where: { slug: "backend" } });
    const sysDesign = await prisma.field.findUnique({ where: { slug: "system-design" } });
    const dsaField = await prisma.field.findUnique({ where: { slug: "dsa" } });

    // Create fresh questions with fieldId
    const sampleQuestions = [
        // Interview Questions
        { content: "What is a closure?", answer: "A closure is a function that has access to variables from its outer (enclosing) scope even after the outer function has returned. Closures are created every time a function is created.", difficulty: "EASY" as const, categoryId: interviewQs!.id, fieldId: frontend!.id },
        { content: "Explain the event loop", answer: "The event loop is a mechanism that allows Node.js to perform non-blocking I/O operations. Despite JavaScript being single-threaded, the event loop offloads operations to the system kernel.", difficulty: "MEDIUM" as const, categoryId: interviewQs!.id, fieldId: backend!.id },
        { content: "What is hoisting?", answer: "Hoisting is JavaScript's behavior of moving declarations to the top of their scope during compilation. var declarations are hoisted with undefined initialization, while let/const are hoisted but not initialized (temporal dead zone).", difficulty: "EASY" as const, categoryId: interviewQs!.id, fieldId: frontend!.id },
        { content: "Explain Promise and async/await", answer: "Promises represent the eventual completion or failure of an async operation. async/await is syntactic sugar over promises that makes asynchronous code look synchronous.", difficulty: "MEDIUM" as const, categoryId: interviewQs!.id, fieldId: frontend!.id },
        { content: "What is middleware in Express?", answer: "Middleware functions are functions that have access to the request object, response object, and the next middleware function. They can execute code, modify request/response, and end the request-response cycle.", difficulty: "EASY" as const, categoryId: interviewQs!.id, fieldId: backend!.id },
        { content: "How does React Virtual DOM work?", answer: "React creates a lightweight copy of the real DOM (Virtual DOM). When state changes, a new Virtual DOM tree is created, compared with the previous one (diffing), and only the minimal necessary changes are applied to the real DOM (reconciliation).", difficulty: "MEDIUM" as const, categoryId: interviewQs!.id, fieldId: frontend!.id },

        // DSA
        { content: "Explain Big O notation", answer: "Big O notation describes the upper bound of an algorithm's time or space complexity. It gives the worst-case scenario for how an algorithm scales with input size.", difficulty: "EASY" as const, categoryId: dsa!.id, fieldId: dsaField!.id },
        { content: "Implement a binary search tree", answer: "A BST is a tree where left child < parent < right child. Operations like search, insert, and delete take O(log n) average time.", difficulty: "HARD" as const, categoryId: dsa!.id, fieldId: dsaField!.id },
        { content: "What is a hash map?", answer: "A hash map uses a hash function to map keys to array indices, allowing O(1) average time for insert, delete, and lookup operations.", difficulty: "EASY" as const, categoryId: dsa!.id, fieldId: dsaField!.id },
        { content: "Explain graph traversal algorithms", answer: "BFS explores nodes level by level using a queue. DFS explores as deep as possible along each branch before backtracking, using a stack or recursion.", difficulty: "MEDIUM" as const, categoryId: dsa!.id, fieldId: dsaField!.id },

        // HR Questions
        { content: "Tell me about yourself", answer: "Start with your background, then mention relevant experience and skills, and end with why you are interested in this role. Keep it concise and relevant to the job.", difficulty: "EASY" as const, categoryId: hrQs!.id, fieldId: frontend!.id },
        { content: "Why should we hire you?", answer: "Highlight your skills that match the job requirements, give examples of past achievements, and show enthusiasm for the role and company.", difficulty: "EASY" as const, categoryId: hrQs!.id, fieldId: frontend!.id },
        { content: "Where do you see yourself in 5 years?", answer: "Focus on growth and learning. Show that you want to develop your skills and take on more responsibility within the company.", difficulty: "EASY" as const, categoryId: hrQs!.id, fieldId: backend!.id },

        // Scenario Based
        { content: "How would you design a URL shortener?", answer: "Use a hash function to generate short URLs. Store mappings in a database with TTL for expiration. Use base62 encoding for shorter URLs.", difficulty: "MEDIUM" as const, categoryId: scenarioQs!.id, fieldId: sysDesign!.id },
        { content: "Design a real-time chat application", answer: "Use WebSockets for real-time bidirectional communication. Store messages in a database with timestamps. Implement rooms/channels for group messaging.", difficulty: "HARD" as const, categoryId: scenarioQs!.id, fieldId: sysDesign!.id },
        { content: "How would you handle 1 million concurrent users?", answer: "Use load balancing, horizontal scaling, caching (Redis), CDN for static assets, database sharding, and asynchronous processing with message queues.", difficulty: "HARD" as const, categoryId: scenarioQs!.id, fieldId: sysDesign!.id },

        // OOPs
        { content: "What is polymorphism?", answer: "Polymorphism allows objects of different types to be treated as objects of a common parent type. It enables the same interface to represent different underlying forms (data types).", difficulty: "EASY" as const, categoryId: oops!.id, fieldId: frontend!.id },
        { content: "Explain SOLID principles", answer: "S - Single Responsibility, O - Open/Closed, L - Liskov Substitution, I - Interface Segregation, D - Dependency Inversion. These principles help write maintainable and scalable code.", difficulty: "MEDIUM" as const, categoryId: oops!.id, fieldId: backend!.id },

        // Computer Network
        { content: "What is the difference between TCP and UDP?", answer: "TCP is connection-oriented, reliable, and ordered. UDP is connectionless, faster, and does not guarantee delivery or ordering.", difficulty: "MEDIUM" as const, categoryId: cn!.id, fieldId: backend!.id },
        { content: "What is DNS?", answer: "DNS (Domain Name System) translates domain names to IP addresses. It works like a phone book for the internet, allowing users to access websites by name.", difficulty: "EASY" as const, categoryId: cn!.id, fieldId: backend!.id },

        // OS
        { content: "What is a deadlock?", answer: "A deadlock occurs when two or more processes are unable to proceed because each is waiting for the other to release a resource. It requires four conditions: mutual exclusion, hold and wait, no preemption, and circular wait.", difficulty: "MEDIUM" as const, categoryId: os!.id, fieldId: backend!.id },
        { content: "Explain process vs thread", answer: "A process is an independent program with its own memory space. A thread is a lightweight process that shares memory with other threads in the same process.", difficulty: "EASY" as const, categoryId: os!.id, fieldId: backend!.id },

        // DBMS
        { content: "What is normalization?", answer: "Normalization is the process of organizing database tables to reduce data redundancy and improve data integrity. It involves dividing large tables into smaller, well-structured tables.", difficulty: "EASY" as const, categoryId: dbmsCat!.id, fieldId: backend!.id },
        { content: "What is an index in databases?", answer: "An index is a data structure that improves the speed of data retrieval operations on a database table. It works like a book index, allowing faster lookups.", difficulty: "MEDIUM" as const, categoryId: dbmsCat!.id, fieldId: backend!.id },

        // SQL
        { content: "What is the difference between DELETE and TRUNCATE?", answer: "DELETE removes rows one by one with WHERE clause support and logs each deletion. TRUNCATE removes all rows at once, is faster, and resets auto-increment counters.", difficulty: "EASY" as const, categoryId: sql!.id, fieldId: backend!.id },
        { content: "Explain JOIN types in SQL", answer: "INNER JOIN returns matching rows from both tables. LEFT JOIN returns all rows from left table. RIGHT JOIN returns all rows from right table. FULL JOIN returns all rows from both tables.", difficulty: "MEDIUM" as const, categoryId: sql!.id, fieldId: backend!.id },

        // HLD
        { content: "Design a chat application", answer: "Use WebSockets for real-time messaging, Redis for pub/sub, message queue for offline messages, and database sharding for scaling.", difficulty: "HARD" as const, categoryId: hld!.id, fieldId: sysDesign!.id },
        { content: "Design a notification system", answer: "Use message queues (RabbitMQ/Kafka) for async processing, multiple delivery channels (push, email, SMS), and a priority system for different notification types.", difficulty: "HARD" as const, categoryId: hld!.id, fieldId: sysDesign!.id },

        // LLD
        { content: "Design a parking lot system", answer: "Use OOP principles with classes for Vehicle, ParkingSpot, ParkingLot. Implement strategy pattern for different vehicle sizes and payment methods.", difficulty: "HARD" as const, categoryId: lld!.id, fieldId: sysDesign!.id },
        { content: "Design a library management system", answer: "Use design patterns like Factory for book creation, Observer for due date notifications, and Strategy for different membership types.", difficulty: "MEDIUM" as const, categoryId: lld!.id, fieldId: sysDesign!.id },

        // Agentic AI
        { content: "What is an AI agent?", answer: "An AI agent is an autonomous entity that perceives its environment through sensors and acts upon it through actuators. It uses reasoning and decision-making to achieve specific goals.", difficulty: "MEDIUM" as const, categoryId: agentic!.id, fieldId: frontend!.id },
    ];

    for (let i = 0; i < sampleQuestions.length; i++) {
        const q = sampleQuestions[i];
        await prisma.question.create({
            data: {
                content: q.content,
                answer: q.answer,
                difficulty: q.difficulty,
                categoryId: q.categoryId,
                fieldId: q.fieldId,
                order: i + 1,
            },
        });
    }

    console.log("Seed complete: categories, companies, and questions with fieldId");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
