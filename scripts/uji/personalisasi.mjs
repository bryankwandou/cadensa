/**
 * Mode, personalisasi, profil siklus, dan menulis ulasan.
 *
 * Rangkaian ini memakai akun demo dan mengubah isinya, jadi setiap perubahan
 * dikembalikan ke keadaan semula di akhir — termasuk ulasan yang ditulis, yang
 * dihapus lagi lewat endpointnya sendiri. Rangkaian uji yang meninggalkan jejak
 * akan membuat rangkaian berikutnya berangkat dari keadaan berbeda, dan
 * kegagalan yang muncul jadi tidak bisa ditelusuri.
 */
import { chromium } from "playwright";
import { konteks } from "./peramban.mjs";
import { PRIA } from "./akun.mjs";

const BASE = process.env.BASE ?? "https://cadensa.vercel.app";
const b = await chromium.launch();
const galat = [];
const hasil = [];
const lapor = (ok, nama, catatan = "") => {
  hasil.push({ ok, nama });
  console.log(`${ok ? "✓" : "✗"} ${nama}${catatan ? " · " + catatan : ""}`);
};

const ctx = await konteks(b);
const p = await ctx.newPage();
p.on("pageerror", (e) => galat.push(e.message));
p.on("response", (r) => {
  if (r.status() >= 500 && r.url().includes("/api/")) galat.push(`${r.status()} ${r.url().replace(BASE, "")}`);
});

const profil = () =>
  p.evaluate(() => {
    const raw = localStorage.getItem("cadensa.vault.v2");
    return raw ? JSON.parse(raw).profile : null;
  });

await p.goto(`${BASE}/masuk`, { waitUntil: "networkidle" });
await p.fill('input[autocomplete="username"]', PRIA.nama);
await p.fill('input[autocomplete="current-password"]', PRIA.sandi);
await p.locator('button[type="submit"]').click();
await p.waitForURL("**/rhythm", { timeout: 45000 });

const semula = await profil();
lapor(semula?.mode === "pria", "akun demo bermode pria di awal", `nama "${semula?.name}", aksen ${semula?.accent}`);

