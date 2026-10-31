import "server-only";

import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createSession,
  deleteSession,
  findUserBySession,
  type User,
} from "@/lib/database";

const sessionCookie = "dashboard-session";
const sessionDuration = 60 * 60 * 24 * 7;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, passwordHash: string): boolean {
  const [salt, savedHash] = passwordHash.split(":");
  if (!salt || !savedHash || !/^[a-f0-9]{128}$/i.test(savedHash)) return false;

  const hash = scryptSync(password, salt, 64);
  return timingSafeEqual(hash, Buffer.from(savedHash, "hex"));
}

export async function startSession(userId: number): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expiresAt = Math.floor(Date.now() / 1000) + sessionDuration;

  createSession(tokenHash, userId, expiresAt);

  const cookieStore = await cookies();
  cookieStore.set(sessionCookie, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionDuration,
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) return null;

  const tokenHash = createHash("sha256").update(token).digest("hex");
  return findUserBySession(tokenHash);
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  return user;
}

export async function endSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookie)?.value;
  if (token) {
    deleteSession(createHash("sha256").update(token).digest("hex"));
  }
  cookieStore.delete(sessionCookie);
}
