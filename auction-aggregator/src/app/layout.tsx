import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AuktionsRadar - Alla auktioner på ett ställe",
  description:
    "Samla och jämför auktioner från Klaravik, Blinto och Budi. Maskiner, fordon, verktyg och mycket mer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className="antialiased">{children}</body>
    </html>
  );
}
