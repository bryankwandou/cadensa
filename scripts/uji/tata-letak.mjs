/**
 * Tata letak di berbagai lebar layar.
 *
 * Rangkaian lain memeriksa apakah aplikasinya bekerja. Yang di sini memeriksa
 * apakah ia terlihat benar — dan itu jenis kerusakan yang tidak pernah muncul
 * sebagai galat di konsol.
 *
 * Tiga hal yang diperiksa semuanya pernah rusak sekaligus oleh satu baris CSS,
 * dan tidak satu pun sempat terlihat oleh pemeriksaan tipe, build, maupun
 * rangkaian uji lain:
 *
 *   · `.aurora > * { position: relative }` ditulis di luar `@layer`, sedangkan
 *     kelas Tailwind hidup di dalam `@layer utilities`. CSS tanpa lapisan
 *     mengalahkan CSS berlapis tanpa peduli spesifisitas, jadi setiap `fixed`
 *     dan `sticky` pada anak langsung `.aurora` dibatalkan diam-diam.
 *   · Akibatnya bilah navigasi berhenti menempel saat digulir.
 *   · Dan penanda bagian tergambar sebagai blok selebar layar di luar tepi
 *     atas, sekaligus mendorong halaman meluber ke samping.
 */
import { chromium, devices } from "playwright";
import { buka, konteks } from "./peramban.mjs";

const BASE = process.env.BASE ?? "https://cadensa.vercel.app";
const b = await chromium.launch();
const hasil = [];
const galat = [];
const lapor = (ok, nama, catatan = "") => {
  hasil.push({ ok, nama });
  console.log(`${ok ? "✓" : "✗"} ${nama}${catatan ? " · " + catatan : ""}`);
};

const LEBAR = [
  ["ponsel 390", { width: 390, height: 844 }],
  ["tablet 768", { width: 768, height: 1024 }],
  ["laptop 1280", { width: 1280, height: 800 }],
  ["desktop 1920", { width: 1920, height: 900 }],
  ["lebar 2560", { width: 2560, height: 1440 }],
];

const HALAMAN = ["/", "/masuk", "/privacy"];

for (const [nama, viewport] of LEBAR) {
  const ctx = await konteks(b, { viewport });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => galat.push(`[${nama}] ${e.message}`));

  for (const rute of HALAMAN) {
    await buka(p, BASE + rute);
    await p.waitForTimeout(2000);
    const meluber = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    lapor(meluber <= 0, `${nama} ${rute}: tidak meluber ke samping`, `${meluber}px`);
  }

  // Bilah navigasi harus tetap di tepi atas setelah digulir jauh
  await buka(p, `${BASE}/`);
  await p.waitForTimeout(1500);
  const posisi = await p.evaluate(() => getComputedStyle(document.querySelector("header")).position);
  await p.evaluate(() => window.scrollTo(0, 4000));
  await p.waitForTimeout(900);
  const y = await p.evaluate(() => Math.round(document.querySelector("header").getBoundingClientRect().y));
  lapor(posisi === "sticky" && y === 0, `${nama}: bilah navigasi tetap menempel setelah digulir`, `position ${posisi}, y ${y}`);

  /*
    Penanda bagian hanya muncul di layar yang benar-benar lapang. Di mana pun ia
    muncul, ia harus berupa kolom sempit di tepi kiri — bukan blok selebar layar,
    yang justru gejala `position` yang gagal berlaku.
  */
  const idx = await p.evaluate(() => {
    const nav = document.querySelector('nav[aria-label="Bagian halaman"]');
    if (!nav) return null;
    const cs = getComputedStyle(nav);
    const r = nav.getBoundingClientRect();
    return { display: cs.display, position: cs.position, x: Math.round(r.x), lebar: Math.round(r.width) };
  });
  if (idx && idx.display !== "none") {
    lapor(idx.position === "fixed", `${nama}: penanda bagian benar-benar menempel`, `position ${idx.position}`);
    lapor(idx.lebar > 0 && idx.lebar < 200, `${nama}: penanda bagian berupa kolom sempit`, `lebar ${idx.lebar}px, x ${idx.x}`);
  } else {
    lapor(true, `${nama}: penanda bagian sengaja disembunyikan di lebar ini`);
  }

  await ctx.close();
}

