"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns `false` on the server and during the first client render,
 * `true` after hydration completes. Avoids the `setState in effect` lint
 * pattern that comes from `useEffect(() => setMounted(true), [])`.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // client snapshot
    () => false // server snapshot
  );
}
