"use client";

import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";

interface FreelancerSearchProps {
  onSearch: (filters: any) => void;
  filterOptions: {
    skills: string[];
    categories: string[];
    locations: string[];
  };
}

export default function FreelancerSearch({
  onSearch,
  filterOptions,
}: FreelancerSearchProps) {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    skills: [] as string[],
    category: "",
    minRating: 0,
    location: "",
    availability: "",
  });

  const handleSearch = () => {
    onSearch({ query, ...filters });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => clearTimeout(timer);
  }, [query, filters]);

  const toggleSkill = (skill: string) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const clearFilters = () => {
    setFilters({
      skills: [],
      category: "",
      minRating: 0,
      location: "",
      availability: "",
    });
    setQuery("");
  };

  const activeFilterCount =
    filters.skills.length +
    (filters.category ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.location ? 1 : 0) +
    (filters.availability ? 1 : 0);

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or skills..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 relative transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-6 transition-colors">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="">All Categories</option>
              {filterOptions.categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Skills Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Skills
            </label>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {filterOptions.skills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters.skills.includes(skill)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minimum Rating
            </label>
            <div className="flex gap-2">
              {[0, 3, 4, 4.5, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFilters({ ...filters, minRating: rating })}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    filters.minRating === rating
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {rating === 0 ? "Any" : `${rating}+ ⭐`}
                </button>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <select
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="">All Locations</option>
              {filterOptions.locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Availability
            </label>
            <select
              value={filters.availability}
              onChange={(e) =>
                setFilters({ ...filters, availability: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="">Any Status</option>
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
