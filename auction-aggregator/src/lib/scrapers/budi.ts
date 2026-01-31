import * as cheerio from "cheerio";
import { AuctionListing } from "../types";

const BASE_URL = "https://www.budi.se";

export async function scrapeBudi(): Promise<AuctionListing[]> {
  try {
    const response = await fetch(`${BASE_URL}/auktioner`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "sv-SE,sv;q=0.9,en;q=0.8",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Budi returned ${response.status}`);
    }

    const html = await response.text();
    return parseBudiHtml(html);
  } catch (error) {
    console.error("Failed to scrape Budi:", error);
    return [];
  }
}

function parseBudiHtml(html: string): AuctionListing[] {
  const $ = cheerio.load(html);
  const listings: AuctionListing[] = [];

  $(".auction-item, .lot-card, .product-item, [data-auction-id]").each(
    (i, el) => {
      const $el = $(el);
      const title = $el
        .find("h2, h3, .title, .auction-title")
        .first()
        .text()
        .trim();
      const priceText = $el
        .find(".price, .bid, .current-bid")
        .first()
        .text()
        .trim();
      const imageUrl =
        $el.find("img").first().attr("src") ||
        $el.find("img").first().attr("data-src") ||
        "";
      const link = $el.find("a").first().attr("href") || "";
      const location = $el.find(".location, .plats").first().text().trim();
      const category = $el.find(".category, .kategori").first().text().trim();
      const bidCountText = $el.find(".bid-count, .bids").first().text().trim();

      if (!title) return;

      const price = parseSwedishPrice(priceText);
      const bidCount = parseInt(bidCountText.replace(/\D/g, ""), 10) || 0;

      listings.push({
        id: `budi-${i}-${Date.now()}`,
        title,
        description: "",
        currentBid: price,
        startingBid: null,
        currency: "SEK",
        imageUrl: imageUrl.startsWith("http")
          ? imageUrl
          : `${BASE_URL}${imageUrl}`,
        images: [],
        url: link.startsWith("http") ? link : `${BASE_URL}${link}`,
        source: "budi",
        category: category || "Övrigt",
        location: location || "Sverige",
        endDate: null,
        bidCount,
        condition: "",
      });
    }
  );

  return listings;
}

function parseSwedishPrice(text: string): number | null {
  const cleaned = text.replace(/[^\d]/g, "");
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? null : num;
}
