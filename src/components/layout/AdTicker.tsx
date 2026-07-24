"use client";

import { useStore } from "@/lib/store";
import { useT } from "@/hooks/use-t";
import { cn } from "@/lib/utils";
import { Megaphone, ExternalLink } from "lucide-react";
import { useState } from "react";

export function AdTicker() {
  const [paused, setPaused] = useState(false);
  const { navigate } = useStore();
  const t = useT();

  const handleAdvertiseClick = () => {
    navigate({ type: "advertise" });
  };

  // Duplicate items for a continuous, seamless scroll
  const adItems = [
    { text: "Sponsored by: Priyam Industries — Leading the way in Quality, Trust & Innovation.", brand: "Priyam Industries" },
    { text: "Sponsor spot open: Grow your brand with Newsvarta. Click here to advertise.", brand: "Grow Your Brand" },
    { text: "प्रियम इंडस्ट्रीज द्वारा प्रायोजित: गुणवत्ता, विश्वास और नवाचार के क्षेत्र में अग्रणी।", brand: "प्रियम इंडस्ट्रीज" },
    { text: "विज्ञापन स्थान उपलब्ध: न्यूज़वार्ता के साथ अपने व्यवसाय को बढ़ाएं। विज्ञापन के लिए यहाँ क्लिक करें।", brand: "विज्ञापन सेवाएँ" }
  ];

  // Repeat items to fill screen width
  const tickerContent = [...adItems, ...adItems, ...adItems];

  return (
    <div
      className="bg-brand/5 border-b border-border/60 py-2.5 overflow-hidden select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="complementary"
      aria-label="Sponsorship ticker"
    >
      <div className="mx-auto max-w-[1280px] flex items-center px-4 md:px-8">
        <button
          onClick={handleAdvertiseClick}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded bg-brand/10 hover:bg-brand/20 text-brand font-ui text-[11px] font-bold uppercase tracking-wider transition-colors mr-4 border border-brand/20"
        >
          <Megaphone className="h-3.5 w-3.5" />
          <span>AD / विज्ञापन</span>
        </button>

        <div className="relative flex-1 overflow-hidden">
          <div
            className={cn(
              "flex items-center whitespace-nowrap gap-12 animate-ticker",
              paused && "ticker-paused"
            )}
          >
            {tickerContent.map((ad, i) => (
              <button
                key={i}
                onClick={handleAdvertiseClick}
                className="inline-flex items-center gap-2 font-ui text-[13px] text-ink-secondary hover:text-brand transition-colors text-left"
              >
                <span className="font-semibold text-foreground border-b border-dotted border-ink-tertiary">
                  {ad.brand}
                </span>
                <span className="text-ink-secondary/80">
                  {ad.text}
                </span>
                <ExternalLink className="h-3 w-3 opacity-40 inline shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
