import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

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
  title: "The National Dispatch — Trusted Journalism, Every Hour",
  description:
    "The National Dispatch delivers authoritative coverage of national and international news, politics, economy, sports, technology, and culture — curated by senior editors for the engaged reader.",
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
  authors: [{ name: "The National Dispatch Editorial Team" }],
  openGraph: {
    title: "The National Dispatch",
    description: "Trusted journalism, every hour.",
    siteName: "The National Dispatch",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The National Dispatch",
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
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
