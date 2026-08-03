"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { getConfigForSlug } from "../lib/categoryFilters";
import { DropDown } from "./DropDown";
import { IconSquare, IconSquareCheck, IconFilter } from "@tabler/icons-react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { questionsApi } from "@/features/questions/lib/api";

type Tab = "all" | "solved" | "saved";

const tabs: { key: Tab; label: string }[] = [
  { key: "all", label: "All questions" },
  { key: "solved", label: "Solved questions" },
  { key: "saved", label: "Saved questions" },
];

interface BrowsePageProps {
  categorySlug: string;
  title: string;
  description: string;
}

export function BrowsePage({
  categorySlug,
  title,
  description,
}: BrowsePageProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [premiumRequired, setPremiumRequired] = useState(false);
  const [isLOGGED_IN, setIsLoggedIn] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [stats, setStats] = useState<{
    total: number;
    easy: number;
    medium: number;
    hard: number;
    solved: number;
    bookmarked: number;
    solvedEasy: number;
    solvedMedium: number;
    solvedHard: number;
  } | null>(null);

  const [filters, setFilters] = useState<Record<string, string>>({
    search: "",
    page: "1",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalQuestions: 0,
  });

  const config = getConfigForSlug(categorySlug);

  const fetchStats = useCallback(async () => {
    try {
      const res = await questionsApi.getStats(categorySlug);
      setStats(res.data.data);
    } catch {}
  }, [categorySlug]);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === "solved") {
        const res = await questionsApi.getSolvedQuestions(
          Number(filters.page) || 1,
        );
        setQuestions(res.data.data.questions);
        setPagination(res.data.data.pagination);
        setPremiumRequired(false);
      } else if (activeTab === "saved") {
        const res = await questionsApi.getBookmarkedQuestions(
          Number(filters.page) || 1,
        );
        setQuestions(res.data.data.questions);
        setPagination(res.data.data.pagination);
        setPremiumRequired(false);
      } else {
        const params: Record<string, any> = { page: filters.page || 1 };
        if (filters.fieldId) params.fieldId = filters.fieldId;
        if (filters.difficulty) params.difficulty = filters.difficulty;
        if (filters.tag) params.tag = filters.tag;

        const res = await apiClient.get(
          `/categories/${categorySlug}/questions`,
          { params },
        );
        setQuestions(res.data.data.questions);
        setPagination(res.data.data.pagination);
        setPremiumRequired(
          res.data.data.pagination.isPremiumRequired || false,
        );
        setIsLoggedIn(res.data.data.pagination.isLoggedIn || false);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [categorySlug, JSON.stringify(filters), activeTab]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    apiClient.get("/questions/fields").then((res) => setFields(res.data.data));
  }, []);

  useEffect(() => {
    setFilters({ search: "", page: "1" });
  }, [categorySlug]);

  useEffect(() => {
    setActiveTab("all");
  }, [categorySlug]);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setFilters((prev) => ({ ...prev, page: "1" }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: "1" }));
  };

  const getFilterValue = (key: string): string => {
    if (key === "fieldId") return filters.fieldId || "";
    if (key === "difficulty") return filters.difficulty || "";
    if (key === "tag") return filters.tag || "";
    return "";
  };

  const getFilterOptions = (
    filterKey: string,
    options?: { label: string; value: string }[],
  ) => {
    if (filterKey === "fieldId" && fields.length > 0) {
      return fields.map((f: any) => ({ label: f.name, value: f.id }));
    }
    return options || [];
  };

  const getCellValue = (q: any, key: string): string => {
    if (key === "field") return q.field?.name || "—";
    if (key === "tags") return q.tags?.[0] || "—";
    if (key === "difficulty") return q.difficulty;
    if (key === "content") return q.content;
    return q[key] || "—";
  };

  const handleToggleSolved = async (questionId: string) => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!user.isPremiumActive) {
      setShowPremiumModal(true);
      return;
    }
    try {
      await questionsApi.toggleSolved(questionId);
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId ? { ...q, isSolved: !q.isSolved } : q,
        ),
      );
      fetchStats();
    } catch {}
  };

  const handleToggleBookmark = async (questionId: string) => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!user.isPremiumActive) {
      setShowPremiumModal(true);
      return;
    }
    try {
      await questionsApi.toggleBookmark(questionId);
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId ? { ...q, isBookmarked: !q.isBookmarked } : q,
        ),
      );
      fetchStats();
    } catch {}
  };

  const difficultyColors: Record<string, string> = {
    EASY: "bg-neutral-100 dark:bg-neutral-900 border-1 dark:border-neutral-900 border-neutral-200",
    MEDIUM:
      "bg-neutral-100 dark:bg-neutral-900 border-1 dark:border-neutral-900 border-neutral-200",
    HARD: "bg-neutral-100 dark:bg-neutral-900 border-1 dark:border-neutral-900 border-neutral-200",
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold font-manrope mb-1">
        {title}
      </h1>
      <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 font-manrope">
        {description}
      </p>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-neutral-200 dark:border-neutral-800">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors relative",
              activeTab === tab.key
                ? "text-neutral-900 dark:text-white"
                : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300",
            )}
          >
            {tab.label}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 dark:bg-white" />
            )}
          </button>
        ))}
      </div>

      {/* Progress Stats - All questions tab */}
      {activeTab === "all" && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div
            className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
            onClick={() => handleTabChange("solved")}
          >
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
              Total progress
            </p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {stats.solved}
              <span className="text-sm font-normal text-neutral-400">
                /{stats.total}
              </span>
            </p>
          </div>
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
              Easy questions
            </p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {stats.solvedEasy}
              <span className="text-sm font-normal text-neutral-400">
                /{stats.easy}
              </span>
            </p>
          </div>
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
              Medium questions
            </p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {stats.solvedMedium}
              <span className="text-sm font-normal text-neutral-400">
                /{stats.medium}
              </span>
            </p>
          </div>
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
              Hard questions
            </p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {stats.solvedHard}
              <span className="text-sm font-normal text-neutral-400">
                /{stats.hard}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Progress Stats - Solved tab */}
      {activeTab === "solved" && stats && (
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
              Total solved
            </p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {stats.solved}
              <span className="text-sm font-normal text-neutral-400">
                /{stats.total}
              </span>
            </p>
          </div>
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
              Easy solved
            </p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {stats.solvedEasy}
              <span className="text-sm font-normal text-neutral-400">
                /{stats.easy}
              </span>
            </p>
          </div>
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
              Medium solved
            </p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {stats.solvedMedium}
              <span className="text-sm font-normal text-neutral-400">
                /{stats.medium}
              </span>
            </p>
          </div>
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
              Hard solved
            </p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {stats.solvedHard}
              <span className="text-sm font-normal text-neutral-400">
                /{stats.hard}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Progress Stats - Saved tab */}
      {activeTab === "saved" && stats && (
        <div className="grid grid-cols-1 gap-3 mb-6">
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 max-w-xs">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
              Total saved
            </p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {stats.bookmarked}
            </p>
          </div>
        </div>
      )}

      {/* Search & Filters - only on All questions tab */}
      {activeTab === "all" && (
        <>
          <input
            type="text"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full px-4 py-2.5 mb-4 border border-neutral-200 dark:border-neutral-900 rounded-lg bg-background dark:background text-sm outline-none focus:ring-2 dark:focus:ring-neutral-900 focus:ring-neutral-100 font-manrope"
          />
          <div className="flex mb-4 md:mb-6 font-manrope">
            {config.filters.map((f) => (
              <DropDown
                key={f.key}
                label={f.label}
                value={getFilterValue(f.key)}
                options={getFilterOptions(f.key, f.options)}
                onChange={(value) => handleFilterChange(f.key, value)}
              />
            ))}
          </div>
        </>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-10 text-neutral-500">
          Loading questions...
        </div>
      ) : premiumRequired ? (
        <div className="text-center py-16 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold font-manrope mb-2">
            Premium Content
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 max-w-md mx-auto">
            {!isLOGGED_IN
              ? "Login to view the first page for free, or upgrade to premium for unlimited access."
              : "Upgrade to premium to access all pages and unlimited questions."}
          </p>
          <div className="flex gap-3 justify-center">
            {!isLOGGED_IN ? (
              <button
                onClick={() => router.push("/login")}
                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
              >
                Login
              </button>
            ) : null}
            <button
              onClick={() => router.push("/pricing")}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
            >
              Upgrade to Premium
            </button>
          </div>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-16 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center">
            <IconFilter size={24} className="text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold font-manrope mb-2">
            {activeTab === "solved"
              ? "No solved questions yet"
              : activeTab === "saved"
                ? "No saved questions yet"
                : "No questions found"}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm max-w-md mx-auto">
            {activeTab === "solved"
              ? "Mark interview questions as solved to see them listed here."
              : activeTab === "saved"
                ? "Save interview questions to see them listed here."
                : "Try adjusting your filters."}
          </p>
        </div>
      ) : (
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          {/* Header */}
          <div
            className="grid gap-2 px-4 py-2.5 bg-neutral-50 dark:bg-background text-sm font-medium text-neutral-400 dark:text-neutral-500 border-b dark:border-neutral-800 border-neutral-200"
            style={{
              gridTemplateColumns:
                window.innerWidth < 768
                  ? "10px 1fr 40px 40px"
                  : `40px 1fr ${config.columns
                      .slice(1)
                      .map(() => "120px")
                      .join(" ")} 60px 60px`,
            }}
          >
            <span className="text-xs text-neutral-400 dark:text-neutral-600 content-center">
              #
            </span>
            {config.columns.map((col) => (
              <span
                key={col.key}
                className={cn(
                  (col.key === "field" || col.key === "difficulty") &&
                    "hidden md:block",
                )}
              >
                {col.label}
              </span>
            ))}
            <span className="pl-2 md:-ml-5">Solved</span>
            <span className="pl-4 md:-ml-5">Save</span>
          </div>

          {/* Rows */}
          {questions.map((q: any, i: number) => (
            <div
              key={q.id}
              className="border-b border-neutral-200 dark:border-neutral-800 last:border-b-0"
            >
              <div
                className="grid gap-2 items-center py-3 px-4 font-manrope"
                style={{
                  gridTemplateColumns:
                    window.innerWidth < 768
                      ? "10px 1fr 30px 20px"
                      : `40px 1fr ${config.columns
                          .slice(1)
                          .map(() => "120px")
                          .join(" ")} 60px 60px`,
                }}
              >
                <span className="text-sm text-neutral-500">
                  {(Number(filters.page) - 1) * 10 + i + 1}
                </span>
                {config.columns.map((col) => {
                  const value = getCellValue(q, col.key);
                  const isContent = col.key === "content";

                  return (
                    <span
                      key={col.key}
                      onClick={
                        isContent
                          ? () =>
                              setExpandedId(expandedId === q.id ? null : q.id)
                          : undefined
                      }
                      className={cn(
                        "text-sm",
                        (col.key === "field" || col.key === "difficulty") &&
                          "hidden md:inline-flex",
                        col.key === "content"
                          ? "font-medium text-neutral-900 dark:text-neutral-100 cursor-pointer"
                          : col.key === "difficulty"
                            ? `items-center gap-1.5 text-[10px] px-2 py-1 rounded-xs w-fit ${
                                difficultyColors[value] || ""
                              }`
                            : "text-neutral-600 dark:text-neutral-400 text-xs",
                      )}
                    >
                      {col.key === "difficulty" ? (
                        <>
                          <span
                            className={cn(
                              "h-1 w-1 rounded-full",
                              value === "EASY" && "bg-green-500",
                              value === "MEDIUM" && "bg-yellow-500",
                              value === "HARD" && "bg-red-500",
                            )}
                          />
                          {value}
                        </>
                      ) : (
                        value
                      )}
                    </span>
                  );
                })}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleSolved(q.id);
                  }}
                  className={cn(
                    "text-neutral-400 hover:text-neutral-600",
                    !user?.isPremiumActive && "opacity-50 cursor-not-allowed",
                  )}
                >
                  {q.isSolved ? (
                    <IconSquareCheck
                      size={16}
                      className="hover:scale-[1.15] transition-transform duration-150 cursor-pointer"
                    />
                  ) : (
                    <IconSquare
                      size={16}
                      className="hover:scale-[1.15] transition-transform duration-150 cursor-pointer"
                    />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleBookmark(q.id);
                  }}
                  className={cn(
                    "text-neutral-400 hover:text-yellow-500",
                    !user?.isPremiumActive && "opacity-50 cursor-not-allowed",
                  )}
                >
                  {q.isBookmarked ? (
                    <BookmarkCheck
                      size={16}
                      className="hover:scale-[1.15] transition-transform duration-150 cursor-pointer"
                    />
                  ) : (
                    <Bookmark
                      size={16}
                      className="hover:scale-[1.15] transition-transform duration-150 cursor-pointer"
                    />
                  )}
                </button>
              </div>

              {/* Expanded answer */}
              {expandedId === q.id && (
                <div
                  className="grid gap-2 -mt-[10px] px-4 pb-2"
                  style={{
                    gridTemplateColumns:
                      window.innerWidth < 768
                        ? "10px 1fr"
                        : `40px 1fr ${config.columns
                            .slice(1)
                            .map(() => "120px")
                            .join(" ")} 60px 60px`,
                  }}
                >
                  <div className="" style={{ gridColumn: "2" }}>
                    <div className="whitespace-pre-wrap font-inter text-sm text-neutral-500 dark:text-neutral-500">
                      {q.answer}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                page: String(Math.max(1, Number(prev.page) - 1)),
              }))
            }
            disabled={Number(filters.page) <= 1}
            className="px-3 py-1.5 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Previous
          </button>
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                page: String(Number(prev.page) + 1),
              }))
            }
            disabled={Number(filters.page) >= pagination.totalPages}
            className="px-3 py-1.5 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Next
          </button>
        </div>
      )}

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl max-w-sm w-full p-6">
            <div className="w-12 h-12 mx-auto mb-4 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold font-manrope text-center mb-2">
              Premium Required
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm text-center mb-6">
              Upgrade to premium to track your solved and saved questions.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowPremiumModal(false)}
                className="px-4 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={() => router.push("/pricing")}
                className="px-4 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
