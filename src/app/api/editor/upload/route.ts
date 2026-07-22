import { NextRequest, NextResponse } from "next/server";
import { requireEditor } from "@/lib/session";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_AUDIO = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg"];
const MAX_IMAGE = 5 * 1024 * 1024; // 5MB
const MAX_AUDIO = 50 * 1024 * 1024; // 50MB

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireEditor();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const isImage = ALLOWED_IMAGE.includes(file.type);
  const isAudio = ALLOWED_AUDIO.includes(file.type);
  if (!isImage && !isAudio) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type}` },
      { status: 400 }
    );
  }
  if (isImage && file.size > MAX_IMAGE) {
    return NextResponse.json(
      { error: "Image must be under 5MB" },
      { status: 400 }
    );
  }
  if (isAudio && file.size > MAX_AUDIO) {
    return NextResponse.json(
      { error: "Audio must be under 50MB" },
      { status: 400 }
    );
  }

  const subdir = isImage ? "images" : "audio";
  const uploadDir = path.join(process.cwd(), "public", "uploads", subdir);
  await mkdir(uploadDir, { recursive: true });

  const ext = path.extname(file.name) || (isImage ? ".jpg" : ".mp3");
  const filename = `${randomUUID()}${ext}`;
  const filepath = path.join(uploadDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, buffer);

  const publicUrl = `/uploads/${subdir}/${filename}`;
  console.log(`[upload] ${user.email} uploaded ${file.name} → ${publicUrl}`);

  return NextResponse.json({
    url: publicUrl,
    filename,
    size: file.size,
    type: file.type,
  });
}