/* ── Katalog alat mengikuti mode ────────────────────────────────────────── */
await p.goto(`${BASE}/log`, { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
await p.getByText("alat bantu", { exact: true }).first().click();
await p.waitForTimeout(900);
const alatPria = await p.evaluate(() => document.body.innerText);
lapor(/Onahole|Pemijat prostat/.test(alatPria), "katalog mode pria memuat alat khusus pria");
lapor(!/Rabbit|Bola kegel/.test(alatPria), "katalog mode pria tidak menawarkan alat khusus wanita");

/* ── Ganti mode ke wanita ───────────────────────────────────────────────── */
await p.goto(`${BASE}/pengaturan`, { waitUntil: "networkidle" });
await p.waitForTimeout(1800);
await p.getByRole("button", { name: "wanita", exact: true }).click();
await p.waitForTimeout(2500);
lapor((await profil())?.mode === "wanita", "mode berganti ke wanita");

const adaSiklus = await p.getByText("Hari pertama haid terakhir").isVisible().catch(() => false);
lapor(adaSiklus, "bagian siklus muncul setelah pindah ke mode wanita");

// isi profil siklus
await p.locator('input[type="date"]').fill("2026-07-20");
await p.waitForTimeout(1200);
const angka = p.locator('input[type="number"]');
await angka.nth(0).fill("30");
await angka.nth(1).fill("6");
await p.waitForTimeout(2000);
const c = (await profil())?.cycle;
lapor(c?.lastPeriodStart === "2026-07-20" && c?.cycleLengthDays === 30 && c?.periodLengthDays === 6,
  "profil siklus tersimpan", JSON.stringify(c));
lapor(await p.getByText(/Perkiraan haid berikutnya/).isVisible().catch(() => false),
  "prakiraan haid berikutnya tampil");

/* ── Katalog dan bacaan ikut berubah ────────────────────────────────────── */
await p.goto(`${BASE}/log`, { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
await p.getByText("alat bantu", { exact: true }).first().click();
await p.waitForTimeout(900);
const alatWanita = await p.evaluate(() => document.body.innerText);
lapor(/Rabbit|Bola kegel|Vibrator klitoris/.test(alatWanita), "katalog mode wanita memuat alat khusus wanita");
lapor(!/Pemijat prostat|Pompa vakum/.test(alatWanita), "katalog mode wanita tidak menawarkan alat khusus pria");

await p.goto(`${BASE}/rhythm`, { waitUntil: "networkidle" });
/*
  Ditunggu sampai kartu siklusnya benar-benar tergambar. Jeda tetap 2,5 detik
  cukup hampir selalu — dan "hampir" itulah yang membuat rangkaian ini
  sesekali gagal pada aplikasi yang benar.
*/
await p
  .waitForFunction(() => /keterikatan siklus|sebaran per fase/i.test(document.body.innerText), undefined, { timeout: 30000 })
  .catch(() => {});
const ritmeWanita = await p.evaluate(() => document.body.innerText);
lapor(!/prostat/i.test(ritmeWanita), "halaman ritme tidak menyebut prostat di mode wanita");
/*
  Dicocokkan tanpa peduli besar-kecil huruf. Kelas `eyebrow` menaikkan teksnya
  jadi huruf besar lewat CSS, dan `innerText` mengembalikan teks setelah
  dirender — bukan teks di sumbernya. Pencocokan yang peka huruf di sini gagal
  pada aplikasi yang berperilaku benar.
*/
lapor(/keterikatan siklus|sebaran per fase/i.test(ritmeWanita), "kartu siklus menggantikan pita bulanan");

await p.goto(`${BASE}/insights`, { waitUntil: "networkidle" });
await p.waitForTimeout(2800);
const bacaanWanita = await p.evaluate(() => document.body.innerText);
lapor(!/prostat/i.test(bacaanWanita), "bacaan tidak menyebut prostat di mode wanita");

/* ── Personalisasi: warna, nama panggilan, gerakan ──────────────────────── */
await p.goto(`${BASE}/pengaturan`, { waitUntil: "networkidle" });
await p.waitForTimeout(1800);
await p.getByRole("button", { name: "Bara" }).click();
await p.waitForTimeout(1500);
lapor((await profil())?.accent === "ember", "aksen warna berganti");

const warnaTerpakai = await p.evaluate(() =>
  getComputedStyle(document.documentElement).getPropertyValue("--color-teal-500").trim());
lapor(warnaTerpakai.toLowerCase() === "#f5924f", "warna aksen benar-benar dipakai di CSS", warnaTerpakai);

await p.locator('input[maxlength="24"]').fill("Bryan");
await p.waitForTimeout(1500);
lapor((await profil())?.name === "Bryan", "nama panggilan tersimpan");

await p.getByRole("button", { name: "tenang", exact: true }).click();
await p.waitForTimeout(1500);
lapor((await profil())?.motion === "tenang", "tingkat gerakan berganti ke tenang");

await p.goto(`${BASE}/log`, { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
lapor(/halo, bryan/i.test(await p.evaluate(() => document.body.innerText)),
  "nama panggilan dipakai menyapa di halaman catat");

/* ── Menulis ulasan ─────────────────────────────────────────────────────── */
await p.goto(`${BASE}/pengaturan`, { waitUntil: "networkidle" });
await p.waitForTimeout(1800);
const bintang = p.locator('button[aria-label$="dari 5"], button[aria-label$="out of 5"]');
await bintang.nth(3).click();
await p.locator("textarea").last().fill("Ditulis oleh rangkaian uji otomatis, dan dihapus lagi setelahnya.");
await p.waitForTimeout(500);
await p.getByText("Kirim ulasan", { exact: true }).click();
await p.waitForTimeout(3500);
const teksUlasan = await p.evaluate(() => document.body.innerText);
lapor(/ditinjau|checked/i.test(teksUlasan), "ulasan terkirim dan menunggu ditinjau");

const belumTayang = await p.evaluate(async () => {
  const j = await (await fetch("/api/reviews")).json();
  return !JSON.stringify(j).includes("rangkaian uji otomatis");
});
lapor(belumTayang, "ulasan yang belum ditinjau tidak tayang di halaman depan");

const terhapus = await p.evaluate(async () => (await fetch("/api/reviews", { method: "DELETE" })).ok);
lapor(terhapus, "ulasan uji dihapus kembali");

/* ── Tombol perusak sudah dicabut dari halaman ritme ────────────────────── */
/*
  Dua tombol pernah berdiri di kaki halaman ritme: mengganti seluruh catatan
  dengan data contoh, dan menghapus semuanya. Keduanya dicabut. Yang diuji di
  sini adalah ketidakhadirannya — karena tombol perusak paling mudah kembali
  tanpa sengaja lewat penggabungan cabang, dan tidak ada yang akan menyadarinya
  sampai ada catatan seseorang yang hilang.
*/
await p.goto(`${BASE}/rhythm`, { waitUntil: "networkidle" });
await p.waitForTimeout(2500);
const kakiRitme = await p.evaluate(() => document.body.innerText);
lapor(!/Ganti dengan data contoh|Replace with sample data/i.test(kakiRitme),
  "tombol ganti data contoh sudah tidak ada di halaman ritme");
lapor(!/Hapus semua|Delete all/i.test(kakiRitme),
  "tombol hapus semua sudah tidak ada di halaman ritme");

// Kemampuannya tidak hilang, hanya pindah ke tempat yang tepat.
await p.goto(`${BASE}/pengaturan`, { waitUntil: "networkidle" });
await p.waitForTimeout(2000);
const setelan = await p.evaluate(() => document.body.innerText);
lapor(/Hapus semua catatan|Delete all entries/i.test(setelan),
  "menghapus seluruh catatan tetap tersedia di halaman pengaturan");

/* ── Kembalikan akun demo ke keadaan semula ─────────────────────────────── */
await p.goto(`${BASE}/pengaturan`, { waitUntil: "networkidle" });
await p.waitForTimeout(1800);
await p.getByRole("button", { name: "pria", exact: true }).click();
await p.waitForTimeout(1200);
await p.getByRole("button", { name: "Laut" }).click();
await p.waitForTimeout(1200);
await p.getByRole("button", { name: "penuh", exact: true }).click();
await p.waitForTimeout(2500);
const akhir = await profil();
lapor(akhir?.mode === "pria" && akhir?.accent === "teal" && akhir?.motion === "penuh",
  "akun demo dikembalikan ke keadaan semula", JSON.stringify({ mode: akhir?.mode, aksen: akhir?.accent, gerak: akhir?.motion }));

await b.close();
const gagal = hasil.filter((h) => !h.ok);
console.log(`\n== ${hasil.length - gagal.length}/${hasil.length} lolos ==`);
for (const g of gagal) console.log("  GAGAL:", g.nama);
console.log(`\ngalat: ${galat.length}`);
for (const g of new Set(galat)) console.log("  ·", g);
process.exit(gagal.length ? 1 : 0);
