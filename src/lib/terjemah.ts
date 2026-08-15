import { EN } from "./locales/en";

export const BAHASA = ["id", "en"] as const;
export type Bahasa = (typeof BAHASA)[number];

export const NAMA_BAHASA: Record<Bahasa, string> = { id: "Indonesia", en: "English" };

/**
 * Bagian terjemahan yang tidak menyentuh React.
 *
 * Dipisahkan dari `i18n.tsx` karena `signals.ts` — mesin bacaan — merangkai
 * kalimat di fungsi biasa dan tidak bisa memanggil hook. Kalau kamusnya hanya
 * hidup di dalam penyedia React, mesin itu terpaksa mengembalikan kalimat
 * Indonesia selamanya, dan justru bagian paling banyak dibaca di aplikasi ini
 * yang tidak ikut berganti bahasa.
 */
type Kamus = Record<string, string>;

const KAMUS: Record<Bahasa, Kamus | null> = { id: null, en: EN };

/**
 * Kuncinya kalimat Indonesia itu sendiri, bukan kode seperti `auth.login.title`.
 *
 * Konsekuensinya perlu disebut terus terang. Aplikasi ini sudah berisi ribuan
 * kalimat yang tertulis langsung di dalam JSX; memindahkannya ke kode kunci
 * berarti menyentuh tiap baris dua kali, dan satu salah ketik menghasilkan layar
 * yang memajang `auth.login.title` kepada pengguna. Dengan kalimat aslinya
 * sebagai kunci, yang belum diterjemahkan tetap tampil utuh dalam bahasa
 * Indonesia — kegagalan terburuknya satu kalimat yang tertinggal, bukan halaman
 * rusak.
 *
 * Harganya: mengubah kalimat Indonesia memutus terjemahannya diam-diam. Itu
 * sebabnya `npm run bahasa` ada, dan sebaiknya dijalankan sebelum rilis.
 */
export function isi(teks: string, vars?: Record<string, string | number>): string {
  if (!vars) return teks;
  return teks.replace(/\{(\w+)\}/g, (utuh, nama: string) =>
    nama in vars ? String(vars[nama]) : utuh,
  );
}

export function penerjemah(bahasa: Bahasa) {
  const kamus = KAMUS[bahasa];
  return (teks: string, vars?: Record<string, string | number>) => isi(kamus?.[teks] ?? teks, vars);
}

export type Terjemah = ReturnType<typeof penerjemah>;

/** Dipakai sebagai nilai bawaan: tidak menerjemahkan apa pun, hanya mengisi `{...}`. */
export const apaAdanya: Terjemah = (teks, vars) => isi(teks, vars);

export function bacaBahasa(nilai: string | null | undefined): Bahasa {
  return nilai === "en" ? "en" : "id";
}
