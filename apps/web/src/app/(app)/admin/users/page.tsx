"use client";

import { useState } from "react";
import { useAdminUsers } from "@/features/admin/hooks/useAdmin";
import { adminApi } from "@/features/admin/lib/api";

export default function AdminUsersPage() {
    const { users, total, totalPages, loading, filters, setFilters, refetch } = useAdminUsers();
    const [editingUser, setEditingUser] = useState<any>(null);

    const handleTogglePremium = async (userId: string, current: boolean) => {
        try {
            await adminApi.togglePremium(userId, {
                isPremiumActive: !current,
                tier: !current ? "TIER_1" : undefined,
                expiryDate: !current ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
            });
            refetch();
        } catch {}
    };

    const handleRoleChange = async (userId: string, role: string) => {
        try {
            await adminApi.updateUserRole(userId, role);
            refetch();
        } catch {}
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await adminApi.deleteUser(userId);
            refetch();
        } catch {}
    };

    return (
        <div>
            <h1 className="text-2xl font-bold font-manrope mb-6">Users ({total})</h1>

            {/* Filters */}
            <div className="flex gap-3 mb-6 flex-wrap">
                <input
                    type="text"
                    placeholder="Search name or email..."
                    value={filters.search}
                    onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
                    className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[200px]"
                />
                <select
                    value={filters.role}
                    onChange={(e) => setFilters((prev) => ({ ...prev, role: e.target.value, page: 1 }))}
                    className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900"
                >
                    <option value="">All Roles</option>
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                </select>
                <select
                    value={filters.isPremium}
                    onChange={(e) => setFilters((prev) => ({ ...prev, isPremium: e.target.value, page: 1 }))}
                    className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900"
                >
                    <option value="">All Users</option>
                    <option value="true">Premium</option>
                    <option value="false">Free</option>
                </select>
            </div>

            {/* Table */}
            {loading ? (
                <div className="text-center py-10 text-neutral-500">Loading users...</div>
            ) : users.length === 0 ? (
                <div className="text-center py-10 text-neutral-500">No users found.</div>
            ) : (
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800 text-left">
                                    <th className="px-4 py-2.5 font-medium text-neutral-500">Name</th>
                                    <th className="px-4 py-2.5 font-medium text-neutral-500">Email</th>
                                    <th className="px-4 py-2.5 font-medium text-neutral-500">Role</th>
                                    <th className="px-4 py-2.5 font-medium text-neutral-500">Premium</th>
                                    <th className="px-4 py-2.5 font-medium text-neutral-500">Tier</th>
                                    <th className="px-4 py-2.5 font-medium text-neutral-500">Joined</th>
                                    <th className="px-4 py-2.5 font-medium text-neutral-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u: any) => (
                                    <tr key={u.id} className="border-b border-neutral-200 dark:border-neutral-800 last:border-b-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                        <td className="px-4 py-2.5 font-medium">{u.name || "—"}</td>
                                        <td className="px-4 py-2.5 text-neutral-500">{u.email}</td>
                                        <td className="px-4 py-2.5">
                                            <select
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                className="text-xs px-2 py-1 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                                            >
                                                <option value="USER">USER</option>
                                                <option value="ADMIN">ADMIN</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-2.5">
                                            <button
                                                onClick={() => handleTogglePremium(u.id, u.isPremiumActive)}
                                                className={`text-xs px-2 py-1 rounded-full cursor-pointer transition-colors ${
                                                    u.isPremiumActive
                                                        ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                                        : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
                                                }`}
                                            >
                                                {u.isPremiumActive ? "Premium" : "Free"}
                                            </button>
                                        </td>
                                        <td className="px-4 py-2.5 text-sm text-neutral-500">{u.currentPremiumTier || "—"}</td>
                                        <td className="px-4 py-2.5 text-sm text-neutral-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td className="px-4 py-2.5">
                                            <button
                                                onClick={() => handleDelete(u.id)}
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
