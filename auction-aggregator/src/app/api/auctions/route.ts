import { NextRequest, NextResponse } from "next/server";
import { scrapeAll } from "@/lib/scrapers";
import { AuctionListing, AuctionSource, SortOption } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || "";
  const sourcesParam = searchParams.get("sources") || "";
  const category = searchParams.get("category") || "";
  const sort = (searchParams.get("sort") || "ending_soon") as SortOption;
  const location = searchParams.get("location") || "";

  const sources = sourcesParam
    ? (sourcesParam.split(",") as AuctionSource[])
    : undefined;

  let listings = await scrapeAll(sources);

  // Filter by search term
  if (search) {
    const searchLower = search.toLowerCase();
    listings = listings.filter(
      (l) =>
        l.title.toLowerCase().includes(searchLower) ||
        l.description.toLowerCase().includes(searchLower) ||
        l.category.toLowerCase().includes(searchLower) ||
        l.location.toLowerCase().includes(searchLower)
    );
  }

  // Filter by category
  if (category && category !== "Alla kategorier") {
    listings = listings.filter(
      (l) => l.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter by location
  if (location) {
    const locationLower = location.toLowerCase();
    listings = listings.filter((l) =>
      l.location.toLowerCase().includes(locationLower)
    );
  }

  // Sort
  listings = sortListings(listings, sort);

  return NextResponse.json({
    listings,
    total: listings.length,
    sources: ["klaravik", "blinto", "budi"],
  });
}

function sortListings(
  listings: AuctionListing[],
  sort: SortOption
): AuctionListing[] {
  return [...listings].sort((a, b) => {
    switch (sort) {
      case "ending_soon":
        if (!a.endDate) return 1;
        if (!b.endDate) return -1;
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      case "newest":
        if (!a.endDate) return 1;
        if (!b.endDate) return -1;
        return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
      case "price_asc":
        return (a.currentBid || 0) - (b.currentBid || 0);
      case "price_desc":
        return (b.currentBid || 0) - (a.currentBid || 0);
      case "most_bids":
        return b.bidCount - a.bidCount;
      default:
        return 0;
    }
  });
}
