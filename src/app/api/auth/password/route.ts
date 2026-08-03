import { NextResponse } from "next/server";
import { ensureSchema, sql, type UserRow } from "@/lib/db";
import { currentUserId, hashAuth, verifyAuth } from "@/lib/session";

export const runtime = "nodejs";

/**
 * Ganti kata sandi. Yang berubah hanya bungkus kunci — isi brankas tidak disentuh
 * sama sekali, jadi tidak ada risiko catatan rusak di tengah proses.
 */
export async function POST(req: Request) {
  const id = await currentUserId();
  if (!id) return NextResponse.json({ error: "Belum masuk." }, { status: 401 });

  const { currentAuthHash, authHash, salt, wrappedDek } = (await req.json()) as Record<string, string>;
  if (!currentAuthHash || !authHash || !salt || !wrappedDek) {
    return NextResponse.json({ error: "Data tidak lengkap." }, { status: 400 });
  }

  await ensureSchema();
  const rows = (await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`) as UserRow[];
  if (!rows.length) return NextResponse.json({ error: "Akun tidak ditemukan." }, { status: 404 });
  if (!(await verifyAuth(currentAuthHash, rows[0].auth_hash))) {
    return NextResponse.json({ error: "Kata sandi lama tidak cocok." }, { status: 401 });
  }

  await sql`
    UPDATE users SET auth_hash = ${await hashAuth(authHash)}, kdf_salt = ${salt}, wrapped_dek = ${wrappedDek}
    WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
