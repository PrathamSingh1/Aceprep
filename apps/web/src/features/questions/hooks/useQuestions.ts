"use client";

import { useState, useEffect, useCallback } from "react";
import { questionsApi } from "../lib/api";

export function useQuestions(filters: {
    languageId?: string;
    fieldId?: string;
    difficulty?: string;
    search?: string;
    page?: number;
}) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchQuestions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await questionsApi.getQuestions(filters);
            setData(res.data.data);
        } finally {
            setLoading(false);
        }
    }, [filters.languageId, filters.fieldId, filters.difficulty, filters.search, filters.page]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    return { data, loading, refetch: fetchQuestions };
}