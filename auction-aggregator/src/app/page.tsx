"use client";

import { useState, useEffect, useCallback } from "react";
import { AuctionListing, FilterState } from "@/lib/types";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import StatsBar from "@/components/StatsBar";
import AuctionGrid from "@/components/AuctionGrid";

const DEFAULT_FILTERS: FilterState = {
  search: "",
  sources: [],
  category: "Alla kategorier",
  sort: "ending_soon",
  location: "",
};

export default function Home() {
  const [listings, setListings] = useState<AuctionListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.sources.length > 0)
        params.set("sources", filters.sources.join(","));
      if (filters.category && filters.category !== "Alla kategorier")
        params.set("category", filters.category);
      if (filters.sort) params.set("sort", filters.sort);
      if (filters.location) params.set("location", filters.location);

      const res = await fetch(`/api/auctions?${params.toString()}`);
      const data = await res.json();
      setListings(data.listings);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const debounce = setTimeout(fetchListings, 300);
    return () => clearTimeout(debounce);
  }, [fetchListings]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <FilterBar
        filters={filters}
        onChange={setFilters}
        resultCount={listings.length}
      />
      <StatsBar listings={listings} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AuctionGrid listings={listings} isLoading={isLoading} />
      </main>
      <footer className="bg-slate-900 text-slate-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-amber-500 rounded-md flex items-center justify-center font-bold text-slate-900 text-sm">
                A
              </div>
              <span className="font-semibold text-white">AuktionsRadar</span>
            </div>
            <p className="text-sm text-center">
              Aggregerar auktioner fr&aring;n{" "}
              <a
                href="https://www.klaravik.se"
                className="text-amber-400 hover:text-amber-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                Klaravik
              </a>
              ,{" "}
              <a
                href="https://www.blinto.se"
                className="text-amber-400 hover:text-amber-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                Blinto
              </a>{" "}
              och{" "}
              <a
                href="https://www.budi.se"
                className="text-amber-400 hover:text-amber-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                Budi
              </a>
            </p>
            <p className="text-xs">
              Inte affilierad med n&aring;gon auktionssajt
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
