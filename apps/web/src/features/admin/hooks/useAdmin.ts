"use client";

import { useState, useEffect, useCallback } from "react";
import { adminApi } from "../lib/api";

export function useAdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminApi.getDashboard()
            .then((res) => setStats(res.data.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return { stats, loading };
}

export function useAdminUsers() {
    const [data, setData] = useState<any>({ users: [], total: 0, totalPages: 0 });
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: "", role: "", isPremium: "", page: 1 });

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminApi.getUsers(filters);
            setData(res.data.data);
        } catch {} finally {
            setLoading(false);
        }
    }, [filters.search, filters.role, filters.isPremium, filters.page]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    return { ...data, loading, filters, setFilters, refetch: fetchUsers };
}

export function useAdminCategories() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminApi.getCategories();
            setCategories(res.data.data);
        } catch {} finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    return { categories, loading, refetch: fetchCategories };
}

export function useAdminQuestions() {
    const [data, setData] = useState<any>({ questions: [], total: 0, totalPages: 0 });
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: "", difficulty: "", categoryId: "", fieldId: "", page: 1 });

    const fetchQuestions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminApi.getQuestions(filters);
            setData(res.data.data);
        } catch {} finally {
            setLoading(false);
        }
    }, [filters.search, filters.difficulty, filters.categoryId, filters.fieldId, filters.page]);

    useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

    return { ...data, loading, filters, setFilters, refetch: fetchQuestions };
}

export function useAdminPurchases() {
    const [data, setData] = useState<any>({ purchases: [], total: 0, totalPages: 0 });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const fetchPurchases = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminApi.getPurchases({ page });
            setData(res.data.data);
        } catch {} finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => { fetchPurchases(); }, [fetchPurchases]);

    return { ...data, loading, page, setPage, refetch: fetchPurchases };
}

export function useAdminCoupons() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCoupons = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminApi.getCoupons();
            setCoupons(res.data.data);
        } catch {} finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

    return { coupons, loading, refetch: fetchCoupons };
}
