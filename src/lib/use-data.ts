"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import {
  fetchArticles,
  fetchCategories,
  fetchPodcasts,
  fetchLive,
  fetchBreaking,
} from "@/lib/api-client";
import {
  ARTICLES_LIST,
  PODCAST_EPISODES,
  PODCAST_SERIES,
  CATEGORIES,
  BREAKING_NEWS,
  LIVE_UPDATES,
} from "@/lib/mock-data";
import type { Article, Category, PodcastEpisode, PodcastSeries, LiveUpdate } from "@/lib/types";

// SWR-like hook: returns mock data immediately, then refreshes from API in background
function useApiData<T>(
  fetcher: () => Promise<T>,
  fallback: T,
  deps: any[] = []
): { data: T; loading: boolean; error: Error | null } {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetcher()
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, deps);

  return { data, loading, error };
}

export function useArticles(params: {
  category?: string;
  state?: string;
  breaking?: boolean;
  featured?: boolean;
  limit?: number;
  sort?: "newest" | "popular";
} = {}) {
  const language = useStore((s) => s.language);
  return useApiData(
    () => fetchArticles({ ...params, lang: language }),
    ARTICLES_LIST.filter((a) => {
      if (params.category && a.category !== params.category) return false;
      if (params.state && !(a.states ?? []).includes(params.state)) return false;
      if (params.breaking && !a.isBreaking) return false;
      if (params.featured && !a.isFeatured) return false;
      if (params.limit) return ARTICLES_LIST.indexOf(a) < params.limit;
      return true;
    }),
    [JSON.stringify(params), language]
  );
}

export function useCategories() {
  return useApiData(fetchCategories, CATEGORIES, []);
}

export function usePodcasts() {
  const fallback = {
    series: PODCAST_SERIES,
    episodes: PODCAST_EPISODES,
  };
  return useApiData(fetchPodcasts, fallback, []);
}

export function useLive() {
  const fallback = {
    isLive: true,
    viewerCount: 4287,
    startedAt: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
    programTitle: "Parliament Passes Digital Infrastructure Bill — Special Coverage",
    programDesc:
      "Join our anchors and correspondents for live analysis as the Bill moves to the President for assent. With expert guests and on-the-ground reporting from Parliament House.",
    youtubeUrl: "",
    nextBroadcastAt: null,
    showOnHomepage: true,
    updates: LIVE_UPDATES as LiveUpdate[],
  };
  return useApiData(fetchLive, fallback, []);
}

export function useBreaking() {
  return useApiData(fetchBreaking, BREAKING_NEWS, []);
}
