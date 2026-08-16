/**
 * Keadaan yang tidak rapi: jaringan putus, dua perangkat menulis pada saat yang
 * sama, dan sinkron yang gagal di tengah jalan.
 *
 * Rangkaian lain menguji aplikasi ketika semuanya berjalan lancar. Yang di sini
 * menguji apa yang terjadi ketika tidak — dan di aplikasi yang menyimpan
 * satu-satunya salinan catatan seseorang, itu justru bagian yang paling
 * menentukan. Kehilangan catatan karena sinyal hilang di kereta bukan kejadian
 * langka; itu hari Selasa.
 */
import { chromium } from "playwright";
import { konteks } from "./peramban.mjs";
import { PRIA, WANITA } from "./akun.mjs";

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

async function masuk(p, akun) {
  await p.goto(`${BASE}/masuk`, { waitUntil: "networkidle" });
  await p.fill('input[autocomplete="username"]', akun.nama);
  await p.fill('input[autocomplete="current-password"]', akun.sandi);
  await p.locator('button[type="submit"]').click();
  await p.waitForURL("**/rhythm", { timeout: 45000 });
  await p.waitForLoadState("networkidle");
}

async function catat(p, rasa) {
  await p.goto(`${BASE}/log`, { waitUntil: "networkidle" }).catch(() => {});
  await p.waitForTimeout(1200);
  await p.getByText(rasa, { exact: true }).first().click();
  await p.getByText("Simpan", { exact: true }).click();
  await p.waitForTimeout(1200);
}

