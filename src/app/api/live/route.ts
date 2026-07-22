import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serializeLiveUpdate } from "@/lib/serializers";

export const dynamic = "force-dynamic";

export async function GET() {
  const [config, updates] = await Promise.all([
    db.liveConfig.findUnique({ where: { id: "default" } }),
    db.liveUpdate.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
  ]);

  return NextResponse.json({
    isLive: config?.isLive ?? false,
    viewerCount: config?.viewerCount ?? 0,
    startedAt: config?.startedAt?.toISOString() ?? null,
    programTitle: config?.programTitle ?? "",
    programDesc: config?.programDesc ?? "",
    youtubeUrl: config?.youtubeUrl ?? "",
    nextBroadcastAt: config?.nextBroadcastAt?.toISOString() ?? null,
    showOnHomepage: config?.showOnHomepage ?? true,
    updates: updates.map(serializeLiveUpdate),
  });
}
