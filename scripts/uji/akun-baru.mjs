/**
 * Akun baru harus benar-benar kosong.
 *
 * Ini rangkaian bukti, bukan sekadar rangkaian uji. Tuduhan yang paling berat
 * terhadap aplikasi seperti ini bukan "ada bug", melainkan "akun baru sudah
 * berisi data orang lain" — dan tuduhan itu tidak bisa dijawab dengan membaca
 * kode, karena yang menuduh tidak punya alasan mempercayai bacaan kita.
 *
 * Yang bisa dipercaya adalah percobaan yang bisa diulang sendiri oleh siapa pun:
 * peramban bersih, akun yang baru dibuat detik itu juga, lalu dihitung apa yang
 * ada di dalamnya. Rangkaian ini melakukan persis itu dan membersihkan akunnya
 * kembali setelah selesai.
 *
 * Dijalankan dengan `npm run uji`, atau sendiri:
 *   node scripts/uji/akun-baru.mjs
 */
import { chromium } from "playwright";
import { buka, konteks } from "./peramban.mjs";

const BASE = process.env.BASE ?? "https://cadensa.vercel.app";
const b = await chromium.launch();
const hasil = [];
const galat = [];
const lapor = (ok, nama, catatan = "") => {
  hasil.push({ ok, nama });
  console.log(`${ok ? "✓" : "✗"} ${nama}${catatan ? " · " + catatan : ""}`);
};

const jumlah = (p) =>
  p.evaluate(() => {
    const raw = localStorage.getItem("cadensa.vault.v2");
    return raw ? (JSON.parse(raw).entries || []).length : 0;
  });

const kosong = (teks) => /Belum ada apa-apa di sini|Nothing here yet/.test(teks);

/* ══ 1. Pengunjung baru, belum menyentuh apa pun ═════════════════════════ */
{
  const ctx = await konteks(b);
  const p = await ctx.newPage();
  p.on("pageerror", (e) => galat.push(`[pengunjung] ${e.message}`));

  for (const rute of ["/rhythm", "/insights", "/log"]) {
    await buka(p, BASE + rute);
    await p.waitForTimeout(2500);
    lapor((await jumlah(p)) === 0, `pengunjung baru: ${rute} tidak menanam catatan apa pun`);
  }

  await buka(p, `${BASE}/rhythm`);
  await p.waitForTimeout(2000);
  lapor(kosong(await p.evaluate(() => document.body.innerText)), "pengunjung baru melihat keadaan kosong");

  /*
    Data contoh hanya boleh masuk lewat tombol yang ditekan. Yang diperiksa di
    sini bukan tombolnya bekerja, melainkan bahwa ia tidak bekerja sendiri:
    berkeliling seluruh aplikasi tidak boleh menghasilkan satu catatan pun.
  */
  for (let i = 0; i < 3; i++) {
    for (const rute of ["/", "/rhythm", "/insights", "/log", "/pengaturan"]) {
      await buka(p, BASE + rute);
      await p.waitForTimeout(600);
    }
  }
  lapor((await jumlah(p)) === 0, "berkeliling aplikasi tidak menyemai apa pun", "15 kunjungan halaman");

  await ctx.close();
}

