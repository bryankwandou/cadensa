import { NextResponse } from "next/server";
import { ensureSchema, sql, type UserRow } from "@/lib/db";
import { currentUserId } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  const id = await currentUserId();
  if (!id) return NextResponse.json({ user: null });

  await ensureSchema();
  const rows = (await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`) as UserRow[];
  if (!rows.length) return NextResponse.json({ user: null });

  const u = rows[0];
  return NextResponse.json({
    user: { id: u.id, username: u.username, email: u.email, mode: u.mode },
    salt: u.kdf_salt,
    wrappedDek: u.wrapped_dek,
  });
}

/** Ganti mode pencatatan. Mode bukan rahasia, jadi tidak ikut dienkripsi. */
export async function PATCH(req: Request) {
  const id = await currentUserId();
  if (!id) return NextResponse.json({ error: "Belum masuk." }, { status: 401 });

  const { mode } = (await req.json()) as { mode?: string };
  await ensureSchema();
  await sql`UPDATE users SET mode = ${mode === "wanita" ? "wanita" : "pria"} WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
