import { QuestionRow } from "./QuestionRow";

export function QuestionTable({ questions }: { questions: any[] }) {
  if (questions.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No questions found. Try adjusting your filters.
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="grid grid-cols-[40px_1fr_100px_80px_40px_40px] gap-2 px-4 py-2 bg-gray-50 text-sm font-medium text-gray-600">
        <span>#</span>
        <span>Question</span>
        <span className="hidden sm:block">Language</span>
        <span>Difficulty</span>
        <span>Solved</span>
        <span>Save</span>
      </div>
      {questions.map((q: any, i: number) => (
        <QuestionRow key={q.id} question={q} index={i} />
      ))}
    </div>
  );
}
