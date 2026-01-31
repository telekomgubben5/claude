import * as cheerio from "cheerio";
import { AuctionListing } from "../types";

const BASE_URL = "https://www.blinto.se";

export async function scrapeBlinto(): Promise<AuctionListing[]> {
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
      throw new Error(`Blinto returned ${response.status}`);
    }

    const html = await response.text();
    return parseBlintoHtml(html);
  } catch (error) {
    console.error("Failed to scrape Blinto:", error);
    return [];
  }
}

function parseBlintoHtml(html: string): AuctionListing[] {
  const $ = cheerio.load(html);
  const listings: AuctionListing[] = [];

  $(".auction-card, .lot-item, .product-card, [data-lot-id]").each(
    (i, el) => {
      const $el = $(el);
      const title = $el
        .find("h2, h3, .title, .lot-title")
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
      const location = $el.find(".location, .city").first().text().trim();
      const category = $el.find(".category").first().text().trim();

      if (!title) return;

      const price = parseSwedishPrice(priceText);

      listings.push({
        id: `blinto-${i}-${Date.now()}`,
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
        source: "blinto",
        category: category || "Övrigt",
        location: location || "Sverige",
        endDate: null,
        bidCount: 0,
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