/* Bulan lampau: satu kartu tidak boleh memuat dua rentang waktu */
{
  const ctx = await konteks(b, { viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => galat.push(`[bulan lampau] ${e.message}`));

  const { PRIA } = await import("./akun.mjs");
  await buka(p, `${BASE}/masuk`);
  await p.fill('input[autocomplete="username"]', PRIA.nama);
  await p.fill('input[autocomplete="current-password"]', PRIA.sandi);
  await p.locator('button[type="submit"]').click();
  await p.waitForURL("**/rhythm", { timeout: 45000 });
  await p.waitForTimeout(2500);

  /*
    Indeks kadens dulu selalu dihitung dari tiga puluh hari terakhir sejak hari
    ini, apa pun bulan yang sedang dibuka — sementara judul dan jumlah catatan
    mengikuti bulan itu. Hasilnya "Juni 2026 · 28 catatan" bersebelahan dengan
    indeks 0 yang berasal dari rentang yang sama sekali lain.

    Yang diuji: dengan catatan sebanyak itu tersebar di dalam bulannya, indeksnya
    tidak mungkin nol. Nol di sini berarti jendelanya salah lagi.
  */
  const baca = () =>
    p.evaluate(() => {
      const teks = document.body.innerText;
      const jumlah = teks.match(/(\d+)\s+catatan/i);
      const cincin = document.querySelector(".num.text-\\[2\\.6rem\\]");
      return {
        jumlah: jumlah ? Number(jumlah[1]) : null,
        indeks: cincin ? cincin.textContent.trim() : null,
      };
    });

  // mundur sampai menemukan bulan yang isinya banyak
  let lampau = null;
  for (let i = 0; i < 6; i++) {
    await p.getByText("Sebelumnya", { exact: true }).click();
    await p.waitForTimeout(1800);
    const d = await baca();
    if (d.jumlah && d.jumlah >= 10) {
      lampau = d;
      break;
    }
  }

  if (lampau) {
    const n = Number(lampau.indeks);
    lapor(
      Number.isFinite(n) && n > 0,
      "indeks kadens bulan lampau dihitung dari bulan itu, bukan dari hari ini",
      `${lampau.jumlah} catatan, indeks ${lampau.indeks}`,
    );
  } else {
    lapor(false, "tidak menemukan bulan lampau berisi cukup catatan untuk diuji");
  }
  await ctx.close();
}

/* Ponsel sungguhan, bukan hanya lebar jendela yang dikecilkan */
{
  const ctx = await konteks(b, { ...devices["iPhone 13"] });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => galat.push(`[iPhone] ${e.message}`));
  await buka(p, `${BASE}/`);
  await p.waitForTimeout(2500);
  const meluber = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  lapor(meluber <= 0, "iPhone 13: tidak meluber ke samping", `${meluber}px`);

  // Butir latar harus tetap tergambar — perbaikan tumpukan tidak boleh menghapusnya
  const adaButir = await p.evaluate(() => {
    const el = document.querySelector(".aurora");
    const cs = getComputedStyle(el, "::before");
    return { z: cs.zIndex, gambar: cs.backgroundImage.slice(0, 30), opasitas: cs.opacity };
  });
  lapor(adaButir.gambar.startsWith("url(") && adaButir.z === "-1",
    "lapisan butir tetap ada, dan berada di belakang isi", JSON.stringify(adaButir));
  await ctx.close();
}

await b.close();
const gagal = hasil.filter((h) => !h.ok);
console.log(`\n== ${hasil.length - gagal.length}/${hasil.length} lolos ==`);
for (const g of gagal) console.log("  GAGAL:", g.nama);
console.log(`\ngalat: ${galat.length}`);
for (const g of new Set(galat)) console.log("  ·", g);
process.exit(gagal.length ? 1 : 0);
