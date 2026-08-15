/**
 * Resolver kecil supaya Node bisa memuat modul TypeScript proyek ini apa adanya.
 *
 * Node 24 sudah bisa membuang anotasi tipe sendiri, jadi tidak ada penyusun yang
 * perlu dipasang. Yang belum ia lakukan adalah menebak ekstensi: TypeScript
 * menulis `from "./types"`, sedangkan resolver ESM menuntut `./types.ts`.
 *
 * Menambahkan ekstensi ke seluruh impor di `src/` akan menyelesaikannya juga,
 * tapi itu mengubah ratusan baris kode aplikasi demi kenyamanan pengujian — dan
 * kode yang berubah bentuk supaya bisa diuji adalah kode yang sedikit lebih
 * jauh dari yang benar-benar dijalankan pengguna.
 *
 * Alias `@/` ikut diterjemahkan, karena `tsconfig` memakainya dan Node tidak
 * membaca `tsconfig`.
 */
import { fileURLToPath, pathToFileURL } from "node:url";
import { existsSync } from "node:fs";
import { dirname, resolve as gabungJalur } from "node:path";

const AKAR = fileURLToPath(new URL("../../", import.meta.url));
const EKSTENSI = [".ts", ".tsx", "/index.ts", "/index.tsx", ".mjs", ".js"];

export async function resolve(specifier, context, next) {
  let spec = specifier;

  // `@/lib/x` menunjuk ke `src/lib/x`
  if (spec.startsWith("@/")) {
    spec = pathToFileURL(gabungJalur(AKAR, "src", spec.slice(2))).href;
  }

  try {
    return await next(spec, context);
  } catch (galat) {
    const relatif = spec.startsWith(".") || spec.startsWith("file:");
    if (!relatif) throw galat;

    const dasar = spec.startsWith("file:")
      ? fileURLToPath(spec)
      : gabungJalur(dirname(fileURLToPath(context.parentURL)), spec);

    for (const ext of EKSTENSI) {
      const calon = dasar + ext;
      if (existsSync(calon)) return next(pathToFileURL(calon).href, context);
    }
    throw galat;
  }
}
