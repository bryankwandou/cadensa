/**
 * Dua akun demo berisi riwayat enam bulan, siap dimasuki dan siap dibaca mesin
 * sinyal.
 *
 *   node scripts/akun-demo.mjs          # pasang
 *   node scripts/akun-demo.mjs --hapus  # cabut
 *
 * Kenapa penyemainya serumit ini, dan tidak cukup satu INSERT
 * ----------------------------------------------------------
 * Brankas Cadensa dienkripsi di peramban. Server tidak pernah memegang kata
 * sandi, dan kunci datanya (DEK) dibungkus dengan kunci turunan PBKDF2 dari kata
 * sandi itu. Artinya baris `users` yang ditulis sembarangan tidak akan bisa
 * dimasuki, dan baris `vaults` yang diisi JSON polos tidak akan bisa dibuka —
 * `openVault` akan melempar dan halaman ritme tampil kosong.
 *
 * Jadi berkas ini menirukan `src/lib/crypto.ts` persis, di Node, memakai
 * `webcrypto`. Tiga angka di bawah ini harus selalu sama dengan yang di sana:
 * jumlah putaran PBKDF2, bentuk `password + " " + info`, dan pemisah `iv.ct`
 * pada hasil AES-GCM. Kalau salah satunya digeser di `crypto.ts` tanpa digeser
 * di sini, akun demo akan tetap terbuat tetapi gagal dibuka — dan gagalnya baru
 * kelihatan saat orang mencoba masuk.
 *
 * Lapisan terakhirnya milik server: `auth_hash` yang disimpan bukan nilai
 * PBKDF2 apa adanya, melainkan hasil scrypt atasnya, sama seperti `hashAuth`
 * di `src/lib/session.ts`.
 */
import { readFileSync } from "node:fs";
import { webcrypto, scrypt as _scrypt, randomBytes, randomUUID } from "node:crypto";
import { promisify } from "node:util";
import { neon } from "@neondatabase/serverless";

const scrypt = promisify(_scrypt);
const { subtle } = webcrypto;

for (const baris of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const m = baris.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const sql = neon(process.env.DATABASE_URL);

/* ── Cermin dari src/lib/crypto.ts ───────────────────────────────────────── */

const PBKDF2_ROUNDS = 210_000;
const enc = new TextEncoder();

const toB64 = (buf) => Buffer.from(buf instanceof Uint8Array ? buf : new Uint8Array(buf)).toString("base64");
const fromB64 = (s) => new Uint8Array(Buffer.from(s, "base64"));

/**
 * Pemisahnya NUL, bukan spasi — sama seperti di `crypto.ts`.
 *
 * Karakter ini tidak terlihat saat berkas dibaca, dan di situlah bahayanya:
 * mengetiknya sebagai spasi tetap menghasilkan kode yang berjalan tanpa galat,
 * tetap membuat akun, dan baru gagal saat ada orang yang mencoba masuk —
 * dengan pesan "kata sandi tidak cocok" yang menunjuk ke arah yang salah.
 */
const PEMISAH = "\0";

async function pbkdf2(password, salt, info, bits) {
  const base = await subtle.importKey("raw", enc.encode(password + PEMISAH + info), "PBKDF2", false, [
    "deriveBits",
  ]);
  return subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ROUNDS, hash: "SHA-256" },
    base,
    bits,
  );
}

const deriveAuthHash = async (password, saltB64) => toB64(await pbkdf2(password, fromB64(saltB64), "auth", 256));

async function deriveWrapKey(password, saltB64) {
  const bits = await pbkdf2(password, fromB64(saltB64), "wrap", 256);
  return subtle.importKey("raw", bits, "AES-GCM", false, ["encrypt", "decrypt"]);
}

async function aesEncrypt(key, plain) {
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const ct = await subtle.encrypt({ name: "AES-GCM", iv }, key, plain);
  return `${toB64(iv)}.${toB64(ct)}`;
}

/** Sama seperti `hashAuth` di src/lib/session.ts. */
async function hashAuth(authHash) {
  const salt = randomBytes(16).toString("hex");
  const dk = await scrypt(authHash, salt, 64);
  return `${salt}:${dk.toString("hex")}`;
}

/* ── Pembangkit riwayat ──────────────────────────────────────────────────── */

/**
 * Acak berbenih, bukan `Math.random`.
 *
 * Menjalankan ulang penyemai ini harus menghasilkan riwayat yang sama persis.
 * Kalau tidak, dua orang di tim melihat angka berbeda di layar yang sama dan
 * setiap laporan bug jadi tidak bisa ditelusuri.
 */
