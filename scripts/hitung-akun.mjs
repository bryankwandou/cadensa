/**
 * Menghitung apa yang benar-benar ada di basis data.
 *
 * Bukan untuk membantah siapa pun, melainkan supaya angkanya berhenti jadi
 * perkiraan. Berapa akun, berapa brankas, sebesar apa isinya, kapan terakhir
 * disentuh. Semuanya bisa dibaca langsung.
 *
 *   node scripts/hitung-akun.mjs
 */
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

for (const baris of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const i = baris.indexOf("=");
  if (i > 0 && !baris.trimStart().startsWith("#")) {
    process.env[baris.slice(0, i).trim()] ??= baris.slice(i + 1).trim();
  }
}

const sql = neon(process.env.DATABASE_URL);

const pengguna = await sql`
  SELECT u.username,
         u.email,
         u.mode,
         u.created_at,
         COALESCE(length(v.ciphertext), 0) AS ukuran,
         v.updated_at
    FROM users u
    LEFT JOIN vaults v ON v.user_id = u.id
   ORDER BY u.created_at`;

const ulasan = await sql`SELECT count(*)::int AS n FROM reviews`;

console.log(`Jumlah akun di basis data : ${pengguna.length}`);
console.log(`Jumlah ulasan             : ${ulasan[0].n}\n`);

if (pengguna.length) {
  console.log("nama pengguna".padEnd(24), "mode".padEnd(8), "brankas".padStart(9), "  dibuat");
  console.log("-".repeat(70));
  for (const p of pengguna) {
    console.log(
      String(p.username).padEnd(24),
      String(p.mode).padEnd(8),
      `${p.ukuran}`.padStart(9),
      " ",
      new Date(p.created_at).toISOString().slice(0, 16).replace("T", " "),
    );
  }
}

/*
  Brankas berukuran di bawah ~1.500 karakter adalah brankas kosong: itu ukuran
  sebuah profil tanpa satu pun catatan. Angka ini yang membuat pertanyaan "apakah
  ada akun berisi data yang tidak semestinya" bisa dijawab tanpa mendekripsi apa
  pun — dan memang tidak bisa didekripsi, karena kuncinya tidak pernah ada di
  server.
*/
const kosong = pengguna.filter((p) => p.ukuran < 1500).length;
console.log(
  `\nBrankas kosong (< 1.500 karakter) : ${kosong} dari ${pengguna.length}`,
);
