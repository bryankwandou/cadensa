/**
 * Menghapus akun sekali pakai yang tertinggal dari rangkaian uji.
 *
 * Rangkaian `alur-akun` dan `akun-baru` membuat akun sementara lalu menghapusnya
 * sendiri lewat alur hapus akun aplikasi. Kalau jalannya terputus di tengah —
 * jaringan mesin tertidur, misalnya — akunnya tertinggal di basis data.
 *
 * Hanya nama yang berpola uji yang disentuh, dan daftarnya selalu ditampilkan
 * lebih dulu supaya tidak ada yang terhapus tanpa terlihat. Akun sungguhan tidak
 * pernah bernama seperti ini.
 *
 *   node scripts/bersihkan-akun-uji.mjs          # hanya menampilkan
 *   node scripts/bersihkan-akun-uji.mjs --hapus  # benar-benar menghapus
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
const hapus = process.argv.includes("--hapus");

/*
  Pola yang dipakai rangkaian uji: `uji<acak>`, `bukti<acak>`, `bersama<acak>`,
  `periksa<acak>`, `bocor<acak>`. Semuanya berakhiran email @contoh.invalid,
  domain yang memang tidak bisa ada di dunia nyata — jadi syarat kedua itu yang
  menjaga akun sungguhan tidak pernah ikut tersapu.
*/
const calon = await sql`
  SELECT u.username, u.email, u.created_at, COALESCE(length(v.ciphertext), 0) AS ukuran
    FROM users u
    LEFT JOIN vaults v ON v.user_id = u.id
   WHERE u.email LIKE '%@contoh.invalid'
     AND (u.username ~ '^(uji|bukti|bersama|periksa|bocor)[a-z0-9]+$')
   ORDER BY u.created_at`;

if (!calon.length) {
  console.log("Tidak ada akun uji yang tertinggal.");
  process.exit(0);
}

console.log(`${calon.length} akun uji tertinggal:\n`);
for (const c of calon) {
  console.log(
    `  ${String(c.username).padEnd(20)} ${String(c.ukuran).padStart(7)} karakter  ${new Date(
      c.created_at,
    )
      .toISOString()
      .slice(0, 16)
      .replace("T", " ")}`,
  );
}

if (!hapus) {
  console.log("\nJalankan ulang dengan --hapus untuk benar-benar menghapusnya.");
  process.exit(0);
}

const nama = calon.map((c) => c.username);
const terhapus = await sql`DELETE FROM users WHERE username = ANY(${nama}) RETURNING username`;
console.log(`\n${terhapus.length} akun uji dihapus. Brankasnya ikut terhapus karena terikat barisnya.`);
