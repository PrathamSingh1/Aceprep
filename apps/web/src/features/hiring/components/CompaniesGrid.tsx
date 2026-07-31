"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";

export function CompaniesGrid() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    apiClient.get("/jobs/companies").then((res) => {
      setCompanies(res.data.data);
      setLoading(false);
    });
  }, []);

  const filtered = companies.filter((c: any) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold font-manrope mb-1">Companies</h1>
      <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-6">
        Explore {companies.length} companies hiring across jobs and internships.
      </p>

      <input
        type="text"
        placeholder="Search companies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2.5 mb-6 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />

      {loading ? (
        <div className="text-center py-10 text-neutral-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-neutral-500">No companies found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c: any) => (
            <div
              key={c.id}
              className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xl font-bold flex-shrink-0">
                  {c.name[0]}
                </div>
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-sm text-blue-500 font-medium">
                    {c._count.jobs} opportunities
                  </div>
                </div>
              </div>

              {c.website && (
                <a
                  href={c.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-neutral-400 hover:text-blue-500"
                >
                  {c.website.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
