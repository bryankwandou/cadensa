/**
 * Jalur merusak: daftar, kunci pemulihan, kunci brankas hilang saat tab ditutup,
 * ganti kata sandi, dan hapus akun.
 *
 * Semuanya dijalankan di akun sekali pakai. Akun demo tidak disentuh: kata
 * sandinya sudah diumumkan ke tim, dan uji yang mengubahnya akan membuat
 * dokumentasi yang beredar jadi salah tanpa ada yang tahu.
 */
import { chromium } from "playwright";
import { buka, konteks } from "./peramban.mjs";

const BASE = process.env.BASE ?? "https://cadensa.vercel.app";
const b = await chromium.launch();
const galat = [];
const hasil = [];

const lapor = (ok, nama, catatan = "") => {
  hasil.push({ ok, nama });
  console.log(`${ok ? "✓" : "✗"} ${nama}${catatan ? " · " + catatan : ""}`);
};

const pasang = (p, l) => {
  p.on("pageerror", (e) => galat.push(`[${l}] ${e.message}`));
  p.on("response", (r) => {
    if (r.status() >= 500 && r.url().includes("/api/")) galat.push(`[${l}] ${r.status()} ${r.url().replace(BASE, "")}`);
  });
};

const sufiks = Date.now().toString(36).slice(-6);
const U = `uji${sufiks}`;
const E = `uji${sufiks}@contoh.invalid`;
const PW1 = "kataSandiUji123";
const PW2 = "kataSandiBaru456";

const jumlah = (p) =>
  p.evaluate(() => {
    const raw = localStorage.getItem("cadensa.vault.v2");
    return raw ? (JSON.parse(raw).entries || []).length : 0;
  });

let kunciPemulihan = null;

/* 1. Daftar, dengan catatan lokal yang harus ikut terangkat */
const ctx = await konteks(b);
const p = await ctx.newPage();
pasang(p, "daftar");

/*
  Catatan lokalnya dibuat dengan mencatat sungguhan, bukan dengan memuat data
  contoh — fitur itu sudah dicabut. Jalur yang diuji di sini justru jadi lebih
  mewakili keadaan sebenarnya: orang mencoba aplikasi ini beberapa kali tanpa
  akun, lalu memutuskan mendaftar, dan catatan yang sudah dibuatnya harus ikut
  terangkat.
*/
for (const rasa of ["lega", "tenang", "netral"]) {
  await buka(p, `${BASE}/log`);
  await p.waitForTimeout(1500);
  await p.getByText(rasa, { exact: true }).first().click();
  await p.getByText("Simpan", { exact: true }).click();
  await p.waitForTimeout(1500);
}
const sebelumDaftar = await jumlah(p);
lapor(sebelumDaftar === 3, "catatan dibuat tanpa akun sebelum mendaftar", `${sebelumDaftar} catatan`);

await buka(p, `${BASE}/masuk`);
await p.getByRole("button", { name: "daftar", exact: true }).click();
await p.waitForTimeout(800);
await p.fill('input[autocomplete="username"]', U);
await p.fill('input[autocomplete="email"]', E);
const sandi = p.locator('input[autocomplete="new-password"]');
await sandi.nth(0).fill(PW1);
await sandi.nth(1).fill(PW1);
lapor(
  await p.getByText(/catatan yang sudah ada di perangkat ini/).isVisible().catch(() => false),
  "pemberitahuan catatan lama ikut terangkat",
);
await p.locator('button[type="submit"]').click();
await p.waitForTimeout(7000);

kunciPemulihan = await p.locator("code").first().textContent().catch(() => null);
lapor(!!kunciPemulihan && kunciPemulihan.trim().length > 40, "kunci pemulihan tampil sekali", `${kunciPemulihan?.trim().length} char`);
lapor(await p.getByText("Salin", { exact: true }).isVisible().catch(() => false), "tombol salin tersedia");

await p.getByText("Sudah saya simpan", { exact: true }).click();
await p.waitForTimeout(4000);
const setelahDaftar = await jumlah(p);
lapor(setelahDaftar === sebelumDaftar, "catatan lama ikut ke akun baru", `${sebelumDaftar} → ${setelahDaftar}`);

/* 2. Brankas terkunci begitu kunci sesi hilang */
await p.evaluate(() => sessionStorage.removeItem("cadensa.dek.session"));
await buka(p, `${BASE}/rhythm`);
await p.waitForTimeout(3000);
const teksTerkunci = await p.evaluate(() => document.body.innerText);
lapor(/Buka brankas|Unlock vault/.test(teksTerkunci), "brankas terkunci setelah kunci sesi hilang");

/* 3. Buka dengan kunci pemulihan */
await buka(p, `${BASE}/masuk`);
await p.waitForTimeout(1500);
await p.getByRole("button", { name: "pemulihan", exact: true }).click();
await p.waitForTimeout(800);
await p.fill("textarea", kunciPemulihan.trim());
await p.locator('button[type="submit"]').click();
const pulih = await p.waitForURL("**/rhythm", { timeout: 30000 }).then(() => true).catch(() => false);
await p.waitForTimeout(2500);
lapor(pulih, "brankas terbuka dengan kunci pemulihan");
const isiPulih = await jumlah(p);
lapor(isiPulih === sebelumDaftar, "isi brankas utuh setelah pemulihan", `${isiPulih} catatan`);

