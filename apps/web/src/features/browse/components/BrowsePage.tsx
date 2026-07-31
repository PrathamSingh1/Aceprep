"use client";

import { useEffect, useState, useCallback } from "react";
import apiClient from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { getConfigForSlug } from "../lib/categoryFilters";

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

      const res = await apiClient.get(`/categories/${categorySlug}/questions`, { params });
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

  const getFilterOptions = (filterKey: string, options?: { label: string; value: string }[]) => {
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
    EASY: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    MEDIUM: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    HARD: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };

  const colCount = config.columns.length + 3;

  return (
    <div>
      <h1 className="text-2xl font-bold font-manrope mb-1">{title}</h1>
      <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-6">
        {description}
      </p>

      {/* Search */}
      <input
        type="text"
        placeholder={`Search ${title.toLowerCase()}...`}
        value={filters.search || ""}
        onChange={(e) => handleFilterChange("search", e.target.value)}
        className="w-full px-4 py-2.5 mb-4 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Category-specific Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {config.filters.map((f) => (
          <select
            key={f.key}
            value={getFilterValue(f.key)}
            onChange={(e) => handleFilterChange(f.key, e.target.value)}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All {f.label}s</option>
            {getFilterOptions(f.key, f.options).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
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
            className="grid gap-2 px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 text-sm font-medium text-neutral-600 dark:text-neutral-400"
            style={{ gridTemplateColumns: `40px 1fr ${config.columns.slice(1).map(() => "120px").join(" ")} 60px 60px` }}
          >
            <span>#</span>
            {config.columns.map((col) => (
              <span key={col.key}>{col.label}</span>
            ))}
            <span>Solved</span>
            <span>Save</span>
          </div>

          {/* Rows */}
          {questions.map((q: any, i: number) => (
            <div key={q.id} className="border-b border-neutral-200 dark:border-neutral-800 last:border-b-0">
              <div
                className="grid gap-2 items-center py-3 px-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                style={{ gridTemplateColumns: `40px 1fr ${config.columns.slice(1).map(() => "120px").join(" ")} 60px 60px` }}
                onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
              >
                <span className="text-sm text-neutral-500">{i + 1}</span>
                {config.columns.map((col) => (
                  <span
                    key={col.key}
                    className={cn(
                      "text-sm",
                      col.key === "content"
                        ? "font-medium text-neutral-900 dark:text-neutral-100"
                        : col.key === "difficulty"
                          ? `text-xs px-2 py-1 rounded-full w-fit ${difficultyColors[getCellValue(q, col.key)] || ""}`
                          : "text-neutral-600 dark:text-neutral-400"
                    )}
                  >
                    {getCellValue(q, col.key)}
                  </span>
                ))}
                <button className="text-neutral-400 hover:text-neutral-600">
                  {q.isSolved ? "✅" : "☐"}
                </button>
                <button className="text-neutral-400 hover:text-yellow-500">
                  {q.isBookmarked ? "🔖" : "☆"}
                </button>
              </div>

              {/* Expanded answer */}
              {expandedId === q.id && (
                <div className="px-4 pb-4 ml-10 mr-4 mb-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                  <p className="text-sm font-medium text-neutral-500 mb-2">
                    Answer:
                  </p>
                  <div className="whitespace-pre-wrap text-sm text-neutral-700 dark:text-neutral-300">
                    {q.answer}
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
            onClick={() => setFilters((prev) => ({ ...prev, page: String(Math.max(1, Number(prev.page) - 1)) }))}
            disabled={Number(filters.page) <= 1}
            className="px-3 py-1.5 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Previous
          </button>
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setFilters((prev) => ({ ...prev, page: String(Number(prev.page) + 1) }))}
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
