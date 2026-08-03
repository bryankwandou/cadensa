import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { ensureSchema, sql } from "@/lib/db";
import { hashAuth, issueSession } from "@/lib/session";

export const runtime = "nodejs";

const USERNAME = /^[a-z0-9_.]{3,24}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  const body = (await req.json()) as Record<string, string>;
  const username = (body.username ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const { authHash, salt, wrappedDek, mode } = body;

  if (!USERNAME.test(username)) {
    return NextResponse.json(
      { error: "Nama pengguna 3–24 karakter, hanya huruf, angka, titik, garis bawah." },
      { status: 400 },
    );
  }
  if (!EMAIL.test(email)) return NextResponse.json({ error: "Alamat email belum benar." }, { status: 400 });
  if (!authHash || !salt || !wrappedDek) {
    return NextResponse.json({ error: "Data pendaftaran tidak lengkap." }, { status: 400 });
  }

  await ensureSchema();

  const taken = (await sql`
    SELECT username, email FROM users WHERE lower(username) = ${username.toLowerCase()} OR email = ${email} LIMIT 1
  `) as { username: string; email: string }[];
  if (taken.length) {
    const clash = taken[0].email === email ? "Email itu sudah terdaftar." : "Nama pengguna itu sudah dipakai.";
    return NextResponse.json({ error: clash }, { status: 409 });
  }

  const id = randomUUID();
  await sql`
    INSERT INTO users (id, username, email, auth_hash, kdf_salt, wrapped_dek, mode)
    VALUES (${id}, ${username}, ${email}, ${await hashAuth(authHash)}, ${salt}, ${wrappedDek},
            ${mode === "wanita" ? "wanita" : "pria"})
  `;
  await issueSession(id);

  return NextResponse.json({ user: { id, username, email, mode: mode ?? "pria" } });
}
