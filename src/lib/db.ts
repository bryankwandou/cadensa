import { neon } from "@neondatabase/serverless";

/**
 * Server hanya menyimpan bentuk terenkripsi. Kolom `ciphertext` sengaja bertipe
 * teks buram: kalau seluruh basis data ini bocor, isinya tidak bisa dibaca siapa pun
 * yang tidak memegang kata sandi penggunanya.
 */
type Sql = ReturnType<typeof neon>;

let client: Sql | null = null;

/**
 * Sambungan dibuat saat dipakai, bukan saat modul dimuat.
 *
 * Bedanya bukan gaya. `neon()` melempar kalau alamat basis datanya kosong, dan
 * memanggilnya di tingkat modul membuat kegagalan itu terjadi saat Next.js
 * mengumpulkan data rute — sehingga seluruh build gagal, bukan hanya rute akun.
 * Dengan cara ini, aplikasi tanpa basis data tetap terbangun utuh dan hanya rute
 * akun yang menjawab galat.
 */
function db(): Sql {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL belum diisi, jadi akun tidak bisa dipakai.");
    client = neon(url);
  }
  return client;
}

/** Dipakai sebagai template tag persis seperti klien Neon aslinya. */
export const sql: Sql = ((strings: TemplateStringsArray, ...values: unknown[]) =>
  (db() as unknown as (s: TemplateStringsArray, ...v: unknown[]) => unknown)(strings, ...values)) as Sql;

let ensured: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  ensured ??= (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id           TEXT PRIMARY KEY,
        username     TEXT UNIQUE NOT NULL,
        email        TEXT UNIQUE NOT NULL,
        auth_hash    TEXT NOT NULL,
        kdf_salt     TEXT NOT NULL,
        wrapped_dek  TEXT NOT NULL,
        mode         TEXT NOT NULL DEFAULT 'pria',
        created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
    await sql`
      CREATE TABLE IF NOT EXISTS vaults (
        user_id    TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        ciphertext TEXT NOT NULL,
        revision   INTEGER NOT NULL DEFAULT 1,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
    /**
     * Ulasan. Satu-satunya tabel di sini yang isinya memang dimaksudkan terbaca.
     *
     * Kuncinya `user_id` sebagai primary key, bukan kolom biasa: satu akun hanya
     * boleh punya satu ulasan, dan menulis lagi berarti mengganti yang lama.
     * Itu yang membuat angka penilaiannya tidak bisa digelembungkan dengan
     * mengirim ulang kalimat yang sama berkali-kali.
     *
     * `approved` sengaja mulai dari false. Ulasan yang langsung tayang begitu
     * dikirim adalah undangan bagi penyalahgunaan, dan halaman yang memajang
     * keberatan terhadap penelitiannya sendiri tidak boleh punya celah itu.
     */
    await sql`
      CREATE TABLE IF NOT EXISTS reviews (
        user_id      TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        display_name TEXT NOT NULL,
        rating       SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        body         TEXT NOT NULL,
        approved     BOOLEAN NOT NULL DEFAULT false,
        created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
  })();
  return ensured;
}

export type UserRow = {
  id: string;
  username: string;
  email: string;
  auth_hash: string;
  kdf_salt: string;
  wrapped_dek: string;
  mode: string;
};
