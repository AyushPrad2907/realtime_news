"use client";

import { create } from "zustand";
import type { PageView, PodcastEpisode } from "./types";
import { fetchSession } from "./api-client";

interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "EDITOR" | "ADMIN";
}

interface NavState {
  // Navigation
  current: PageView;
  history: PageView[];
  navigate: (view: PageView) => void;
  back: () => void;
  canGoBack: () => boolean;

  // Mobile menu drawer
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // Search overlay
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // Live status (mock)
  isLive: boolean;

  // Audio mini-player state
  nowPlaying: PodcastEpisode | null;
  isPlaying: boolean;
  playEpisode: (episode: PodcastEpisode) => void;
  togglePlay: () => void;
  stopPlayback: () => void;

  // Reading progress (0..1)
  readingProgress: number;
  setReadingProgress: (p: number) => void;

  // Auth
  user: SessionUser | null;
  sessionLoading: boolean;
  setSession: (user: SessionUser | null) => void;
  refreshSession: () => Promise<void>;
}

export const useStore = create<NavState>((set, get) => ({
  current: { type: "home" },
  history: [],
  navigate: (view) => {
    const { current, history } = get();
    set({
      current: view,
      history: [...history, current].slice(-50),
      mobileMenuOpen: false,
      searchOpen: false,
    });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  },
  back: () => {
    const { history } = get();
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    set({
      current: prev,
      history: history.slice(0, -1),
    });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  },
  canGoBack: () => get().history.length > 0,

  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  searchOpen: false,
  setSearchOpen: (open) => set({ searchOpen: open }),

  isLive: true,

  nowPlaying: null,
  isPlaying: false,
  playEpisode: (episode) => set({ nowPlaying: episode, isPlaying: true }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  stopPlayback: () => set({ nowPlaying: null, isPlaying: false }),

  readingProgress: 0,
  setReadingProgress: (p) => set({ readingProgress: p }),

  user: null,
  sessionLoading: true,
  setSession: (user) => set({ user, sessionLoading: false }),
  refreshSession: async () => {
    set({ sessionLoading: true });
    try {
      const { user } = await fetchSession();
      set({ user, sessionLoading: false });
    } catch {
      set({ user: null, sessionLoading: false });
    }
  },
}));
