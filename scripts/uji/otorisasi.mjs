/**
 * Uji otorisasi di lapisan API, bukan lewat antarmuka.
 *
 * Antarmuka tidak pernah menawarkan tombol untuk membaca brankas orang lain,
 * jadi menguji lewat tombol tidak membuktikan apa pun. Yang perlu dipastikan
 * adalah apa yang terjadi ketika permintaan dibuat langsung — karena itulah
 * yang akan dilakukan orang yang berniat lain.
 */
import { chromium } from "playwright";
import { buka, konteks } from "./peramban.mjs";
import { PRIA } from "./akun.mjs";

const BASE = process.env.BASE ?? "https://cadensa.vercel.app";
const b = await chromium.launch();
const hasil = [];
const lapor = (ok, nama, catatan = "") => {
  hasil.push({ ok, nama });
  console.log(`${ok ? "✓" : "✗"} ${nama}${catatan ? " · " + catatan : ""}`);
};

const ctx = await konteks(b);
const p = await ctx.newPage();

// Permintaan harus berangkat dari asal yang sama; halaman kosong bawaan
// Playwright bukan bagian dari domain ini, jadi fetch-nya akan ditolak CORS.
await buka(p, `${BASE}/privacy`);

/* Tanpa sesi sama sekali */
const tanpaSesi = await p.evaluate(async (BASE) => {
  const out = {};
  for (const [nama, jalur, metode] of [
    ["vault-get", "/api/vault", "GET"],
    ["vault-put", "/api/vault", "PUT"],
    ["vault-del", "/api/vault", "DELETE"],
    ["me", "/api/auth/me", "GET"],
    ["review-put", "/api/reviews", "PUT"],
    ["tinjau", "/api/reviews/tinjau", "GET"],
  ]) {
    const r = await fetch(BASE + jalur, {
      method: metode,
      headers: { "content-type": "application/json" },
      body: metode === "GET" ? undefined : JSON.stringify({ ciphertext: "a.b", rating: 5, body: "x".repeat(30) }),
    });
    out[nama] = r.status;
  }
  return out;
}, BASE);
console.log("tanpa sesi:", JSON.stringify(tanpaSesi));
lapor(tanpaSesi["vault-get"] === 401, "brankas tidak bisa diambil tanpa masuk");
lapor(tanpaSesi["vault-put"] === 401, "brankas tidak bisa ditulis tanpa masuk");
lapor(tanpaSesi["vault-del"] === 401, "akun tidak bisa dihapus tanpa masuk");
lapor(tanpaSesi["review-put"] === 401, "ulasan tidak bisa ditulis tanpa masuk");
lapor(tanpaSesi["tinjau"] === 404, "panel peninjauan tidak menampakkan diri", `HTTP ${tanpaSesi["tinjau"]}`);

/* Salt tidak boleh membocorkan siapa yang terdaftar */
// Nama akun dioper masuk: fungsi ini dijalankan di dalam peramban, dan tidak
// punya akses ke apa pun yang hidup di sisi Node.
const salt = await p.evaluate(
  async ({ BASE, nama }) => {
    const a = await (await fetch(`${BASE}/api/auth/salt?ident=${nama}`)).json();
    const c = await (await fetch(`${BASE}/api/auth/salt?ident=tidakAdaOrangIni9182`)).json();
    const d = await (await fetch(`${BASE}/api/auth/salt?ident=tidakAdaOrangIni9182`)).json();
    return { ada: a.salt, tiada: c.salt, tiada2: d.salt };
  },
  { BASE, nama: PRIA.nama },
);
lapor(!!salt.tiada && salt.tiada.length === salt.ada.length, "salt akun tak dikenal sepanjang salt asli");
lapor(salt.tiada === salt.tiada2, "salt semu tetap sama tiap kali ditanya");
lapor(salt.tiada !== salt.ada, "salt semu berbeda dari salt asli");

/* Masuk sebagai akun A, lalu coba jangkau brankas akun B */
await buka(p, `${BASE}/masuk`);
await p.fill('input[autocomplete="username"]', PRIA.nama);
await p.fill('input[autocomplete="current-password"]', PRIA.sandi);
await p.locator('button[type="submit"]').click();
await p.waitForURL("**/rhythm", { timeout: 45000 });

const cookieA = (await ctx.cookies()).find((c) => c.name === "cadensa_sesi");
lapor(!!cookieA?.httpOnly, "cookie sesi httpOnly", `secure=${cookieA?.secure} sameSite=${cookieA?.sameSite}`);
const bisaBacaCookie = await p.evaluate(() => document.cookie.includes("cadensa_sesi"));
lapor(!bisaBacaCookie, "cookie sesi tidak terbaca JavaScript halaman");

/* Brankas milik sendiri terambil; tidak ada parameter untuk meminta milik orang lain */
const milikSendiri = await p.evaluate(async () => {
  const r = await fetch("/api/vault");
  const j = await r.json();
  return { status: r.status, panjang: (j.ciphertext || "").length };
});
lapor(milikSendiri.status === 200 && milikSendiri.panjang > 1000, "brankas sendiri terambil", `${milikSendiri.panjang} char`);

/* Cookie yang dirusak harus ditolak, bukan diterima sebagian */
const rusak = await ctx.cookies();
const asli = rusak.find((c) => c.name === "cadensa_sesi").value;
const potong = asli.slice(0, asli.lastIndexOf(".")) + ".xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
await ctx.clearCookies();
await ctx.addCookies([{ name: "cadensa_sesi", value: potong, domain: "cadensa.vercel.app", path: "/" }]);
const setelahRusak = await p.evaluate(async () => (await fetch("/api/vault")).status);
lapor(setelahRusak === 401, "tanda tangan cookie yang dipalsukan ditolak", `HTTP ${setelahRusak}`);

/* Id pengguna diganti, tanda tangan dibiarkan */
const [idBagian] = asli.split(".");
const tukar = asli.replace(idBagian, "00000000-0000-0000-0000-000000000000");
await ctx.clearCookies();
await ctx.addCookies([{ name: "cadensa_sesi", value: tukar, domain: "cadensa.vercel.app", path: "/" }]);
const setelahTukar = await p.evaluate(async () => (await fetch("/api/vault")).status);
lapor(setelahTukar === 401, "id pengguna yang ditukar ditolak", `HTTP ${setelahTukar}`);

/* Ulasan publik tidak boleh membocorkan email atau id */
const ulasan = await p.evaluate(async () => await (await fetch("/api/reviews")).json());
const bocor = JSON.stringify(ulasan).match(/@|user_id|ulasan-luar/g);
lapor(!bocor, "endpoint ulasan publik tidak membocorkan email atau id", `${ulasan.reviews.length} ulasan, rata-rata ${ulasan.average}`);

await b.close();
const gagal = hasil.filter((h) => !h.ok);
console.log(`\n== ${hasil.length - gagal.length}/${hasil.length} lolos ==`);
for (const g of gagal) console.log("  GAGAL:", g.nama);
