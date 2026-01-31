import * as cheerio from "cheerio";
import { AuctionListing } from "../types";

const BASE_URL = "https://www.klaravik.se";

export async function scrapeKlaravik(): Promise<AuctionListing[]> {
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
      throw new Error(`Klaravik returned ${response.status}`);
    }

    const html = await response.text();
    return parseKlaravikHtml(html);
  } catch (error) {
    console.error("Failed to scrape Klaravik:", error);
    return [];
  }
}

function parseKlaravikHtml(html: string): AuctionListing[] {
  const $ = cheerio.load(html);
  const listings: AuctionListing[] = [];

  $("[data-testid='lot-card'], .lot-card, .auction-item").each((i, el) => {
    const $el = $(el);
    const title = $el.find("h2, h3, .lot-title, .item-title").first().text().trim();
    const priceText = $el
      .find(".price, .current-bid, .bid-amount")
      .first()
      .text()
      .trim();
    const imageUrl =
      $el.find("img").first().attr("src") ||
      $el.find("img").first().attr("data-src") ||
      "";
    const link = $el.find("a").first().attr("href") || "";
    const location = $el.find(".location, .place").first().text().trim();
    const category = $el.find(".category, .lot-category").first().text().trim();
    const endDateText = $el.find(".end-date, .closing-date, time").first().text().trim();

    if (!title) return;

    const price = parseSwedishPrice(priceText);

    listings.push({
      id: `klaravik-${i}-${Date.now()}`,
      title,
      description: "",
      currentBid: price,
      startingBid: null,
      currency: "SEK",
      imageUrl: imageUrl.startsWith("http") ? imageUrl : `${BASE_URL}${imageUrl}`,
      images: [],
      url: link.startsWith("http") ? link : `${BASE_URL}${link}`,
      source: "klaravik",
      category: category || "Övrigt",
      location: location || "Sverige",
      endDate: endDateText || null,
      bidCount: 0,
      condition: "",
    });
  });

  return listings;
}

function parseSwedishPrice(text: string): number | null {
  const cleaned = text.replace(/[^\d]/g, "");
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? null : num;
}
