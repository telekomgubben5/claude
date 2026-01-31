"use client";

import { AuctionListing } from "@/lib/types";
import AuctionCard from "./AuctionCard";

interface AuctionGridProps {
  listings: AuctionListing[];
  isLoading: boolean;
}

export default function AuctionGrid({ listings, isLoading }: AuctionGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse"
          >
            <div className="aspect-[4/3] bg-slate-200" />
            <div className="p-4 space-y-3">
              <div className="flex gap-2">
                <div className="h-5 w-20 bg-slate-200 rounded" />
                <div className="h-5 w-16 bg-slate-200 rounded" />
              </div>
              <div className="h-5 w-3/4 bg-slate-200 rounded" />
              <div className="h-4 w-full bg-slate-200 rounded" />
              <div className="h-4 w-2/3 bg-slate-200 rounded" />
              <div className="pt-3 border-t border-slate-100 flex justify-between">
                <div className="h-7 w-28 bg-slate-200 rounded" />
                <div className="h-5 w-12 bg-slate-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-16">
        <svg
          className="w-16 h-16 text-slate-300 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-slate-600 mb-1">
          Inga auktioner hittades
        </h3>
        <p className="text-slate-400">
          Prova att ändra dina filter eller sökord
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <AuctionCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
