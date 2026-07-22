import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serializeEpisode, serializeSeries } from "@/lib/serializers";

export const dynamic = "force-dynamic";

export async function GET() {
  const [series, episodes] = await Promise.all([
    db.podcastSeries.findMany({ orderBy: { name: "asc" } }),
    db.podcastEpisode.findMany({
      orderBy: { publishedAt: "desc" },
      include: { series: true },
    }),
  ]);

  // Annotate each series with its episode count
  const seriesWithCounts = series.map((s) => {
    const count = episodes.filter((e) => e.seriesId === s.id).length;
    return { ...serializeSeries(s), episodes: count };
  });

  return NextResponse.json({
    series: seriesWithCounts,
    episodes: episodes.map(serializeEpisode),
  });
}
