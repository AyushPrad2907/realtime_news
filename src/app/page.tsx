"use client";

import { useStore } from "@/lib/store";
import { Header } from "@/components/layout/Header";
import { CategoryBar } from "@/components/layout/CategoryBar";
import { BreakingTicker } from "@/components/layout/BreakingTicker";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { MiniPlayer } from "@/components/layout/MiniPlayer";
import { ReadingProgress } from "@/components/layout/ReadingProgress";

import { HomePage } from "@/components/pages/HomePage";
import { ArticlePage } from "@/components/pages/ArticlePage";
import { LivePage } from "@/components/pages/LivePage";
import { PodcastsPage } from "@/components/pages/PodcastsPage";
import { PodcastDetailPage } from "@/components/pages/PodcastDetailPage";
import { SearchPage } from "@/components/pages/SearchPage";
import { AdvertisePage } from "@/components/pages/AdvertisePage";
import { CareersPage } from "@/components/pages/CareersPage";
import { CareerDetailPage } from "@/components/pages/CareerDetailPage";
import { AboutPage } from "@/components/pages/AboutPage";
import { ContactPage } from "@/components/pages/ContactPage";
import { StaticPage } from "@/components/pages/StaticPage";
import { CategoryPage } from "@/components/pages/CategoryPage";
import { SectionPage } from "@/components/pages/SectionPage";

import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { current, nowPlaying } = useStore();

  const renderPage = () => {
    switch (current.type) {
      case "home":
        return <HomePage />;
      case "article":
        return <ArticlePage slug={current.slug} />;
      case "section":
        // Live has its own dedicated page
        if (current.slug === "live") return <LivePage />;
        return <SectionPage slug={current.slug} />;
      case "category":
        return <CategoryPage slug={current.slug} />;
      case "podcast-episode":
        return <PodcastDetailPage slug={current.slug} />;
      case "search":
        return <SearchPage query={current.query} />;
      case "advertise":
        return <AdvertisePage />;
      case "careers":
        return <CareersPage />;
      case "career-detail":
        return <CareerDetailPage slug={current.slug} />;
      case "about":
        return <AboutPage />;
      case "contact":
        return <ContactPage />;
      case "privacy":
        return <StaticPage type="privacy" />;
      case "terms":
        return <StaticPage type="terms" />;
      default:
        return <HomePage />;
    }
  };

  // Determine if the category bar should show (hide on some pages)
  const showCategoryBar =
    current.type === "home" ||
    current.type === "category" ||
    (current.type === "section" &&
      current.slug !== "live" &&
      current.slug !== "podcasts");

  // Determine if the breaking ticker should show (hide on some pages)
  const showBreakingTicker =
    current.type === "home" ||
    current.type === "category" ||
    (current.type === "section" && current.slug !== "live");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ReadingProgress />
      <Header />
      {showBreakingTicker && <BreakingTicker />}
      {showCategoryBar && <CategoryBar />}

      <main className="flex-1 pb-16 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={JSON.stringify(current)}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      {/* Mobile bottom nav */}
      <MobileNav />

      {/* Mobile menu drawer */}
      <MobileMenu />

      {/* Search overlay */}
      <SearchOverlay />

      {/* Persistent audio mini-player */}
      <MiniPlayer />

      {/* Bottom padding when mini-player is visible (mobile) */}
      {nowPlaying && <div className="h-16 md:h-14 md:hidden" aria-hidden />}
    </div>
  );
}
