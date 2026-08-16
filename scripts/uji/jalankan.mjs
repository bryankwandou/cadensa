/**
 * Menjalankan ketiga rangkaian uji ujung-ke-ujung terhadap situs yang benar-benar
 * tayang.
 *
 *   npm run uji                                  # terhadap produksi
 *   BASE=http://localhost:3000 npm run uji       # terhadap salinan lokal
 *
 * Kenapa terhadap situs yang tayang, bukan terhadap komponen
 * -----------------------------------------------------------
 * Bug yang paling mahal di proyek ini semuanya lolos dari pemeriksaan tipe dan
 * dari build. Tombol masuk berhenti bisa ditekan karena transformasi tiga
 * dimensi menggeser daerah tumbukannya; kalimat tentang prostat tampil kepada
 * pengguna mode wanita; dua halaman memajang angka berbeda di bawah label yang
 * sama. Tidak satu pun dari itu bisa ditangkap tanpa menjalankan halamannya
 * sungguhan, mengetik ke dalamnya, dan menekan tombolnya.
 *
 * Karena itu rangkaian ini memakai peramban asli dan akun asli. Ia lambat —
 * beberapa menit — dan itu memang harganya.
 *
 * Prasyarat: `npm i -D playwright && npx playwright install chromium`.
 * Playwright sengaja tidak dijadikan dependensi tetap: ia berat, dan aplikasi
 * ini tidak membutuhkannya untuk dibangun maupun dijalankan.
 */
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const DI_SINI = dirname(fileURLToPath(import.meta.url));

const RANGKAIAN = [
  ["Akun baru", "akun-baru.mjs", "akun baru benar-benar kosong, tidak ada penyemaian diam-diam"],
  ["Alur utama", "alur-utama.mjs", "mencatat, sinkron dua perangkat, ekspor–impor"],
  ["Alur akun", "alur-akun.mjs", "daftar, kunci pemulihan, ganti kata sandi, hapus akun"],
  ["Otorisasi", "otorisasi.mjs", "akses tanpa sesi, cookie palsu, kebocoran data publik"],
  ["Personalisasi", "personalisasi.mjs", "ganti mode, warna, nama, siklus, tulis ulasan"],
  ["Ketahanan", "ketahanan.mjs", "luring, tulis serentak, API mati"],
  ["Lintas peramban", "lintas-peramban.mjs", "Chromium, Firefox, WebKit"],
  ["Tata letak", "tata-letak.mjs", "meluber, bilah menempel, penanda bagian, 5 lebar layar"],
  ["Aksesibilitas", "akses.mjs", "axe-core WCAG 2.1 AA, papan ketik, penanda fokus"],
];

try {
  await import("playwright");
} catch {
  console.error(
    "Playwright belum terpasang.\n" +
      "  npm i -D playwright && npx playwright install chromium",
  );
  process.exit(1);
}

/*
 * Semua rangkaian diperiksa keterbacaannya lebih dulu, sebelum satu pun
 * peramban dijalankan.
 *
 * Satu rangkaian pernah rusak sintaksisnya oleh suntingan yang gagal, dan
 * kerusakan itu baru ketahuan setelah sepuluh menit menunggu — dengan gejala
 * yang mudah disalahartikan sebagai kegagalan uji, padahal berkasnya bahkan
 * tidak sempat dijalankan. Pemeriksaan ini memakan dua detik dan memisahkan
 * dua hal yang sangat berbeda: "ujinya gagal" dan "ujinya tidak bisa dibaca".
 */
for (const [nama, berkas] of RANGKAIAN) {
  // `--check` mengurai berkasnya tanpa menjalankannya. Memuatnya lewat `import`
  // justru akan menyalakan peramban dan menjalankan seluruh rangkaian — persis
  // yang tidak diinginkan dari sebuah pemeriksaan awal.
  const periksa = spawnSync(process.execPath, ["--check", join(DI_SINI, berkas)], {
    encoding: "utf8",
  });
  if (periksa.status !== 0) {
    console.error(`\n✗ ${nama} (${berkas}) tidak bisa dibaca sebagai JavaScript:`);
    console.error((periksa.stderr || "").trim().split("\n").slice(0, 6).join("\n"));
    process.exit(2);
  }
}

/*
 * Uji unit dijalankan lebih dulu, dan kegagalannya menghentikan sisanya.
 *
 * Ia memeriksa fungsi yang memutuskan apakah catatan bertahan atau hilang, dan
 * selesai dalam hitungan detik. Kalau `merge` sudah salah, menjalankan tujuh
 * rangkaian peramban selama belasan menit hanya akan menghasilkan daftar
 * kegagalan yang semuanya berakar pada satu hal — dan yang membacanya harus
 * menebak yang mana penyebabnya.
 */
console.log(`\n${"─".repeat(64)}\nUji unit — merge, nisan, kadens, siklus\n${"─".repeat(64)}`);
const unit = spawnSync(
  process.execPath,
  [
    /*
      `--import` menuntut URL, bukan jalur berkas.

      Di Windows, jalur mutlak seperti `E:\\...` dibaca sebagai protokol `e:` dan
      ditolak dengan ERR_UNSUPPORTED_ESM_URL_SCHEME. Menjalankannya lewat
      `npm run uji:unit` tidak pernah menampakkan ini, karena di sana jalurnya
      relatif.
    */
    "--import",
    pathToFileURL(join(DI_SINI, "daftar-resolver.mjs")).href,
    "--test",
    join(DI_SINI, "unit.test.mjs"),
  ],
  { stdio: "inherit" },
);
if (unit.status !== 0) {
  console.error("\nUji unit gagal. Rangkaian peramban tidak dijalankan.");
  process.exit(1);
}

let gagal = 0;
for (const [nama, berkas, keterangan] of RANGKAIAN) {
  console.log(`\n${"─".repeat(64)}\n${nama} — ${keterangan}\n${"─".repeat(64)}`);
  const kode = await new Promise((selesai) => {
    const anak = spawn(process.execPath, [join(DI_SINI, berkas)], { stdio: "inherit" });
    anak.on("close", selesai);
  });
  if (kode !== 0) gagal++;
}

console.log(`\n${"═".repeat(64)}`);
console.log(
  gagal
    ? `${gagal} dari ${RANGKAIAN.length} rangkaian gagal.`
    : `Semua rangkaian lolos (${RANGKAIAN.length}/${RANGKAIAN.length}).`,
);
process.exit(gagal ? 1 : 0);
