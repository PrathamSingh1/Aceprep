"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ThemeToggle } from "../theme/theme-toggle";
import {
  IconSearch,
  IconBriefcase,
  IconSchool,
  IconBuilding,
  IconMessageQuestion,
  IconCode,
  IconFolder,
  IconUsers,
  IconClipboardList,
  IconMath,
  IconBook,
  IconRobot,
  IconBrain,
  IconDatabase,
  IconLayoutDashboard,
  IconSitemap,
  IconNetwork,
  IconDeviceDesktop,
  IconComponents,
} from "@tabler/icons-react";

interface NavItem {
  title: string;
  slug: string;
  children?: { title: string; slug: string; icon: any }[];
}

const navigation: NavItem[] = [
  {
    title: "Hiring",
    slug: "hiring",
    children: [
      { title: "All Jobs", slug: "all-jobs", icon: IconBriefcase },
      { title: "Internships", slug: "internships", icon: IconSchool },
      { title: "Companies", slug: "companies", icon: IconBuilding },
    ],
  },
  {
    title: "Library",
    slug: "library",
    children: [
      {
        title: "Interview Questions",
        slug: "interview-questions",
        icon: IconMessageQuestion,
      },
      { title: "DSA", slug: "dsa", icon: IconCode },
      { title: "Projects", slug: "projects", icon: IconFolder },
      { title: "HR Questions", slug: "hr-questions", icon: IconUsers },
      {
        title: "Scenario Based",
        slug: "scenario-based",
        icon: IconClipboardList,
      },
      { title: "Aptitude", slug: "aptitude", icon: IconMath },
      { title: "Core CS Subjects", slug: "core-cs", icon: IconBook },
    ],
  },
  {
    title: "AI and Machine Learning",
    slug: "ai-ml",
    children: [
      { title: "Agentic AI", slug: "agentic-ai", icon: IconRobot },
      { title: "AI & ML Questions", slug: "ai-ml-questions", icon: IconBrain },
      { title: "SQL Questions", slug: "sql", icon: IconDatabase },
    ],
  },
  {
    title: "System Design",
    slug: "system-design",
    children: [
      {
        title: "High Level Design",
        slug: "high-level-design",
        icon: IconLayoutDashboard,
      },
      {
        title: "Low Level Design",
        slug: "low-level-design",
        icon: IconSitemap,
      },
    ],
  },
  {
    title: "Fundamentals",
    slug: "fundamentals",
    children: [
      { title: "OOPs Concepts", slug: "oops", icon: IconComponents },
      {
        title: "Computer Network",
        slug: "computer-network",
        icon: IconNetwork,
      },
      {
        title: "Operating System",
        slug: "operating-system",
        icon: IconDeviceDesktop,
      },
      { title: "DBMS", slug: "dbms", icon: IconDatabase },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {
      hiring: true,
      library: true,
      "ai-ml": true,
      "system-design": true,
      fundamentals: true,
    },
  );

  const toggleGroup = (slug: string) => {
    setExpandedGroups((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  const filteredNavigation = navigation
    .map((group) => ({
      ...group,
      children: group.children?.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          group.title.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter(
      (group) =>
        searchQuery === "" ||
        (group.children && group.children.length > 0),
    );

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
          "fixed top-0 left-0 z-50 h-full w-[290px] bg-background dark:bg-background border-r font-inter border-neutral-200 dark:border-neutral-800 flex flex-col transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>

        {/* Search */}
        <div className="px-2">
          <div className="py-0.5 px-3 flex items-center bg-background dark:bg-background border dark:border-neutral-900 border-neutral-200 rounded-md">
            <IconSearch size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1 text-sm  border-none outline-none placeholder:text-neutral-500"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 mt-2">
          {filteredNavigation.map((group) => (
            <div key={group.slug} className="mb-1">
              {/* Group header */}
              <button
                onClick={() => toggleGroup(group.slug)}
                className="w-full flex items-center justify-between mt-4 px-3 py-1 text-sm font-medium text-neutral-800 border border-transparent dark:hover:border-neutral-800 hover:border-neutral-200 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              >
                <span>{group.title}</span>
                <svg
                  className={cn(
                    "w-4 h-4 transition-transform duration-300",
                    expandedGroups[group.slug] && "rotate-90",
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
              {(searchQuery !== "" || expandedGroups[group.slug]) && group.children && (
                <div className="ml-4 mt-2">
                  {group.children.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/browse/${item.slug}`}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors mt-1 group",
                        pathname.includes(item.slug)
                          ? "bg-neutral-100 dark:bg-neutral-900 border dark:border-neutral-800 border-neutral-200 text-neutral-900 dark:text-white"
                          : "text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200/40 dark:hover:bg-neutral-900",
                      )}
                    >
                      <item.icon
                        size={16}
                        className="shrink-0 group-hover:rotate-6 group-hover:scale-[1.25] transition-all duration-300"
                      />

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
