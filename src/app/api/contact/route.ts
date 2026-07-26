import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { fullName, email, subject, message } = body ?? {};
  if (!fullName || !email || !subject || !message) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  await db.contactMessage.create({
    data: { fullName, email, subject, message },
  });
  return NextResponse.json({ ok: true });
}
