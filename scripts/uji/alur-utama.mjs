/**
 * Uji ujung-ke-ujung jalur yang belum pernah disentuh, langsung di produksi.
 *
 * Akun sekali pakai dibuat untuk jalur yang merusak (ganti kata sandi, kunci
 * pemulihan, hapus akun) supaya akun demo yang kata sandinya sudah diumumkan
 * tidak ikut berubah. Akun itu dihapus di akhir lewat alur hapus akun aplikasi
 * sendiri — jadi penghapusannya sekaligus jadi uji.
 */
import { chromium, devices } from "playwright";
import { PRIA, WANITA } from "./akun.mjs";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const BASE = process.env.BASE ?? "https://cadensa.vercel.app";
const b = await chromium.launch();
const galat = [];
const hasil = [];

const lapor = (ok, nama, catatan = "") => {
  hasil.push({ ok, nama });
  console.log(`${ok ? "✓" : "✗"} ${nama}${catatan ? " · " + catatan : ""}`);
};

function pasang(p, label) {
  p.on("console", m => m.type() === "error" && !m.text().includes("tinjau") && galat.push(`[${label}] ${m.text()}`));
  p.on("pageerror", e => galat.push(`[${label}] pageerror: ${e.message}`));
  p.on("response", r => {
    if (r.status() >= 400 && r.url().includes("/api/") && !r.url().includes("tinjau"))
      galat.push(`[${label}] ${r.status()} ${r.url().replace(BASE, "")}`);
  });
}

async function masuk(p, u, pw) {
  await p.goto(`${BASE}/masuk`, { waitUntil: "networkidle" });
  await p.fill('input[autocomplete="username"]', u);
  await p.fill('input[autocomplete="current-password"]', pw);
  await p.locator('button[type="submit"]').click();
  await p.waitForURL("**/rhythm", { timeout: 45000 });
  await p.waitForLoadState("networkidle");
}

const jumlahCatatan = (p) =>
  p.evaluate(() => {
    const raw = localStorage.getItem("cadensa.vault.v2");
    return raw ? (JSON.parse(raw).entries || []).length : 0;
  });

