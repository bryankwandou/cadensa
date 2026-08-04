"use client";

import { useEffect } from "react";
import { accentMeta } from "@/lib/types";
import { useVault } from "@/lib/vault";

/**
 * Menerapkan pilihan pribadi ke seluruh aplikasi.
 *
 * Caranya sengaja lewat satu tempat: token `--color-teal-*` ditimpa di elemen
 * akar. Karena setiap komponen memakai token itu dan bukan nilai warna langsung,
 * satu pilihan mengubah semuanya sekaligus — pita ritme, ikon, tombol, cincin
 * denyut, sampai garis kemajuan gulir. Tidak ada komponen yang perlu tahu warna
 * apa yang sedang dipakai.
 *
 * Pilihannya ikut terenkripsi bersama catatan, jadi bahkan warna kesukaan pun
 * tidak terbaca server.
 */
export function Skin() {
  const { profile, ready } = useVault();

  useEffect(() => {
    if (!ready) return;
    const a = accentMeta(profile.accent);
    const root = document.documentElement;
    root.style.setProperty("--color-teal-400", a.c400);
    root.style.setProperty("--color-teal-500", a.c500);
    root.style.setProperty("--color-teal-600", a.c600);
    root.style.setProperty("--color-teal-700", a.c700);
    root.dataset.accent = a.key;
  }, [profile.accent, ready]);

  useEffect(() => {
    if (!ready) return;
    // Mode tenang memakai kanal yang sama dengan prefers-reduced-motion, jadi
    // satu aturan CSS melayani keduanya dan tidak ada jalur kedua yang bisa
    // ketinggalan saat komponen baru ditambahkan.
    document.documentElement.dataset.motion = profile.motion;
  }, [profile.motion, ready]);

  return null;
}
