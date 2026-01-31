"use client";

import {
  AuctionSource,
  AUCTION_SOURCES,
  CATEGORIES,
  FilterState,
  SortOption,
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  resultCount: number;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "ending_soon", label: "Slutar snart" },
  { value: "newest", label: "Nyaste" },
  { value: "price_asc", label: "Lägsta pris" },
  { value: "price_desc", label: "Högsta pris" },
  { value: "most_bids", label: "Flest bud" },
];

export default function FilterBar({
  filters,
  onChange,
  resultCount,
}: FilterBarProps) {
  const toggleSource = (source: AuctionSource) => {
    const sources = filters.sources.includes(source)
      ? filters.sources.filter((s) => s !== source)
      : [...filters.sources, source];
    onChange({ ...filters, sources });
  };

  return (
    <div className="bg-white border-b border-slate-200 sticky top-16 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Sök bland alla auktioner..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Source toggles + Category + Sort */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Source toggles */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500 mr-1">
              Källa:
            </span>
            {Object.values(AUCTION_SOURCES).map((source) => {
              const active =
                filters.sources.length === 0 ||
                filters.sources.includes(source.id);
              return (
                <button
                  key={source.id}
                  onClick={() => toggleSource(source.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all border",
                    active
                      ? "text-white border-transparent shadow-sm"
                      : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
                  )}
                  style={
                    active
                      ? { backgroundColor: source.color }
                      : undefined
                  }
                >
                  {source.name}
                </button>
              );
            })}
          </div>

          <div className="hidden sm:block w-px h-6 bg-slate-200" />

          {/* Category select */}
          <select
            value={filters.category}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Sort select */}
          <select
            value={filters.sort}
            onChange={(e) =>
              onChange({ ...filters, sort: e.target.value as SortOption })
            }
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="flex-1" />

          {/* Result count */}
          <span className="text-sm text-slate-500">
            {resultCount} {resultCount === 1 ? "objekt" : "objekt"}
          </span>
        </div>
      </div>
    </div>
  );
}
