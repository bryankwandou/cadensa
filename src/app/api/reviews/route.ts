import { NextResponse } from "next/server";
import { ensureSchema, sql } from "@/lib/db";
import { currentUserId } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Row = { display_name: string; rating: number; body: string; created_at: string };

/**
 * Ulasan yang sudah disetujui, berikut angka penilaiannya.
 *
 * Rata-ratanya dihitung dari baris yang ada di tabel ini, bukan dari angka yang
 * ditulis tangan di halaman depan. Bedanya menentukan: pasal 9 dan 10 UU
 * Perlindungan Konsumen mengatur pernyataan jumlah dan penilaian produk, jadi
 * satu-satunya angka yang aman ditampilkan adalah angka yang bisa ditelusuri
 * kembali ke barisnya.
 */
export async function GET() {
  try {
    await ensureSchema();
    const rows = (await sql`
      SELECT display_name, rating, body, created_at
      FROM reviews
      WHERE approved = true
      ORDER BY created_at DESC
      LIMIT 24
    `) as Row[];

    const agg = (await sql`
      SELECT count(*)::int AS n, coalesce(avg(rating), 0)::float AS avg
      FROM reviews WHERE approved = true
    `) as { n: number; avg: number }[];

    return NextResponse.json({
      reviews: rows.map((r) => ({
        name: r.display_name,
        rating: r.rating,
        body: r.body,
        at: r.created_at,
      })),
      count: agg[0]?.n ?? 0,
      average: agg[0]?.n ? Math.round(agg[0].avg * 10) / 10 : null,
    });
  } catch {
    // Tanpa basis data, halaman depan tetap harus tampil utuh.
    return NextResponse.json({ reviews: [], count: 0, average: null });
  }
}

/**
 * Menulis atau mengganti ulasan milik akun yang sedang masuk.
 *
 * Satu akun satu ulasan, dipaksakan lewat primary key. Mengirim ulang mengganti
 * yang lama, bukan menambah baris — itu yang membuat angka penilaiannya tidak
 * bisa digelembungkan dengan mengirim kalimat yang sama berkali-kali.
 */
export async function PUT(req: Request) {
  const id = await currentUserId();
  if (!id) return NextResponse.json({ error: "Belum masuk." }, { status: 401 });

  const { rating, body, displayName } = (await req.json()) as {
    rating?: number;
    body?: string;
    displayName?: string;
  };

  const r = Number(rating);
  if (!Number.isInteger(r) || r < 1 || r > 5) {
    return NextResponse.json({ error: "Penilaian harus antara 1 sampai 5." }, { status: 400 });
  }
  const teks = (body ?? "").trim();
  if (teks.length < 20) {
    return NextResponse.json({ error: "Tulis setidaknya 20 karakter." }, { status: 400 });
  }
  if (teks.length > 600) {
    return NextResponse.json({ error: "Maksimal 600 karakter." }, { status: 400 });
  }
  const nama = (displayName ?? "").trim().slice(0, 40) || "Pengguna anonim";

  await ensureSchema();
  await sql`
    INSERT INTO reviews (user_id, display_name, rating, body, approved, updated_at)
    VALUES (${id}, ${nama}, ${r}, ${teks}, false, now())
    ON CONFLICT (user_id) DO UPDATE
      SET display_name = EXCLUDED.display_name,
          rating       = EXCLUDED.rating,
          body         = EXCLUDED.body,
          approved     = false,
          updated_at   = now()
  `;

  return NextResponse.json({ ok: true, pending: true });
}

/** Ulasan milik akun yang sedang masuk, termasuk yang belum disetujui. */
export async function POST() {
  const id = await currentUserId();
  if (!id) return NextResponse.json({ error: "Belum masuk." }, { status: 401 });

  await ensureSchema();
  const rows = (await sql`
    SELECT display_name, rating, body, approved FROM reviews WHERE user_id = ${id} LIMIT 1
  `) as (Row & { approved: boolean })[];

  if (!rows.length) return NextResponse.json({ review: null });
  return NextResponse.json({
    review: {
      name: rows[0].display_name,
      rating: rows[0].rating,
      body: rows[0].body,
      approved: rows[0].approved,
    },
  });
}

export async function DELETE() {
  const id = await currentUserId();
  if (!id) return NextResponse.json({ error: "Belum masuk." }, { status: 401 });
  await ensureSchema();
  await sql`DELETE FROM reviews WHERE user_id = ${id}`;
  return NextResponse.json({ ok: true });
}
