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

  const { ciphertext, baseRevision } = (await req.json()) as {
    ciphertext?: string;
    baseRevision?: number;
  };
  if (typeof ciphertext !== "string" || !ciphertext.includes(".")) {
    return NextResponse.json({ error: "Isi brankas tidak berbentuk terenkripsi." }, { status: 400 });
  }
  if (ciphertext.length > 4_000_000) {
    return NextResponse.json({ error: "Brankas melampaui batas ukuran." }, { status: 413 });
  }

  await ensureSchema();

  /**
   * Tulisan hanya diterima kalau ia berpijak pada revisi yang masih berlaku.
   *
   * Klien sudah membaca-lalu-menggabung sebelum menulis, dan itu menutup
   * sebagian besar tabrakan. Yang tersisa adalah jendela sempit di antara
   * bacaan dan tulisan: kalau dua perangkat sama-sama membaca lebih dulu, lalu
   * keduanya menulis, yang belakangan menimpa hasil gabungan yang pertama.
   * Catatan yang hilang dari server itu memang masih ada di perangkat asalnya —
   * tapi kalau perangkat itu tidak pernah tersambung lagi, ia hilang untuk
   * selamanya, dan tidak ada satu pun galat yang muncul.
   *
   * `WHERE revision = baseRevision` membuat tabrakan itu mustahil lolos diam-
   * diam: basis data sendiri yang menolaknya. Klien menerima 409 berikut revisi
   * terbaru, membaca ulang, menggabung ulang, lalu mencoba lagi.
   *
   * Perbandingan dan penulisan terjadi dalam satu pernyataan, bukan dua. Membaca
   * revisi lebih dulu lalu menulis di pernyataan terpisah hanya memindahkan
   * jendela balapannya ke tempat lain, tidak menutupnya.
   */
  const ada = (await sql`SELECT revision FROM vaults WHERE user_id = ${id}`) as { revision: number }[];

  if (!ada.length) {
    // Brankas pertama. `ON CONFLICT DO NOTHING` menjaga dua permintaan pertama
    // yang tiba bersamaan tidak saling menimpa — yang kalah akan dapat 409.
    const dibuat = (await sql`
      INSERT INTO vaults (user_id, ciphertext, revision, updated_at)
      VALUES (${id}, ${ciphertext}, 1, now())
      ON CONFLICT (user_id) DO NOTHING
      RETURNING revision`) as { revision: number }[];
    if (dibuat.length) return NextResponse.json({ ok: true, revision: dibuat[0].revision });
    const kini = (await sql`SELECT revision FROM vaults WHERE user_id = ${id}`) as { revision: number }[];
    return NextResponse.json(
      { error: "Brankas sudah berubah.", revision: kini[0]?.revision ?? 0 },
      { status: 409 },
    );
  }

  const dasar = typeof baseRevision === "number" ? baseRevision : -1;
  const berikut = ada[0].revision + 1;
  const ditulis = (await sql`
    UPDATE vaults
       SET ciphertext = ${ciphertext}, revision = ${berikut}, updated_at = now()
     WHERE user_id = ${id} AND revision = ${dasar}
    RETURNING revision`) as { revision: number }[];

  if (!ditulis.length) {
    const kini = (await sql`SELECT revision FROM vaults WHERE user_id = ${id}`) as { revision: number }[];
    return NextResponse.json(
      { error: "Brankas sudah berubah di perangkat lain.", revision: kini[0]?.revision ?? 0 },
      { status: 409 },
    );
  }

  return NextResponse.json({ ok: true, revision: ditulis[0].revision });
}

/** Menghapus akun berikut brankasnya, tanpa masa tunggu. */
export async function DELETE() {
  const id = await currentUserId();
  if (!id) return NextResponse.json({ error: "Belum masuk." }, { status: 401 });
  await ensureSchema();
  await sql`DELETE FROM users WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
