import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-6">Ace Your Next Interview</h1>
        <p className="text-xl text-gray-600 mb-8">
          Comprehensive collection of interview questions with detailed answers.
          Filter by language, field, and difficulty level.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Get Started Free
          </Link>
          <Link
            href="/questions"
            className="border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50"
          >
            Browse Questions
          </Link>
        </div>
      </div>
    </div>
  );
}
