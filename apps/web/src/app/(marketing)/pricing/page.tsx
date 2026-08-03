"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api-client";

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface TierConfig {
    tier: "TIER_1" | "TIER_2" | "TIER_3";
    label: string;
    duration: string;
    price: number;
    priceLabel: string;
    perMonth: string;
    features: string[];
    popular?: boolean;
}

const tiers: TierConfig[] = [
    {
        tier: "TIER_1",
        label: "1 Month",
        duration: "1 Month Premium",
        price: 299,
        priceLabel: "₹299",
        perMonth: "₹299/mo",
        features: [
            "Access all interview questions",
            "Unlimited pagination",
            "Apply to unlimited jobs",
            "Save & track applications",
            "Premium badge on profile",
        ],
    },
    {
        tier: "TIER_2",
        label: "6 Months",
        duration: "6 Month Premium",
        price: 1499,
        priceLabel: "₹1,499",
        perMonth: "₹250/mo",
        features: [
            "Everything in 1 Month",
            "Save ₹295 vs monthly",
            "Priority support",
            "Early access to new features",
            "Premium badge on profile",
        ],
        popular: true,
    },
    {
        tier: "TIER_3",
        label: "1 Year",
        duration: "1 Year Premium",
        price: 2499,
        priceLabel: "₹2,499",
        perMonth: "₹208/mo",
        features: [
            "Everything in 6 Months",
            "Save ₹1,089 vs monthly",
            "1-on-1 resume review",
            "Lifetime community access",
            "Premium badge on profile",
        ],
    },
];

export default function PricingPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);
    const [couponCode, setCouponCode] = useState("");
    const [error, setError] = useState("");

    const loadRazorpay = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePurchase = async (tierConfig: TierConfig) => {
        if (!user) {
            router.push("/login");
            return;
        }

        if (user.isPremiumActive) {
            setError("You already have an active premium subscription.");
            return;
        }

        setLoading(tierConfig.tier);
        setError("");

        try {
            const loaded = await loadRazorpay();
            if (!loaded) {
                setError("Failed to load payment gateway. Please try again.");
                setLoading(null);
                return;
            }

            const orderRes = await apiClient.post("/premium/create-order", {
                tier: tierConfig.tier,
                couponCode: couponCode || undefined,
            });

            const { orderId, amount, purchaseId } = orderRes.data.data;

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount,
                currency: "INR",
                name: "Aceprep",
                description: tierConfig.duration,
                order_id: orderId,
                handler: async (response: any) => {
                    try {
                        await apiClient.post("/premium/verify", {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        });
                        window.location.href = "/questions";
                    } catch {
                        setError("Payment verification failed. Contact support.");
                        setLoading(null);
                    }
                },
                prefill: {
                    name: user.name || "",
                    email: user.email || "",
                },
                theme: {
                    color: "#3b82f6",
                },
                modal: {
                    ondismiss: () => {
                        setLoading(null);
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-5xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold font-manrope mb-3">
                        Choose Your Plan
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-2xl mx-auto">
                        Unlock unlimited access to all interview questions, job applications, and premium features.
                    </p>
                </div>

                {user?.isPremiumActive && (
                    <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
                        <p className="text-green-700 dark:text-green-400 font-medium">
                            You have an active {user.currentPremiumTier?.replace("TIER_1", "1 Month").replace("TIER_2", "6 Month").replace("TIER_3", "1 Year")} premium subscription.
                        </p>
                    </div>
                )}

                {error && (
                    <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center">
                        <p className="text-red-700 dark:text-red-400">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {tiers.map((t) => (
                        <div
                            key={t.tier}
                            className={`relative border rounded-xl p-6 flex flex-col ${
                                t.popular
                                    ? "border-blue-500 dark:border-blue-400 shadow-lg"
                                    : "border-neutral-200 dark:border-neutral-800"
                            }`}
                        >
                            {t.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                                    Most Popular
                                </div>
                            )}
                            <h3 className="text-lg font-semibold font-manrope mb-1">{t.label}</h3>
                            <p className="text-sm text-neutral-500 mb-4">{t.duration}</p>
                            <div className="mb-4">
                                <span className="text-3xl font-bold">{t.priceLabel}</span>
                                <span className="text-sm text-neutral-500 ml-1">/ {t.perMonth}</span>
                            </div>
                            <ul className="space-y-2 mb-6 flex-1">
                                {t.features.map((f, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                        <svg
                                            className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handlePurchase(t)}
                                disabled={loading !== null || !!user?.isPremiumActive}
                                className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors ${
                                    t.popular
                                        ? "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300"
                                        : "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50"
                                }`}
                            >
                                {loading === t.tier
                                    ? "Processing..."
                                    : user?.isPremiumActive
                                        ? "Active"
                                        : "Get Started"}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="max-w-md mx-auto">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Have a coupon code?
                    </label>
                    <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code"
                        className="w-full px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mt-12 text-center text-sm text-neutral-500">
                    <p>Payments are securely processed via Razorpay. All major cards, UPI, and net banking accepted.</p>
                </div>
            </div>
        </div>
    );
}
