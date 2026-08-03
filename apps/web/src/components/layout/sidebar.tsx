"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ThemeToggle } from "../theme/theme-toggle";
import { useAuth } from "@/features/auth/hooks/useAuth";
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
  IconDots,
  IconLogout,
  IconMessage,
  IconCrown,
  IconCircleFilled,
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

const TIER_LABELS: Record<string, string> = {
  TIER_1: "1 Month Premium",
  TIER_2: "6 Month Premium",
  TIER_3: "1 Year Premium",
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, loading: authLoading, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [platformStatus, setPlatformStatus] = useState<"ok" | "error" | "checking">("checking");
  const menuRef = useRef<HTMLDivElement>(null);

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {
      hiring: true,
      library: true,
      "ai-ml": true,
      "system-design": true,
      fundamentals: true,
    },
  );

  const checkPlatformStatus = useCallback(async () => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:5000";
      const res = await fetch(`${baseURL}/health`, { method: "GET" });
      setPlatformStatus(res.ok ? "ok" : "error");
    } catch {
      setPlatformStatus("error");
    }
  }, []);

  useEffect(() => {
    checkPlatformStatus();
    const interval = setInterval(checkPlatformStatus, 30000);
    return () => clearInterval(interval);
  }, [checkPlatformStatus]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

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
        searchQuery === "" || (group.children && group.children.length > 0),
    );

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "?";

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
              {(searchQuery !== "" || expandedGroups[group.slug]) &&
                group.children && (
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

        {/* User Profile */}
        {user && (
          <div className="border-t border-neutral-200 dark:border-neutral-800 p-3" ref={menuRef}>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || ""}
                    className="w-8 h-8 rounded-full shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                    <span className="text-sm font-medium text-white">{userInitial}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {user.isPremiumActive
                      ? TIER_LABELS[user.currentPremiumTier || ""] || "Premium"
                      : "Free plan"}
                  </p>
                </div>
                <IconDots size={18} className="text-neutral-400 shrink-0" />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-background dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg overflow-hidden z-50">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                      {user.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    {/* Feedback */}
                    <a
                      href="mailto:support@aceprep.com?subject=Feedback"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <IconMessage size={16} className="text-neutral-500" />
                      Feedback
                    </a>

                    {/* Log Out */}
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <IconLogout size={16} className="text-neutral-500" />
                      Log Out
                    </button>
                  </div>

                  {/* Upgrade to Premium */}
                  {!user.isPremiumActive && (
                    <div className="px-3 pb-3">
                      <Link
                        href="/pricing"
                        onClick={() => setShowMenu(false)}
                        className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all"
                      >
                        <IconCrown size={16} />
                        Upgrade to Premium
                      </Link>
                    </div>
                  )}

                  {/* Platform Status */}
                  <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-800">
                    <p className="text-[11px] font-semibold tracking-wider uppercase text-neutral-400 dark:text-neutral-500 mb-1.5">
                      Platform Status
                    </p>
                    <div className="flex items-center gap-2">
                      {platformStatus === "checking" ? (
                        <>
                          <div className="w-2 h-2 rounded-full bg-neutral-300 animate-pulse" />
                          <span className="text-xs text-neutral-500">Checking...</span>
                        </>
                      ) : platformStatus === "ok" ? (
                        <>
                          <IconCircleFilled size={8} className="text-green-500" />
                          <span className="text-xs text-neutral-600 dark:text-neutral-400">
                            All systems normal.
                          </span>
                        </>
                      ) : (
                        <>
                          <IconCircleFilled size={8} className="text-red-500" />
                          <span className="text-xs text-neutral-600 dark:text-neutral-400">
                            System issue detected.
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
