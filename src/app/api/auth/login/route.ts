import { NextResponse } from "next/server";
import { ensureSchema, sql, type UserRow } from "@/lib/db";
import { issueSession, verifyAuth } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { ident, authHash } = (await req.json()) as Record<string, string>;
  if (!ident || !authHash) {
    return NextResponse.json({ error: "Lengkapi dulu isiannya." }, { status: 400 });
  }

  await ensureSchema();
  const rows = (await sql`
    SELECT * FROM users WHERE lower(username) = ${ident.toLowerCase()} OR lower(email) = ${ident.toLowerCase()} LIMIT 1
  `) as UserRow[];

  // Pesan yang sama untuk pengguna tidak ada maupun kata sandi salah.
  const wrong = NextResponse.json({ error: "Nama pengguna atau kata sandi tidak cocok." }, { status: 401 });
  if (!rows.length) return wrong;
  if (!(await verifyAuth(authHash, rows[0].auth_hash))) return wrong;

  const u = rows[0];
  await issueSession(u.id);
  return NextResponse.json({
    user: { id: u.id, username: u.username, email: u.email, mode: u.mode },
    salt: u.kdf_salt,
    wrappedDek: u.wrapped_dek,
  });
}