/* Kunci pemulihan cacat harus ditolak, bukan membuka brankas kosong */
const ctxSalah = await konteks(b);
const pSalah = await ctxSalah.newPage();
pasang(pSalah, "pemulihanSalah");
await buka(pSalah, `${BASE}/masuk`);
await pSalah.waitForTimeout(1200);
await pSalah.getByRole("button", { name: "pemulihan", exact: true }).click();
await pSalah.waitForTimeout(700);
await pSalah.fill("textarea", "aGFsbw==");
await pSalah.locator('button[type="submit"]').click();
await pSalah.waitForTimeout(3000);
const pesanSalah = await pSalah.locator(".text-signal-500").first().textContent().catch(() => null);
lapor(!!pesanSalah && pSalah.url().includes("/masuk"), "kunci pemulihan cacat ditolak", `"${pesanSalah?.trim()}"`);
await ctxSalah.close();

/* Setelah pemulihan, sesinya sudah aktif — `/masuk` benar-benar menampilkan
   "Kamu sudah masuk", bukan formulir. Jadi tidak ada yang perlu diisi lagi. */
await buka(p, `${BASE}/masuk`);
await p.waitForTimeout(2000);
lapor(
  (await p.evaluate(() => document.body.innerText)).includes("Kamu sudah masuk"),
  "halaman masuk mengenali sesi yang sudah aktif",
);

/* 4. Ganti kata sandi */
await buka(p, `${BASE}/pengaturan`);
await p.waitForTimeout(2000);
const kolom = p.locator('input[type="password"]');
await kolom.nth(0).fill(PW1);
await kolom.nth(1).fill(PW2);
await kolom.nth(2).fill(PW2);
await p.getByText("Ganti kata sandi", { exact: true }).click();
await p.waitForTimeout(6000);
lapor((await p.evaluate(() => document.body.innerText)).includes("Kata sandi diganti"), "kata sandi berhasil diganti");

/* Kata sandi lama harus gagal, yang baru harus berhasil, brankas tetap terbaca */
const ctx2 = await konteks(b);
const p2 = await ctx2.newPage();
pasang(p2, "sandiBaru");
await buka(p2, `${BASE}/masuk`);
await p2.fill('input[autocomplete="username"]', U);
await p2.fill('input[autocomplete="current-password"]', PW1);
await p2.locator('button[type="submit"]').click();
await p2.waitForTimeout(7000);
lapor(p2.url().includes("/masuk"), "kata sandi lama ditolak setelah diganti");

await p2.fill('input[autocomplete="current-password"]', PW2);
await p2.locator('button[type="submit"]').click();
const masukBaru = await p2.waitForURL("**/rhythm", { timeout: 40000 }).then(() => true).catch(() => false);
await p2.waitForTimeout(3000);
lapor(masukBaru, "kata sandi baru berhasil");
const isiSetelahGanti = await jumlah(p2);
lapor(isiSetelahGanti === sebelumDaftar, "brankas tetap terbaca setelah ganti kata sandi", `${isiSetelahGanti} catatan`);

/* 5. Hapus akun */
p2.on("dialog", (d) => d.accept());
await buka(p2, `${BASE}/pengaturan`);
await p2.waitForTimeout(2000);
await p2.getByText("Hapus akun", { exact: true }).click();
await p2.waitForTimeout(6000);
lapor((await p2.evaluate(() => document.body.innerText)).includes("Akun dihapus"), "akun terhapus");

const ctx3 = await konteks(b);
const p3 = await ctx3.newPage();
await buka(p3, `${BASE}/masuk`);
await p3.fill('input[autocomplete="username"]', U);
await p3.fill('input[autocomplete="current-password"]', PW2);
await p3.locator('button[type="submit"]').click();
await p3.waitForTimeout(7000);
lapor(p3.url().includes("/masuk"), "akun yang dihapus tidak bisa dimasuki lagi");

await b.close();

const gagal = hasil.filter((h) => !h.ok);
console.log(`\n== ${hasil.length - gagal.length}/${hasil.length} lolos ==`);
for (const g of gagal) console.log("  GAGAL:", g.nama);
console.log(`\ngalat: ${galat.length}`);
for (const g of new Set(galat)) console.log("  ·", g);

/*
  Kode keluar harus mencerminkan hasilnya.

  Tanpa baris ini, rangkaian yang gagal tetap keluar dengan kode 0, dan
  `jalankan.mjs` — yang menilai dari kode keluar — melaporkannya sebagai lolos.
  Tanda ✗ tetap tercetak di layar, tapi ringkasan di bawahnya mengatakan
  sebaliknya, dan yang dibaca orang adalah ringkasannya.

  Tiga rangkaian sempat begini sekaligus. Setiap laporan "semua rangkaian lolos"
  selama itu bernilai lebih kecil daripada bunyinya.
*/
process.exit(gagal.length ? 1 : 0);
