import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

import { GoogleTranslate } from "@/components/providers/GoogleTranslate";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Newsvarta — Trusted Journalism, Every Hour",
  description:
    "Newsvarta delivers authoritative coverage of national and international news, politics, economy, sports, technology, and culture — curated by senior editors for the engaged reader.",
  keywords: [
    "news",
    "national news",
    "breaking news",
    "politics",
    "economy",
    "sports",
    "technology",
    "podcasts",
    "live news",
  ],
  authors: [{ name: "Newsvarta Editorial Team" }],
  openGraph: {
    title: "Newsvarta",
    description: "Trusted journalism, every hour.",
    siteName: "Newsvarta",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Newsvarta",
    description: "Trusted journalism, every hour.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${sourceSerif.variable} ${inter.variable} font-ui antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <GoogleTranslate />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
