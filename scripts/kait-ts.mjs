/**
 * Kait resolusi agar Node bisa menjalankan berkas sumber apa adanya.
 *
 * Berkas di src/ memakai impor tanpa ekstensi (`./metrics`) karena begitulah
 * TypeScript dan Next menuliskannya. Node ESM tidak menebak ekstensi, jadi kait
 * ini yang menambahkannya — hanya untuk skrip pemeriksaan, tidak pernah ikut
 * masuk ke bundel aplikasi.
 */
import { register } from "node:module";
import { pathToFileURL } from "node:url";

export async function resolve(specifier, context, next) {
  try {
    return await next(specifier, context);
  } catch (err) {
    if (specifier.startsWith(".") && !/\.[cm]?[jt]sx?$/.test(specifier)) {
      for (const ext of [".ts", ".tsx", "/index.ts"]) {
        try {
          return await next(specifier + ext, context);
        } catch {
          /* coba ekstensi berikutnya */
        }
      }
    }
    throw err;
  }
}

register(pathToFileURL(import.meta.filename));
