import type { Metadata } from "next";
import { Inter_Tight, Syne } from "next/font/google";
import "./globals.css";

const sans = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const display = Syne({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FORGE AI",
  description: "The capital foundry for working machines.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <head>
        {/*
          Only the first frame and the first clip block the hero. The reel
          prefetches clips 2 and 3 itself once it is live, so preloading them
          here just competes for bandwidth during the initial paint.
        */}
        <link rel="preload" as="image" href="/media/poster.jpg" fetchPriority="high" />
        <link rel="preload" as="video" href="/media/electronics.mp4" type="video/mp4" />
      </head>
      <body>{children}</body>
    </html>
  );
}
