"use client";

import { useStore } from "@/lib/store";
import { ExternalLink } from "lucide-react";

interface SponsoredCardProps {
  title: string;
  description: string;
  imageUrl: string;
  sponsor: string;
  href?: string;
}

export function SponsoredCard({
  title,
  description,
  imageUrl,
  sponsor,
  href = "#",
}: SponsoredCardProps) {
  const _ = useStore();
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group cursor-pointer flex flex-col card-hover relative block"
    >
      <article>
        <div className="overflow-hidden rounded-md mb-3 aspect-[16/9] bg-muted relative">
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover img-zoom"
          />
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-foreground/80 backdrop-blur text-background font-ui text-[10px] font-semibold uppercase tracking-wide">
            Sponsored
          </div>
        </div>
        <h3 className="font-display text-lg md:text-xl font-bold leading-tight line-clamp-3 group-hover:text-brand transition-colors pr-5">
          {title}
          <ExternalLink className="inline-block h-3 w-3 ml-1 text-ink-tertiary" />
        </h3>
        <p className="font-serif text-[14px] text-ink-secondary mt-2 line-clamp-2">
          {description}
        </p>
        <p className="font-ui text-[11px] text-ink-tertiary mt-3">
          Promoted by {sponsor}
        </p>
      </article>
    </a>
  );
}
