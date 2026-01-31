import { AuctionListing, AuctionSource } from "../types";
import { scrapeKlaravik } from "./klaravik";
import { scrapeBlinto } from "./blinto";
import { scrapeBudi } from "./budi";
import { getDemoListings } from "./demo-data";

export async function scrapeAll(
  sources?: AuctionSource[]
): Promise<AuctionListing[]> {
  const activeSources = sources || ["klaravik", "blinto", "budi"];

  const scraperMap: Record<AuctionSource, () => Promise<AuctionListing[]>> = {
    klaravik: scrapeKlaravik,
    blinto: scrapeBlinto,
    budi: scrapeBudi,
  };

  const results = await Promise.allSettled(
    activeSources.map((source) => scraperMap[source]())
  );

  const listings: AuctionListing[] = [];
  let scrapedCount = 0;

  for (const result of results) {
    if (result.status === "fulfilled" && result.value.length > 0) {
      listings.push(...result.value);
      scrapedCount += result.value.length;
    }
  }

  // If scrapers returned no results (sites blocking, etc.), use demo data
  if (scrapedCount === 0) {
    console.log("No live data available, using demo listings");
    return getDemoListings(activeSources);
  }

  // If some scrapers failed, supplement with demo data for those sources
  const sourcesWithData = new Set(listings.map((l) => l.source));
  for (const source of activeSources) {
    if (!sourcesWithData.has(source)) {
      console.log(`No data from ${source}, adding demo listings`);
      listings.push(...getDemoListings([source]));
    }
  }

  return listings;
}
