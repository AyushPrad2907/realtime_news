import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { UserRole, AccountStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      jobTitle: true,
      avatar: true,
      createdAt: true,
      _count: { select: { articles: true } },
    },
  });
  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }

  const body = await req.json();
  const { name, email, password, role, jobTitle, bio } = body ?? {};
  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email and password are required" },
      { status: 400 }
    );
  }

  const existing = await db.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (existing) {
    return NextResponse.json(
      { error: "A user with that email already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role === "ADMIN" ? UserRole.ADMIN : UserRole.EDITOR,
      status: AccountStatus.ACTIVE,
      jobTitle: jobTitle ?? null,
      bio: bio ?? null,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      jobTitle: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ user });
}
