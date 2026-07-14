"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";

export function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      apiClient
        .get("/auth/me")
        .then((res) => setUser(res.data.data))
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          AcePrep
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/questions" className="text-gray-600 hover:text-gray-900">
            Questions
          </Link>
          <Link
            href="/experiences"
            className="text-gray-600 hover:text-gray-900"
          >
            Experiences
          </Link>
          {user ? (
            <>
              <Link
                href="/premium"
                className="text-gray-600 hover:text-gray-900"
              >
                Premium
              </Link>
              <span className="text-gray-600">{user.name}</span>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
