"use client";

import { useState } from "react";
import { useAdminCategories } from "@/features/admin/hooks/useAdmin";
import { adminApi } from "@/features/admin/lib/api";

export default function AdminCategoriesPage() {
    const { categories, loading, refetch } = useAdminCategories();
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: "", slug: "", parentId: "", sortOrder: "0" });
    const [saving, setSaving] = useState(false);

    const rootCategories = categories.filter((c: any) => !c.parentId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await adminApi.createCategory({
                name: form.name,
                slug: form.slug,
                parentId: form.parentId || undefined,
                sortOrder: parseInt(form.sortOrder) || 0,
            });
            setForm({ name: "", slug: "", parentId: "", sortOrder: "0" });
            setShowForm(false);
            refetch();
        } catch {} finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this category? Questions in it will be orphaned.")) return;
        try {
            await adminApi.deleteCategory(id);
            refetch();
        } catch {}
    };

    const handleToggleActive = async (id: string, current: boolean) => {
        try {
            await adminApi.updateCategory(id, { isActive: !current });
            refetch();
        } catch {}
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold font-manrope">Categories ({categories.length})</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                >
                    {showForm ? "Cancel" : "Add Category"}
                </button>
            </div>

            {/* Add Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 mb-6 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="text"
                            placeholder="Name"
                            value={form.name}
                            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                            required
                            className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900"
                        />
                        <input
                            type="text"
                            placeholder="Slug"
                            value={form.slug}
                            onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                            required
                            className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <select
                            value={form.parentId}
                            onChange={(e) => setForm((prev) => ({ ...prev, parentId: e.target.value }))}
                            className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900"
                        >
                            <option value="">Root Category</option>
                            {rootCategories.map((c: any) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="Sort Order"
                            value={form.sortOrder}
                            onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: e.target.value }))}
                            className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Create Category"}
                    </button>
                </form>
            )}

            {/* Table */}
            {loading ? (
                <div className="text-center py-10 text-neutral-500">Loading categories...</div>
            ) : (
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800 text-left">
                                <th className="px-4 py-2.5 font-medium text-neutral-500">Name</th>
                                <th className="px-4 py-2.5 font-medium text-neutral-500">Slug</th>
                                <th className="px-4 py-2.5 font-medium text-neutral-500">Parent</th>
                                <th className="px-4 py-2.5 font-medium text-neutral-500">Questions</th>
                                <th className="px-4 py-2.5 font-medium text-neutral-500">Active</th>
                                <th className="px-4 py-2.5 font-medium text-neutral-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((c: any) => (
                                <tr key={c.id} className="border-b border-neutral-200 dark:border-neutral-800 last:border-b-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                    <td className="px-4 py-2.5 font-medium">
                                        {c.parentId && <span className="text-neutral-400 mr-1">└</span>}
                                        {c.name}
                                    </td>
                                    <td className="px-4 py-2.5 text-neutral-500 font-mono text-xs">{c.slug}</td>
                                    <td className="px-4 py-2.5 text-neutral-500">{c.parent?.name || "—"}</td>
                                    <td className="px-4 py-2.5">{c._count.questions}</td>
                                    <td className="px-4 py-2.5">
                                        <button
                                            onClick={() => handleToggleActive(c.id, c.isActive)}
                                            className={`text-xs px-2 py-1 rounded-full cursor-pointer ${
                                                c.isActive ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-400"
                                            }`}
                                        >
                                            {c.isActive ? "Active" : "Inactive"}
                                        </button>
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <button
                                            onClick={() => handleDelete(c.id)}
                                            className="text-xs text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
