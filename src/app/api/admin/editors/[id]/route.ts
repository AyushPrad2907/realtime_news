import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { AccountStatus, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const updates: any = {};
  if (body.name) updates.name = body.name;
  if (body.email) updates.email = body.email.toLowerCase();
  if (body.jobTitle) updates.jobTitle = body.jobTitle;
  if (body.bio !== undefined) updates.bio = body.bio;
  if (body.status) {
    if (!["ACTIVE", "SUSPENDED", "DEACTIVATED"].includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    updates.status = body.status as AccountStatus;
  }
  if (body.role) {
    if (!["EDITOR", "ADMIN"].includes(body.role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    updates.role = body.role as UserRole;
  }
  if (body.password) {
    updates.passwordHash = await bcrypt.hash(body.password, 10);
  }

  const user = await db.user.update({
    where: { id },
    data: updates,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      jobTitle: true,
      avatar: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ user });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let currentUser;
  try {
    currentUser = await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
  const { id } = await params;
  // Prevent self-delete
  if (currentUser.id === id) {
    return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
  }
  await db.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
