/**
 * Menjalankan mesin bacaan yang asli terhadap brankas akun peraga di produksi.
 *
 * Tujuannya membuktikan bahwa enam bulan riwayat itu benar-benar memicu
 * pembacaan, bukan sekadar mengisi basis data. Yang dipanggil di sini persis
 * fungsi yang dipakai halaman /insights — tidak ada salinan dan tidak ada
 * tiruan, jadi kalau berkas ini lulus, halamannya juga lulus.
 *
 * Dijalankan dengan pelucutan tipe bawaan Node, jadi tidak perlu alat bantu apa
 * pun di luar yang sudah ada:
 *
 *   node scripts/verifikasi-bacaan.mts
 */
import { webcrypto as crypto } from "node:crypto";
import { readAll } from "../src/lib/signals.ts";
import {
  cadenceIndex,
  lastDays,
  longestGapDays,
  medianDurationSec,
  monthProjection,
  positiveShare,
  startOfMonth,
  within,
} from "../src/lib/metrics.ts";
import { cycleCoupling, peakPhase, phaseDensity } from "../src/lib/cycle.ts";

const BASE = process.env.BASE ?? "https://cadensa.vercel.app";
const ROUNDS = 210_000;
const enc = new TextEncoder();
const b64 = (b: ArrayBuffer) => Buffer.from(new Uint8Array(b)).toString("base64");
const unb64 = (s: string) => new Uint8Array(Buffer.from(s, "base64"));

async function pbkdf2(password: string, salt: Uint8Array, info: string) {
  const base = await crypto.subtle.importKey("raw", enc.encode(`${password} ${info}`), "PBKDF2", false, ["deriveBits"]);
  return crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as unknown as BufferSource, iterations: ROUNDS, hash: "SHA-256" },
    base,
    256,
  );
}
const authHashOf = async (pw: string, salt: string) => b64(await pbkdf2(pw, unb64(salt), "auth"));
const wrapKeyOf = async (pw: string, salt: string) =>
  crypto.subtle.importKey("raw", await pbkdf2(pw, unb64(salt), "wrap"), "AES-GCM", false, ["decrypt"]);

async function open(key: CryptoKey, packed: string) {
  const [iv, ct] = packed.split(".");
  return new Uint8Array(
    await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: unb64(iv) as unknown as BufferSource },
      key,
      unb64(ct) as unknown as BufferSource,
    ),
  );
}

async function call(path: string, init: RequestInit = {}, cookie = "") {
  const res = await fetch(BASE + path, {
    ...init,
    headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}), ...(init.headers ?? {}) },
  });
  const set = res.headers.get("set-cookie");
  let body: Record<string, unknown> | null = null;
  try {
    body = (await res.json()) as Record<string, unknown>;
  } catch {
    /* balasan kosong */
  }
  return { status: res.status, body, cookie: set ? set.split(";")[0] : cookie };
}

let gagal = 0;
const cek = (label: string, lulus: boolean, extra = "") => {
  if (!lulus) gagal++;
  console.log(`  ${lulus ? "OK   " : "GAGAL"} ${label}${extra ? `  — ${extra}` : ""}`);
};

