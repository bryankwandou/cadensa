import type { Entry } from "./types";

/**
 * Penggabungan dua salinan brankas, dan nisan yang membuat penghapusan bertahan.
 *
 * Dipisahkan dari `vault.tsx` bukan demi kerapian. Tiga fungsi di berkas ini
 * memutuskan apakah catatan seseorang bertahan atau hilang, dan selama mereka
 * tinggal di dalam komponen React, satu-satunya cara mengujinya adalah
 * menjalankan peramban sungguhan — lambat, dan hampir mustahil menjangkau kasus
 * tepi yang justru paling berbahaya: nisan yang lebih tua dari catatannya,
 * dua perangkat yang menghapus hal berbeda, cap waktu yang rusak.
 *
 * Di sini semuanya murni: masuk data, keluar data, tanpa jam, tanpa jaringan,
 * tanpa React. `scripts/uji/unit.test.mjs` menguji ketiganya langsung.
 */

/**
 * Nisan yang lebih tua dari ini dibuang.
 *
 * Tanpa batas, daftarnya tumbuh selamanya dan brankas membengkak oleh catatan
 * tentang hal-hal yang sudah lama tidak ada. Enam bulan jauh lebih panjang
 * daripada jeda paling lama antara dua perangkat yang sama-sama dipakai, jadi
 * satu-satunya cara nisan terbuang sebelum tugasnya selesai adalah perangkat
 * yang tidak pernah menyala selama setengah tahun.
 */
export const UMUR_NISAN_MS = 180 * 86_400_000;

/**
 * `sekarang` bisa dioper supaya pemangkasan bisa diuji tanpa menunggu setengah
 * tahun berlalu. Nilai bawaannya tetap jam sungguhan.
 */
export function pangkasNisan(
  d: Record<string, string>,
  sekarang = Date.now(),
): Record<string, string> {
  const batas = sekarang - UMUR_NISAN_MS;
  const out: Record<string, string> = {};
  for (const [id, saat] of Object.entries(d)) {
    const t = +new Date(saat);
    /*
      Cap waktu yang tidak terbaca dipertahankan, bukan dibuang.
      `+new Date("bukan tanggal")` menghasilkan NaN, dan setiap perbandingan
      dengan NaN bernilai salah — jadi menyaring dengan `>= batas` akan diam-diam
      membuang nisannya, dan catatan yang sudah dihapus hidup kembali. Kalau
      ragu, nisan lebih baik bertahan terlalu lama daripada hilang terlalu cepat.
    */
    if (Number.isNaN(t) || t >= batas) out[id] = saat;
  }
  return out;
}

/**
 * Menggabung dua salinan berdasarkan id, lalu membuang yang bernisan.
 *
 * Urutannya menentukan: penggabungan dulu, penyaringan belakangan. Perangkat
 * yang lama menyala tetap tidak menimpa yang baru, tapi ia juga tidak bisa
 * menghidupkan kembali apa pun yang sudah dihapus di perangkat lain.
 */
export function merge(a: Entry[], b: Entry[], dihapus: Record<string, string> = {}): Entry[] {
  const map = new Map<string, Entry>();
  for (const e of [...a, ...b]) map.set(e.id, e);
  return [...map.values()]
    .filter((e) => !(e.id in dihapus))
    .sort((x, y) => +new Date(x.at) - +new Date(y.at));
}

/** Nisan dari dua salinan disatukan; yang lebih dulu tercatat dipertahankan. */
export function gabungNisan(
  a: Record<string, string> = {},
  b: Record<string, string> = {},
  sekarang = Date.now(),
): Record<string, string> {
  const out: Record<string, string> = { ...a };
  for (const [id, saat] of Object.entries(b)) {
    if (!out[id] || +new Date(saat) < +new Date(out[id])) out[id] = saat;
  }
  return pangkasNisan(out, sekarang);
}
