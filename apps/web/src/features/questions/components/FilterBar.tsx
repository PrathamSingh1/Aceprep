"use client";

import { useLanguages } from "../hooks/useLanguages";
import { useFields } from "../hooks/useFields";

interface FilterBarProps {
  filters: {
    languageId?: string;
    fieldId?: string;
    difficulty?: string;
  };
  onChange: (updates: {
    languageId?: string;
    fieldId?: string;
    difficulty?: string;
  }) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const { languages } = useLanguages();
  const { fields } = useFields();

  return (
    <div className="flex gap-4 mb-6 flex-wrap">
      <select
        value={filters.languageId || ""}
        onChange={(e) => onChange({ languageId: e.target.value || undefined })}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Languages</option>
        {languages.map((lang) => (
          <option key={lang.id} value={lang.id}>
            {lang.icon} {lang.name}
          </option>
        ))}
      </select>

      <select
        value={filters.fieldId || ""}
        onChange={(e) => onChange({ fieldId: e.target.value || undefined })}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Fields</option>
        {fields.map((field) => (
          <option key={field.id} value={field.id}>
            {field.icon} {field.name}
          </option>
        ))}
      </select>

      <select
        value={filters.difficulty || ""}
        onChange={(e) => onChange({ difficulty: e.target.value || undefined })}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Difficulties</option>
        <option value="EASY">Easy</option>
        <option value="MEDIUM">Medium</option>
        <option value="HARD">Hard</option>
      </select>
    </div>
  );
}
