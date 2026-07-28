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
  deps: any[] = [],
  pollIntervalMs?: number
): { data: T; loading: boolean; error: Error | null; refetch: () => Promise<void> } {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      const result = await fetcher();
      setData(result);
      setError(null);
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

    let intervalId: NodeJS.Timeout | null = null;
    if (pollIntervalMs && pollIntervalMs > 0) {
      intervalId = setInterval(() => {
        if (!cancelled) {
          fetcher()
            .then((res) => {
              if (!cancelled) setData(res);
            })
            .catch(() => {});
        }
      }, pollIntervalMs);
    }

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [...deps, pollIntervalMs]);

  return { data, loading, error, refetch };
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
    programTitle: "संसद ने डिजिटल अवसंरचना विधेयक पारित किया — विशेष कवरेज",
    programDesc:
      "विधेयक पर राष्ट्रपति की स्वीकृति की ओर बढ़ने पर लाइव विश्लेषण के लिए हमारे एंकरों और संवाददाताओं से जुड़ें। संसद भवन से विशेषज्ञ मेहमानों और जमीनी रिपोर्टिंग के साथ।",
    youtubeUrl: "",
    nextBroadcastAt: null,
    showOnHomepage: true,
    updates: LIVE_UPDATES as LiveUpdate[],
  };
  return useApiData(fetchLive, fallback, []);
}

export function useBreaking() {
  const language = useStore((s) => s.language);
  return useApiData(() => fetchBreaking(language), BREAKING_NEWS, [language], 45000); // Auto-poll every 45s
}
