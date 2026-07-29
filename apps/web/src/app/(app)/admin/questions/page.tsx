"use client";

import { useState, useEffect } from "react";
import { useAdminQuestions } from "@/features/admin/hooks/useAdmin";
import { adminApi } from "@/features/admin/lib/api";
import apiClient from "@/lib/api-client";

export default function AdminQuestionsPage() {
    const { questions, total, totalPages, loading, filters, setFilters, refetch } = useAdminQuestions();
    const [showForm, setShowForm] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [fields, setFields] = useState<any[]>([]);
    const [form, setForm] = useState({ content: "", answer: "", difficulty: "MEDIUM", categoryId: "", fieldId: "" });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        apiClient.get("/admin/categories").then((res) => setCategories(res.data.data));
        apiClient.get("/questions/fields").then((res) => setFields(res.data.data));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await adminApi.createQuestion({
                content: form.content,
                answer: form.answer,
                difficulty: form.difficulty,
                categoryId: form.categoryId || undefined,
                fieldId: form.fieldId || undefined,
            });
            setForm({ content: "", answer: "", difficulty: "MEDIUM", categoryId: "", fieldId: "" });
            setShowForm(false);
            refetch();
        } catch {} finally {
            setSaving(false);
        }
    };

    const difficultyColors: Record<string, string> = {
        EASY: "bg-green-100 text-green-800",
        MEDIUM: "bg-yellow-100 text-yellow-800",
        HARD: "bg-red-100 text-red-800",
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold font-manrope">Questions ({total})</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                >
                    {showForm ? "Cancel" : "Add Question"}
                </button>
            </div>

            {/* Add Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 mb-6 space-y-3">
                    <textarea
                        placeholder="Question"
                        value={form.content}
                        onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                        required
                        rows={2}
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900 resize-none"
                    />
                    <textarea
                        placeholder="Answer"
                        value={form.answer}
                        onChange={(e) => setForm((prev) => ({ ...prev, answer: e.target.value }))}
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900 resize-none"
                    />
                    <div className="grid grid-cols-3 gap-3">
                        <select
                            value={form.difficulty}
                            onChange={(e) => setForm((prev) => ({ ...prev, difficulty: e.target.value }))}
                            className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900"
                        >
                            <option value="EASY">Easy</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HARD">Hard</option>
                        </select>
                        <select
                            value={form.categoryId}
                            onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
                            className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900"
                        >
                            <option value="">No Category</option>
                            {categories.map((c: any) => (
                                <option key={c.id} value={c.id}>{c.parent ? `└ ${c.name}` : c.name}</option>
                            ))}
                        </select>
                        <select
                            value={form.fieldId}
                            onChange={(e) => setForm((prev) => ({ ...prev, fieldId: e.target.value }))}
                            className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900"
                        >
                            <option value="">No Role</option>
                            {fields.map((f: any) => (
                                <option key={f.id} value={f.id}>{f.name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Create Question"}
                    </button>
                </form>
            )}

            {/* Filters */}
            <div className="flex gap-3 mb-6 flex-wrap">
                <input
                    type="text"
                    placeholder="Search questions..."
                    value={filters.search}
                    onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
                    className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900 flex-1 min-w-[200px]"
                />
                <select
                    value={filters.difficulty}
                    onChange={(e) => setFilters((prev) => ({ ...prev, difficulty: e.target.value, page: 1 }))}
                    className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900"
                >
                    <option value="">All Difficulties</option>
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                </select>
                <select
                    value={filters.fieldId}
                    onChange={(e) => setFilters((prev) => ({ ...prev, fieldId: e.target.value, page: 1 }))}
                    className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900"
                >
                    <option value="">All Roles</option>
                    {fields.map((f: any) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            {loading ? (
                <div className="text-center py-10 text-neutral-500">Loading questions...</div>
            ) : questions.length === 0 ? (
                <div className="text-center py-10 text-neutral-500">No questions found.</div>
            ) : (
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800 text-left">
                                    <th className="px-4 py-2.5 font-medium text-neutral-500">Question</th>
                                    <th className="px-4 py-2.5 font-medium text-neutral-500">Category</th>
                                    <th className="px-4 py-2.5 font-medium text-neutral-500">Role</th>
                                    <th className="px-4 py-2.5 font-medium text-neutral-500">Difficulty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {questions.map((q: any) => (
                                    <tr key={q.id} className="border-b border-neutral-200 dark:border-neutral-800 last:border-b-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                        <td className="px-4 py-2.5 max-w-[400px] truncate">{q.content}</td>
                                        <td className="px-4 py-2.5 text-neutral-500">{q.category?.name || "—"}</td>
                                        <td className="px-4 py-2.5 text-neutral-500">{q.field?.name || "—"}</td>
                                        <td className="px-4 py-2.5">
                                            <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[q.difficulty] || ""}`}>
                                                {q.difficulty}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                        onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                        disabled={filters.page <= 1}
                        className="px-3 py-1.5 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-neutral-500">Page {filters.page} of {totalPages}</span>
                    <button
                        onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
                        disabled={filters.page >= totalPages}
                        className="px-3 py-1.5 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
