"use client";

import { AuctionListing, AUCTION_SOURCES } from "@/lib/types";
import { formatSEK, timeRemaining, cn } from "@/lib/utils";
import Image from "next/image";

interface AuctionCardProps {
  listing: AuctionListing;
}

export default function AuctionCard({ listing }: AuctionCardProps) {
  const source = AUCTION_SOURCES[listing.source];
  const remaining = timeRemaining(listing.endDate);
  const isEndingSoon =
    remaining.includes("m kvar") ||
    (remaining.includes("h") &&
      !remaining.includes("d") &&
      parseInt(remaining) < 6);

  return (
    <a
      href={listing.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
        />
        {/* Source badge */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-semibold text-white shadow-sm"
          style={{ backgroundColor: source.color }}
        >
          {source.name}
        </div>
        {/* Time badge */}
        <div
          className={cn(
            "absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm",
            isEndingSoon
              ? "bg-red-500 text-white"
              : "bg-slate-900/70 text-white"
          )}
        >
          {remaining}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category & Location */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {listing.category}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {listing.location}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-800 group-hover:text-amber-600 transition-colors line-clamp-2 mb-2">
          {listing.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-500 line-clamp-2 mb-3">
          {listing.description}
        </p>

        {/* Price & Bids */}
        <div className="flex items-end justify-between pt-3 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400">Aktuellt bud</p>
            <p className="text-lg font-bold text-slate-900">
              {formatSEK(listing.currentBid)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">
              {listing.bidCount} {listing.bidCount === 1 ? "bud" : "bud"}
            </p>
            {listing.condition && (
              <p className="text-xs text-emerald-600 font-medium">
                {listing.condition}
              </p>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
