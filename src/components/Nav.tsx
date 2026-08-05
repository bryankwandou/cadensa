"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Wordmark } from "./Logo";
import { useVault } from "@/lib/vault";

const LINKS = [
  { href: "/log", label: "Catat" },
  { href: "/rhythm", label: "Ritme" },
  { href: "/insights", label: "Bacaan" },
  { href: "/pengaturan", label: "Pengaturan" },
];

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
        Buka brankas
      </Link>
    );
  }

  const map = {
    lokal: { c: "bg-sand-500", t: "Tersimpan di perangkat" },
    menyiapkan: { c: "bg-amber-400", t: "Menyiapkan brankas" },
    menyimpan: { c: "bg-amber-400", t: "Menyimpan" },
    tersimpan: { c: "bg-teal-500", t: "Tersimpan & tersinkron" },
    terkunci: { c: "bg-amber-500", t: "Brankas terkunci" },
    gagal: { c: "bg-signal-500", t: "Gagal menyimpan" },
  } as const;
  const s = map[sync.kind];

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
  const { user, logout, sync } = useVault();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b hairline bg-ink-975/75 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5">
        <Link href="/" aria-label="Cadensa, beranda" className="shrink-0">
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
                <span className={`relative ${active ? "text-sand-100" : ""}`}>{l.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <SyncDot />
          {user ? (
            <div className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-700 text-xs font-medium uppercase text-sand-100"
                aria-label="Menu akun"
              >
                {user.username.slice(0, 2)}
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
                    <div className="px-3 py-2 text-xs text-sand-500">Masuk sebagai {user.username}</div>
                    {sync.kind === "terkunci" && (
                      <Link
                        href="/masuk"
                        onClick={() => setOpen(false)}
                        className="mb-1 block rounded-xl border border-amber-500/30 bg-amber-500/[0.06] px-3 py-2 text-sm text-amber-400 hover:bg-amber-500/[0.12]"
                      >
                        Buka brankas
                        <span className="mt-0.5 block text-[11px] text-sand-500">
                          Kuncinya hilang saat tab ditutup
                        </span>
                      </Link>
                    )}
                    <Link
                      href="/pengaturan"
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-3 py-2 text-sm text-sand-300 hover:bg-ink-700 hover:text-sand-100"
                    >
                      Pengaturan & cadangan
                    </Link>
                    <button
                      onClick={() => {
                        setOpen(false);
                        void logout();
                      }}
                      className="block w-full rounded-xl px-3 py-2 text-left text-sm text-sand-300 hover:bg-ink-700 hover:text-sand-100"
                    >
                      Keluar
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
              Masuk
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
