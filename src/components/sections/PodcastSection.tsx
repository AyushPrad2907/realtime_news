"use client";

import { useStore } from "@/lib/store";
import { PODCAST_EPISODES } from "@/lib/mock-data";
import { PodcastCard } from "@/components/cards/PodcastCard";
import { ArrowRight, Headphones } from "lucide-react";

export function PodcastSection() {
  const { navigate } = useStore();
  const featured = PODCAST_EPISODES.slice(0, 4);

  return (
    <section className="mb-12 md:mb-16">
      <div className="flex items-end justify-between mb-5 md:mb-6 border-b border-border pb-3">
        <h2 className="h-section flex items-center gap-2">
          <Headphones className="h-5 w-5 text-brand" />
          Latest Podcasts
        </h2>
        <button
          onClick={() => navigate({ type: "section", slug: "podcasts" })}
          className="font-ui text-xs font-semibold text-brand hover:text-brand-dark transition-colors flex items-center gap-1"
        >
          All podcasts <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="md:hidden -mx-4 px-4 flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
        {featured.map((ep) => (
          <div key={ep.id} className="shrink-0 w-[220px] snap-start">
            <PodcastCard episode={ep} />
          </div>
        ))}
      </div>

      {/* Desktop: 4-column grid */}
      <div className="hidden md:grid md:grid-cols-4 gap-6 lg:gap-8">
        {featured.map((ep) => (
          <PodcastCard key={ep.id} episode={ep} />
        ))}
      </div>
    </section>
  );
}
