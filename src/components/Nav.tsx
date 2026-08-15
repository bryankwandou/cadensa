"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Wordmark } from "./Logo";
import { useVault } from "@/lib/vault";
import { useT } from "@/lib/i18n";
import { BAHASA } from "@/lib/terjemah";

const LINKS = [
  { href: "/log", label: "Catat" },
  { href: "/rhythm", label: "Ritme" },
  { href: "/insights", label: "Bacaan" },
  { href: "/pengaturan", label: "Pengaturan" },
];

/**
 * Pengalih bahasa.
 *
 * Dua huruf, bukan bendera dan bukan menu turun. Bendera menandai negara, bukan
 * bahasa — dan bahasa Inggris tidak punya satu negara yang berhak mewakilinya.
 * Menu turun akan menyembunyikan pilihan kedua di balik satu ketukan tambahan,
 * padahal pilihannya cuma dua dan keduanya muat sekaligus.
 *
 * Yang tidak aktif tetap terbaca, bukan diredupkan sampai hilang: orang yang
 * belum bisa membaca antarmuka ini harus bisa menemukan jalan keluarnya justru
 * tanpa membaca apa pun.
 */
function AlihBahasa() {
  const { bahasa, setBahasa, t } = useT();
  return (
    <div
      className="flex shrink-0 items-center rounded-full border hairline p-0.5"
      role="group"
      aria-label={t("Ganti bahasa")}
    >
      {BAHASA.map((b) => {
        const aktif = b === bahasa;
        return (
          <button
            key={b}
            onClick={() => setBahasa(b)}
            aria-pressed={aktif}
            lang={b}
            className={`relative rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider transition-colors ${
              aktif ? "text-ink-975" : "text-sand-500 hover:text-sand-200"
            }`}
          >
            {aktif && (
              <motion.span
                layoutId="nav-bahasa"
                className="absolute inset-0 rounded-full bg-teal-500"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative">{b}</span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Titik status sinkron. Kecil, di pojok, tidak pernah menghalangi.
 *
 * Kecuali satu keadaan: saat brankas terkunci, titik ini berubah jadi tautan.
 * Kunci ditahan di sessionStorage dan hilang begitu tab ditutup — itu disengaja
 * demi perangkat yang dipinjam. Akibatnya pengguna kembali dalam keadaan "masuk
 * tapi tidak bisa membaca apa pun", dan status yang hanya memberitahu tanpa
 * menawarkan jalan keluar adalah jalan buntu, bukan informasi.
 */
function SyncDot() {
  const { sync, user } = useVault();
  const { t } = useT();
  if (!user) return null;

  if (sync.kind === "terkunci") {
    return (
      <Link
        href="/masuk"
        className="flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/[0.06] px-3 py-1 text-xs text-amber-400 transition-colors hover:bg-amber-500/[0.12]"
      >
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-amber-400"
          animate={{ opacity: [1, 0.35, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {/* Di ponsel, empat tautan dan tanda merek sudah memenuhi barisnya;
            titiknya sendiri sudah cukup, dan menu akun tetap memuat jalan yang sama. */}
        <span className="hidden sm:inline">{t("Buka brankas")}</span>
      </Link>
    );
  }

  const map = {
    lokal: { c: "bg-sand-500", label: "Tersimpan di perangkat" },
    menyiapkan: { c: "bg-amber-400", label: "Menyiapkan brankas" },
    menyimpan: { c: "bg-amber-400", label: "Menyimpan" },
    tersimpan: { c: "bg-teal-500", label: "Tersimpan & tersinkron" },
    terkunci: { c: "bg-amber-500", label: "Brankas terkunci" },
    gagal: { c: "bg-signal-500", label: "Gagal menyimpan" },
  } as const;
  const s = { c: map[sync.kind].c, t: t(map[sync.kind].label) };

  return (
    <span className="flex items-center gap-2 text-xs text-sand-500" title={s.t}>
      <motion.span
        className={`h-1.5 w-1.5 rounded-full ${s.c}`}
        animate={sync.kind === "menyimpan" ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
        transition={{ duration: 1.2, repeat: sync.kind === "menyimpan" ? Infinity : 0 }}
      />
      <span className="hidden sm:inline">{s.t}</span>
    </span>
  );
}

export function Nav() {
  const path = usePathname();
  const { user, logout, sync, profile } = useVault();
  const { t } = useT();

  /**
   * Nama panggilan lebih dulu, nama pengguna sebagai cadangan.
   *
   * Dua huruf pertama nama pengguna terlihat masuk akal sampai dua akun berbagi
   * awalan — lalu keduanya memakai lencana yang sama persis, dan lencana yang
   * tidak membedakan siapa pun tidak menjalankan tugasnya. Nama panggilan sudah
   * diminta di pengaturan justru untuk dipakai, dan nama orang memberi inisial
   * yang jauh lebih membedakan daripada awalan nama pengguna.
   */
  const inisial = (() => {
    const nama = profile.name.trim();
    if (nama) {
      const kata = nama.split(/\s+/);
      return (kata.length > 1 ? kata[0][0] + kata[1][0] : kata[0].slice(0, 2)).toUpperCase();
    }
    return user?.username.slice(0, 2).toUpperCase() ?? "";
  })();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b hairline bg-ink-975/75 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5">
        <Link href="/" aria-label={t("Cadensa, beranda")} className="shrink-0">
          <Wordmark size={28} />
        </Link>

        <div className="flex items-center gap-1 overflow-x-auto">
          {LINKS.map((l) => {
            const active = path === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className="relative shrink-0 rounded-full px-3 py-1.5 text-sm text-sand-300 transition-colors hover:text-sand-100"
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-ink-700"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className={`relative ${active ? "text-sand-100" : ""}`}>{t(l.label)}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <SyncDot />
          <AlihBahasa />
          {user ? (
            <div className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-700 text-xs font-medium uppercase text-sand-100"
                aria-label={t("Menu akun")}
              >
                {inisial}
              </button>
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.16 }}
                    className="surface-raised absolute right-0 mt-2 w-52 rounded-card p-2 backdrop-blur-xl"
                  >
                    <div className="px-3 py-2 text-xs text-sand-500">
                      {t("Masuk sebagai {nama}", { nama: user.username })}
                    </div>
                    {sync.kind === "terkunci" && (
                      <Link
                        href="/masuk"
                        onClick={() => setOpen(false)}
                        className="mb-1 block rounded-xl border border-amber-500/30 bg-amber-500/[0.06] px-3 py-2 text-sm text-amber-400 hover:bg-amber-500/[0.12]"
                      >
                        {t("Buka brankas")}
                        <span className="mt-0.5 block text-[11px] text-sand-500">
                          {t("Kuncinya hilang saat tab ditutup")}
                        </span>
                      </Link>
                    )}
                    <Link
                      href="/pengaturan"
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-3 py-2 text-sm text-sand-300 hover:bg-ink-700 hover:text-sand-100"
                    >
                      {t("Pengaturan & cadangan")}
                    </Link>
                    <button
                      onClick={() => {
                        setOpen(false);
                        void logout();
                      }}
                      className="block w-full rounded-xl px-3 py-2 text-left text-sm text-sand-300 hover:bg-ink-700 hover:text-sand-100"
                    >
                      {t("Keluar")}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/masuk"
              className="rounded-full bg-teal-500 px-4 py-1.5 text-sm font-medium text-ink-975 transition-colors hover:bg-teal-400"
            >
              {t("Masuk")}
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
