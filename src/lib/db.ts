import { neon } from "@neondatabase/serverless";

/**
 * Server hanya menyimpan bentuk terenkripsi. Kolom `ciphertext` sengaja bertipe
 * teks buram: kalau seluruh basis data ini bocor, isinya tidak bisa dibaca siapa pun
 * yang tidak memegang kata sandi penggunanya.
 */
export const sql = neon(process.env.DATABASE_URL!);

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
