"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useEffect } from "react";

const adminNav = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Users", href: "/admin/users" },
    { label: "Categories", href: "/admin/categories" },
    { label: "Questions", href: "/admin/questions" },
    { label: "Purchases", href: "/admin/purchases" },
    { label: "Coupons", href: "/admin/coupons" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && (!user || user.role !== "ADMIN")) {
            window.location.href = "/browse/interview-questions";
        }
    }, [user, loading]);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen text-neutral-500">Loading...</div>;
    }

    if (!user || user.role !== "ADMIN") {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* Admin Sidebar */}
            <aside className="w-[220px] border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex flex-col fixed h-screen">
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
                    <Link href="/admin/dashboard" className="font-manrope font-bold text-lg">
                        Admin Panel
                    </Link>
                </div>
                <nav className="flex-1 p-3 space-y-1">
                    {adminNav.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "block px-3 py-2 text-sm rounded-lg transition-colors",
                                    isActive
                                        ? "bg-blue-500 text-white"
                                        : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                                )}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-3 border-t border-neutral-200 dark:border-neutral-800">
                    <Link href="/browse/interview-questions" className="block px-3 py-2 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
                        Back to App
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 ml-[220px] p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
}
