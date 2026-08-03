"use client";

import { useSession, signOut } from "@/lib/auth-client";

export interface AuthUser {
    id: string;
    name: string | null;
    email: string;
    emailVerified: boolean;
    image: string | null;
    role: string;
    referralCode: string;
    walletBalance: number;
    isPremiumActive: boolean;
    currentPremiumTier: string | null;
    premiumExpiryDate: string | null;
    createdAt: string;
    updatedAt: string;
}

export function useAuth() {
    const { data, isPending } = useSession();

    const user = (data?.user as unknown as AuthUser) || null;
    const loading = isPending;

    const logout = async () => {
        await signOut();
        window.location.href = "/";
    };

    return { user, loading, logout };
}