/* ══ 2. Akun yang baru dibuat detik ini ══════════════════════════════════ */
{
  const ctx = await konteks(b);
  const p = await ctx.newPage();
  p.on("pageerror", (e) => galat.push(`[akun baru] ${e.message}`));
  p.on("response", (r) => {
    if (r.status() >= 500 && r.url().includes("/api/")) galat.push(`${r.status()} ${r.url().replace(BASE, "")}`);
  });

  const sufiks = Date.now().toString(36).slice(-7);
  const U = `bukti${sufiks}`;
  const SANDI = `sandiBukti${sufiks}`;

  await buka(p, `${BASE}/masuk`);
  await p.getByRole("button", { name: "daftar", exact: true }).click();
  await p.waitForTimeout(900);
  await p.fill('input[autocomplete="username"]', U);
  await p.fill('input[autocomplete="email"]', `${U}@contoh.invalid`);
  const sandi = p.locator('input[autocomplete="new-password"]');
  await sandi.nth(0).fill(SANDI);
  await sandi.nth(1).fill(SANDI);

  /*
    Spanduk "catatan lama ikut terangkat" hanya muncul kalau perangkatnya memang
    sudah berisi catatan. Di peramban bersih ia harus diam — kalau ia tampil di
    sini, artinya ada sesuatu yang sudah menanam data sebelum pengguna menulis
    apa pun.
  */
  const spanduk = await p
    .getByText(/catatan yang sudah ada di perangkat ini|entries already on this device/)
    .isVisible()
    .catch(() => false);
  lapor(!spanduk, "tidak ada tawaran mengangkat catatan lama di perangkat bersih");

  await p.locator('button[type="submit"]').click();
  await p.waitForTimeout(9000);

  const adaKunci = await p.getByText("Sudah saya simpan", { exact: true }).isVisible().catch(() => false);
  lapor(adaKunci, "kunci pemulihan ditampilkan sekali saat mendaftar");
  if (adaKunci) await p.getByText("Sudah saya simpan", { exact: true }).click();
  await p.waitForTimeout(4000);

  await buka(p, `${BASE}/rhythm`);
  await p.waitForTimeout(4000);
  const n = await jumlah(p);
  lapor(n === 0, "akun baru berisi nol catatan", `${n} catatan`);
  lapor(kosong(await p.evaluate(() => document.body.innerText)), "akun baru melihat keadaan kosong");

  /*
    Brankas di server juga diperiksa, bukan hanya layarnya.

    Isinya terenkripsi dan memang tidak bisa dibaca dari sini — tapi panjangnya
    bisa. Brankas berisi puluhan catatan berukuran puluhan ribu karakter;
    brankas kosong hanya beberapa ratus. Kalau akun baru mewarisi data orang
    lain, panjangnya akan langsung membocorkannya.
  */
  const server = await p.evaluate(async () => {
    const r = await fetch("/api/vault");
    const j = await r.json();
    return { status: r.status, panjang: (j.ciphertext || "").length };
  });
  lapor(
    server.status === 200 && server.panjang > 0 && server.panjang < 1500,
    "brankas server akun baru berukuran brankas kosong",
    `${server.panjang} karakter`,
  );

  // Bacaan juga tidak boleh mengarang apa pun dari ketiadaan
  await buka(p, `${BASE}/insights`);
  await p.waitForTimeout(3000);
  const bacaan = await p.evaluate(() => document.body.innerText);
  lapor(
    /Pola baru muncul setelah beberapa catatan|Patterns only appear after/.test(bacaan),
    "halaman bacaan mengaku belum punya bahan, bukan menampilkan pola karangan",
  );

  /* Bereskan: akun bukti dihapus lewat alur hapus akun aplikasi sendiri */
  p.on("dialog", (d) => d.accept());
  await buka(p, `${BASE}/pengaturan`);
  await p.waitForTimeout(2500);
  await p.getByText("Hapus akun", { exact: true }).click();
  await p.waitForTimeout(6000);
  lapor(
    /Akun dihapus|Account fully deleted/.test(await p.evaluate(() => document.body.innerText)),
    "akun bukti dihapus kembali setelah diperiksa",
  );

  await ctx.close();
}

await b.close();
const gagal = hasil.filter((h) => !h.ok);
console.log(`\n== ${hasil.length - gagal.length}/${hasil.length} lolos ==`);
for (const g of gagal) console.log("  GAGAL:", g.nama);
console.log(`\ngalat: ${galat.length}`);
for (const g of new Set(galat)) console.log("  ·", g);
process.exit(gagal.length ? 1 : 0);
