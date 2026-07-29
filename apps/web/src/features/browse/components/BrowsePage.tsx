"use client";

import { useEffect, useState, useCallback } from "react";
import apiClient from "@/lib/api-client";
import { cn } from "@/lib/utils";

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

  const [filters, setFilters] = useState({
    search: "",
    fieldId: "",
    difficulty: "",
    page: 1,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalQuestions: 0,
  });

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/categories/${categorySlug}/questions`, {
        params: {
          page: filters.page,
          ...(filters.fieldId && { fieldId: filters.fieldId }),
          ...(filters.difficulty && { difficulty: filters.difficulty }),
        },
      });
      setQuestions(res.data.data.questions);
      setPagination(res.data.data.pagination);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [categorySlug, filters.page, filters.fieldId, filters.difficulty]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    apiClient.get("/questions/fields").then((res) => setFields(res.data.data));
  }, []);

  const handleFilterChange = (updates: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...updates, page: 1 }));
  };

  const filteredQuestions = questions.filter((q: any) => {
    if (!filters.search) return true;
    return q.content.toLowerCase().includes(filters.search.toLowerCase());
  });

  const difficultyColors: Record<string, string> = {
    EASY: "bg-green-100 text-green-800",
    MEDIUM: "bg-yellow-100 text-yellow-800",
    HARD: "bg-red-100 text-red-800",
  };

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
        value={filters.search}
        onChange={(e) => handleFilterChange({ search: e.target.value })}
        className="w-full px-4 py-2.5 mb-4 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <select
          value={filters.fieldId}
          onChange={(e) => handleFilterChange({ fieldId: e.target.value })}
          className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Roles</option>
          {fields.map((field: any) => (
            <option key={field.id} value={field.id}>
              {field.name}
            </option>
          ))}
        </select>

        <select
          value={filters.difficulty}
          onChange={(e) => handleFilterChange({ difficulty: e.target.value })}
          className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Difficulties</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-10 text-neutral-500">
          Loading questions...
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="text-center py-10 text-neutral-500">
          No questions found. Try adjusting your filters.
        </div>
      ) : (
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[40px_1fr_120px_100px_60px_60px] gap-2 px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 text-sm font-medium text-neutral-600 dark:text-neutral-400">
            <span>#</span>
            <span>Question</span>
            <span>Role</span>
            <span>Difficulty</span>
            <span>Solved</span>
            <span>Save</span>
          </div>

          {/* Rows */}
          {filteredQuestions.map((q: any, i: number) => (
            <div key={q.id} className="border-b border-neutral-200 dark:border-neutral-800 last:border-b-0">
              <div
                className="grid grid-cols-[40px_1fr_120px_100px_60px_60px] gap-2 items-center py-3 px-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
              >
                <span className="text-sm text-neutral-500">{i + 1}</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">
                  {q.content}
                </span>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {q.field?.name || "—"}
                </span>
                <span
                  className={cn(
                    "text-xs px-2 py-1 rounded-full w-fit",
                    difficultyColors[q.difficulty] || ""
                  )}
                >
                  {q.difficulty}
                </span>
                <button className="text-neutral-400 hover:text-neutral-600">
                  {q.progress?.[0]?.isSolved ? "✅" : "☐"}
                </button>
                <button className="text-neutral-400 hover:text-yellow-500">
                  {q.progress?.[0]?.isBookmarked ? "🔖" : "☆"}
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
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
            disabled={filters.page <= 1}
            className="px-3 py-1.5 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Previous
          </button>
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
            disabled={filters.page >= pagination.totalPages}
            className="px-3 py-1.5 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
