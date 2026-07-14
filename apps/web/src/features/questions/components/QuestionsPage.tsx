"use client";

import { useState } from "react";
import { SearchBar } from "./SearchBar";
import { FilterBar } from "./FilterBar";
import { QuestionTable } from "./QuestionTable";
import { Pagination } from "./Pagination";
import { PaymentModal } from "./PaymentModal";
import { useQuestions } from "../hooks/useQuestions";

export function QuestionsPage() {
  const [filters, setFilters] = useState({
    search: "",
    languageId: "",
    fieldId: "",
    difficulty: "",
    page: 1,
  });
  const [showPayment, setShowPayment] = useState(false);

  const { data, loading } = useQuestions(filters);

  const handlePageChange = (newPage: number) => {
    if (newPage > 1 && data?.pagination.isPremiumRequired) {
      setShowPayment(true);
      return;
    }
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Interview Questions</h1>
      <p className="text-gray-500 mb-6">
        Prepare for your interviews with our comprehensive collection of
        questions and answers.
      </p>

      <SearchBar
        value={filters.search}
        onChange={(search) =>
          setFilters((prev) => ({ ...prev, search, page: 1 }))
        }
      />

      <FilterBar
        filters={filters}
        onChange={(updates) =>
          setFilters((prev) => ({ ...prev, ...updates, page: 1 }))
        }
      />

      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading questions...
        </div>
      ) : (
        <>
          <QuestionTable questions={data?.questions || []} />
          <Pagination
            page={filters.page}
            totalPages={data?.pagination.totalPages || 1}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
      />
    </div>
  );
}
