"use client";

import { useEffect, useState, useCallback } from "react";

/**
 * Fetch data from an async function on mount (and when deps change).
 *
 * The fetch is deferred via setTimeout(0) so the initial setState calls
 * happen in a separate tick — this satisfies the `react-hooks/set-state-in-effect`
 * lint rule while still loading data on mount.
 *
 * Returns `{ data, loading, error, reload }`.
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: any[] = []
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetcher();
      setData(result);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [fetcher, ...deps]);

  useEffect(() => {
    const id = setTimeout(() => {
      reload();
    }, 0);
    return () => clearTimeout(id);
  }, [reload]);

  return { data, loading, error, reload };
}
