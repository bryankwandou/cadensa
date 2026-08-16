/**
 * Audit aksesibilitas.
 *
 * Memakai axe-core, mesin yang sama dengan yang dipakai pemeriksa aksesibilitas
 * profesional — bukan pemeriksaan buatan sendiri. Itu disengaja: hasil dari
 * mesin yang dikenal luas bisa diperiksa ulang oleh orang lain dengan alat yang
 * sama, sedangkan daftar buatan sendiri hanya sekuat orang yang menyusunnya.
 *
 * Yang dicari di sini adalah kerusakan yang tidak pernah terlihat oleh siapa pun
 * yang mengujinya dengan mata dan tetikus:
 *
 *   · kontras warna yang terlalu tipis untuk mata yang menua, atau untuk layar
 *     ponsel di bawah matahari
 *   · kendali yang tidak bisa dijangkau papan ketik sama sekali
 *   · tombol yang hanya berisi ikon, tanpa nama yang bisa dibacakan
 *   · kolom isian tanpa label yang terhubung
 *   · penanda fokus yang tidak kelihatan, sehingga orang yang menekan Tab tidak
 *     tahu ia sedang berada di mana
 *
 * Aplikasi ini menyimpan catatan yang paling pribadi. Orang yang memakai pembaca
 * layar berhak mencatatnya sendiri, tanpa meminta tolong siapa pun membacakan
 * layarnya.
 *
 * Pelanggaran tingkat `serious` dan `critical` dianggap gagal. Yang `minor` dan
 * `moderate` dicetak sebagai catatan, karena sebagian di antaranya keputusan
 * rasa yang tidak selalu punya jawaban tunggal.
 */
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { buka, konteks } from "./peramban.mjs";

const BASE = process.env.BASE ?? "https://cadensa.vercel.app";
const b = await chromium.launch();
const hasil = [];
const catatan = [];
const lapor = (ok, nama, ket = "") => {
  hasil.push({ ok, nama });
  console.log(`${ok ? "✓" : "✗"} ${nama}${ket ? " · " + ket : ""}`);
};

const HALAMAN = ["/", "/masuk", "/privacy"];

