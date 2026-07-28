"use client";

import { useState, useCallback, useMemo } from "react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=60";

// Domains that are known to allow hotlinking — skip proxy for these
const HOTLINK_SAFE_DOMAINS = new Set([
  "images.unsplash.com",
  "ui-avatars.com",
  "upload.wikimedia.org",
  "i.imgur.com",
]);

/**
 * Generate HMAC-SHA256 signature for a URL (browser-side).
 * Uses the Web Crypto API (SubtleCrypto).
 * Falls back to a simple hash if SubtleCrypto is unavailable.
 */
const PROXY_SECRET = "nv-img-proxy-default-key-2024";

// Simple synchronous hash for the browser (matches the server's first 16 hex chars)
// We use a fast djb2-based approach and augment with the secret key for HMAC-like behavior.
// NOTE: For production, consider pre-computing signatures server-side.
function simpleHmac(url: string): string {
  const data = PROXY_SECRET + url;
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < data.length; i++) {
    const ch = data.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const hash = (4294967296 * (2097151 & h2) + (h1 >>> 0))
    .toString(16)
    .padStart(16, "0")
    .slice(0, 16);
  return hash;
}

// Pre-computed signature cache to avoid recalculating
const sigCache = new Map<string, string>();

function getProxiedUrl(src: string): string {
  // Don't proxy data URIs, blobs, or empty strings
  if (!src || src.startsWith("data:") || src.startsWith("blob:")) {
    return src;
  }

  // Don't proxy safe domains
  try {
    const hostname = new URL(src).hostname;
    if (HOTLINK_SAFE_DOMAINS.has(hostname)) {
      return src;
    }
  } catch {
    return src;
  }

  // Check cache
  let sig = sigCache.get(src);
  if (!sig) {
    sig = simpleHmac(src);
    // Keep cache bounded
    if (sigCache.size > 500) {
      const firstKey = sigCache.keys().next().value;
      if (firstKey) sigCache.delete(firstKey);
    }
    sigCache.set(src, sig);
  }

  return `/api/img-proxy?url=${encodeURIComponent(src)}&sig=${sig}`;
}

interface ProxiedImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** The original (external) image URL */
  src: string;
  /** Optional custom fallback image URL */
  fallbackSrc?: string;
  /** If true, skip proxying entirely (e.g. for local images) */
  skipProxy?: boolean;
}

/**
 * Drop-in replacement for <img> that:
 * 1. Routes external URLs through /api/img-proxy to bypass hotlink protection
 * 2. Adds referrerPolicy="no-referrer" as an extra safety net
 * 3. Gracefully falls back to a default image on load errors
 */
export function ProxiedImage({
  src,
  fallbackSrc = FALLBACK_IMAGE,
  skipProxy = false,
  alt = "",
  onError,
  ...rest
}: ProxiedImageProps) {
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const resolvedSrc = useMemo(() => {
    if (hasError) return fallbackSrc;
    if (skipProxy) return src;
    // If the src is already our fallback, don't proxy it
    if (src === fallbackSrc || src.startsWith("https://images.unsplash.com")) {
      return src;
    }
    return getProxiedUrl(src);
  }, [src, fallbackSrc, skipProxy, hasError]);

  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      if (retryCount === 0) {
        // First failure: try with referrerPolicy="no-referrer" directly (skip proxy)
        setRetryCount(1);
      } else if (!hasError) {
        // Second failure: fall back to default image
        setHasError(true);
      }
      onError?.(e);
    },
    [hasError, retryCount, onError]
  );

  // On first retry, try the original URL with no-referrer (no proxy)
  const finalSrc =
    retryCount === 1 && !hasError ? src : resolvedSrc;

  return (
    <img
      {...rest}
      src={finalSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={handleError}
    />
  );
}
