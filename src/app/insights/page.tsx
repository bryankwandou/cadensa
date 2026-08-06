"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Nav } from "@/components/Nav";
import { Stagger, StaggerItem, Pressable, Reveal } from "@/components/Motion";
import { useVault } from "@/lib/vault";
import { readAll, type Reading, type ReadingKind } from "@/lib/signals";
import {
  cadenceIndex,
  lastDays,
  longestGapDays,
  medianDurationSec,
  positiveShare,
  startOfMonth,
  within,
} from "@/lib/metrics";
import { cycleCoupling, peakPhase } from "@/lib/cycle";

const KIND_LABEL: Record<ReadingKind, string> = {
  medis: "Perlu diperiksa",
  sinyal: "Yang tubuhmu tunjukkan",
  ritme: "Ritme",
  praktik: "Praktik",
};

const KIND_STYLE: Record<ReadingKind, string> = {
  medis: "border-signal-500/40 text-signal-500",
  sinyal: "border-amber-400/40 text-amber-400",
  ritme: "border-teal-700/50 text-teal-500",
  praktik: "hairline text-sand-300",
};

/** Urutan tetap: yang menyangkut tubuh selalu dibaca lebih dulu. */
const ORDER: ReadingKind[] = ["medis", "sinyal", "ritme", "praktik"];

function menit(detik: number | null) {
  if (detik == null) return "—";
  return `${Math.round(detik / 60)}m`;
}

function bagian(rasio: number | null) {
  return rasio == null ? "—" : Math.round(rasio * 100);
}

