/**
 * Jalur terpenting, dijalankan di tiga mesin peramban.
 *
 * Kenapa ini perlu berdiri sendiri
 * --------------------------------
 * Semua rangkaian lain memakai Chromium, dan itu menyembunyikan justru jenis
 * bug yang paling mahal di produk ini. Tiga bagian Cadensa berperilaku berbeda
 * antar mesin, dan ketiganya menyangkut hal yang tidak boleh salah:
 *
 *   · `crypto.subtle` — seluruh brankas bergantung padanya. WebKit pernah
 *     berbeda dalam menerima `Uint8Array` sebagai `BufferSource`.
 *   · `sessionStorage` — tempat kunci sesi ditahan. Safari membuangnya lebih
 *     agresif, dan itu menentukan seberapa sering orang harus mengetik ulang
 *     kata sandinya.
 *   · seleksi teks dan uji-tumbukan tombol — persis yang membuat tombol masuk
 *     berhenti bekerja, dan tiap mesin menanganinya dengan caranya sendiri.
 *
 * Cakupannya sengaja sempit: masuk, brankas terbuka, catatan terbaca. Kalau
 * ketiganya jalan, sisanya adalah tata letak — yang gagal dengan cara yang
 * kelihatan, bukan diam-diam.
 */
import { chromium, firefox, webkit } from "playwright";
import { PRIA } from "./akun.mjs";

const BASE = process.env.BASE ?? "https://cadensa.vercel.app";
const hasil = [];
const lapor = (ok, nama, catatan = "") => {
  hasil.push({ ok, nama });
  console.log(`${ok ? "✓" : "✗"} ${nama}${catatan ? " · " + catatan : ""}`);
};

const MESIN = [
  ["Chromium", chromium],
  ["Firefox", firefox],
  ["WebKit", webkit],
];

