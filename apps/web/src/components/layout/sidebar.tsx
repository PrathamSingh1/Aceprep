"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ThemeToggle } from "../theme/theme-toggle";

interface NavItem {
  title: string;
  slug: string;
  children?: { title: string; slug: string }[];
}

const navigation: NavItem[] = [
  {
    title: "Hiring",
    slug: "hiring",
    children: [
      { title: "All Jobs", slug: "all-jobs" },
      { title: "Internships", slug: "internships" },
      { title: "Companies", slug: "companies" },
    ],
  },
  {
    title: "Library",
    slug: "library",
    children: [
      { title: "Interview Questions", slug: "interview-questions" },
      { title: "DSA", slug: "dsa" },
      { title: "Projects", slug: "projects" },
      { title: "HR Questions", slug: "hr-questions" },
      { title: "Scenario Based", slug: "scenario-based" },
      { title: "Aptitude", slug: "aptitude" },
      { title: "Core CS Subjects", slug: "core-cs" },
    ],
  },
  {
    title: "AI and Machine Learning",
    slug: "ai-ml",
    children: [
      { title: "Agentic AI", slug: "agentic-ai" },
      { title: "AI & ML Questions", slug: "ai-ml-questions" },
      { title: "SQL Questions", slug: "sql" },
    ],
  },
  {
    title: "System Design",
    slug: "system-design",
    children: [
      { title: "High Level Design", slug: "high-level-design" },
      { title: "Low Level Design", slug: "low-level-design" },
    ],
  },
  {
    title: "Fundamentals",
    slug: "fundamentals",
    children: [
      { title: "OOPs Concepts", slug: "oops" },
      { title: "Computer Network", slug: "computer-network" },
      { title: "Operating System", slug: "operating-system" },
      { title: "DBMS", slug: "dbms" },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    hiring: true,
    library: true,
    "ai-ml": true,
    "system-design": true,
    fundamentals: true,
  });

  const toggleGroup = (slug: string) => {
    setExpandedGroups((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-[260px] bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
          <Logo />
          <ThemeToggle />
        </div>

        {/* Search */}
        <div className="p-3">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-2 text-sm bg-neutral-100 dark:bg-neutral-800 rounded-lg border-none outline-none placeholder:text-neutral-500"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {navigation.map((group) => (
            <div key={group.slug} className="mb-1">
              {/* Group header */}
              <button
                onClick={() => toggleGroup(group.slug)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <span>{group.title}</span>
                <svg
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    expandedGroups[group.slug] && "rotate-90"
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Children */}
              {expandedGroups[group.slug] && group.children && (
                <div className="ml-4 mt-0.5">
                  {group.children.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/browse/${item.slug}`}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors",
                        pathname.includes(item.slug)
                          ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white font-medium"
                          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      )}
                    >
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
