"use client";

import { useState, useEffect } from "react";
import { questionsApi } from "../lib/api";

export function useLanguages() {
    const [languages, setLanguages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        questionsApi.getLanguages()
            .then((res) => setLanguages(res.data.data))
            .finally(() => setLoading(false));
    }, []);

    return { languages, loading };
}