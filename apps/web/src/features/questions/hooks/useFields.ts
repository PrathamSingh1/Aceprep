"use client";

import { useState, useEffect } from "react";
import { questionsApi } from "../lib/api";

export function useFields() {
    const [fields, setFields] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        questionsApi.getFields()
            .then((res) => setFields(res.data.data))
            .finally(() => setLoading(false));
    }, []);

    return { fields, loading };
}