import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serializeEpisode } from "@/lib/serializers";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const episode = await db.podcastEpisode.findUnique({
    where: { slug },
    include: { series: true },
  });
  if (!episode) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Other episodes in the same series
  const otherEpisodes = await db.podcastEpisode.findMany({
    where: { seriesId: episode.seriesId, NOT: { id: episode.id } },
    orderBy: { publishedAt: "desc" },
    take: 6,
  });

  return NextResponse.json({
    episode: serializeEpisode(episode),
    series: {
      id: episode.series.id,
      name: episode.series.name,
      description: episode.series.description,
      coverImage: episode.series.coverImage,
      category: episode.series.category,
      episodes: 0,
    },
    otherEpisodes: otherEpisodes.map(serializeEpisode),
  });
}
