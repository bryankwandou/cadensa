import { createHmac, randomBytes, scrypt as _scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";

const scrypt = promisify(_scrypt) as (p: string, s: string, k: number) => Promise<Buffer>;

const COOKIE = "cadensa_sesi";
const MAX_AGE = 60 * 60 * 24 * 30;

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET belum diisi.");
  return s;
}

/**
 * Yang di-hash di sini bukan kata sandi asli, melainkan turunan PBKDF2 yang sudah
 * dibuat di peramban. Server tidak pernah melihat kata sandinya.
 */
export async function hashAuth(authHash: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const dk = await scrypt(authHash, salt, 64);
  return `${salt}:${dk.toString("hex")}`;
}

export async function verifyAuth(authHash: string, stored: string): Promise<boolean> {
  const [salt, hex] = stored.split(":");
  if (!salt || !hex) return false;
  const dk = await scrypt(authHash, salt, 64);
  const want = Buffer.from(hex, "hex");
  return dk.length === want.length && timingSafeEqual(dk, want);
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export async function issueSession(userId: string) {
  const payload = `${userId}.${Date.now() + MAX_AGE * 1000}`;
  const jar = await cookies();
  jar.set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function currentUserId(): Promise<string | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const i = raw.lastIndexOf(".");
  if (i < 0) return null;
  const payload = raw.slice(0, i);
  const mac = raw.slice(i + 1);
  const expected = sign(payload);
  if (mac.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return null;
  const [userId, expiresAt] = payload.split(".");
  if (!userId || Number(expiresAt) < Date.now()) return null;
  return userId;
}

/** Salt semu yang tetap sama untuk identitas tidak dikenal, agar tidak bisa dipakai
 *  menebak siapa yang sudah terdaftar. */
export function decoySalt(ident: string): string {
  return createHmac("sha256", secret()).update(`decoy:${ident.toLowerCase()}`).digest("base64").slice(0, 24);
}
