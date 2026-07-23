import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getSession() {
  return getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

export async function requireEditor() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  if (user.role !== "EDITOR" && user.role !== "ADMIN")
    throw new Error("FORBIDDEN");
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  if (user.role !== "ADMIN") throw new Error("FORBIDDEN");
  return user;
}