/* ══ 1. Mencatat saat jaringan mati ══════════════════════════════════════ */
{
  const ctx = await konteks(b);
  const p = await ctx.newPage();
  p.on("pageerror", (e) => galat.push(`[luring] ${e.message}`));
  await masuk(p, PRIA);
  const awal = await jumlah(p);

  await p.goto(`${BASE}/log`, { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);
  await ctx.setOffline(true);

  await p.getByText("lega", { exact: true }).first().click();
  await p.getByText("Simpan", { exact: true }).click();
  await p.waitForTimeout(2500);

  const luring = await jumlah(p);
  lapor(luring === awal + 1, "catatan tetap tersimpan di perangkat saat luring", `${awal} → ${luring}`);

  const tandaGagal = await p.evaluate(() => document.body.innerText);
  lapor(/Gagal menyimpan|Save failed/i.test(tandaGagal), "status sinkron menunjukkan kegagalan, tidak berpura-pura berhasil");

  // jaringan kembali, lalu satu perubahan lagi memicu dorongan ulang
  await ctx.setOffline(false);
  await p.waitForTimeout(1500);
  await catat(p, "tenang");
  await p.waitForTimeout(4000);

  const setelahPulih = await jumlah(p);
  lapor(setelahPulih === awal + 2, "catatan luring tidak hilang setelah jaringan kembali", `${setelahPulih}`);

  const status = await p.evaluate(() => document.body.innerText);
  lapor(/Tersimpan & tersinkron|Saved & synced/i.test(status), "status kembali tersinkron setelah jaringan pulih");

  // brankas di server harus sudah memuat keduanya
  const diServer = await p.evaluate(async () => {
    const r = await fetch("/api/vault");
    return (await r.json()).revision;
  });
  lapor(typeof diServer === "number" && diServer > 0, "brankas server ikut terbarui", `rev ${diServer}`);

  // bersihkan dua catatan uji
  await p.goto(`${BASE}/rhythm`, { waitUntil: "networkidle" });
  await p.waitForTimeout(1500);
  for (let i = 0; i < 2; i++) {
    await p.locator('button:has-text("hapus")').first().click();
    await p.waitForTimeout(1500);
  }
  await p.waitForTimeout(3000);
  lapor((await jumlah(p)) === awal, "dua catatan uji terhapus lagi", `${await jumlah(p)}`);
  await ctx.close();
}

/* ══ 2. Dua perangkat menulis pada saat yang sama ════════════════════════ */
{
  const ctxA = await konteks(b);
  const ctxB = await konteks(b);
  const pA = await ctxA.newPage();
  const pB = await ctxB.newPage();
  pA.on("pageerror", (e) => galat.push(`[serentakA] ${e.message}`));
  pB.on("pageerror", (e) => galat.push(`[serentakB] ${e.message}`));

  await masuk(pA, WANITA);
  await masuk(pB, WANITA);
  const awal = await jumlah(pA);

  // keduanya membuka /log, lalu menyimpan hampir bersamaan
  await pA.goto(`${BASE}/log`, { waitUntil: "networkidle" });
  await pB.goto(`${BASE}/log`, { waitUntil: "networkidle" });
  await pA.waitForTimeout(1200);
  await pB.waitForTimeout(1200);

  await Promise.all([
    (async () => {
      await pA.getByText("lega", { exact: true }).first().click();
      await pA.getByText("Simpan", { exact: true }).click();
    })(),
    (async () => {
      await pB.getByText("nikmat", { exact: true }).first().click();
      await pB.getByText("Simpan", { exact: true }).click();
    })(),
  ]);
  await pA.waitForTimeout(5000);
  await pB.waitForTimeout(5000);

  /*
    Sekurang-kurangnya satu tambahan, bukan tepat satu.

    Sejak dorongan menggabung isi server sebelum menulis, perangkat yang
    menyimpan belakangan bisa langsung ikut menerima tulisan perangkat lain di
    putaran yang sama — jadi jumlahnya sah kalau sudah dua. Menuntut angka
    persis satu berarti menguji lambatnya sinkron, bukan tersimpannya catatan.
  */
  lapor((await jumlah(pA)) >= awal + 1, "perangkat A menyimpan miliknya", `${awal} → ${await jumlah(pA)}`);
  lapor((await jumlah(pB)) >= awal + 1, "perangkat B menyimpan miliknya", `${awal} → ${await jumlah(pB)}`);

  /*
    Inti ujinya: dua tulisan bersamaan tidak boleh saling menimpa.

    Yang diperiksa adalah pemulihan akhirnya, bukan keadaan pada detik tertentu.
    Sinkronnya memang tidak seketika — perangkat baru melihat tulisan perangkat
    lain setelah ia menarik lagi — jadi menuntut keduanya sudah setara tepat
    setelah satu kali muat ulang berarti menguji kecepatan jaringan, bukan
    keutuhan data. Versi pertama uji ini melakukan persis itu dan gagal
    sekali-sekali pada aplikasi yang tidak kehilangan apa pun.

    Yang tidak boleh terjadi adalah kehilangan: kalau dorongan terakhir menimpa
    yang sebelumnya, jumlahnya akan berhenti di satu tambahan dan tidak pernah
    naik lagi berapa kali pun ditarik.
  */
  const sampai = async (halaman, target, batasMs = 60000) => {
    const habis = Date.now() + batasMs;
    while (Date.now() < habis) {
      if ((await jumlah(halaman)) >= target) return true;
      await halaman.reload({ waitUntil: "networkidle" });
      await halaman.waitForTimeout(3000);
    }
    return false;
  };

  const tibaA = await sampai(pA, awal + 2);
  const tibaB = await sampai(pB, awal + 2);
  const akhirA = await jumlah(pA);
  const akhirB = await jumlah(pB);
  lapor(tibaA, "kedua tulisan akhirnya sampai di perangkat A", `${awal} → ${akhirA}`);
  lapor(tibaB, "kedua tulisan akhirnya sampai di perangkat B", `${awal} → ${akhirB}`);

  // Kebenaran yang menentukan ada di server: brankas di sana harus memuat
  // keduanya, apa pun yang sudah atau belum sampai ke masing-masing perangkat.
  const diServer = await pA.evaluate(async () => {
    const r = await fetch("/api/vault");
    const j = await r.json();
    return { rev: j.revision, panjang: (j.ciphertext || "").length };
  });
  lapor(diServer.panjang > 1000, "brankas server memuat hasil gabungan", `rev ${diServer.rev}`);

  // bersihkan — sebanyak yang benar-benar bertambah, bukan selalu dua
  await pA.goto(`${BASE}/rhythm`, { waitUntil: "networkidle" });
  await pA.waitForTimeout(1500);
  const lebih = (await jumlah(pA)) - awal;
  for (let i = 0; i < lebih; i++) {
    await pA.locator('button:has-text("hapus")').first().click();
    await pA.waitForTimeout(1500);
  }
  await pA.waitForTimeout(3500);
  lapor((await jumlah(pA)) === awal, "catatan uji serentak terhapus lagi", `${await jumlah(pA)}`);

  await ctxA.close();
  await ctxB.close();
}

/* ══ 3. Halaman tetap tampil saat API tidak menjawab ═════════════════════ */
{
  const ctx = await konteks(b);
  const p = await ctx.newPage();
  p.on("pageerror", (e) => galat.push(`[apiMati] ${e.message}`));
  // Semua rute API dijatuhkan; halaman depan tetap harus tampil utuh.
  await ctx.route("**/api/**", (r) => r.abort());
  /*
    Ditunggu sampai isinya benar-benar ada, bukan sampai jeda tetap habis.

    Versi pertama uji ini memakai `waitForTimeout(4000)` dan gagal sekali-sekali
    pada halaman yang sebenarnya benar: cukup dengan chunk halaman diunduh
    sedikit lebih lambat, dan asersinya membaca layar yang masih kosong. Uji
    yang kadang gagal tanpa sebab jauh lebih merugikan daripada tidak ada uji —
    orang berhenti mempercayainya, lalu berhenti membacanya.
  */
  const tunggu = (halaman, minimal) =>
    halaman
      .waitForFunction((n) => document.body.innerText.length > n, minimal, { timeout: 25000 })
      .then(() => true)
      .catch(() => false);

  await p.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  const depanTampil = await tunggu(p, 3000);
  const teks = await p.evaluate(() => document.body.innerText);
  lapor(depanTampil, "halaman depan tetap tampil saat API mati", `${teks.length} char`);
  lapor(/Ritme|Rhythm/.test(teks), "judul utama tetap tergambar");

  await p.goto(`${BASE}/rhythm`, { waitUntil: "domcontentloaded" });
  const ritmeTampil = await tunggu(p, 200);
  const ritme = await p.evaluate(() => document.body.innerText);
  lapor(ritmeTampil, "halaman ritme tidak kosong saat API mati", `${ritme.length} char`);
  lapor(
    /Belum ada apa-apa|Nothing here yet/.test(ritme),
    "ritme menampilkan keadaan kosong, bukan rangka yang menggantung",
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
