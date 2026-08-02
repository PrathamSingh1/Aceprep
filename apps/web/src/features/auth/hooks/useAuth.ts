"use client";

import { useSession, signOut } from "@/lib/auth-client";

export function useAuth() {
    const { data, isPending } = useSession();

    const user = data?.user || null;
    const loading = isPending;

    const logout = async () => {
        await signOut();
        window.location.href = "/";
    };

    return { user, loading, logout };
}
