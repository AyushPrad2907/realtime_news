"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useT } from "@/hooks/use-t";
import { useHydrated } from "@/hooks/use-hydrated";
import { ArrowRight, ShoppingBag, Sparkles, Code, BookOpen } from "lucide-react";

interface AdBannerProps {
  format: "leaderboard" | "rectangle" | "mobile-banner" | "native";
  className?: string;
  label?: string;
}

interface AdCampaign {
  id: string;
  name: string;
  company: string;
  url: string;
  theme: "tech" | "ecommerce" | "book";
  headline: string;
  subline: string;
  badge: string;
  cta: string;
}

const CAMPAIGNS: AdCampaign[] = [
  {
    id: "nwt-infotech",
    name: "NWT Infotech Monsoon Sale",
    company: "NWT Infotech",
    url: "https://www.nwtinfotech.online/",
    theme: "tech",
    headline: "Building the Next World",
    subline: "Monsoon Sale: Flat 70% OFF on all Web & Software Services",
    badge: "70% OFF",
    cta: "Claim Offer",
  },
  {
    id: "implexcart",
    name: "ImplexCart Flash Sale",
    company: "ImplexCart",
    url: "https://www.implexcart.online/",
    theme: "ecommerce",
    headline: "Super Flash Sale Live",
    subline: "Incredible discounts on best selling electronics & fashion",
    badge: "FLASH SALE",
    cta: "Shop Deals",
  },
  {
    id: "the-warrior",
    name: "The Warrior In You Book",
    company: "The Warrior In You",
    url: "https://thewarrior.online/",
    theme: "book",
    headline: "Turn Into a Powerful Version of You",
    subline: "आपके जीवन में क्रांतिकारी बदलाव लाने वाली एकमात्र पुस्तक। Read Smarter. Grow Faster.",
    badge: "BESTSELLER",
    cta: "Start Reading",
  },
];

