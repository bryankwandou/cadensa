/**
 * Mengosongkan brankas sebuah akun tanpa menghapus akunnya.
 *
 * Dipakai untuk membuang data contoh yang sempat dimuat ke akun sungguhan
 * sebelum fiturnya dicabut. Akunnya tetap ada, kata sandinya tetap berlaku,
 * kunci pemulihannya tetap sama — yang hilang hanya isi catatannya.
 *
 * Kenapa lewat CLI dan bukan lewat aplikasi: isi brankas terenkripsi dengan
 * kunci yang tidak pernah ada di server, jadi tidak ada satu pun jalur di
 * aplikasi yang bisa membaca isinya untuk memilah mana yang karangan dan mana
 * yang sungguhan. Yang bisa dilakukan hanya mengosongkan seluruhnya. Kalau isinya
 * bercampur, unduh cadangan dulu dari halaman pengaturan.
 *
 * Selalu menampilkan daftar lebih dulu. Tidak ada yang berubah tanpa `--kosongkan`.
 *
 *   node scripts/kosongkan-brankas.mjs nayrbryangaming03
 *   node scripts/kosongkan-brankas.mjs nayrbryangaming03 --kosongkan
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
const argumen = process.argv.slice(2);
const kosongkan = argumen.includes("--kosongkan");
const nama = argumen.filter((a) => !a.startsWith("--"));

if (!nama.length) {
  console.error(
    "Sebutkan nama pengguna yang brankasnya hendak dikosongkan.\n\n" +
      "  node scripts/kosongkan-brankas.mjs nayrbryangaming03\n" +
      "  node scripts/kosongkan-brankas.mjs akun1 akun2 --kosongkan\n",
  );
  process.exit(1);
}

const baris = await sql`
  SELECT u.username, COALESCE(length(v.ciphertext), 0) AS ukuran, v.revision, v.updated_at
    FROM users u
    LEFT JOIN vaults v ON v.user_id = u.id
   WHERE lower(u.username) = ANY(${nama.map((n) => n.toLowerCase())})`;

if (!baris.length) {
  console.error("Tidak ada akun dengan nama itu.");
  process.exit(1);
}

console.log("Keadaan sekarang:\n");
for (const r of baris) {
  console.log(
    `  ${String(r.username).padEnd(22)} ${String(r.ukuran).padStart(7)} karakter   rev ${r.revision ?? "-"}`,
  );
}

if (!kosongkan) {
  console.log(
    "\nBelum ada yang diubah.\n" +
      "Unduh cadangan dari halaman pengaturan dulu kalau isinya bercampur dengan catatan sungguhan.\n" +
      "Jalankan ulang dengan --kosongkan untuk benar-benar mengosongkannya.",
  );
  process.exit(0);
}

/*
  Barisnya dihapus, bukan ditulisi ciphertext kosong.

  Aplikasi memperlakukan brankas yang tidak ada sebagai brankas baru dan
  membuatnya lagi saat sinkron berikutnya. Menulisi ciphertext buatan sendiri
  justru berbahaya: apa pun yang ditulis dari sini tidak akan bisa dibuka oleh
  kunci pemiliknya, dan yang muncul di layarnya adalah galat dekripsi, bukan
  brankas kosong.
*/
const hasil = await sql`
  DELETE FROM vaults
   WHERE user_id IN (SELECT id FROM users WHERE lower(username) = ANY(${nama.map((n) => n.toLowerCase())}))
  RETURNING user_id`;

console.log(`\n${hasil.length} brankas dikosongkan. Akunnya tetap ada dan tetap bisa dimasuki.`);
console.log("Di perangkat yang masih memegang salinan lama, tekan Keluar sekali untuk membersihkannya.");
