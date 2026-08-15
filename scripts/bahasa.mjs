/**
 * Memeriksa kamus terhadap kode.
 *
 *   npm run bahasa
 *
 * Kunci kamus di sini adalah kalimat Indonesianya sendiri, dan itu punya satu
 * kelemahan yang harus dijaga dari luar: mengubah satu koma di dalam JSX membuat
 * kuncinya tidak cocok lagi, terjemahannya berhenti terpakai, dan tidak ada
 * yang gagal — kalimatnya cuma diam-diam kembali berbahasa Indonesia di tengah
 * halaman berbahasa Inggris. Kegagalan yang tidak berisik seperti itu baru
 * ketahuan dari tangkapan layar pengguna.
 *
 * Berkas ini menutup celah tersebut. Ia membaca setiap `t("…")` di dalam `src`,
 * lalu melaporkan dua hal:
 *
 *   · dipanggil tapi tidak ada di kamus  → tampil sebagai bahasa Indonesia
 *   · ada di kamus tapi tidak dipanggil  → kemungkinan kalimatnya sudah berubah
 *
 * Golongan kedua bukan galat. Sebagian kunci memang dipanggil secara tidak
 * langsung — nama alat, nama bulan, nama fase — lewat `t(variabel)`, dan itu
 * tidak mungkin dilihat dari pemindaian teks. Karena itu perintah ini keluar
 * dengan status gagal hanya untuk golongan pertama.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

// `fileURLToPath`, bukan `.pathname`: jalur proyek ini mengandung spasi, dan
// `.pathname` menyerahkannya masih ter-escape sebagai %20.
const AKAR = fileURLToPath(new URL("../src", import.meta.url));

function berkas(dir) {
  const out = [];
  for (const nama of readdirSync(dir)) {
    const p = join(dir, nama);
    if (statSync(p).isDirectory()) out.push(...berkas(p));
    else if (/\.tsx?$/.test(p) && !p.includes("locales")) out.push(p);
  }
  return out;
}

/**
 * Hanya kunci harfiah yang bisa dipungut.
 *
 * `t(meta.care)` dan `t(e.method)` sengaja tidak tertangkap: nilainya baru ada
 * saat aplikasi berjalan. Itulah alasan "yatim" tidak diperlakukan sebagai galat.
 */
const POLA = /\bt\(\s*"((?:[^"\\]|\\.)*)"/g;

const dipanggil = new Set();
for (const p of berkas(AKAR)) {
  const isi = readFileSync(p, "utf8");
  for (const m of isi.matchAll(POLA)) dipanggil.add(m[1].replace(/\\"/g, '"'));
}

const { EN } = await import("../src/lib/locales/en.ts").catch(async () => {
  // Node tidak membaca TypeScript. Kuncinya dipungut dari teksnya saja — cukup,
  // karena yang dibutuhkan di sini hanya daftar kunci, bukan nilainya.
  const teks = readFileSync(new URL("../src/lib/locales/en.ts", import.meta.url), "utf8");
  const kunci = new Set();
  for (const m of teks.matchAll(/^\s{2}"((?:[^"\\]|\\.)*)":/gm)) kunci.add(m[1].replace(/\\"/g, '"'));
  for (const m of teks.matchAll(/^\s{2}([A-Za-z][A-Za-z0-9]*):/gm)) kunci.add(m[1]);
  return { EN: Object.fromEntries([...kunci].map((k) => [k, ""])) };
});

const punya = new Set(Object.keys(EN));
const hilang = [...dipanggil].filter((k) => !punya.has(k)).sort();
const yatim = [...punya].filter((k) => !dipanggil.has(k)).sort();

console.log(`Dipanggil di kode: ${dipanggil.size} · Ada di kamus Inggris: ${punya.size}`);

if (hilang.length) {
  console.log(`\n✗ ${hilang.length} kunci dipanggil tapi belum diterjemahkan:`);
  for (const k of hilang) console.log(`   ${JSON.stringify(k.slice(0, 90))}`);
}

if (yatim.length) {
  console.log(`\n· ${yatim.length} kunci ada di kamus tanpa pemanggilan harfiah.`);
  console.log("  Sebagian wajar (nama alat, bulan, fase — dipanggil lewat variabel).");
  console.log("  Sisanya kemungkinan kalimat aslinya sudah berubah:");
  for (const k of yatim.slice(0, 40)) console.log(`   ${JSON.stringify(k.slice(0, 90))}`);
  if (yatim.length > 40) console.log(`   … dan ${yatim.length - 40} lagi`);
}

if (!hilang.length) console.log("\n✓ Semua kunci harfiah punya terjemahan.");
process.exit(hilang.length ? 1 : 0);