export function AdBanner({ format, className, label }: AdBannerProps) {
  const t = useT();
  const mounted = useHydrated();
  const [campaign, setCampaign] = useState<AdCampaign | null>(null);

  useEffect(() => {
    // Select a campaign based on placement/random to distribute them
    const randomIndex = Math.floor(Math.random() * CAMPAIGNS.length);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCampaign(CAMPAIGNS[randomIndex]);
  }, [format]);

  if (!mounted || !campaign) return null;

  const handleAdClick = () => {
    window.open(campaign.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onClick={handleAdClick}
      className={cn(
        "w-full cursor-pointer relative overflow-hidden rounded-lg border transition-all duration-300 hover:scale-[1.01] hover:shadow-lg flex items-center justify-between group",
        // Format layout sizes
        format === "leaderboard" && "h-[90px] px-6 py-2",
        format === "rectangle" && "h-[250px] p-6 flex-col justify-between text-center",
        format === "mobile-banner" && "h-[50px] px-4 py-1 md:hidden",
        format === "native" && "min-h-[120px] p-5",
        // Theme Colors and Gradients
        campaign.theme === "tech" && "bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-indigo-500/30 text-white",
        campaign.theme === "ecommerce" && "bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100 border-orange-200 text-slate-800",
        campaign.theme === "book" && "bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 border-amber-500/20 text-stone-100",
        className
      )}
      role="banner"
      aria-label={`${t("misc.advertisement")}: ${campaign.name}`}
    >
      {/* Background Graphic Accents */}
      {campaign.theme === "tech" && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]" />
      )}
      {campaign.theme === "ecommerce" && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.08),transparent)]" />
      )}
      {campaign.theme === "book" && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.05),transparent)]" />
      )}

      {/* Ad Tag Badge */}
      <span
        className={cn(
          "absolute top-1.5 right-2 font-ui text-[8px] font-bold uppercase tracking-wider px-1 rounded",
          campaign.theme === "tech" && "bg-indigo-500/10 text-indigo-400",
          campaign.theme === "ecommerce" && "bg-orange-500/10 text-orange-600",
          campaign.theme === "book" && "bg-amber-500/10 text-amber-400"
        )}
      >
        {label || t("misc.advertisement")}
      </span>

      {/* Leaderboard layout (Wide banner) */}
      {format === "leaderboard" && (
        <>
          <div className="flex items-center gap-4 z-10">
            {campaign.theme === "tech" && (
              <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20">
                <Code className="h-5 w-5 animate-pulse" />
              </div>
            )}
            {campaign.theme === "ecommerce" && (
              <div className="p-2 bg-orange-500/10 text-orange-600 rounded-md border border-orange-500/20">
                <ShoppingBag className="h-5 w-5" />
              </div>
            )}
            {campaign.theme === "book" && (
              <div className="p-2 bg-amber-500/10 text-amber-500 rounded-md border border-amber-500/20">
                <BookOpen className="h-5 w-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full font-ui",
                    campaign.theme === "tech" && "bg-indigo-500 text-white",
                    campaign.theme === "ecommerce" && "bg-orange-600 text-white",
                    campaign.theme === "book" && "bg-amber-600 text-stone-900"
                  )}
                >
                  {campaign.badge}
                </span>
                <span className="font-ui text-xs font-semibold opacity-70">
                  {campaign.company}
                </span>
              </div>
              <h4 className="font-display text-sm md:text-base font-bold leading-tight mt-0.5">
                {campaign.headline} <span className="opacity-90 font-normal">| {campaign.subline}</span>
              </h4>
            </div>
          </div>
          <button
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 z-10 shrink-0 shadow-sm",
              campaign.theme === "tech" && "bg-indigo-600 hover:bg-indigo-500 text-white group-hover:translate-x-1",
              campaign.theme === "ecommerce" && "bg-orange-600 hover:bg-orange-500 text-white group-hover:translate-x-1",
              campaign.theme === "book" && "bg-amber-600 hover:bg-amber-500 text-stone-950 group-hover:translate-x-1"
            )}
          >
            {campaign.cta}
            <ArrowRight className="h-3 w-3" />
          </button>
        </>
      )}

      {/* Rectangle layout (Box / Sidebar banner) */}
      {format === "rectangle" && (
        <div className="flex flex-col h-full w-full justify-between items-center z-10 py-2">
          <div className="flex flex-col items-center gap-2">
            {campaign.theme === "tech" && <Code className="h-8 w-8 text-indigo-400 mb-1" />}
            {campaign.theme === "ecommerce" && <ShoppingBag className="h-8 w-8 text-orange-500 mb-1" />}
            {campaign.theme === "book" && <BookOpen className="h-8 w-8 text-amber-500 mb-1" />}

            <span className="font-ui text-xs font-bold tracking-wider opacity-60 uppercase">
              {campaign.company}
            </span>
            <span
              className={cn(
                "text-[10px] font-extrabold tracking-widest px-2 py-0.5 rounded-full font-ui uppercase",
                campaign.theme === "tech" && "bg-indigo-500/20 text-indigo-300",
                campaign.theme === "ecommerce" && "bg-orange-500/10 text-orange-700",
                campaign.theme === "book" && "bg-amber-500/10 text-amber-400"
              )}
            >
              {campaign.badge}
            </span>
          </div>

          <div className="my-2">
            <h4 className="font-display text-lg font-bold leading-snug tracking-tight">
              {campaign.headline}
            </h4>
            <p className="text-xs opacity-75 mt-1 max-w-[240px] leading-relaxed line-clamp-3">
              {campaign.subline}
            </p>
          </div>

          <button
            className={cn(
              "w-full py-2.5 rounded-md text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm mt-2",
              campaign.theme === "tech" && "bg-indigo-600 hover:bg-indigo-500 text-white",
              campaign.theme === "ecommerce" && "bg-orange-600 hover:bg-orange-500 text-white",
              campaign.theme === "book" && "bg-amber-600 hover:bg-amber-500 text-stone-950"
            )}
          >
            {campaign.cta}
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Mobile banner layout (Compact height) */}
      {format === "mobile-banner" && (
        <>
          <div className="flex items-center gap-2 z-10">
            <span
              className={cn(
                "text-[8px] font-bold px-1 py-0.5 rounded font-ui shrink-0",
                campaign.theme === "tech" && "bg-indigo-500 text-white",
                campaign.theme === "ecommerce" && "bg-orange-600 text-white",
                campaign.theme === "book" && "bg-amber-600 text-stone-900"
              )}
            >
              {campaign.badge}
            </span>
            <div className="truncate max-w-[180px]">
              <h4 className="font-display text-xs font-bold truncate">
                {campaign.headline}
              </h4>
              <p className="text-[9px] opacity-75 truncate">{campaign.company}</p>
            </div>
          </div>
          <button
            className={cn(
              "px-2.5 py-1 rounded-full text-[10px] font-bold transition-all duration-300 flex items-center gap-1 z-10 shrink-0",
              campaign.theme === "tech" && "bg-indigo-600 text-white",
              campaign.theme === "ecommerce" && "bg-orange-600 text-white",
              campaign.theme === "book" && "bg-amber-600 text-stone-950"
            )}
          >
            {campaign.cta}
          </button>
        </>
      )}

      {/* Native Ad layout */}
      {format === "native" && (
        <div className="flex items-start gap-4 z-10 w-full">
          <div
            className={cn(
              "p-3 rounded-lg border shrink-0 hidden sm:block",
              campaign.theme === "tech" && "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
              campaign.theme === "ecommerce" && "bg-orange-500/10 border-orange-500/20 text-orange-600",
              campaign.theme === "book" && "bg-amber-500/10 border-amber-500/20 text-amber-500"
            )}
          >
            {campaign.theme === "tech" && <Code className="h-6 w-6" />}
            {campaign.theme === "ecommerce" && <ShoppingBag className="h-6 w-6" />}
            {campaign.theme === "book" && <BookOpen className="h-6 w-6" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-ui text-xs font-semibold opacity-60">
                {campaign.company}
              </span>
              <span
                className={cn(
                  "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full font-ui",
                  campaign.theme === "tech" && "bg-indigo-500/25 text-indigo-300",
                  campaign.theme === "ecommerce" && "bg-orange-500/20 text-orange-700",
                  campaign.theme === "book" && "bg-amber-500/20 text-amber-400"
                )}
              >
                {campaign.badge}
              </span>
            </div>
            <h4 className="font-display text-base font-bold mt-1 text-inherit">
              {campaign.headline}
            </h4>
            <p className="text-xs opacity-75 mt-1 max-w-[450px] leading-relaxed">
              {campaign.subline}
            </p>
            <button
              className={cn(
                "mt-3 px-4 py-1.5 rounded-md text-xs font-bold transition-all duration-300 flex items-center gap-1.5 shadow-sm",
                campaign.theme === "tech" && "bg-indigo-600 hover:bg-indigo-500 text-white",
                campaign.theme === "ecommerce" && "bg-orange-600 hover:bg-orange-500 text-white",
                campaign.theme === "book" && "bg-amber-600 hover:bg-amber-500 text-stone-950"
              )}
            >
              {campaign.cta}
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

