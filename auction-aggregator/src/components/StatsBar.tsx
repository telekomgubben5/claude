"use client";

import { AuctionListing, AUCTION_SOURCES, AuctionSource } from "@/lib/types";
import { formatSEK } from "@/lib/utils";

interface StatsBarProps {
  listings: AuctionListing[];
}

export default function StatsBar({ listings }: StatsBarProps) {
  const sourceCounts = listings.reduce(
    (acc, l) => {
      acc[l.source] = (acc[l.source] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const totalBids = listings.reduce((sum, l) => sum + l.bidCount, 0);
  const avgPrice =
    listings.length > 0
      ? listings.reduce((sum, l) => sum + (l.currentBid || 0), 0) /
        listings.length
      : 0;

  return (
    <div className="bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center gap-6 text-sm">
          {/* Source breakdown */}
          {(Object.keys(AUCTION_SOURCES) as AuctionSource[]).map((sourceId) => {
            const source = AUCTION_SOURCES[sourceId];
            const count = sourceCounts[sourceId] || 0;
            return (
              <div key={sourceId} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: source.color }}
                />
                <span className="text-slate-600">
                  <span className="font-semibold">{count}</span> {source.name}
                </span>
              </div>
            );
          })}

          <div className="hidden sm:block w-px h-4 bg-slate-300" />

          <div className="text-slate-600">
            <span className="font-semibold">{totalBids}</span> totala bud
          </div>

          <div className="text-slate-600">
            Snitt: <span className="font-semibold">{formatSEK(Math.round(avgPrice))}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
