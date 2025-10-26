"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import FreelancerSearch from "@/components/FreelancerSearch";
import FreelancerCard from "@/components/FreelancerCard";
import { Loader2 } from "lucide-react";
import { Freelancer, SearchFilters, FilterOptions } from "@/types/freelancer";

export default function FreelancersPage() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    skills: [],
    categories: [],
    locations: [],
  });
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    query: "",
    skills: [],
    category: "",
    minRating: 0,
    location: "",
    availability: "",
  });
  const mounted = useRef(false);

  const fetchFilterOptions = useCallback(async () => {
    try {
      const response = await fetch("/api/freelancers/filters");
      const data = await response.json();
      if (data.success) {
        setFilterOptions(data.data);
      }
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  }, []);

  const handleSearch = async (filters: SearchFilters) => {
    setLoading(true);
    setCurrentFilters(filters);

    try {
      // Build query string
      const params = new URLSearchParams();
      if (filters.query) params.append("query", filters.query);
      if (filters.skills?.length)
        params.append("skills", filters.skills.join(","));
      if (filters.category) params.append("category", filters.category);
      if (filters.minRating)
        params.append("minRating", filters.minRating.toString());
      if (filters.location) params.append("location", filters.location);
      if (filters.availability)
        params.append("availability", filters.availability);
      params.append("page", pagination.page.toString());
      params.append("limit", pagination.limit.toString());

      const response = await fetch(
        `/api/freelancers/search?${params.toString()}`
      );
      const data = await response.json();

      if (data.success) {
        setFreelancers(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error searching freelancers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch filter options on mount
  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  // Initial search on mount
  useEffect(() => {
    handleSearch({
      query: "",
      skills: [],
      category: "",
      minRating: 0,
      location: "",
      availability: "",
    });
    mounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch when page changes
  useEffect(() => {
    if (mounted.current && pagination.page > 1) {
      handleSearch(currentFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 pt-20">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Find Freelancers
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover talented professionals for your projects
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8">
          <FreelancerSearch
            onSearch={handleSearch}
            filterOptions={filterOptions}
          />
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Showing {freelancers.length} of {pagination.total} freelancers
            </div>

            {/* Freelancer Grid */}
            {freelancers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {freelancers.map((freelancer) => (
                  <FreelancerCard
                    key={freelancer._id}
                    freelancer={freelancer}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No freelancers found matching your criteria
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white transition-colors"
                >
                  Previous
                </button>
                {Array.from(
                  { length: Math.min(pagination.pages, 5) },
                  (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 border rounded-lg transition-colors ${
                          pagination.page === page
                            ? "bg-blue-500 text-white border-blue-500"
                            : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                )}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

