"use client";

import { useState } from "react";
import { useAdminCompanies } from "@/features/admin/hooks/useAdmin";
import { adminApi } from "@/features/admin/lib/api";

export default function AdminCompaniesPage() {
    const { companies, total, totalPages, loading, filters, setFilters, refetch } = useAdminCompanies();
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: "", slug: "", logo: "", website: "" });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await adminApi.createCompany({
                name: form.name,
                slug: form.slug,
                logo: form.logo || undefined,
                website: form.website || undefined,
            });
            setForm({ name: "", slug: "", logo: "", website: "" });
            setShowForm(false);
            refetch();
        } catch {} finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this company?")) return;
        try {
            await adminApi.deleteCompany(id);
            refetch();
        } catch {}
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold font-manrope">Companies ({total})</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                >
                    {showForm ? "Cancel" : "Add Company"}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 mb-6 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="text"
                            placeholder="Company Name"
                            value={form.name}
                            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                            required
                            className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900"
                        />
                        <input
                            type="text"
                            placeholder="Slug (e.g. google)"
                            value={form.slug}
                            onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                            required
                            className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="text"
                            placeholder="Logo URL (optional)"
                            value={form.logo}
                            onChange={(e) => setForm((prev) => ({ ...prev, logo: e.target.value }))}
                            className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900"
                        />
                        <input
                            type="url"
                            placeholder="Website URL (optional)"
                            value={form.website}
                            onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
                            className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Create Company"}
                    </button>
                </form>
            )}

            <div className="flex gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Search companies..."
                    value={filters.search}
                    onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
                    className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900 flex-1 min-w-[200px]"
                />
            </div>

            {loading ? (
                <div className="text-center py-10 text-neutral-500">Loading companies...</div>
            ) : companies.length === 0 ? (
                <div className="text-center py-10 text-neutral-500">No companies found.</div>
            ) : (
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800 text-left">
                                    <th className="px-4 py-2.5 font-medium text-neutral-500">Name</th>
                                    <th className="px-4 py-2.5 font-medium text-neutral-500">Slug</th>
                                    <th className="px-4 py-2.5 font-medium text-neutral-500">Website</th>
                                    <th className="px-4 py-2.5 font-medium text-neutral-500">Jobs</th>
                                    <th className="px-4 py-2.5 font-medium text-neutral-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {companies.map((c: any) => (
                                    <tr key={c.id} className="border-b border-neutral-200 dark:border-neutral-800 last:border-b-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                        <td className="px-4 py-2.5 font-medium">{c.name}</td>
                                        <td className="px-4 py-2.5 text-neutral-500 font-mono text-xs">{c.slug}</td>
                                        <td className="px-4 py-2.5">
                                            {c.website ? (
                                                <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs">
                                                    {c.website}
                                                </a>
                                            ) : (
                                                <span className="text-neutral-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2.5">{c._count.jobs}</td>
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
                </div>
            )}

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