for (const [nama, mesin] of MESIN) {
  let b;
  try {
    b = await mesin.launch();
  } catch (e) {
    lapor(false, `${nama}: peramban gagal dijalankan`, e.message.slice(0, 80));
    continue;
  }

  const galat = [];
  const ctx = await b.newContext();
  const p = await ctx.newPage();
  p.on("pageerror", (e) => galat.push(e.message));

  try {
    // Enkripsi tersedia sama sekali?
    await p.goto(`${BASE}/masuk`, { waitUntil: "networkidle" });
    const adaSubtle = await p.evaluate(() => !!(window.crypto && window.crypto.subtle));
    lapor(adaSubtle, `${nama}: crypto.subtle tersedia`);

    /*
      Diketik, bukan diisi lewat `fill`.

      `page.fill` menaruh nilainya langsung lalu melepas satu peristiwa
      `input`. Di WebKit peristiwa itu tidak selalu sampai ke penangan React,
      sehingga render berikutnya menimpanya kembali dengan keadaan lama — kolom
      tampak terisi sesaat lalu kosong sendiri. Akibatnya rangkaian ini pernah
      melaporkan "WebKit tidak bisa masuk" pada aplikasi yang sebenarnya baik.
      Mengetik menempuh jalan yang sama dengan jari orang sungguhan.
    */
    // Batas waktu dilonggarkan: Firefox di mesin ini kadang butuh lebih dari 30
    // detik hanya untuk menempatkan kursor, dan itu bukan sesuatu yang bisa
    // diperbaiki dari sisi aplikasi.
    const ketik = async (pemilih, teks) => {
      await p.click(pemilih, { timeout: 90000 });
      await p.keyboard.type(teks, { delay: 15 });
    };

    // Masuk penuh — menurunkan PBKDF2 210.000 putaran di peramban ini
    const mulai = Date.now();
    await ketik('input[autocomplete="username"]', PRIA.nama);
    await ketik('input[autocomplete="current-password"]', PRIA.sandi);
    await p.locator('button[type="submit"]').click();
    const masuk = await p
      .waitForURL("**/rhythm", { timeout: 60000 })
      .then(() => true)
      .catch(() => false);
    lapor(masuk, `${nama}: masuk berhasil`, `${Date.now() - mulai} ms`);

    if (masuk) {
      await p.waitForLoadState("networkidle");
      await p.waitForFunction(
        () => {
          const raw = localStorage.getItem("cadensa.vault.v2");
          return raw && (JSON.parse(raw).entries || []).length > 0;
        },
        undefined,
        { timeout: 30000 },
      ).catch(() => {});

      const n = await p.evaluate(() => {
        const raw = localStorage.getItem("cadensa.vault.v2");
        return raw ? (JSON.parse(raw).entries || []).length : 0;
      });
      lapor(n > 50, `${nama}: brankas terdekripsi dan terbaca`, `${n} catatan`);

      // Kunci sesi memang ditahan di sessionStorage, bukan localStorage
      const tempat = await p.evaluate(() => ({
        sesi: !!sessionStorage.getItem("cadensa.dek.session"),
        lokal: !!localStorage.getItem("cadensa.dek.session"),
      }));
      lapor(tempat.sesi && !tempat.lokal, `${nama}: kunci ditahan di sessionStorage saja`);

      // Tombol tidak boleh ikut terseleksi saat digeser
      const kotak = await p.locator('a[href="/log"]').first().boundingBox();
      if (kotak) {
        await p.mouse.move(kotak.x + 2, kotak.y + kotak.height / 2);
        await p.mouse.down();
        await p.mouse.move(kotak.x + kotak.width - 2, kotak.y + kotak.height / 2, { steps: 6 });
        await p.mouse.up();
        const sel = await p.evaluate(() => window.getSelection().toString());
        lapor(sel === "", `${nama}: label kendali tidak ikut terseleksi`, JSON.stringify(sel));
      }

      /*
        Ditunggu sampai isinya ada, bukan sampai jaringan sepi.

        `networkidle` menggantung di Firefox pada halaman ini: selalu ada
        sambungan yang tidak pernah benar-benar diam, dan tungguannya habis
        waktu pada halaman yang sudah lama tergambar penuh.
      */
      // Bacaan tergambar — memastikan mesin sinyal jalan di mesin ini juga
      // `commit` dan batas waktu yang lebih longgar: Firefox di mesin ini
      // kadang butuh lebih dari 30 detik hanya untuk menuntaskan navigasinya,
      // dan itu bukan sesuatu yang aplikasinya bisa perbaiki.
      await p.goto(`${BASE}/insights`, { waitUntil: "commit", timeout: 90000 });
      await p
        .waitForFunction(() => document.body.innerText.length > 600, undefined, { timeout: 25000 })
        .catch(() => {});
      const bacaan = await p.evaluate(() => document.body.innerText);
      lapor(bacaan.length > 600, `${nama}: halaman bacaan tergambar`, `${bacaan.length} char`);

      // Pengalih bahasa
      await p.locator('button[lang="en"]').click({ timeout: 60000 });
      await p.waitForTimeout(1200);
      const inggris = await p.evaluate(() => ({
        lang: document.documentElement.lang,
        teks: document.body.innerText.toLowerCase(),
      }));
      lapor(
        inggris.lang === "en" && inggris.teks.includes("computed on this device"),
        `${nama}: pengalih bahasa bekerja`,
      );
    }
  } catch (e) {
    lapor(false, `${nama}: rangkaian terhenti`, e.message.slice(0, 100));
  }

  lapor(galat.length === 0, `${nama}: tanpa galat halaman`, galat.length ? galat[0].slice(0, 80) : "");
  await b.close();
}

const gagal = hasil.filter((h) => !h.ok);
console.log(`\n== ${hasil.length - gagal.length}/${hasil.length} lolos ==`);
for (const g of gagal) console.log("  GAGAL:", g.nama);
process.exit(gagal.length ? 1 : 0);
