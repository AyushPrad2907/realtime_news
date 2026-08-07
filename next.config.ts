import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "static.pib.gov.in" },
      { protocol: "https", hostname: "pib.gov.in" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "timesofindia.indiatimes.com" },
      { protocol: "https", hostname: "*.timesofindia.com" },
      { protocol: "https", hostname: "feeds.feedburner.com" },
      { protocol: "https", hostname: "c.ndtvimg.com" },
      { protocol: "https", hostname: "*.ndtv.com" },
      { protocol: "https", hostname: "feed.livehindustan.com" },
      { protocol: "https", hostname: "*.livehindustan.com" },
      { protocol: "https", hostname: "ui-avatars.com" },
    ],
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