function acak(benih) {
  let s = benih;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

const HARI = 185; // enam bulan penuh

/**
 * Riwayat yang dibuat di sini bukan derau acak. Ia sengaja memuat pola-pola yang
 * memang dicari `signals.ts`, supaya setiap jenis bacaan — ritme, sinyal,
 * praktik, medis — punya bahan untuk muncul, dan QA bisa melihat keempatnya
 * tanpa harus mencatat sendiri selama sebulan.
 *
 * Pola yang ditanam untuk mode pria:
 *   · paruh awal tenang: siang hari, durasi panjang, rasa sesudah positif
 *   · enam pekan terakhir bergeser larut malam, durasi memendek
 *   · pemicu bergeser dari "dorongan alami" ke "stres" dan "bosan"
 *   · edging panjang yang berujung ngilu, cukup sering untuk terbaca
 *   · satu jeda panjang di sekitar bulan ketiga, untuk menguji `longestGapDays`
 */
function riwayatPria(sekarang) {
  const rnd = acak(20260101);
  const pilih = (xs) => xs[Math.floor(rnd() * xs.length)];
  const alat = [
    "onahole", "sleeve-terbuka", "sleeve-tertutup", "sleeve-getar", "stroker-otomatis",
    "sucker", "cincin", "cincin-getar", "prostat", "plug", "wand", "pompa", "torso",
  ];
  const out = [];

  for (let lalu = HARI; lalu >= 0; lalu--) {
    // Jeda sengaja: dua pekan tanpa catatan di sekitar bulan ketiga.
    if (lalu <= 104 && lalu >= 91) continue;

    const baru = lalu <= 42; // enam pekan terakhir
    if (rnd() > (baru ? 0.68 : 0.46)) continue;

    const d = new Date(+sekarang - lalu * 86_400_000);
    const jam = baru
      ? rnd() < 0.62
        ? 23 + Math.floor(rnd() * 3) // menembus tengah malam
        : 15 + Math.floor(rnd() * 5)
      : 10 + Math.floor(rnd() * 11);
    d.setHours(jam % 24, Math.floor(rnd() * 60), 0, 0);

    const edging = rnd() < (baru ? 0.28 : 0.14) ? "lama" : rnd() < 0.4 ? "ringan" : "tidak";
    const durasi = Math.round((baru ? 3 + rnd() * 7 : 11 + rnd() * 17) * 60);
    const metode = rnd() < 0.42 ? "alat bantu" : pilih(["tangan", "pelumas", "hubungan seksual"]);
    const perangkat = metode === "alat bantu" ? pilih(alat) : null;

    let rasa;
    if (edging === "lama" && rnd() < 0.62) rasa = rnd() < 0.5 ? "ngilu" : "kebas";
    else if (metode === "tangan" && rnd() < 0.2) rasa = "perih";
    else if (baru && rnd() < 0.46) rasa = rnd() < 0.5 ? "hampa" : "netral";
    else rasa = rnd() < 0.42 ? "lega" : rnd() < 0.74 ? "nikmat" : "tenang";

    out.push({
      id: `demo-p-${lalu}-${Math.floor(rnd() * 1e6).toString(36)}`,
      at: d.toISOString(),
      durationSec: rnd() < 0.06 ? null : durasi, // sebagian tidak tahu durasinya
      method: metode,
      device: perangkat,
      lube: metode === "tangan" ? "tidak pakai" : pilih(["berbasis air", "berbasis silikon", "hibrida", "tidak pakai"]),
      edging,
      edgeCycles: edging === "tidak" ? null : 1 + Math.floor(rnd() * 6),
      trigger: baru
        ? pilih(["stres", "bosan", "susah tidur", "kebiasaan jam segini"])
        : pilih(["dorongan alami", "rangsangan visual", "keintiman pasangan", "bosan"]),
      afterfeel: rasa,
      note: rnd() < 0.12 ? pilih(CATATAN_PRIA) : "",
      mode: "pria",
    });
  }
  return out;
}

/**
 * Mode wanita. Sebarannya diikat ke siklus, bukan ke jam kerja: menumpuk di hari
 * ke-11 sampai ke-16 dan hampir kosong saat haid. Itu yang membuat
 * `cycleCoupling` punya sesuatu untuk dilaporkan; tanpa keterikatan itu, seluruh
 * kartu siklus di halaman bacaan tampil sebagai "belum cukup data".
 */
function riwayatWanita(sekarang, mulaiHaidTerakhir) {
  const rnd = acak(20260202);
  const pilih = (xs) => xs[Math.floor(rnd() * xs.length)];
  const alat = [
    "vibrator-klitoris", "vibrator-rabbit", "vibrator-peluru", "vibrator-batang",
    "air-pulse", "sucker", "wand", "dildo", "kegel", "plug", "air",
  ];
  const out = [];

  for (let lalu = HARI; lalu >= 0; lalu--) {
    const d = new Date(+sekarang - lalu * 86_400_000);
    const hariSiklus = Math.floor((+d - +mulaiHaidTerakhir) / 86_400_000) % 28;
    const h = ((hariSiklus % 28) + 28) % 28;

    const haid = h < 4;
    const suburan = h >= 11 && h <= 16;
    const peluang = haid ? 0.08 : suburan ? 0.8 : 0.3;
    if (rnd() > peluang) continue;

    d.setHours(20 + Math.floor(rnd() * 5), Math.floor(rnd() * 60), 0, 0);

    const metode = rnd() < 0.58 ? "alat bantu" : pilih(["tangan", "pelumas", "hubungan seksual"]);
    const perangkat = metode === "alat bantu" ? pilih(alat) : null;
    const edging = rnd() < 0.18 ? "lama" : rnd() < 0.36 ? "ringan" : "tidak";

    let rasa;
    if (perangkat === "wand" && rnd() < 0.42) rasa = "kebas"; // alat berintensitas tinggi
    else if (edging === "lama" && rnd() < 0.4) rasa = "ngilu";
    else if (metode === "tangan" && rnd() < 0.16) rasa = "perih";
    else if (suburan) rasa = rnd() < 0.6 ? "nikmat" : "lega";
    else rasa = rnd() < 0.35 ? "lega" : rnd() < 0.6 ? "tenang" : rnd() < 0.85 ? "netral" : "lelah";

    out.push({
      id: `demo-w-${lalu}-${Math.floor(rnd() * 1e6).toString(36)}`,
      at: d.toISOString(),
      durationSec: rnd() < 0.05 ? null : Math.round((8 + rnd() * 20) * 60),
      method: metode,
      device: perangkat,
      lube: metode === "tangan" ? "tidak pakai" : pilih(["berbasis air", "hibrida", "tidak pakai"]),
      edging,
      edgeCycles: edging === "tidak" ? null : 1 + Math.floor(rnd() * 5),
      trigger: suburan
        ? pilih(["dorongan alami", "keintiman pasangan", "rangsangan visual"])
        : pilih(["stres", "susah tidur", "bosan", "kesepian", "kebiasaan jam segini"]),
      afterfeel: rasa,
      note: rnd() < 0.12 ? pilih(CATATAN_WANITA) : "",
      mode: "wanita",
    });
  }
  return out;
}

/** Catatan bebas. Ada supaya kolom teks panjang ikut teruji, bukan sebagai hiasan. */
const CATATAN_PRIA = [
  "Tidur jadi mundur lagi setelah ini.",
  "Kepikiran kerjaan, susah berhenti.",
  "Terasa lebih cepat dari biasanya.",
  "Agak perih di akhir, mungkin kurang pelumas.",
  "Habis olahraga, badan lebih enteng.",
  "Sengaja pelan-pelan, tidak buru-buru.",
];

const CATATAN_WANITA = [
  "Perut masih agak kram sisa kemarin.",
  "Lebih cepat responsif hari ini.",
  "Getarnya kekencangan, agak kebas setelahnya.",
  "Suasana hati sedang naik.",
  "Susah tidur, jadi dipakai untuk menenangkan.",
  "Nyaman, tidak buru-buru.",
];

/* ── Perakitan akun ──────────────────────────────────────────────────────── */

/**
 * Kata sandi akun demo dibaca dari lingkungan, tidak ditulis di berkas ini.
 *
 * Repositori ini publik. Kata sandi yang ditulis di sini akan tersimpan permanen
 * di riwayat Git — menghapusnya belakangan tidak menghapusnya dari commit yang
 * sudah beredar. Dan akun demo bukan akun kosong: ia berisi enam bulan catatan
 * yang dipakai sebagai bahan pengujian, di aplikasi yang benar-benar tayang.
 * Siapa pun yang membaca berkasnya bisa masuk dan menghapus isinya.
 *
 * Isikan sebelum menjalankan:
 *
 *   SANDI_DEMO_PRIA=... SANDI_DEMO_WANITA=... node scripts/akun-demo.mjs
 *
 * Bisa juga ditaruh di .env.local, yang sudah diabaikan Git.
 */
function sandi(nama) {
  const nilai = process.env[nama];
  if (!nilai || nilai.length < 10) {
    console.error(
      `${nama} belum diisi, atau kurang dari 10 karakter.\n` +
        "Kata sandi akun demo sengaja tidak ditulis di dalam berkas ini karena\n" +
        "repositorinya publik. Isikan lewat lingkungan atau .env.local:\n\n" +
        "  SANDI_DEMO_PRIA=... SANDI_DEMO_WANITA=... node scripts/akun-demo.mjs\n",
    );
    process.exit(1);
  }
  return nilai;
}

const SEKARANG = new Date();
// Hari pertama haid terakhir dipasang 14 hari lalu, jadi akun demo mendarat di
// tengah siklus: fase subur sudah lewat sedikit, dan prakiraan haid berikutnya
// masih dua pekan lagi. Itu keadaan yang paling banyak memunculkan kartu.
const HAID_TERAKHIR = new Date(+SEKARANG - 14 * 86_400_000);
HAID_TERAKHIR.setHours(0, 0, 0, 0);

const AKUN = [
  {
    username: "nayrbryanGaming01",
    password: sandi("SANDI_DEMO_PRIA"),
    email: "nayrbryangaming01@demo.cadensa.id",
    mode: "pria",
    profil: {
      mode: "pria",
      cycle: { lastPeriodStart: null, cycleLengthDays: 28, periodLengthDays: 5 },
      name: "Bryan",
      accent: "teal",
      motion: "penuh",
    },
    entri: () => riwayatPria(SEKARANG),
  },
  {
    username: "nayrbryanGaming02",
    password: sandi("SANDI_DEMO_WANITA"),
    email: "nayrbryangaming02@demo.cadensa.id",
    mode: "wanita",
    profil: {
      mode: "wanita",
      cycle: {
        lastPeriodStart: HAID_TERAKHIR.toISOString().slice(0, 10),
        cycleLengthDays: 28,
        periodLengthDays: 5,
      },
      name: "Nayra",
      accent: "clay",
      motion: "penuh",
    },
    entri: () => riwayatWanita(SEKARANG, HAID_TERAKHIR),
  },
];

if (process.argv.includes("--hapus")) {
  const nama = AKUN.map((a) => a.username.toLowerCase());
  const { length } = await sql`
    DELETE FROM users WHERE lower(username) = ANY(${nama}) RETURNING id`;
  console.log(`Dicabut: ${length} akun demo beserta brankasnya.`);
} else {
  for (const a of AKUN) {
    const entri = a.entri().sort((x, y) => +new Date(x.at) - +new Date(y.at));

    // Kunci dibuat persis seperti `createVaultKeys` melakukannya di peramban.
    const salt = toB64(webcrypto.getRandomValues(new Uint8Array(16)));
    const dekRaw = webcrypto.getRandomValues(new Uint8Array(32));
    const wrapKey = await deriveWrapKey(a.password, salt);
    const wrappedDek = await aesEncrypt(wrapKey, dekRaw);
    const authHash = await deriveAuthHash(a.password, salt);
    const dek = await subtle.importKey("raw", dekRaw, "AES-GCM", true, ["encrypt", "decrypt"]);

    const isi = { entries: entri, profile: a.profil, rev: entri.length + 1 };
    const ciphertext = await aesEncrypt(dek, enc.encode(JSON.stringify(isi)));

    // Akun lama dibuang lebih dulu, bukan ditimpa: kalau kata sandinya diganti,
    // DEK yang lama tidak akan pernah cocok lagi dengan brankas yang baru.
    await sql`DELETE FROM users WHERE lower(username) = ${a.username.toLowerCase()} OR email = ${a.email}`;

    const id = randomUUID();
    await sql`
      INSERT INTO users (id, username, email, auth_hash, kdf_salt, wrapped_dek, mode)
      VALUES (${id}, ${a.username}, ${a.email}, ${await hashAuth(authHash)}, ${salt}, ${wrappedDek}, ${a.mode})`;
    await sql`
      INSERT INTO vaults (user_id, ciphertext, revision, updated_at)
      VALUES (${id}, ${ciphertext}, ${isi.rev}, now())`;

    const hariTerpakai = new Set(entri.map((e) => e.at.slice(0, 10))).size;
    console.log(
      `${a.username} (${a.mode}) — ${entri.length} catatan di ${hariTerpakai} hari, ` +
        `${entri[0].at.slice(0, 10)} sampai ${entri.at(-1).at.slice(0, 10)}. ` +
        `Kunci pemulihan: ${toB64(dekRaw)}`,
    );
  }
}
