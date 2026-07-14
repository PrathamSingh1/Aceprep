"use client";

import { useState } from "react";

interface QuestionRowProps {
  question: any;
  index: number;
}

export function QuestionRow({ question, index }: QuestionRowProps) {
  const [expanded, setExpanded] = useState(false);

  const difficultyColors: Record<string, string> = {
    EASY: "bg-green-100 text-green-800",
    MEDIUM: "bg-yellow-100 text-yellow-800",
    HARD: "bg-red-100 text-red-800",
  };

  return (
    <div className="border-b border-gray-200">
      <div
        className="flex items-center gap-4 py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="w-8 text-sm text-gray-500">{index + 1}</span>
        <span className="flex-1 font-medium text-gray-900">
          {question.content}
        </span>
        <span className="text-sm text-gray-600 hidden sm:block">
          {question.questionSet?.language?.name}
        </span>
        <span
          className={`text-xs px-2 py-1 rounded-full ${difficultyColors[question.difficulty] || ""}`}
        >
          {question.difficulty}
        </span>
        <button className="text-gray-400 hover:text-gray-600">
          {question.isSolved ? "✅" : "☐"}
        </button>
        <button className="text-gray-400 hover:text-yellow-500">
          {question.isBookmarked ? "🔖" : "☆"}
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4 ml-12 bg-gray-50 rounded mx-4 mb-2 p-4">
          <p className="text-sm font-medium text-gray-500 mb-2">Answer:</p>
          <div className="whitespace-pre-wrap text-gray-700">
            {question.answer}
          </div>
        </div>
      )}
    </div>
  );
}
