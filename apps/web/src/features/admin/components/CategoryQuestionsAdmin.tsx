"use client";

import { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/features/admin/lib/api";
import apiClient from "@/lib/api-client";

interface CategoryQuestionsPageProps {
    categorySlug: string;
    title: string;
}

export function CategoryQuestionsAdmin({ categorySlug, title }: CategoryQuestionsPageProps) {
    const [questions, setQuestions] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [fields, setFields] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ content: "", answer: "", difficulty: "MEDIUM", fieldId: "" });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        apiClient.get("/questions/fields").then((res) => setFields(res.data.data));
        apiClient.get("/admin/categories").then((res) => setCategories(res.data.data));
    }, []);

    const categoryId = categories.find((c: any) => c.slug === categorySlug)?.id;

    const fetchQuestions = useCallback(async () => {
        setLoading(true);
        try {
            const params: Record<string, any> = { page };
            if (search) params.search = search;
            if (categoryId) params.categoryId = categoryId;

            const res = await adminApi.getQuestions(params);
            setQuestions(res.data.data.questions);
            setTotal(res.data.data.total);
            setTotalPages(res.data.data.totalPages);
        } catch {} finally {
            setLoading(false);
        }
    }, [search, page, categoryId]);

    useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryId) return;
        setSaving(true);
        try {
            await adminApi.createQuestion({
                content: form.content,
                answer: form.answer,
                difficulty: form.difficulty,
                categoryId,
                fieldId: form.fieldId || undefined,
            });
            setForm({ content: "", answer: "", difficulty: "MEDIUM", fieldId: "" });
            setShowForm(false);
            fetchQuestions();
        } catch {} finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this question?")) return;
        try {
            await apiClient.delete(`/questions/${id}`);
            fetchQuestions();
        } catch {}
    };

    const difficultyColors: Record<string, string> = {
        EASY: "bg-green-100 text-green-800",
        MEDIUM: "bg-yellow-100 text-yellow-800",
        HARD: "bg-red-100 text-red-800",
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold font-manrope">{title} ({total})</h1>
                <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600">
                    {showForm ? "Cancel" : "Add Question"}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 mb-6 space-y-3">
                    <textarea placeholder="Question" value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} required rows={2} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900 resize-none" />
                    <textarea placeholder="Answer" value={form.answer} onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))} required rows={3} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900 resize-none" />
                    <div className="grid grid-cols-2 gap-3">
                        <select value={form.difficulty} onChange={(e) => setForm((p) => ({ ...p, difficulty: e.target.value }))} className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900">
                            <option value="EASY">Easy</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HARD">Hard</option>
                        </select>
                        <select value={form.fieldId} onChange={(e) => setForm((p) => ({ ...p, fieldId: e.target.value }))} className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900">
                            <option value="">No Role</option>
                            {fields.map((f: any) => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                    </div>
                    <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50">{saving ? "Saving..." : "Create"}</button>
                </form>
            )}

            <input type="text" placeholder={`Search ${title.toLowerCase()}...`} value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full px-4 py-2 mb-6 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900" />

            {loading ? (
                <div className="text-center py-10 text-neutral-500">Loading...</div>
            ) : questions.length === 0 ? (
                <div className="text-center py-10 text-neutral-500">No questions yet.</div>
            ) : (
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800 text-left">
                                <th className="px-4 py-2.5 font-medium text-neutral-500">Question</th>
                                <th className="px-4 py-2.5 font-medium text-neutral-500">Role</th>
                                <th className="px-4 py-2.5 font-medium text-neutral-500">Difficulty</th>
                                <th className="px-4 py-2.5 font-medium text-neutral-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((q: any) => (
                                <tr key={q.id} className="border-b border-neutral-200 dark:border-neutral-800 last:border-b-0">
                                    <td className="px-4 py-2.5 max-w-[400px] truncate">{q.content}</td>
                                    <td className="px-4 py-2.5 text-neutral-500">{q.field?.name || "—"}</td>
                                    <td className="px-4 py-2.5"><span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[q.difficulty] || ""}`}>{q.difficulty}</span></td>
                                    <td className="px-4 py-2.5"><button onClick={() => handleDelete(q.id)} className="text-xs text-red-500 hover:text-red-700">Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1.5 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-50">Previous</button>
                    <span className="text-sm text-neutral-500">Page {page} of {totalPages}</span>
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1.5 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-50">Next</button>
                </div>
            )}
        </div>
    );
}
