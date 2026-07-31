"use client";

import { useAdminDashboard } from "@/features/admin/hooks/useAdmin";

export default function AdminDashboardPage() {
    const { stats, loading } = useAdminDashboard();

    if (loading) {
        return <div className="text-center py-10 text-neutral-500">Loading dashboard...</div>;
    }

    if (!stats) {
        return <div className="text-center py-10 text-neutral-500">Failed to load dashboard.</div>;
    }

    const cards = [
        { label: "Total Users", value: stats.totalUsers, color: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
        { label: "Premium Users", value: stats.premiumUsers, color: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
        { label: "Total Questions", value: stats.totalQuestions, color: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300" },
        { label: "Categories", value: stats.totalCategories, color: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" },
        { label: "Companies", value: stats.totalCompanies, color: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300" },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold font-manrope mb-6">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {cards.map((card) => (
                    <div key={card.label} className={`rounded-xl p-4 ${card.color}`}>
                        <p className="text-sm opacity-75">{card.label}</p>
                        <p className="text-2xl font-bold mt-1">{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Purchases */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800">
                    <h2 className="font-semibold text-sm">Recent Purchases</h2>
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-neutral-200 dark:border-neutral-800 text-left text-neutral-500">
                            <th className="px-4 py-2.5 font-medium">User</th>
                            <th className="px-4 py-2.5 font-medium">Tier</th>
                            <th className="px-4 py-2.5 font-medium">Amount</th>
                            <th className="px-4 py-2.5 font-medium">Status</th>
                            <th className="px-4 py-2.5 font-medium">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.recentPurchases.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-6 text-center text-neutral-400">No purchases yet</td>
                            </tr>
                        ) : (
                            stats.recentPurchases.map((p: any) => (
                                <tr key={p.id} className="border-b border-neutral-200 dark:border-neutral-800 last:border-b-0">
                                    <td className="px-4 py-2.5">
                                        <div>{p.user.name || "—"}</div>
                                        <div className="text-xs text-neutral-400">{p.user.email}</div>
                                    </td>
                                    <td className="px-4 py-2.5">{p.tier}</td>
                                    <td className="px-4 py-2.5">₹{p.amountPaid}</td>
                                    <td className="px-4 py-2.5">
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            p.paymentStatus === "COMPLETED" ? "bg-green-100 text-green-700" :
                                            p.paymentStatus === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                                            "bg-red-100 text-red-700"
                                        }`}>
                                            {p.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-neutral-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
