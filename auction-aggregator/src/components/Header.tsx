"use client";

import { AUCTION_SOURCES } from "@/lib/types";

export default function Header() {
  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-slate-900 text-lg">
              A
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                AuktionsRadar
              </h1>
              <p className="text-xs text-slate-400 -mt-0.5">
                Alla auktioner. Ett ställe.
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            {Object.values(AUCTION_SOURCES).map((source) => (
              <a
                key={source.id}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                {source.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
