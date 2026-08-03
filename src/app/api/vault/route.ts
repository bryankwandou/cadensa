import { NextResponse } from "next/server";
import { ensureSchema, sql } from "@/lib/db";
import { currentUserId } from "@/lib/session";

export const runtime = "nodejs";

/** Mengambil brankas terenkripsi. Server tidak bisa membacanya, hanya memindahkannya. */
export async function GET() {
  const id = await currentUserId();
  if (!id) return NextResponse.json({ error: "Belum masuk." }, { status: 401 });

  await ensureSchema();
  const rows = (await sql`
    SELECT ciphertext, revision, updated_at FROM vaults WHERE user_id = ${id} LIMIT 1
  `) as { ciphertext: string; revision: number; updated_at: string }[];

  if (!rows.length) return NextResponse.json({ ciphertext: null, revision: 0 });
  return NextResponse.json({
    ciphertext: rows[0].ciphertext,
    revision: rows[0].revision,
    updatedAt: rows[0].updated_at,
  });
}

export async function PUT(req: Request) {
  const id = await currentUserId();
  if (!id) return NextResponse.json({ error: "Belum masuk." }, { status: 401 });

  const { ciphertext, revision } = (await req.json()) as { ciphertext?: string; revision?: number };
  if (typeof ciphertext !== "string" || !ciphertext.includes(".")) {
    return NextResponse.json({ error: "Isi brankas tidak berbentuk terenkripsi." }, { status: 400 });
  }
  if (ciphertext.length > 4_000_000) {
    return NextResponse.json({ error: "Brankas melampaui batas ukuran." }, { status: 413 });
  }

  await ensureSchema();
  const next = (revision ?? 0) + 1;
  await sql`
    INSERT INTO vaults (user_id, ciphertext, revision, updated_at)
    VALUES (${id}, ${ciphertext}, ${next}, now())
    ON CONFLICT (user_id) DO UPDATE
      SET ciphertext = EXCLUDED.ciphertext,
          revision   = GREATEST(vaults.revision + 1, EXCLUDED.revision),
          updated_at = now()
    `;
  const rows = (await sql`SELECT revision FROM vaults WHERE user_id = ${id}`) as { revision: number }[];
  return NextResponse.json({ ok: true, revision: rows[0]?.revision ?? next });
}

/** Menghapus akun berikut brankasnya, tanpa masa tunggu. */
export async function DELETE() {
  const id = await currentUserId();
  if (!id) return NextResponse.json({ error: "Belum masuk." }, { status: 401 });
  await ensureSchema();
  await sql`DELETE FROM users WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
