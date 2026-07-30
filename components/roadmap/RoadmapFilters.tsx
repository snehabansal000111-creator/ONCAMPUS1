"use client";

import { useState } from "react";
import { Search, X, Filter } from "lucide-react";
import Badge from "@/components/ui/Badge";

export interface FilterState {
  search: string;
  status: "all" | "upcoming" | "in-progress" | "done";
  difficulty: "all" | "beginner" | "intermediate" | "advanced";
}

interface RoadmapFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export default function RoadmapFilters({ onFilterChange }: RoadmapFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    difficulty: "all",
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters, search: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStatusChange = (status: FilterState["status"]) => {
    const newFilters = { ...filters, status };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDifficultyChange = (difficulty: FilterState["difficulty"]) => {
    const newFilters = { ...filters, difficulty };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const cleared: FilterState = { search: "", status: "all", difficulty: "all" };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  const hasActiveFilters = filters.search || filters.status !== "all" || filters.difficulty !== "all";

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="text"
          placeholder="Search roadmap..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg text-sm bg-white text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600"
        />
        {filters.search && (
          <button
            onClick={() => handleSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="w-full flex items-center justify-between px-3 py-2.5 text-sm border border-border rounded-lg hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-muted" />
          <span className="text-ink">Filters</span>
          {hasActiveFilters && (
            <span className="px-1.5 py-0.5 bg-primary-100 text-primary-700 rounded text-xs font-medium">
              {[filters.search ? 1 : 0, filters.status !== "all" ? 1 : 0, filters.difficulty !== "all" ? 1 : 0].filter(Boolean).length}
            </span>
          )}
        </div>
        <span className={`transition-transform ${showFilters ? "rotate-180" : ""}`}>▼</span>
      </button>

      {/* Filter Dropdowns */}
      {showFilters && (
        <div className="p-3 bg-slate-50 rounded-lg space-y-3 border border-border">
          {/* Status Filter */}
          <div>
            <p className="text-xs font-medium text-muted uppercase tracking-wide mb-2">Status</p>
            <div className="flex flex-wrap gap-2">
              {(["all", "upcoming", "in-progress", "done"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                    filters.status === status
                      ? "bg-primary-600 text-white"
                      : "bg-white text-muted border border-border hover:border-primary-300"
                  }`}
                >
                  {status === "all" ? "All" : status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <p className="text-xs font-medium text-muted uppercase tracking-wide mb-2">Difficulty</p>
            <div className="flex flex-wrap gap-2">
              {(["all", "beginner", "intermediate", "advanced"] as const).map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => handleDifficultyChange(difficulty)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                    filters.difficulty === difficulty
                      ? "bg-primary-600 text-white"
                      : "bg-white text-muted border border-border hover:border-primary-300"
                  }`}
                >
                  {difficulty === "all" ? "All" : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full py-2 text-sm text-muted hover:text-ink transition-colors border-t border-border pt-3 mt-3"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
