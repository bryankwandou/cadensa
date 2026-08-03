import { NextResponse } from "next/server";
import { ensureSchema, sql } from "@/lib/db";
import { decoySalt } from "@/lib/session";

export const runtime = "nodejs";

/** Salt harus bisa diambil sebelum masuk, karena kunci diturunkan di peramban dulu. */
export async function GET(req: Request) {
  const ident = new URL(req.url).searchParams.get("ident")?.trim().toLowerCase() ?? "";
  if (!ident) return NextResponse.json({ error: "Isi nama pengguna atau email." }, { status: 400 });

  await ensureSchema();
  const rows = (await sql`
    SELECT kdf_salt FROM users WHERE lower(username) = ${ident} OR lower(email) = ${ident} LIMIT 1
  `) as { kdf_salt: string }[];

  return NextResponse.json({ salt: rows[0]?.kdf_salt ?? decoySalt(ident) });
}