/* ══ 1. axe-core pada halaman publik ═════════════════════════════════════ */
{
  const ctx = await konteks(b, { viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();

  for (const rute of HALAMAN) {
    await buka(p, BASE + rute);
    await p.waitForTimeout(2500);

    const { violations } = await new AxeBuilder({ page: p })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const berat = violations.filter((v) => ["serious", "critical"].includes(v.impact));
    const ringan = violations.filter((v) => !["serious", "critical"].includes(v.impact));

    lapor(
      berat.length === 0,
      `${rute}: tanpa pelanggaran serius`,
      berat.length ? berat.map((v) => `${v.id} (${v.nodes.length})`).join(", ") : "0 serius",
    );

    for (const v of berat) {
      console.log(`     ✗ ${v.id} [${v.impact}] ${v.help}`);
      for (const n of v.nodes.slice(0, 3)) console.log(`        ${n.html.slice(0, 110)}`);
    }
    for (const v of ringan) catatan.push(`${rute}: ${v.id} [${v.impact}] ${v.nodes.length} elemen`);
  }

  await ctx.close();
}

/* ══ 2. axe-core pada halaman di dalam brankas ═══════════════════════════ */
{
  const { PRIA } = await import("./akun.mjs");
  const ctx = await konteks(b, { viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();

  await buka(p, `${BASE}/masuk`);
  await p.fill('input[autocomplete="username"]', PRIA.nama);
  await p.fill('input[autocomplete="current-password"]', PRIA.sandi);
  await p.locator('button[type="submit"]').click();
  await p.waitForURL("**/rhythm", { timeout: 60000 });
  await p.waitForTimeout(3000);

  for (const rute of ["/rhythm", "/log", "/insights", "/pengaturan"]) {
    await buka(p, BASE + rute);
    await p.waitForTimeout(3000);

    const { violations } = await new AxeBuilder({ page: p })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const berat = violations.filter((v) => ["serious", "critical"].includes(v.impact));
    lapor(
      berat.length === 0,
      `${rute}: tanpa pelanggaran serius`,
      berat.length ? berat.map((v) => `${v.id} (${v.nodes.length})`).join(", ") : "0 serius",
    );
    for (const v of berat) {
      console.log(`     ✗ ${v.id} [${v.impact}] ${v.help}`);
      for (const n of v.nodes.slice(0, 3)) console.log(`        ${n.html.slice(0, 110)}`);
    }
    for (const v of violations.filter((x) => !["serious", "critical"].includes(x.impact)))
      catatan.push(`${rute}: ${v.id} [${v.impact}] ${v.nodes.length} elemen`);
  }

  await ctx.close();
}

/* ══ 3. Mencatat sepenuhnya dengan papan ketik ═══════════════════════════ */
{
  const { PRIA } = await import("./akun.mjs");
  const ctx = await konteks(b, { viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();

  /*
    Masuk tanpa menyentuh tetikus sama sekali.

    Ini bukan sekadar memeriksa atribut. Orang yang memakai pembaca layar atau
    tidak bisa memakai tetikus harus bisa membuka brankasnya sendiri; kalau
    langkah ini gagal, seluruh aplikasi tertutup baginya, dan tidak ada satu pun
    pemeriksaan otomatis lain yang akan menangkapnya.
  */
  await buka(p, `${BASE}/masuk`);
  await p.waitForTimeout(1500);
  await p.keyboard.press("Tab");

  let sampai = false;
  for (let i = 0; i < 25 && !sampai; i++) {
    const fokus = await p.evaluate(() => {
      const el = document.activeElement;
      return { tag: el?.tagName, auto: el?.getAttribute?.("autocomplete") };
    });
    if (fokus.tag === "INPUT" && fokus.auto === "username") sampai = true;
    else await p.keyboard.press("Tab");
  }
  lapor(sampai, "kolom nama pengguna terjangkau papan ketik");

  if (sampai) {
    await p.keyboard.type(PRIA.nama, { delay: 10 });
    await p.keyboard.press("Tab");
    await p.keyboard.type(PRIA.sandi, { delay: 10 });
    await p.keyboard.press("Enter");
    const masuk = await p
      .waitForURL("**/rhythm", { timeout: 60000 })
      .then(() => true)
      .catch(() => false);
    lapor(masuk, "masuk selesai tanpa menyentuh tetikus");
  }

  /* Penanda fokus harus benar-benar terlihat, bukan sekadar ada */
  await buka(p, `${BASE}/log`);
  await p.waitForTimeout(2500);
  const fokusTerlihat = await p.evaluate(() => {
    const kendali = [...document.querySelectorAll("button, a[href], input, textarea")].filter(
      (el) => el.offsetParent !== null,
    );
    let diperiksa = 0;
    let tanpaTanda = 0;
    for (const el of kendali.slice(0, 30)) {
      el.focus();
      const cs = getComputedStyle(el);
      const adaOutline = cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0;
      const adaBayangan = cs.boxShadow !== "none";
      const adaTepi = parseFloat(cs.borderWidth) > 0;
      diperiksa++;
      if (!adaOutline && !adaBayangan && !adaTepi) tanpaTanda++;
    }
    return { diperiksa, tanpaTanda };
  });
  lapor(
    fokusTerlihat.tanpaTanda === 0,
    "setiap kendali menampakkan tanda saat difokuskan",
    `${fokusTerlihat.diperiksa} kendali diperiksa, ${fokusTerlihat.tanpaTanda} tanpa tanda`,
  );

  /* Tombol berikon harus punya nama yang bisa dibacakan */
  const tanpaNama = await p.evaluate(() => {
    const kurang = [];
    for (const el of document.querySelectorAll("button, a[href]")) {
      if (el.offsetParent === null) continue;
      const teks = (el.innerText || "").trim();
      const label = el.getAttribute("aria-label") || el.getAttribute("title");
      if (!teks && !label) kurang.push(el.outerHTML.slice(0, 90));
    }
    return kurang;
  });
  lapor(tanpaNama.length === 0, "tidak ada kendali tanpa nama yang bisa dibacakan", tanpaNama[0] ?? "");

  await ctx.close();
}

await b.close();

if (catatan.length) {
  console.log(`\ncatatan ringan (${catatan.length}), tidak dihitung gagal:`);
  for (const c of [...new Set(catatan)]) console.log(`  · ${c}`);
}

const gagal = hasil.filter((h) => !h.ok);
console.log(`\n== ${hasil.length - gagal.length}/${hasil.length} lolos ==`);
for (const g of gagal) console.log("  GAGAL:", g.nama);
process.exit(gagal.length ? 1 : 0);
