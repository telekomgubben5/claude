export interface AuctionListing {
  id: string;
  title: string;
  description: string;
  currentBid: number | null;
  startingBid: number | null;
  currency: string;
  imageUrl: string;
  images: string[];
  url: string;
  source: AuctionSource;
  category: string;
  location: string;
  endDate: string | null;
  bidCount: number;
  condition: string;
}

export type AuctionSource = "klaravik" | "blinto" | "budi";

export interface AuctionSourceInfo {
  id: AuctionSource;
  name: string;
  url: string;
  logo: string;
  color: string;
}

export const AUCTION_SOURCES: Record<AuctionSource, AuctionSourceInfo> = {
  klaravik: {
    id: "klaravik",
    name: "Klaravik",
    url: "https://www.klaravik.se",
    logo: "/klaravik-logo.png",
    color: "#00A651",
  },
  blinto: {
    id: "blinto",
    name: "Blinto",
    url: "https://www.blinto.se",
    logo: "/blinto-logo.png",
    color: "#1E3A5F",
  },
  budi: {
    id: "budi",
    name: "Budi",
    url: "https://www.budi.se",
    logo: "/budi-logo.png",
    color: "#FF6B00",
  },
};

export const CATEGORIES = [
  "Alla kategorier",
  "Entreprenad",
  "Fordon",
  "Lastbilar",
  "Lantbruk",
  "Skog",
  "Verktyg",
  "Industri",
  "Transport",
  "Inredning",
  "IT & Datorer",
  "Restaurang",
  "Övrigt",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type SortOption =
  | "ending_soon"
  | "newest"
  | "price_asc"
  | "price_desc"
  | "most_bids";

export interface FilterState {
  search: string;
  sources: AuctionSource[];
  category: string;
  sort: SortOption;
  location: string;
}
