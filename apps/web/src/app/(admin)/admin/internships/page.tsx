"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdminCompanies } from "@/features/admin/hooks/useAdmin";
import { adminApi } from "@/features/admin/lib/api";

export default function AdminInternshipsPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { companies, refetch: refetchCompanies } = useAdminCompanies();
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        title: "", companyId: "", location: "", description: "", applyUrl: "",
        salaryMin: "", salaryMax: "", isRemote: false,
    });
    const [saving, setSaving] = useState(false);

    const [useNewCompany, setUseNewCompany] = useState(false);
    const [newCompanyForm, setNewCompanyForm] = useState({ name: "", slug: "", website: "" });
    const [creatingCompany, setCreatingCompany] = useState(false);

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminApi.getJobs({ search, type: "INTERNSHIP", page });
            setJobs(res.data.data.jobs);
            setTotal(res.data.data.total);
            setTotalPages(res.data.data.totalPages);
        } catch {} finally {
            setLoading(false);
        }
    }, [search, page]);

    useEffect(() => { fetchJobs(); }, [fetchJobs]);

    const handleCreateCompany = async () => {
        if (!newCompanyForm.name) return;
        setCreatingCompany(true);
        try {
            const slug = newCompanyForm.slug || newCompanyForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
            const res = await adminApi.createCompany({ ...newCompanyForm, slug });
            const newId = res.data.data.id;
            setForm((p) => ({ ...p, companyId: newId }));
            setUseNewCompany(false);
            setNewCompanyForm({ name: "", slug: "", website: "" });
            refetchCompanies();
        } catch {} finally {
            setCreatingCompany(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await adminApi.createJob({
                ...form,
                type: "INTERNSHIP",
                salaryMin: form.salaryMin ? parseInt(form.salaryMin) : undefined,
                salaryMax: form.salaryMax ? parseInt(form.salaryMax) : undefined,
            });
            setForm({ title: "", companyId: "", location: "", description: "", applyUrl: "", salaryMin: "", salaryMax: "", isRemote: false });
            setShowForm(false);
            fetchJobs();
        } catch {} finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this internship?")) return;
        try {
            await adminApi.deleteJob(id);
            fetchJobs();
        } catch {}
    };

    const formatSalary = (min?: number, max?: number) => {
        if (!min && !max) return "—";
        const fmt = (n: number) => `${(n / 1000).toFixed(0)}K`;
        if (min && max) return `${fmt(min)} - ${fmt(max)}/month`;
        return min ? `From ${fmt(min)}/month` : `Up to ${fmt(max!)}/month`;
    };

    const inputClass = "px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900";

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold font-manrope">Internships ({total})</h1>
                <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600">
                    {showForm ? "Cancel" : "Add Internship"}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 mb-6 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="Internship Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required className={inputClass} />
                        <div>
                            {!useNewCompany ? (
                                <div className="flex gap-2">
                                    <select value={form.companyId} onChange={(e) => setForm((p) => ({ ...p, companyId: e.target.value }))} required className={`${inputClass} flex-1`}>
                                        <option value="">Select Company</option>
                                        {companies.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    <button type="button" onClick={() => setUseNewCompany(true)} className="px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 whitespace-nowrap">+ New</button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <input type="text" placeholder="Company Name" value={newCompanyForm.name} onChange={(e) => setNewCompanyForm((p) => ({ ...p, name: e.target.value }))} className={`${inputClass} w-full`} />
                                    <input type="text" placeholder="Website URL (optional)" value={newCompanyForm.website} onChange={(e) => setNewCompanyForm((p) => ({ ...p, website: e.target.value }))} className={`${inputClass} w-full`} />
                                    <div className="flex gap-2">
                                        <button type="button" onClick={handleCreateCompany} disabled={creatingCompany || !newCompanyForm.name} className="px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 disabled:opacity-50 whitespace-nowrap">
                                            {creatingCompany ? "Creating..." : "Create & Select"}
                                        </button>
                                        <button type="button" onClick={() => setUseNewCompany(false)} className="px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700">Cancel</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="Location" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} className={inputClass} />
                        <input type="url" placeholder="Apply URL" value={form.applyUrl} onChange={(e) => setForm((p) => ({ ...p, applyUrl: e.target.value }))} className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <input type="number" placeholder="Stipend Min" value={form.salaryMin} onChange={(e) => setForm((p) => ({ ...p, salaryMin: e.target.value }))} className={inputClass} />
                        <input type="number" placeholder="Stipend Max" value={form.salaryMax} onChange={(e) => setForm((p) => ({ ...p, salaryMax: e.target.value }))} className={inputClass} />
                    </div>
                    <textarea placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={2} className={`w-full ${inputClass} resize-none`} />
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isRemote} onChange={(e) => setForm((p) => ({ ...p, isRemote: e.target.checked }))} /> Remote</label>
                    <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50">{saving ? "Saving..." : "Create Internship"}</button>
                </form>
            )}

            <input type="text" placeholder="Search internships..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className={`w-full px-4 py-2 mb-6 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900`} />

            {loading ? (
                <div className="text-center py-10 text-neutral-500">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {jobs.map((job: any) => (
                        <div key={job.id} className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-2">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="font-medium text-sm">{job.title}</div>
                                    <div className="text-xs text-neutral-500">{job.company.name}</div>
                                </div>
                                <button onClick={() => handleDelete(job.id)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {job.location && <span className="text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">{job.location}</span>}
                                {job.isRemote && <span className="text-xs bg-green-50 dark:bg-green-900/20 text-green-600 px-2 py-0.5 rounded">Remote</span>}
                            </div>
                            <div className="text-xs text-neutral-500">{formatSalary(job.salaryMin, job.salaryMax)}</div>
                            <div className="text-xs text-neutral-400">Posted {new Date(job.postedAt).toLocaleDateString()}</div>
                        </div>
                    ))}
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
