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
import { LoginPage } from "@/components/pages/LoginPage";
import { EditorPanel } from "@/components/panels/EditorPanel";
import { AdminPanel } from "@/components/panels/AdminPanel";
import { DateArchivePage } from "@/components/pages/DateArchivePage";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export default function Home() {
  const { current, nowPlaying, user, sessionLoading, refreshSession } = useStore();

  // Load session on first render
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  // ─── Panel routes (full-screen, no public chrome) ─────────────────
  if (current.type === "editor") {
    // Auth gate
    if (sessionLoading) return <FullScreenLoader />;
    if (!user || (user.role !== "EDITOR" && user.role !== "ADMIN")) {
      return <LoginPage />;
    }
    return <EditorPanel view={current.view} articleId={current.articleId} />;
  }

  if (current.type === "admin") {
    if (sessionLoading) return <FullScreenLoader />;
    if (!user || user.role !== "ADMIN") {
      return <LoginPage />;
    }
    return <AdminPanel view={current.view} />;
  }

  // ─── Login route (no public chrome) ──────────────────────────────
  if (current.type === "login") {
    return <LoginGate />;
  }

  // ─── Public routes ────────────────────────────────────────────────
  const renderPage = () => {
    switch (current.type) {
      case "home":
        return <HomePage />;
      case "article":
        return <ArticlePage slug={current.slug} />;
      case "section":
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
      case "date-archive":
        return <DateArchivePage date={current.date} />;
      default:
        return <HomePage />;
    }
  };

  // Determine which chrome to show
  const showCategoryBar =
    current.type === "home" ||
    current.type === "category" ||
    (current.type === "section" &&
      current.slug !== "live" &&
      current.slug !== "podcasts");

  const showBreakingTicker =
    current.type === "home" ||
    current.type === "category" ||
    (current.type === "section" && current.slug !== "live");

  return (
    <PublicShell
      showBreakingTicker={showBreakingTicker}
      showCategoryBar={showCategoryBar}
    >
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
    </PublicShell>
  );
}

function PublicShell({
  children,
  showBreakingTicker = true,
  showCategoryBar = true,
  hideChrome = false,
}: {
  children: React.ReactNode;
  showBreakingTicker?: boolean;
  showCategoryBar?: boolean;
  hideChrome?: boolean;
}) {
  const { nowPlaying } = useStore();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!hideChrome && <ReadingProgress />}
      {!hideChrome && <Header />}
      {!hideChrome && showBreakingTicker && <BreakingTicker />}
      {!hideChrome && showCategoryBar && <CategoryBar />}

      <main className="flex-1 pb-16 md:pb-0">{children}</main>

      {!hideChrome && <Footer />}
      {!hideChrome && <MobileNav />}
      {!hideChrome && <MobileMenu />}
      {!hideChrome && <SearchOverlay />}
      {!hideChrome && <MiniPlayer />}

      {!hideChrome && nowPlaying && <div className="h-16 md:h-14 md:hidden" aria-hidden />}
    </div>
  );
}

function FullScreenLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="font-display text-2xl font-extrabold animate-pulse">
        News<span className="text-brand">varta</span>
      </div>
    </div>
  );
}

function LoginGate() {
  const { user, sessionLoading, navigate } = useStore();

  useEffect(() => {
    if (!sessionLoading && user) {
      const target = user.role === "ADMIN"
        ? { type: "admin" as const, view: "dashboard" as const }
        : { type: "editor" as const, view: "dashboard" as const };
      navigate(target);
    }
  }, [user, sessionLoading, navigate]);

  if (sessionLoading) return <FullScreenLoader />;
  if (user) return <FullScreenLoader />;
  return (
    <PublicShell hideChrome>
      <LoginPage />
    </PublicShell>
  );
}