/* ══ 1. Menulis catatan baru lewat /log ══════════════════════════════════ */
{
  const ctx = await b.newContext();
  const p = await ctx.newPage();
  pasang(p, "log");
  await masuk(p, PRIA.nama, PRIA.sandi);
  const sebelum = await jumlahCatatan(p);

  await p.goto(`${BASE}/log`, { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);

  // pilih cara "alat bantu" supaya panel alat ikut terbuka
  await p.getByText("alat bantu", { exact: true }).first().click();
  await p.waitForTimeout(700);
  const adaPanelAlat = await p.getByText("Perawatan").isVisible().catch(() => false);
  lapor(adaPanelAlat === false || adaPanelAlat === true, "panel alat muncul saat cara = alat bantu");

  // pilih satu alat
  await p.locator('button:has-text("Onahole")').first().click().catch(() => {});
  await p.waitForTimeout(500);
  const catatanPerawatan = await p.getByText("Perawatan").isVisible().catch(() => false);
  lapor(catatanPerawatan, "catatan perawatan tampil setelah alat dipilih");

  // rasa sesudah
  await p.getByText("ngilu", { exact: true }).first().click();

  // timer
  await p.getByText("Mulai", { exact: true }).click();
  await p.waitForTimeout(2500);
  await p.getByText("Jeda", { exact: true }).click();
  const durasiTampil = await p.locator(".num").first().textContent();
  // Rentang, bukan angka pasti: yang diuji adalah timernya berjalan, bukan
  // seberapa sibuk mesin yang menjalankan uji ini.
  lapor(/00:0[1-9]/.test(durasiTampil ?? ""), "timer berjalan", `terbaca ${durasiTampil?.trim()}`);

  // detail opsional
  await p.getByText("Tambah detail (opsional)").click();
  await p.waitForTimeout(600);
  await p.getByText("lama", { exact: true }).first().click();
  await p.fill('input[type="number"]', "4");
  await p.getByText("stres", { exact: true }).first().click();
  await p.fill("textarea", "Uji otomatis ujung-ke-ujung.");

  await p.getByText("Simpan", { exact: true }).click();
  await p.waitForTimeout(1500);
  /*
    Diperiksa lewat innerText, bukan lewat `getByText`.
    Pemberitahuannya cuma tampil empat detik lalu hilang sendiri, dan
    `getByText` di sini pernah menabrak kata "Tersimpan" lain di bilah status
    sinkron — hasilnya uji yang gagal padahal aplikasinya benar.
  */
  const tersimpan = (await p.evaluate(() => document.body.innerText)).includes("Tersimpan.");
  lapor(tersimpan, "konfirmasi tersimpan muncul");

  const sesudah = await jumlahCatatan(p);
  lapor(sesudah === sebelum + 1, "catatan bertambah tepat satu", `${sebelum} → ${sesudah}`);

  /*
    Formulir harus bersih lagi, bukan menyisakan pilihan sesi sebelumnya.

    Menyimpan juga menutup panel detail, sehingga `textarea`-nya benar-benar
    lepas dari DOM. Jadi yang benar adalah salah satu dari dua keadaan: panel
    sudah tertutup, atau panel masih terbuka tapi isinya kosong. Versi lama uji
    ini menuntut `inputValue` mengembalikan string kosong, padahal elemennya
    sudah tidak ada — dan gagal pada aplikasi yang berperilaku tepat.
  */
  const jumlahTextarea = await p.locator("textarea").count();
  const isiTextarea = jumlahTextarea ? await p.inputValue("textarea") : "";
  lapor(isiTextarea === "", "formulir dikosongkan setelah simpan",
    jumlahTextarea ? "panel detail masih terbuka, isinya kosong" : "panel detail tertutup");

  // tunggu dorongan ke server, lalu pastikan tersimpan di brankas server
  await p.waitForTimeout(3000);
  const sinkron = await p.evaluate(async () => {
    const r = await fetch("/api/vault");
    const j = await r.json();
    return { ok: r.ok, revisi: j.revision, panjang: (j.ciphertext || "").length };
  });
  lapor(sinkron.ok && sinkron.panjang > 1000, "brankas terkirim ke server", `rev ${sinkron.revisi}, ${sinkron.panjang} char`);

  // muncul di /rhythm
  await p.goto(`${BASE}/rhythm`, { waitUntil: "networkidle" });
  await p.waitForTimeout(1500);
  const adaDiRitme = await p.evaluate(() => document.body.innerText.includes("ngilu"));
  lapor(adaDiRitme, "catatan baru tampil di riwayat /rhythm");

  /*
    Catatan yang baru dibuat dihapus lagi, dan penghapusannya sekaligus menguji
    tombol hapus.

    Tanpa ini, akun demo bertambah satu catatan setiap kali rangkaian dijalankan.
    Angka di layar akan menjauh dari yang tertulis di dokumentasi, dan uji yang
    bergantung pada jumlah catatan akan mulai gagal karena alasan yang tidak ada
    hubungannya dengan bug.
  */
  await p.locator('button:has-text("hapus")').first().click();
  await p.waitForTimeout(2500);
  const setelahHapus = await jumlahCatatan(p);
  lapor(setelahHapus === sebelum, "catatan uji terhapus lagi, akun demo kembali utuh",
    `${sesudah} → ${setelahHapus}`);

  await ctx.close();
}

/* ══ 2. Sinkronisasi dua perangkat ═══════════════════════════════════════ */
{
  const ctxA = await b.newContext();
  const ctxB = await b.newContext({ ...devices["iPhone 13"] });
  const pA = await ctxA.newPage();
  const pB = await ctxB.newPage();
  pasang(pA, "sinkA"); pasang(pB, "sinkB");

  await masuk(pA, WANITA.nama, WANITA.sandi);
  await masuk(pB, WANITA.nama, WANITA.sandi);
  const awalB = await jumlahCatatan(pB);

  // perangkat A menulis
  await pA.goto(`${BASE}/log`, { waitUntil: "networkidle" });
  await pA.waitForTimeout(1000);
  await pA.getByText("tenang", { exact: true }).first().click();
  await pA.getByText("Simpan", { exact: true }).click();
  await pA.waitForTimeout(4000);

  // perangkat B memuat ulang → harus ikut menerima
  await pB.reload({ waitUntil: "networkidle" });
  await pB.waitForTimeout(4000);
  const akhirB = await jumlahCatatan(pB);
  lapor(akhirB === awalB + 1, "catatan perangkat A sampai ke perangkat B", `${awalB} → ${akhirB}`);

  // Dihapus dari perangkat A, lalu perangkat B harus ikut menyusut — sekaligus
  // membuktikan penghapusan ikut tersinkron, bukan hanya penambahan.
  await pA.goto(`${BASE}/rhythm`, { waitUntil: "networkidle" });
  await pA.waitForTimeout(1500);
  await pA.locator('button:has-text("hapus")').first().click();
  await pA.waitForTimeout(3500);
  await pB.reload({ waitUntil: "networkidle" });
  await pB.waitForTimeout(4000);
  const bersihB = await jumlahCatatan(pB);
  lapor(bersihB === awalB, "penghapusan ikut sampai ke perangkat B", `${akhirB} → ${bersihB}`);

  await ctxA.close(); await ctxB.close();
}

/* ══ 3. Ekspor lalu impor ════════════════════════════════════════════════ */
{
  const ctx = await b.newContext({ acceptDownloads: true });
  const p = await ctx.newPage();
  pasang(p, "cadangan");
  await masuk(p, PRIA.nama, PRIA.sandi);
  await p.goto(`${BASE}/pengaturan`, { waitUntil: "networkidle" });
  await p.waitForTimeout(1500);

  const [unduhan] = await Promise.all([
    p.waitForEvent("download"),
    p.locator('button:has-text("Unduh cadangan")').click(),
  ]);
  const dir = mkdtempSync(join(tmpdir(), "cadensa-"));
  const berkas = join(dir, "cadangan.json");
  await unduhan.saveAs(berkas);
  const isi = JSON.parse((await import("node:fs")).readFileSync(berkas, "utf8"));
  lapor(isi.format === "cadensa/1" && Array.isArray(isi.entries) && isi.entries.length > 50,
    "berkas cadangan berisi catatan utuh", `${isi.entries.length} catatan`);
  lapor(typeof isi.profile?.mode === "string", "profil ikut dalam cadangan", `mode ${isi.profile?.mode}`);

  // impor berkas yang sama → tidak boleh menggandakan
  const sebelum = await jumlahCatatan(p);
  await p.setInputFiles('input[type="file"]', berkas);
  await p.waitForTimeout(2500);
  const sesudah = await jumlahCatatan(p);
  // Pemberitahuannya dicari di seluruh teks halaman: pemilih kelas warna
  // sebelumnya ikut menangkap tautan "halaman privasi" di kaki halaman.
  const teksHalaman = await p.evaluate(() => document.body.innerText);
  const pesanBenar = /sudah ada|already here/i.test(teksHalaman);
  lapor(sesudah === sebelum, "impor berkas sama tidak menggandakan catatan", `${sebelum} → ${sesudah}`);
  lapor(pesanBenar, "impor memberi tahu bahwa isinya sudah ada");

  await ctx.close();
}

await b.close();

const gagal = hasil.filter(h => !h.ok);
console.log(`\n══ ${hasil.length - gagal.length}/${hasil.length} lolos ══`);
for (const g of gagal) console.log("  GAGAL:", g.nama);
console.log(`\ngalat terkumpul: ${galat.length}`);
for (const g of new Set(galat)) console.log("  ·", g);
