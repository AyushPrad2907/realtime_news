import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serializeEpisode, serializeSeries } from "@/lib/serializers";
import { PODCAST_SERIES, PODCAST_EPISODES } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
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
  } catch (err) {
    console.error("Prisma database connection failed in podcasts API. Falling back to mock:", err);
    // Return annotated mock podcasts
    const mockSeriesWithCounts = PODCAST_SERIES.map((s) => {
      const count = PODCAST_EPISODES.filter((e) => e.seriesId === s.id).length;
      return { ...s, episodes: count };
    });
    return NextResponse.json({
      series: mockSeriesWithCounts,
      episodes: PODCAST_EPISODES,
    });
  }
}
