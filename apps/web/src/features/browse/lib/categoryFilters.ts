export interface FilterOption {
  label: string;
  value: string;
}

export interface CategoryFilter {
  key: string;
  label: string;
  options?: FilterOption[];
}

export interface CategoryFilterConfig {
  filters: CategoryFilter[];
  columns: { key: string; label: string }[];
}

const allRoles: FilterOption[] = [
  { label: "Frontend", value: "fld_frontend" },
  { label: "Backend", value: "fld_backend" },
  { label: "System Design", value: "fld_sysdesign" },
  { label: "DSA", value: "fld_dsa" },
  { label: "DevOps", value: "fld_devops" },
];

const difficultyOptions: FilterOption[] = [
  { label: "Easy", value: "EASY" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Hard", value: "HARD" },
];

export const categoryFilters: Record<string, CategoryFilterConfig> = {
  // ─── Hiring ──────────────────────────────────────
  "all-jobs": {
    filters: [
      { key: "fieldId", label: "Domain", options: allRoles },
      { key: "difficulty", label: "Experience Level", options: difficultyOptions },
    ],
    columns: [
      { key: "content", label: "Question" },
      { key: "field", label: "Domain" },
      { key: "difficulty", label: "Experience" },
    ],
  },
  internships: {
    filters: [
      { key: "fieldId", label: "Domain", options: allRoles },
      { key: "difficulty", label: "Duration", options: difficultyOptions },
    ],
    columns: [
      { key: "content", label: "Question" },
      { key: "field", label: "Domain" },
      { key: "difficulty", label: "Duration" },
    ],
  },
  companies: {
    filters: [
      { key: "fieldId", label: "Industry", options: allRoles },
    ],
    columns: [
      { key: "content", label: "Question" },
      { key: "field", label: "Industry" },
    ],
  },

  // ─── Library ─────────────────────────────────────
  "interview-questions": {
    filters: [
      { key: "fieldId", label: "Role", options: allRoles },
      { key: "difficulty", label: "Difficulty", options: difficultyOptions },
    ],
    columns: [
      { key: "content", label: "Question" },
      { key: "field", label: "Role" },
      { key: "difficulty", label: "Difficulty" },
    ],
  },
  dsa: {
    filters: [
      { key: "tag", label: "Topic", options: [
        { label: "Arrays", value: "Arrays" },
        { label: "Strings", value: "Strings" },
        { label: "Linked Lists", value: "Linked Lists" },
        { label: "Trees", value: "Trees" },
        { label: "Graphs", value: "Graphs" },
        { label: "Dynamic Programming", value: "Dynamic Programming" },
        { label: "Sorting", value: "Sorting" },
        { label: "Searching", value: "Searching" },
        { label: "Recursion", value: "Recursion" },
        { label: "Stacks & Queues", value: "Stacks & Queues" },
        { label: "Hashmaps", value: "Hashmaps" },
        { label: "Greedy", value: "Greedy" },
      ]},
      { key: "difficulty", label: "Difficulty", options: difficultyOptions },
    ],
    columns: [
      { key: "content", label: "Question" },
      { key: "tags", label: "Topic" },
      { key: "difficulty", label: "Difficulty" },
    ],
  },
  projects: {
    filters: [
      { key: "fieldId", label: "Technology", options: allRoles },
      { key: "difficulty", label: "Complexity", options: difficultyOptions },
    ],
    columns: [
      { key: "content", label: "Question" },
      { key: "field", label: "Technology" },
      { key: "difficulty", label: "Complexity" },
    ],
  },
  "hr-questions": {
    filters: [
      { key: "tag", label: "Type", options: [
        { label: "Behavioral", value: "Behavioral" },
        { label: "Situational", value: "Situational" },
        { label: "Personal", value: "Personal" },
        { label: "Technical", value: "Technical" },
        { label: "Cultural Fit", value: "Cultural Fit" },
        { label: "Leadership", value: "Leadership" },
      ]},
      { key: "difficulty", label: "Difficulty", options: difficultyOptions },
    ],
    columns: [
      { key: "content", label: "Question" },
      { key: "tags", label: "Type" },
      { key: "difficulty", label: "Difficulty" },
    ],
  },
  "scenario-based": {
    filters: [
      { key: "fieldId", label: "Domain", options: allRoles },
      { key: "difficulty", label: "Complexity", options: difficultyOptions },
    ],
    columns: [
      { key: "content", label: "Question" },
      { key: "field", label: "Domain" },
      { key: "difficulty", label: "Complexity" },
    ],
  },
  aptitude: {
    filters: [
      { key: "tag", label: "Topic", options: [
        { label: "Boat & Streams", value: "Boat & Streams" },
        { label: "Time & Distance", value: "Time & Distance" },
        { label: "Profit & Loss", value: "Profit & Loss" },
        { label: "Percentage", value: "Percentage" },
        { label: "Ratio & Proportion", value: "Ratio & Proportion" },
        { label: "Simple Interest", value: "Simple Interest" },
        { label: "Compound Interest", value: "Compound Interest" },
        { label: "Probability", value: "Probability" },
        { label: "Permutation & Combination", value: "Permutation & Combination" },
        { label: "Time & Work", value: "Time & Work" },
        { label: "Number System", value: "Number System" },
        { label: "Average", value: "Average" },
      ]},
      { key: "difficulty", label: "Difficulty", options: difficultyOptions },
    ],
    columns: [
      { key: "content", label: "Question" },
      { key: "tags", label: "Topic" },
      { key: "difficulty", label: "Difficulty" },
    ],
  },
  "core-cs": {
    filters: [
      { key: "fieldId", label: "Subject", options: allRoles },
      { key: "difficulty", label: "Difficulty", options: difficultyOptions },
    ],
    columns: [
      { key: "content", label: "Question" },
      { key: "field", label: "Subject" },
      { key: "difficulty", label: "Difficulty" },
    ],
  },

  // ─── AI & ML ─────────────────────────────────────
  "agentic-ai": {
    filters: [
      { key: "tag", label: "Topic", options: [
        { label: "ReAct Pattern", value: "ReAct Pattern" },
        { label: "Tool Use", value: "Tool Use" },
        { label: "Planning", value: "Planning" },
        { label: "Memory", value: "Memory" },
        { label: "Multi-Agent", value: "Multi-Agent" },
        { label: "Reflection", value: "Reflection" },
      ]},
      { key: "difficulty", label: "Difficulty", options: difficultyOptions },
    ],
    columns: [
      { key: "content", label: "Question" },
      { key: "tags", label: "Topic" },
      { key: "difficulty", label: "Difficulty" },
    ],
  },
  "ai-ml-questions": {
    filters: [
      { key: "tag", label: "Topic", options: [
        { label: "Supervised Learning", value: "Supervised Learning" },
        { label: "Unsupervised Learning", value: "Unsupervised Learning" },
        { label: "Deep Learning", value: "Deep Learning" },
        { label: "NLP", value: "NLP" },
        { label: "Computer Vision", value: "Computer Vision" },
        { label: "Reinforcement Learning", value: "Reinforcement Learning" },
      ]},
      { key: "difficulty", label: "Difficulty", options: difficultyOptions },
    ],
    columns: [
      { key: "content", label: "Question" },
      { key: "tags", label: "Topic" },
      { key: "difficulty", label: "Difficulty" },
    ],
  },
  sql: {
    filters: [
      { key: "tag", label: "Topic", options: [
        { label: "Joins", value: "Joins" },
        { label: "Subqueries", value: "Subqueries" },
        { label: "Aggregation", value: "Aggregation" },
        { label: "Window Functions", value: "Window Functions" },
        { label: "Indexing", value: "Indexing" },
        { label: "Normalization", value: "Normalization" },
        { label: "Transactions", value: "Transactions" },
      ]},
      { key: "difficulty", label: "Difficulty", options: difficultyOptions },
    ],
    columns: [
      { key: "content", label: "Question" },
      { key: "tags", label: "Topic" },
      { key: "difficulty", label: "Difficulty" },
    ],
  },

  // ─── System Design ───────────────────────────────
  "high-level-design": {
    filters: [
      { key: "tag", label: "Pattern", options: [
        { label: "Load Balancing", value: "Load Balancing" },
        { label: "Caching", value: "Caching" },
        { label: "Message Queues", value: "Message Queues" },
        { label: "Database Sharding", value: "Database Sharding" },
        { label: "CDN", value: "CDN" },
        { label: "Microservices", value: "Microservices" },
        { label: "Event-Driven", value: "Event-Driven" },
      ]},
      { key: "difficulty", label: "Scale", options: difficultyOptions },
    ],
    columns: [
      { key: "content", label: "Question" },
      { key: "tags", label: "Pattern" },
      { key: "difficulty", label: "Scale" },
    ],
  },
  "low-level-design": {
    filters: [
      { key: "tag", label: "Pattern", options: [
        { label: "Singleton", value: "Singleton" },
        { label: "Factory", value: "Factory" },
        { label: "Observer", value: "Observer" },
        { label: "Strategy", value: "Strategy" },
        { label: "Adapter", value: "Adapter" },
        { label: "Decorator", value: "Decorator" },
        { label: "Composite", value: "Composite" },
      ]},
      { key: "difficulty", label: "Complexity", options: difficultyOptions },
    ],
    columns: [
      { key: "content", label: "Question" },
      { key: "tags", label: "Pattern" },
      { key: "difficulty", label: "Complexity" },
    ],
  },

  // ─── Fundamentals ────────────────────────────────
  oops: {
    filters: [
      { key: "tag", label: "Concept", options: [
        { label: "Encapsulation", value: "Encapsulation" },
        { label: "Inheritance", value: "Inheritance" },
        { label: "Polymorphism", value: "Polymorphism" },
        { label: "Abstraction", value: "Abstraction" },
        { label: "SOLID", value: "SOLID" },
      ]},
      { key: "difficulty", label: "Difficulty", options: difficultyOptions },
    ],
    columns: [
      { key: "content", label: "Question" },
      { key: "tags", label: "Concept" },
      { key: "difficulty", label: "Difficulty" },
    ],
  },
  "computer-network": {
    filters: [
      { key: "tag", label: "Topic", options: [
        { label: "TCP/IP", value: "TCP/IP" },
        { label: "HTTP", value: "HTTP" },
        { label: "DNS", value: "DNS" },
        { label: "OSI Model", value: "OSI Model" },
        { label: "Routing", value: "Routing" },
        { label: "Security", value: "Security" },
        { label: "Subnetting", value: "Subnetting" },
      ]},
      { key: "difficulty", label: "Difficulty", options: difficultyOptions },
    ],
    columns: [
      { key: "content", label: "Question" },
      { key: "tags", label: "Topic" },
      { key: "difficulty", label: "Difficulty" },
    ],
  },
  "operating-system": {
    filters: [
      { key: "tag", label: "Topic", options: [
        { label: "Process Management", value: "Process Management" },
        { label: "Memory Management", value: "Memory Management" },
        { label: "File Systems", value: "File Systems" },
        { label: "Scheduling", value: "Scheduling" },
        { label: "Deadlocks", value: "Deadlocks" },
        { label: "Threads", value: "Threads" },
        { label: "Virtual Memory", value: "Virtual Memory" },
      ]},
      { key: "difficulty", label: "Difficulty", options: difficultyOptions },
    ],
    columns: [
      { key: "content", label: "Question" },
      { key: "tags", label: "Topic" },
      { key: "difficulty", label: "Difficulty" },
    ],
  },
  dbms: {
    filters: [
      { key: "tag", label: "Topic", options: [
        { label: "Normalization", value: "Normalization" },
        { label: "Indexing", value: "Indexing" },
        { label: "Transactions", value: "Transactions" },
        { label: "ACID", value: "ACID" },
        { label: "Joins", value: "Joins" },
        { label: "Query Optimization", value: "Query Optimization" },
      ]},
      { key: "difficulty", label: "Difficulty", options: difficultyOptions },
    ],
    columns: [
      { key: "content", label: "Question" },
      { key: "tags", label: "Topic" },
      { key: "difficulty", label: "Difficulty" },
    ],
  },
};

export function getConfigForSlug(slug: string): CategoryFilterConfig {
  return categoryFilters[slug] || {
    filters: [
      { key: "fieldId", label: "Role", options: allRoles },
      { key: "difficulty", label: "Difficulty", options: difficultyOptions },
    ],
    columns: [
      { key: "content", label: "Question" },
      { key: "field", label: "Role" },
      { key: "difficulty", label: "Difficulty" },
    ],
  };
}
