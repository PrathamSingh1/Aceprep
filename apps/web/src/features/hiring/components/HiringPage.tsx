"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { cn } from "@/lib/utils";

interface HiringPageProps {
  type: "FULL_TIME" | "INTERNSHIP";
  title: string;
  description: string;
}

export function HiringPage({ type, title, description }: HiringPageProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ allJobs: 0, internships: 0 });
  const [companyCards, setCompanyCards] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [activeTab, setActiveTab] = useState("all");
  const [pendingApplyJobId, setPendingApplyJobId] = useState<string | null>(null);

  const tags = type === "FULL_TIME"
    ? ["", "Startup", "Remote", "HFT"]
    : [""];

  const tagLabels: Record<string, string> = {
    "": type === "FULL_TIME" ? "All Jobs" : "All Internships",
    Startup: "Startup Jobs",
    Remote: "Remote Jobs",
    HFT: "HFT",
  };

  const filterTabs = [
    { key: "all", label: type === "FULL_TIME" ? "All Jobs" : "All Internships" },
    { key: "in_progress", label: "In Progress" },
    { key: "applied", label: "Applied" },
    { key: "saved", label: "Saved" },
  ];

  const requireAuth = useCallback(() => {
    if (!user) {
      router.push("/login");
      return false;
    }
    if (!user.isPremiumActive) {
      router.push("/pricing");
      return false;
    }
    return true;
  }, [user, router]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { type, page };
      if (search) params.search = search;
      if (activeTag) params.tag = activeTag;
      if (activeTab !== "all") params.filter = activeTab;

      const res = await apiClient.get("/jobs", { params });
      setJobs(res.data.data.jobs);
      setTotalPages(res.data.data.totalPages);
    } catch {} finally {
      setLoading(false);
    }
  }, [type, page, search, activeTag, activeTab]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  useEffect(() => {
    apiClient.get("/jobs/counts").then((res) => setCounts(res.data.data));
    apiClient.get("/jobs/companies").then((res) => setCompanyCards(res.data.data));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, activeTag, activeTab]);

  const handleSave = async (jobId: string) => {
    if (!requireAuth()) return;
    try {
      const res = await apiClient.post(`/jobs/${jobId}/save`);
      const saved = res.data.data.saved;
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, isSaved: saved } : j))
      );
    } catch {}
  };

  const handleApply = (job: any) => {
    if (!requireAuth()) return;
    if (job.applyUrl) {
      window.open(job.applyUrl, "_blank");
    }
    apiClient.post(`/jobs/${job.id}/apply`, { status: "IN_PROGRESS" }).then(() => {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id ? { ...j, applicationStatus: "IN_PROGRESS" } : j
        )
      );
      setPendingApplyJobId(job.id);
    }).catch(() => {});
  };

  const handleDidApply = async (jobId: string, applied: boolean) => {
    try {
      if (applied) {
        await apiClient.post(`/jobs/${jobId}/apply`, { status: "APPLIED" });
      } else {
        await apiClient.post(`/jobs/${jobId}/apply`, { status: null });
      }
      setPendingApplyJobId(null);
      if (activeTab === "all") {
        setJobs((prev) =>
          prev.map((j) =>
            j.id === jobId
              ? { ...j, applicationStatus: applied ? "APPLIED" : null }
              : j
          )
        );
      } else {
        fetchJobs();
      }
    } catch {}
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return null;
    const fmt = (n: number) => {
      if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
      if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
      return String(n);
    };
    if (min && max) return `${fmt(min)} - ${fmt(max)}/yr`;
    if (min) return `From ${fmt(min)}/yr`;
    return `Up to ${fmt(max!)}/yr`;
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold font-manrope mb-1">{title}</h1>
      <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-6">
        {description}
      </p>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1 w-fit">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-2 text-sm rounded-md transition-colors font-medium",
              activeTab === tab.key
                ? "bg-white dark:bg-neutral-900 text-blue-600 shadow-sm"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder={`Search ${type === "FULL_TIME" ? "jobs" : "internships"} by company or role...`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2.5 mb-4 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Filter tags */}
      {activeTab === "all" && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={cn(
                "px-4 py-2 text-sm rounded-full border transition-colors",
                activeTag === tag
                  ? "bg-blue-500 text-white border-blue-500"
                  : "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              )}
            >
              {tagLabels[tag]}
            </button>
          ))}
        </div>
      )}

      {/* Company cards carousel */}
      {companyCards.length > 0 && type === "FULL_TIME" && activeTab === "all" && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold font-manrope mb-3">
            Top companies hiring
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {companyCards.slice(0, 10).map((c: any) => (
              <div
                key={c.id}
                className="flex-shrink-0 w-[180px] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-2 text-lg font-bold">
                  {c.name[0]}
                </div>
                <div className="font-medium text-sm">{c.name}</div>
                <div className="text-xs text-blue-500">{c._count.jobs} jobs</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Job cards */}
      {loading ? (
        <div className="text-center py-10 text-neutral-500">Loading...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-10 text-neutral-500">
          No {activeTab === "saved" ? "saved" : activeTab === "applied" ? "applied" : activeTab === "in_progress" ? "in-progress" : ""} {type === "FULL_TIME" ? "jobs" : "internships"} found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job: any) => (
            <div
              key={job.id}
              className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col relative"
            >
              {/* Status badges */}
              <div className="absolute top-3 right-3 flex gap-1">
                {job.applicationStatus === "APPLIED" && (
                  <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">Applied</span>
                )}
                {job.applicationStatus === "IN_PROGRESS" && (
                  <span className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full font-medium">In Progress</span>
                )}
              </div>

              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-lg font-bold flex-shrink-0">
                    {job.company.name[0]}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{job.title}</div>
                    <div className="text-xs text-neutral-500">{job.company.name}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {job.location && (
                  <span className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-800 px-2 py-1 rounded">
                    {job.location}
                  </span>
                )}
                {job.isRemote && (
                  <span className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                    Remote
                  </span>
                )}
                {job.isStartup && (
                  <span className="text-xs text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                    Startup
                  </span>
                )}
                {job.isHFT && (
                  <span className="text-xs text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded">
                    HFT
                  </span>
                )}
              </div>

              {job.description && (
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2 flex-1">
                  {job.description}
                </p>
              )}

              <div className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <div className="text-xs text-neutral-500">
                  {formatSalary(job.salaryMin, job.salaryMax) || (
                    <span className="text-green-600 font-medium">Paid</span>
                  )}
                </div>
                <div className="text-xs text-neutral-400">{timeAgo(job.postedAt)}</div>
              </div>

              {/* Did you apply prompt */}
              {pendingApplyJobId === job.id && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Did you apply?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDidApply(job.id, true)}
                      className="px-3 py-1.5 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
                    >
                      Yes, applied
                    </button>
                    <button
                      onClick={() => handleDidApply(job.id, false)}
                      className="px-3 py-1.5 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    >
                      Not yet
                    </button>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              {pendingApplyJobId !== job.id && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleApply(job)}
                    className={cn(
                      "flex-1 text-center text-sm py-2 rounded-lg transition-colors font-medium",
                      job.applicationStatus === "APPLIED"
                        ? "bg-green-500 text-white"
                        : job.applicationStatus === "IN_PROGRESS"
                        ? "bg-yellow-500 text-white"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    )}
                  >
                    {job.applicationStatus === "APPLIED" ? "Applied ✓" : job.applicationStatus === "IN_PROGRESS" ? "In Progress" : "Apply Now"}
                  </button>
                  <button
                    onClick={() => handleSave(job.id)}
                    className={cn(
                      "px-4 py-2 text-sm rounded-lg border transition-colors font-medium",
                      job.isSaved
                        ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-400"
                        : "border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    )}
                  >
                    {job.isSaved ? "Saved" : "Save"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-neutral-500">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1.5 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
