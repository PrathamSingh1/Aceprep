"use client";

import { useState } from "react";
import { useAdminCoupons } from "@/features/admin/hooks/useAdmin";
import { adminApi } from "@/features/admin/lib/api";

export default function AdminCouponsPage() {
    const { coupons, loading, refetch } = useAdminCoupons();
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ code: "", type: "PERCENTAGE", value: "", maxUses: "", validUntil: "" });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await adminApi.createCoupon({
                code: form.code,
                type: form.type,
                value: parseInt(form.value),
                maxUses: form.maxUses ? parseInt(form.maxUses) : undefined,
                validUntil: form.validUntil || undefined,
            });
            setForm({ code: "", type: "PERCENTAGE", value: "", maxUses: "", validUntil: "" });
            setShowForm(false);
            refetch();
        } catch {} finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this coupon?")) return;
        try {
            await adminApi.deleteCoupon(id);
            refetch();
        } catch {}
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold font-manrope">Coupons ({coupons.length})</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                >
                    {showForm ? "Cancel" : "Add Coupon"}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 mb-6 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="text"
                            placeholder="Coupon Code (e.g. SAVE20)"
                            value={form.code}
                            onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
                            required
                            className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900 uppercase"
                        />
                        <select
                            value={form.type}
                            onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
                            className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900"
                        >
                            <option value="PERCENTAGE">Percentage (%)</option>
                            <option value="FIXED_AMOUNT">Fixed Amount (₹)</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <input
                            type="number"
                            placeholder="Discount Value"
                            value={form.value}
                            onChange={(e) => setForm((prev) => ({ ...prev, value: e.target.value }))}
                            required
                            min="0"
                            className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900"
                        />
                        <input
                            type="number"
                            placeholder="Max Uses (optional)"
                            value={form.maxUses}
                            onChange={(e) => setForm((prev) => ({ ...prev, maxUses: e.target.value }))}
                            min="1"
                            className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900"
                        />
                        <input
                            type="datetime-local"
                            placeholder="Valid Until"
                            value={form.validUntil}
                            onChange={(e) => setForm((prev) => ({ ...prev, validUntil: e.target.value }))}
                            className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Create Coupon"}
                    </button>
                </form>
            )}

            {loading ? (
                <div className="text-center py-10 text-neutral-500">Loading coupons...</div>
            ) : coupons.length === 0 ? (
                <div className="text-center py-10 text-neutral-500">No coupons yet.</div>
            ) : (
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                                <tr className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800 text-left">
                                <th className="px-4 py-2.5 font-medium text-neutral-500">Code</th>
                                <th className="px-4 py-2.5 font-medium text-neutral-500">Type</th>
                                <th className="px-4 py-2.5 font-medium text-neutral-500">Value</th>
                                <th className="px-4 py-2.5 font-medium text-neutral-500">Uses</th>
                                <th className="px-4 py-2.5 font-medium text-neutral-500">Valid Until</th>
                                <th className="px-4 py-2.5 font-medium text-neutral-500">Active</th>
                                <th className="px-4 py-2.5 font-medium text-neutral-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map((c: any) => (
                                <tr key={c.id} className="border-b border-neutral-200 dark:border-neutral-800 last:border-b-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                    <td className="px-4 py-2.5 font-mono font-bold">{c.code}</td>
                                    <td className="px-4 py-2.5 text-neutral-500">{c.type}</td>
                                    <td className="px-4 py-2.5">
                                        {c.type === "PERCENTAGE" ? `${c.value}%` : `₹${c.value}`}
                                    </td>
                                    <td className="px-4 py-2.5 text-neutral-500">
                                        {c.usedCount}/{c.maxUses || "∞"}
                                    </td>
                                    <td className="px-4 py-2.5 text-neutral-500">
                                        {c.validUntil ? new Date(c.validUntil).toLocaleDateString() : "—"}
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            c.isActive ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-400"
                                        }`}>
                                            {c.isActive ? "Active" : "Inactive"}
                                        </span>
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
