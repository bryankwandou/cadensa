"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { bacaBahasa, isi, penerjemah, type Bahasa, type Terjemah } from "./terjemah";

export { BAHASA, NAMA_BAHASA, bacaBahasa, type Bahasa } from "./terjemah";

export const KUNCI = "cadensa.bahasa";
export const COOKIE_BAHASA = "cadensa_bahasa";

type Ctx = {
  bahasa: Bahasa;
  setBahasa: (b: Bahasa) => void;
  t: Terjemah;
  /** Memilih satu dari dua nilai tanpa lewat kamus. Untuk hal yang bukan kalimat. */
  pilih: <T>(id: T, en: T) => T;
};

const I18nCtx = createContext<Ctx | null>(null);

/**
 * `awal` datang dari cookie yang dibaca di server.
 *
 * Tanpa itu, render pertama selalu bahasa Indonesia dan baru berganti setelah
 * `useEffect` membaca localStorage. Pengguna Inggris akan melihat satu halaman
 * penuh berbahasa Indonesia berkedip setiap kali membuka aplikasi, dan React
 * mengeluhkan ketidakcocokan hidrasi karena server dan klien menggambar teks
 * yang berbeda.
 */
export function I18nProvider({ awal, children }: { awal: Bahasa; children: ReactNode }) {
  const [bahasa, setState] = useState<Bahasa>(awal);

  const setBahasa = useCallback((b: Bahasa) => {
    setState(b);
    try {
      localStorage.setItem(KUNCI, b);
    } catch {
      /* penyimpanan ditolak — cookie di bawah tetap membuat pilihannya bertahan */
    }
    /*
      Cookie, bukan hanya localStorage. Server perlu tahu bahasa apa yang harus
      digambar pada render pertama, dan localStorage tidak ikut terkirim dalam
      permintaan. Isinya persis dua huruf, "id" atau "en" — tidak ada apa pun
      yang pribadi di sini, jadi tidak ada yang perlu disembunyikan.
    */
    document.cookie = `${COOKIE_BAHASA}=${b}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = b;
  }, []);

  // localStorage menang atas cookie kalau keduanya ada dan berbeda: cookie bisa
  // tertinggal basi, localStorage selalu milik peramban ini.
  useEffect(() => {
    try {
      const tersimpan = localStorage.getItem(KUNCI);
      if (tersimpan && bacaBahasa(tersimpan) !== bahasa) {
        setBahasa(bacaBahasa(tersimpan));
        return;
      }
    } catch {
      /* diabaikan — bahasa dari cookie sudah cukup */
    }
    document.documentElement.lang = bahasa;
    // sengaja sekali jalan: ini pemulihan pilihan, bukan pengawasan berkelanjutan
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      bahasa,
      setBahasa,
      t: penerjemah(bahasa),
      pilih: (id, en) => (bahasa === "en" ? en : id),
    }),
    [bahasa, setBahasa],
  );

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useT(): Ctx {
  const c = useContext(I18nCtx);
  /*
    Komponen di luar penyedia tetap tampil, tidak melempar.
    Halaman yang mati total gara-gara lapisan terjemahan jauh lebih buruk
    daripada halaman yang tampil dalam satu bahasa saja.
  */
  if (!c) {
    return { bahasa: "id", setBahasa: () => {}, t: (teks, vars) => isi(teks, vars), pilih: (id) => id };
  }
  return c;
}
