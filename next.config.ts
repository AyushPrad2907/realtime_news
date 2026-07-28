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
};

export default nextConfig;
