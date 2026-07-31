"use client";

import { useAdminPurchases } from "@/features/admin/hooks/useAdmin";

export default function AdminPurchasesPage() {
    const { purchases, total, totalPages, loading, page, setPage } = useAdminPurchases();

    return (
        <div>
            <h1 className="text-2xl font-bold font-manrope mb-6">Purchases ({total})</h1>

            {loading ? (
                <div className="text-center py-10 text-neutral-500">Loading purchases...</div>
            ) : purchases.length === 0 ? (
                <div className="text-center py-10 text-neutral-500">No purchases yet.</div>
            ) : (
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800 text-left">
                                    <th className="px-4 py-2.5 font-medium text-neutral-500">User</th>
                                    <th className="px-4 py-2.5 font-medium text-neutral-500">Tier</th>
                                    <th className="px-4 py-2.5 font-medium text-neutral-500">Amount</th>
                                    <th className="px-4 py-2.5 font-medium text-neutral-500">Status</th>
                                    <th className="px-4 py-2.5 font-medium text-neutral-500">Razorpay ID</th>
                                    <th className="px-4 py-2.5 font-medium text-neutral-500">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchases.map((p: any) => (
                                    <tr key={p.id} className="border-b border-neutral-200 dark:border-neutral-800 last:border-b-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                        <td className="px-4 py-2.5">
                                            <div className="font-medium">{p.user.name || "—"}</div>
                                            <div className="text-xs text-neutral-400">{p.user.email}</div>
                                        </td>
                                        <td className="px-4 py-2.5">{p.tier}</td>
                                        <td className="px-4 py-2.5">₹{p.amountPaid}</td>
                                        <td className="px-4 py-2.5">
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                p.paymentStatus === "COMPLETED" ? "bg-green-100 text-green-700" :
                                                p.paymentStatus === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                                                p.paymentStatus === "REFUNDED" ? "bg-blue-100 text-blue-700" :
                                                "bg-red-100 text-red-700"
                                            }`}>
                                                {p.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2.5 text-xs font-mono text-neutral-400">{p.razorpayPaymentId || "—"}</td>
                                        <td className="px-4 py-2.5 text-neutral-500">{new Date(p.createdAt).toLocaleDateString()}</td>
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
                        onClick={() => setPage(page - 1)}
                        disabled={page <= 1}
                        className="px-3 py-1.5 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-neutral-500">Page {page} of {totalPages}</span>
                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={page >= totalPages}
                        className="px-3 py-1.5 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