export default function InsightsPage() {
  const { entries, ready, seed, profile } = useVault();
  const readings = useMemo(() => readAll(entries, profile), [entries, profile]);

  /**
   * Ringkasan angka di kepala halaman.
   *
   * Sebelumnya halaman ini langsung menumpuk kartu bacaan, dan itu membuat orang
   * membaca kesimpulan tanpa pernah melihat dasarnya. Empat angka ini bukan
   * hiasan: tiap bacaan di bawahnya lahir dari salah satunya, jadi menaruhnya
   * lebih dulu membuat kesimpulannya bisa ditimbang, bukan sekadar dipercaya.
   */
  const ringkas = useMemo(() => {
    const now = new Date();
    const bulan = within(entries, startOfMonth(now), now).length;
    if (profile.mode === "wanita") {
      return [
        { l: "Keterikatan siklus", v: cycleCoupling(entries, profile.cycle) ?? "—", s: "/100" },
        { l: "Fase puncak", v: peakPhase(entries, profile.cycle) ?? "—", s: "" },
        { l: "Bulan ini", v: bulan, s: "catatan" },
        { l: "Rasa positif", v: bagian(positiveShare(entries)), s: "%" },
      ];
    }
    return [
      { l: "Cadence Index", v: cadenceIndex(lastDays(entries, 30, now)) ?? "—", s: "/100" },
      { l: "Bulan ini", v: bulan, s: "catatan" },
      { l: "Kekosongan terpanjang", v: Math.round(longestGapDays(entries, now)), s: "hari" },
      { l: "Durasi tengah", v: menit(medianDurationSec(entries)), s: "" },
    ];
  }, [entries, profile]);

  /**
   * Rangka, bukan layar kosong.
   *
   * Brankas dibuka di peramban, jadi selalu ada jeda sebelum ada yang bisa
   * digambar. Halaman yang kosong selama jeda itu terbaca sebagai gagal memuat,
   * dan di aplikasi yang menyimpan catatan pribadi, "gagal memuat" adalah
   * ketakutan yang paling mahal.
   */
  if (!ready)
    return (
      <div className="aurora min-h-screen">
        <Nav />
        <main className="mx-auto max-w-3xl px-5 pb-24 pt-12" aria-busy>
          <div className="h-3 w-32 animate-pulse rounded-full bg-ink-700" />
          <div className="mt-5 h-10 w-44 animate-pulse rounded-full bg-ink-700" />
          <div className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-panel border hairline sm:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="surface h-24 animate-pulse" />
            ))}
          </div>
          <div className="mt-12 space-y-3.5">
            {[0, 1].map((i) => (
              <div key={i} className="surface h-52 animate-pulse rounded-panel" />
            ))}
          </div>
        </main>
      </div>
    );

  const kelompok = ORDER.map((k) => ({ kind: k, items: readings.filter((r) => r.kind === k) })).filter(
    (g) => g.items.length,
  );

  return (
    <div className="aurora min-h-screen">
      <Nav />
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-12">
        <Reveal>
          <p className="eyebrow">Dihitung di perangkat ini</p>
          <h1 className="display mt-2.5 text-[2.4rem] sm:text-[2.75rem]">Bacaan</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-sand-500">
            Semua di halaman ini dihitung dari catatan yang tersimpan di peramban ini. Tidak ada satu
            pun permintaan jaringan yang membawa isinya keluar.
          </p>
        </Reveal>

        {entries.length >= 3 && (
          <Reveal delay={0.05}>
            <div className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-panel border hairline sm:grid-cols-4">
              {ringkas.map((x) => (
                <div key={x.l} className="surface px-4 py-5">
                  <p className="eyebrow text-[9px]">{x.l}</p>
                  <p className="num mt-2 text-[1.6rem] leading-none text-teal-400">
                    {typeof x.v === "string" && x.v.length > 4 ? (
                      <span className="text-lg capitalize">{x.v}</span>
                    ) : (
                      x.v
                    )}
                    {x.s && <span className="ml-1 text-[11px] text-sand-500">{x.s}</span>}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {readings.length === 0 ? (
          <Reveal delay={0.08}>
            <div className="surface mt-9 rounded-panel p-8">
              <p className="leading-relaxed text-sand-300">
                {entries.length < 3
                  ? "Pola baru muncul setelah beberapa catatan. Tiga adalah batas paling awal di mana angka apa pun masih berarti sesuatu."
                  : "Belum ada pola yang cukup jelas untuk dituliskan. Itu bukan kabar buruk — artinya tidak ada yang menonjol dari ritmemu belakangan ini."}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/log"
                  className="rounded-full bg-teal-500 px-5 py-2.5 text-sm font-medium text-ink-975 transition-colors hover:bg-teal-400"
                >
                  Catat
                </Link>
                {entries.length === 0 && (
                  <Pressable
                    onClick={seed}
                    className="rounded-full border hairline px-5 py-2.5 text-sm text-sand-100 hover:bg-ink-800"
                  >
                    Muat data contoh
                  </Pressable>
                )}
              </div>
            </div>
          </Reveal>
        ) : (
          <div className="mt-12 space-y-12">
            {kelompok.map((g, gi) => (
              <section key={g.kind}>
                <Reveal>
                  <p className="eyebrow flex items-center gap-3">
                    <span className={g.kind === "medis" ? "text-signal-500" : "text-teal-600"}>
                      {String(gi + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px w-8 bg-sand-500/30" />
                    {KIND_LABEL[g.kind]}
                  </p>
                </Reveal>

                <Stagger className="mt-5 space-y-3.5">
                  {g.items.map((r) => (
                    <StaggerItem key={r.id}>
                      <Kartu r={r} />
                    </StaggerItem>
                  ))}
                </Stagger>
              </section>
            ))}
          </div>
        )}

        <p className="mt-14 border-t hairline pt-6 text-xs leading-relaxed text-sand-500">
          Cadensa bukan alat diagnosis dan tidak menggantikan pemeriksaan. Kalau ada nyeri berulang,
          darah, atau keluhan yang menetap, temui dokter.
        </p>
      </main>
    </div>
  );
}

/**
 * Kartu bacaan.
 *
 * Bacaan medis diberi pita merah di tepi kiri, bukan sekadar cincin di sekeliling
 * kartu. Bedanya terasa saat menggulir cepat: tepi berwarna tetap terbaca dengan
 * ekor mata, sedangkan cincin tipis hilang di antara kartu lain.
 */
function Kartu({ r }: { r: Reading }) {
  const medis = r.kind === "medis";
  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 340, damping: 26 }}
      className={`surface overflow-hidden rounded-panel ${medis ? "border-signal-500/25" : ""}`}
    >
      <div className="flex">
        {medis && <span className="w-1 shrink-0 bg-signal-500/70" aria-hidden />}
        <div className="min-w-0 p-6 sm:p-8">
          <span
            className={`inline-block rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${KIND_STYLE[r.kind]}`}
          >
            {KIND_LABEL[r.kind]}
          </span>
          <h2 className="display-sm mt-4 text-xl text-sand-100 sm:text-2xl">{r.title}</h2>
          <p className="mt-3.5 leading-relaxed text-sand-300">{r.body}</p>
          <div className="surface-sunken mt-6 rounded-card p-5">
            <p className="eyebrow">Satu langkah</p>
            <p className="mt-2.5 text-sm leading-relaxed text-sand-100">{r.action}</p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
