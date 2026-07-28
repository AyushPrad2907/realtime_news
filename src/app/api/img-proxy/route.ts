import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

// Shared secret for signature — must match the browser-side ProxiedImage component
const PROXY_SECRET = "nv-img-proxy-default-key-2024";

/**
 * Simple hash matching the browser-side djb2 implementation in ProxiedImage.tsx.
 * This ensures signatures generated client-side are valid server-side.
 */
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

/** Verify signature matches */
function verifySignature(url: string, sig: string): boolean {
  const expected = simpleHmac(url);
  return sig === expected;
}

// Allowed image content types
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/avif",
  "image/bmp",
  "image/tiff",
]);

// Max image size: 10MB
const MAX_SIZE = 10 * 1024 * 1024;

// Default fallback image
const FALLBACK_IMAGE_URL =
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=60";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  const sig = searchParams.get("sig");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // Validate URL format
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Invalid protocol");
    }
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Block requests to localhost / private IPs (SSRF prevention)
  const hostname = parsedUrl.hostname.toLowerCase();
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    hostname.startsWith("172.") ||
    hostname.endsWith(".local")
  ) {
    return NextResponse.json({ error: "Blocked" }, { status: 403 });
  }

  // Verify HMAC signature to prevent open-proxy abuse
  if (!sig || !verifySignature(url, sig)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: parsedUrl.origin + "/",
      },
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeout);

    if (!res.ok) {
      // If the source returns an error, redirect to fallback
      return NextResponse.redirect(FALLBACK_IMAGE_URL, 302);
    }

    const contentType = res.headers.get("content-type")?.split(";")[0]?.trim() || "";
    const contentLength = parseInt(res.headers.get("content-length") || "0", 10);

    // Verify it's actually an image
    if (contentType && !ALLOWED_TYPES.has(contentType) && !contentType.startsWith("image/")) {
      return NextResponse.redirect(FALLBACK_IMAGE_URL, 302);
    }

    // Reject oversized images
    if (contentLength > MAX_SIZE) {
      return NextResponse.redirect(FALLBACK_IMAGE_URL, 302);
    }

    const imageBuffer = await res.arrayBuffer();

    // Double-check size after download
    if (imageBuffer.byteLength > MAX_SIZE) {
      return NextResponse.redirect(FALLBACK_IMAGE_URL, 302);
    }

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType || "image/jpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200",
        "X-Content-Type-Options": "nosniff",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    // On any fetch error (timeout, network, etc.), redirect to fallback
    console.error("[img-proxy] Failed to fetch image:", url, err?.message || err);
    return NextResponse.redirect(FALLBACK_IMAGE_URL, 302);
  }
}
