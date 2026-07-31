"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useEffect, useState } from "react";

interface NavItem {
  label: string;
  href: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const adminNav: (NavItem | NavGroup)[] = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Users", href: "/admin/users" },
  {
    label: "Hiring",
    items: [
      { label: "Full-Time Jobs", href: "/admin/jobs" },
      { label: "Internships", href: "/admin/internships" },
      { label: "Companies", href: "/admin/companies" },
    ],
  },
  {
    label: "Library",
    items: [
      { label: "Interview Questions", href: "/admin/questions" },
      { label: "DSA", href: "/admin/questions/dsa" },
      { label: "HR Questions", href: "/admin/questions/hr-questions" },
      { label: "Aptitude", href: "/admin/questions/aptitude" },
      { label: "Projects", href: "/admin/questions/projects" },
    ],
  },
  {
    label: "AI & ML",
    items: [
      { label: "Agentic AI", href: "/admin/questions/agentic-ai" },
      { label: "AI & ML", href: "/admin/questions/ai-ml-questions" },
      { label: "SQL", href: "/admin/questions/sql" },
    ],
  },
  {
    label: "System Design",
    items: [
      {
        label: "High Level Design",
        href: "/admin/questions/high-level-design",
      },
      { label: "Low Level Design", href: "/admin/questions/low-level-design" },
    ],
  },
  {
    label: "Fundamentals",
    items: [
      { label: "OOPs", href: "/admin/questions/oops" },
      { label: "Computer Network", href: "/admin/questions/computer-network" },
      { label: "Operating System", href: "/admin/questions/operating-system" },
      { label: "DBMS", href: "/admin/questions/dbms" },
    ],
  },
  { label: "Categories", href: "/admin/categories" },
  { label: "Purchases", href: "/admin/purchases" },
  { label: "Coupons", href: "/admin/coupons" },
];

function isGroup(item: NavItem | NavGroup): item is NavGroup {
  return "items" in item;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      window.location.href = "/browse/interview-questions";
    }
  }, [user, loading]);

  useEffect(() => {
    const groups: Record<string, boolean> = {};
    adminNav.forEach((item) => {
      if (isGroup(item)) {
        const hasActive = item.items.some((i) => pathname.startsWith(i.href));
        if (hasActive) groups[item.label] = true;
      }
    });
    setOpenGroups((prev) => ({ ...prev, ...groups }));
  }, [pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-neutral-500">
        Loading...
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-[240px] border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex flex-col fixed h-screen overflow-y-auto">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
          <Link
            href="/admin/dashboard"
            className="font-manrope font-bold text-lg"
          >
            Admin Panel
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {adminNav.map((item) => {
            if (!isGroup(item)) {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 text-sm rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-500 text-white"
                      : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800",
                  )}
                >
                  {item.label}
                </Link>
              );
            }

            const isOpen = openGroups[item.label];
            const hasActive = item.items.some((i) =>
              pathname.startsWith(i.href),
            );

            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleGroup(item.label)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors",
                    hasActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800",
                  )}
                >
                  <span className="font-medium">{item.label}</span>
                  <svg
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isOpen && "rotate-90",
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
                {isOpen && (
                  <div className="ml-3 pl-3 border-l border-neutral-200 dark:border-neutral-700 space-y-0.5 mt-0.5 mb-1">
                    {item.items.map((sub) => {
                      const isActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={cn(
                            "block px-3 py-1.5 text-sm rounded-lg transition-colors",
                            isActive
                              ? "bg-blue-500 text-white"
                              : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800",
                          )}
                        >
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800">
          <Link
            href="/browse/interview-questions"
            className="block px-3 py-2 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          >
            Back to App
          </Link>
        </div>
      </aside>

      <main className="flex-1 ml-[240px] p-6 lg:p-8">{children}</main>
    </div>
  );
}