for (const [username, password] of [
  ["nayrbryanGaming01", "nayrbryanGaming01"],
  ["nayrbryanGaming02", "nayrbryanGaming02"],
]) {
  const s = await call(`/api/auth/salt?ident=${username}`);
  const login = await call("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ ident: username, authHash: await authHashOf(password, s.body!.salt as string) }),
  });

  const dek = await crypto.subtle.importKey(
    "raw",
    await open(await wrapKeyOf(password, login.body!.salt as string), login.body!.wrappedDek as string),
    "AES-GCM",
    false,
    ["decrypt"],
  );
  const v = await call("/api/vault", {}, login.cookie);
  const vault = JSON.parse(Buffer.from(await open(dek, v.body!.ciphertext as string)).toString());

  console.log(`\n=== ${username} · mode ${vault.profile.mode} · ${vault.entries.length} catatan ===`);
  cek("masuk", login.status === 200);
  cek("brankas terbuka", vault.entries.length > 0, `${vault.entries.length} catatan`);

  const rentangHari =
    (Date.parse(vault.entries.at(-1).at) - Date.parse(vault.entries[0].at)) / 86_400_000;
  cek("riwayat minimal 6 bulan", rentangHari >= 175, `${Math.round(rentangHari)} hari`);

  const now = new Date();
  cek(
    "durasi tengah terhitung",
    medianDurationSec(vault.entries) !== null,
    `${medianDurationSec(vault.entries)} detik`,
  );
  cek("bagian rasa positif terhitung", positiveShare(vault.entries) >= 0, `${Math.round(positiveShare(vault.entries) * 100)}%`);
  cek("kekosongan terpanjang terhitung", longestGapDays(vault.entries, now) >= 0, `${longestGapDays(vault.entries, now)} hari`);

  if (vault.profile.mode === "pria") {
    const ci = cadenceIndex(lastDays(vault.entries, 30, now));
    const bulan = within(vault.entries, startOfMonth(now), now).length;
    const proj = monthProjection(vault.entries, now);
    cek("Cadence Index terhitung", ci !== null && ci >= 0 && ci <= 100, String(ci));
    cek("jumlah bulan ini terhitung", bulan > 0, `${bulan} catatan`);
    cek("proyeksi bulan terhitung", proj.projected > 0, `mengarah ke ${proj.projected}`);
  } else {
    const kop = cycleCoupling(vault.entries, vault.profile.cycle);
    const dens = phaseDensity(vault.entries, vault.profile.cycle);
    const puncak = peakPhase(vault.entries, vault.profile.cycle);
    cek("keterikatan siklus terhitung", kop !== null && kop >= 0 && kop <= 100, String(kop));
    cek("empat fase terisi", dens.length === 4, dens.map((d) => `${d.phase}:${d.count}`).join(" "));
    cek("fase puncak terdeteksi", Boolean(puncak), String(puncak));
  }

  const bacaan = readAll(vault.entries, vault.profile, now);
  cek("mesin bacaan menghasilkan", bacaan.length > 0, `${bacaan.length} bacaan`);

  const jenis = new Set(bacaan.map((b) => b.kind));
  cek("lebih dari satu jenis bacaan", jenis.size >= 2, [...jenis].join(", "));
  cek(
    "setiap bacaan punya satu langkah",
    bacaan.every((b) => b.action && b.action.length > 0),
  );

  // Penjaga yang lahir dari bug sungguhan: mode wanita pernah menampilkan
  // kalimat tentang prostat, karena penyaringnya melewatkan satu bacaan.
  // Menyebut organ yang tidak ada di tubuh pembacanya bukan kejanggalan bahasa,
  // melainkan klaim kesehatan yang salah alamat.
  if (vault.profile.mode === "wanita") {
    const bocor = bacaan.filter((b) => /prostat/i.test(`${b.title} ${b.body} ${b.action}`));
    cek(
      "tidak ada kata prostat di mode wanita",
      bocor.length === 0,
      bocor.map((b) => b.id).join(", "),
    );
    cek(
      "tidak ada pita 21 di mode wanita",
      !bacaan.some((b) => /\bpita\b|\b21\b/.test(`${b.title} ${b.body}`)),
    );
  }

  // Aturan nada yang berlaku di kedua mode.
  const menghakimi = bacaan.filter((b) =>
    /kecanduan|kecanduanmu|berlebihan|dosa|kotor|jorok|harus berhenti|gagal/i.test(
      `${b.title} ${b.body} ${b.action}`,
    ),
  );
  cek("tanpa bahasa menghakimi", menghakimi.length === 0, menghakimi.map((b) => b.id).join(", "));

  const medisTercampur = bacaan.filter(
    (b) => b.kind === "medis" && /teknik|coba geser|jangkar|atur jadwal/i.test(b.action),
  );
  cek("jalur medis tidak dijawab saran kebiasaan", medisTercampur.length === 0);

  console.log("");
  for (const b of bacaan) {
    console.log(`  [${b.kind}] ${b.title}`);
    console.log(`     ${b.body}`);
    console.log(`     -> ${b.action}\n`);
  }
}

console.log(gagal === 0 ? "\nSemua pemeriksaan lulus." : `\n${gagal} pemeriksaan gagal.`);
process.exit(gagal === 0 ? 0 : 1);
