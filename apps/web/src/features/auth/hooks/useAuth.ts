"use client";

import { useState, useEffect, useCallback } from "react";
import { authApi } from "../lib/api";

export function useAuth() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            authApi.getMe()
                .then((res) => setUser(res.data.data))
                .catch(() => localStorage.removeItem("token"))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const res = await authApi.login({ email, password });
        localStorage.setItem("token", res.data.data.token);
        setUser(res.data.data.user);
        return res.data.data;
    }, []);

    const register = useCallback(async (name: string, email: string, password: string) => {
        const res = await authApi.register({ name, email, password });
        localStorage.setItem("token", res.data.data.token);
        setUser(res.data.data.user);
        return res.data.data;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        setUser(null);
        window.location.href = "/";
    }, []);

    return { user, loading, login, register, logout };
}