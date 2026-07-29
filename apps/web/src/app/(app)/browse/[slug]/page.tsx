import { BrowsePage } from "@/features/browse/components/BrowsePage";

const categoryMeta: Record<string, { title: string; description: string }> = {
  "all-jobs": { title: "All Jobs", description: "Browse all job openings" },
  internships: {
    title: "Internships",
    description: "Find internship opportunities",
  },
  companies: { title: "Companies", description: "Explore top companies" },
  "interview-questions": {
    title: "Interview Questions",
    description: "Prepare for interviews with curated questions",
  },
  dsa: { title: "DSA", description: "Data Structures and Algorithms practice" },
  projects: { title: "Projects", description: "Project ideas and resources" },
  "hr-questions": {
    title: "HR Questions",
    description: "Common HR interview questions",
  },
  "scenario-based": {
    title: "Scenario Based Questions",
    description: "Real-world scenario questions",
  },
  aptitude: {
    title: "Aptitude Questions",
    description: "Practice aptitude problems",
  },
  "core-cs": {
    title: "Core CS Subjects",
    description: "Fundamental computer science topics",
  },
  "agentic-ai": {
    title: "Agentic AI",
    description: "AI agent concepts and architectures",
  },
  "ai-ml-questions": {
    title: "AI & ML Questions",
    description: "Machine learning interview questions",
  },
  sql: { title: "SQL Questions", description: "Database query practice" },
  "high-level-design": {
    title: "High Level Design",
    description: "System design at scale",
  },
  "low-level-design": {
    title: "Low Level Design",
    description: "Object-oriented design problems",
  },
  oops: {
    title: "OOPs Concepts",
    description: "Object-oriented programming fundamentals",
  },
  "computer-network": {
    title: "Computer Network",
    description: "Networking concepts and protocols",
  },
  "operating-system": {
    title: "Operating System",
    description: "OS concepts and algorithms",
  },
  dbms: { title: "DBMS", description: "Database management systems" },
};

export default async function BrowseSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = categoryMeta[slug] || { title: slug, description: "" };

  return (
    <BrowsePage
      categorySlug={slug}
      title={meta.title}
      description={meta.description}
    />
  );
}
