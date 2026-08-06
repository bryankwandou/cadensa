import { NextResponse } from "next/server";
import { ensureSchema, sql } from "@/lib/db";
import { currentUserId } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Peninjauan ulasan.
 *
 * Kepemilikan ditentukan oleh satu nama pengguna di `ADMIN_USERNAME`, bukan oleh
 * kolom di basis data. Alasannya: kolom bisa diubah lewat celah apa pun yang
 * kelak ditemukan di rute lain, sedangkan variabel lingkungan hanya bisa diubah
 * oleh yang memegang akun Vercel. Untuk satu-satunya rute yang bisa mengubah apa
 * yang dibaca publik, itu pertukaran yang benar.
 *
 * Kalau variabelnya belum diisi, rute ini menjawab 404 — bukan 403. Rute yang
 * membalas "terlarang" memberi tahu penyerang bahwa ada sesuatu di sini.
 */
async function pemilik(): Promise<string | null> {
  const nama = process.env.ADMIN_USERNAME;
  if (!nama) return null;

  const id = await currentUserId();
  if (!id) return null;

  await ensureSchema();
  const rows = (await sql`SELECT username FROM users WHERE id = ${id} LIMIT 1`) as {
    username: string;
  }[];
  if (!rows.length) return null;
  return rows[0].username.toLowerCase() === nama.toLowerCase() ? id : null;
}

type Row = {
  user_id: string;
  display_name: string;
  rating: number;
  body: string;
  approved: boolean;
  updated_at: string;
};

/** Semua ulasan berikut statusnya, terbaru dulu. */
export async function GET() {
  if (!(await pemilik())) return NextResponse.json({ error: "Tidak ditemukan." }, { status: 404 });

  const rows = (await sql`
    SELECT user_id, display_name, rating, body, approved, updated_at
    FROM reviews ORDER BY approved ASC, updated_at DESC LIMIT 200
  `) as Row[];

  return NextResponse.json({
    owner: true,
    reviews: rows.map((r) => ({
      id: r.user_id,
      name: r.display_name,
      rating: r.rating,
      body: r.body,
      approved: r.approved,
      at: r.updated_at,
    })),
  });
}

/** Menayangkan atau menurunkan satu ulasan. */
export async function PATCH(req: Request) {
  if (!(await pemilik())) return NextResponse.json({ error: "Tidak ditemukan." }, { status: 404 });

  const { id, approved } = (await req.json()) as { id?: string; approved?: boolean };
  if (typeof id !== "string" || typeof approved !== "boolean") {
    return NextResponse.json({ error: "Permintaan tidak lengkap." }, { status: 400 });
  }

  await sql`UPDATE reviews SET approved = ${approved} WHERE user_id = ${id}`;
  return NextResponse.json({ ok: true });
}

/** Menghapus ulasan yang jelas bukan dari pengguna sungguhan. */
export async function DELETE(req: Request) {
  if (!(await pemilik())) return NextResponse.json({ error: "Tidak ditemukan." }, { status: 404 });

  const { id } = (await req.json()) as { id?: string };
  if (typeof id !== "string") {
    return NextResponse.json({ error: "Permintaan tidak lengkap." }, { status: 400 });
  }

  await sql`DELETE FROM reviews WHERE user_id = ${id}`;
  return NextResponse.json({ ok: true });
}
