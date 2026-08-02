"use client";

import { useEffect, useState, useCallback } from "react";
import apiClient from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { getConfigForSlug } from "../lib/categoryFilters";
import { DropDown } from "./DropDown";
import { IconSquare, IconSquareCheck } from "@tabler/icons-react";
import { Bookmark, BookmarkCheck } from "lucide-react";

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
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page: filters.page || 1 };
      if (filters.fieldId) params.fieldId = filters.fieldId;
      if (filters.difficulty) params.difficulty = filters.difficulty;
      if (filters.tag) params.tag = filters.tag;

      const res = await apiClient.get(`/categories/${categorySlug}/questions`, {
        params,
      });
      setQuestions(res.data.data.questions);
      setPagination(res.data.data.pagination);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [categorySlug, JSON.stringify(filters)]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    apiClient.get("/questions/fields").then((res) => setFields(res.data.data));
  }, []);

  useEffect(() => {
    setFilters({ search: "", page: "1" });
  }, [categorySlug]);

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

  const difficultyColors: Record<string, string> = {
    EASY: "bg-neutral-100 dark:bg-neutral-900 border-1 dark:border-neutral-900 border-neutral-200",
    MEDIUM:
      "bg-neutral-100 dark:bg-neutral-900 border-1 dark:border-neutral-900 border-neutral-200",
    HARD: "bg-neutral-100 dark:bg-neutral-900 border-1 dark:border-neutral-900 border-neutral-200",
  };

  const colCount = config.columns.length + 3;

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold font-manrope mb-1">
        {title}
      </h1>
      <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-6 font-manrope">
        {description}
      </p>

      {/* Search */}
      <input
        type="text"
        placeholder={`Search ${title.toLowerCase()}...`}
        value={filters.search || ""}
        onChange={(e) => handleFilterChange("search", e.target.value)}
        className="w-full px-4 py-2.5 mb-4 border border-neutral-200 dark:border-neutral-900 rounded-lg bg-background dark:background text-sm outline-none focus:ring-2 dark:focus:ring-neutral-900 focus:ring-neutral-100 font-manrope"
      />

      {/* Category-specific Filters */}
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

      {/* Table */}
      {loading ? (
        <div className="text-center py-10 text-neutral-500">
          Loading questions...
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-10 text-neutral-500">
          No questions found. Try adjusting your filters.
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
            <span className="text-xs text-neutral-400 dark:text-neutral-600">
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
                <span className="text-sm text-neutral-500">{i + 1}</span>
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
                  onClick={(e) => e.stopPropagation()}
                  className="text-neutral-400 hover:text-neutral-600"
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
                  onClick={(e) => e.stopPropagation()}
                  className="text-neutral-400 hover:text-yellow-500"
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
    </div>
  );
}
