"use client";

import { useStore } from "@/lib/store";
import { t, type TranslationKey } from "@/lib/i18n";

export function useT() {
  const language = useStore((s) => s.language);
  return (key: TranslationKey): string => t((language as "en" | "hi") ?? "hi", key);
}
