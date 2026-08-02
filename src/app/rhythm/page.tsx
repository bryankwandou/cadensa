"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Nav } from "@/components/Nav";
import { Pressable } from "@/components/Motion";
import { useEntries } from "@/lib/store";
import {
  TARGET_BAND,
  bandState,
  cadenceIndex,
  daysInMonth,
  densityByDay,
  edgingLoad,
  lastDays,
  longestGapDays,
  monthProjection,
  positiveShare,
  startOfMonth,
  within,
} from "@/lib/metrics";
import { afterfeelMeta } from "@/lib/types";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function Stat({
  label,
  value,
  hint,
  tone = "netral",
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "netral" | "baik" | "perhatian";
}) {
  const color =
    tone === "baik" ? "text-teal-500" : tone === "perhatian" ? "text-amber-400" : "text-sand-100";
  return (
    <div className="card rounded-3xl p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-sand-500">{label}</p>
      <p className={`mt-3 font-mono text-3xl ${color}`}>{value}</p>
      <p className="mt-2 text-xs leading-relaxed text-sand-500">{hint}</p>
    </div>
  );
}

export default function RhythmPage() {
  const { entries, ready, seed, wipe, remove } = useEntries();
  const [offset, setOffset] = useState(0);

  const anchor = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth() + offset, 1);
  }, [offset]);

  const now = new Date();
  const monthEntries = useMemo(
    () =>
      within(
        entries,
        startOfMonth(anchor),
        new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1),
      ),
    [entries, anchor],
  );

  const days = useMemo(() => densityByDay(entries, anchor), [entries, anchor]);
  const isThisMonth = offset === 0;
  const proj = monthProjection(entries, now);
  const ci = cadenceIndex(lastDays(entries, 30, now));
  const gap = longestGapDays(lastDays(entries, 30, now), now);
  const pos = positiveShare(monthEntries);
  const load = edgingLoad(monthEntries);
  const band = bandState(isThisMonth ? proj.projected : monthEntries.length);
  const maxCount = Math.max(1, ...days.map((d) => d.count));

  const recent = useMemo(
    () => [...entries].sort((a, b) => +new Date(b.at) - +new Date(a.at)).slice(0, 12),
    [entries],
  );

  if (!ready) return <div className="aurora min-h-screen"><Nav /></div>;

  if (!entries.length) {
    return (
      <div className="aurora min-h-screen">
        <Nav />
        <main className="mx-auto max-w-2xl px-5 pt-24 text-center">
          <h1 className="text-3xl font-semibold tracking-[-0.02em]">Belum ada apa-apa di sini</h1>
          <p className="mt-4 leading-relaxed text-sand-300">
            Ritme baru terbaca setelah beberapa catatan. Kalau ingin melihat bentuk halaman ini
            lebih dulu, muat data contoh — semuanya tetap tinggal di perangkat ini dan bisa
            dihapus kapan saja.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/log"
              className="rounded-full bg-teal-500 px-6 py-3 text-sm font-medium text-ink-950"
            >
              Catat yang pertama
            </Link>
            <Pressable
              onClick={seed}
              className="rounded-full border hairline px-6 py-3 text-sm text-sand-100 hover:bg-ink-800"
            >
              Muat data contoh
            </Pressable>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="aurora min-h-screen">
      <Nav />
      <main className="mx-auto max-w-4xl px-5 pb-24 pt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-[-0.02em]">
              {MONTHS[anchor.getMonth()]} {anchor.getFullYear()}
            </h1>
            <p className="mt-2 text-sm text-sand-500">
              {monthEntries.length} catatan
              {isThisMonth && ` · laju saat ini mengarah ke sekitar ${proj.projected}`}
            </p>
          </div>
          <div className="flex gap-2">
            <Pressable
              onClick={() => setOffset((o) => o - 1)}
              className="rounded-full border hairline px-4 py-2 text-sm text-sand-300 hover:bg-ink-800"
            >
              Sebelumnya
            </Pressable>
            <Pressable
              onClick={() => setOffset((o) => Math.min(0, o + 1))}
              disabled={offset >= 0}
              className="rounded-full border hairline px-4 py-2 text-sm text-sand-300 disabled:opacity-40 hover:bg-ink-800"
            >
              Berikutnya
            </Pressable>
          </div>
        </div>

        {/* Pita ritme */}
        <section className="card mt-8 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between text-xs text-sand-500">
            <span>Kepadatan menunjukkan frekuensi, tinggi menunjukkan rasa sesudahnya</span>
            <span className="font-mono">
              pita {TARGET_BAND.low}–{TARGET_BAND.high}
            </span>
          </div>
          <div className="mt-6 flex h-40 items-end gap-[2px]">
            {days.map((d) => {
              const future =
                isThisMonth && d.day > now.getDate();
              const height = d.count === 0 ? 5 : 22 + (d.count / maxCount) * 78;
              const avg = d.count ? d.valence / d.count : 0;
              const bg =
                d.count === 0
                  ? "rgba(214,205,190,0.07)"
                  : avg > 0.2
                    ? "linear-gradient(180deg, var(--color-teal-500), var(--color-teal-700))"
                    : avg < -0.2
                      ? "linear-gradient(180deg, var(--color-amber-400), var(--color-amber-500))"
                      : "linear-gradient(180deg, var(--color-sand-500), var(--color-ink-600))";
              return (
                <motion.div
                  key={d.day}
                  className="group relative flex-1 rounded-full"
                  style={{ background: bg, opacity: future ? 0.3 : 1 }}
                  initial={{ height: "5%" }}
                  animate={{ height: `${height}%` }}
                  transition={{
                    type: "spring",
                    stiffness: 240,
                    damping: 26,
                    delay: d.day * 0.012,
                  }}
                  title={`${d.day} — ${d.count} catatan`}
                />
              );
            })}
          </div>
          <div className="mt-3 flex justify-between font-mono text-[11px] text-sand-500">
            <span>1</span>
            <span>{Math.round(daysInMonth(anchor) / 2)}</span>
            <span>{daysInMonth(anchor)}</span>
          </div>
        </section>

        {/* Metrik */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Cadence Index"
            value={ci == null ? "—" : String(ci)}
            hint="Kemerataan jarak antar kejadian 30 hari terakhir. Bukan jumlah."
            tone={ci == null ? "netral" : ci >= 60 ? "baik" : "perhatian"}
          />
          <Stat
            label="Pita bulan ini"
            value={band === "dalam-pita" ? "dalam" : band === "sepi" ? "sepi" : "padat"}
            hint={`Wilayah ${TARGET_BAND.low}–${TARGET_BAND.high}, digambar sebagai koridor bukan garis.`}
            tone={band === "dalam-pita" ? "baik" : "perhatian"}
          />
          <Stat
            label="Kekosongan terpanjang"
            value={`${Math.round(gap)} hari`}
            hint="Rentang terpanjang tanpa catatan dalam sebulan terakhir."
            tone={gap >= 9 ? "perhatian" : "netral"}
          />
          <Stat
            label="Rasa yang enak"
            value={pos == null ? "—" : `${Math.round(pos * 100)}%`}
            hint="Bagian catatan bulan ini yang ditandai lega atau nikmat."
            tone={pos != null && pos < 0.4 ? "perhatian" : "baik"}
          />
        </section>

        <p className="mt-4 text-xs text-sand-500">
          Beban edging bulan ini: <span className="font-mono">{Math.round(load)}</span>
        </p>

        <div className="mt-8">
          <Link href="/insights" className="text-sm text-teal-500 hover:text-teal-600">
            Baca apa yang terbaca dari pola ini
          </Link>
        </div>

        {/* Riwayat */}
        <section className="mt-14">
          <h2 className="text-xs uppercase tracking-[0.18em] text-sand-500">Terakhir dicatat</h2>
          <ul className="mt-4 divide-y divide-[rgba(214,205,190,0.08)]">
            {recent.map((e) => {
              const d = new Date(e.at);
              const meta = afterfeelMeta(e.afterfeel);
              return (
                <li key={e.id} className="flex items-center justify-between gap-4 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-sand-100">
                      {d.getDate()} {MONTHS[d.getMonth()].slice(0, 3)} ·{" "}
                      {String(d.getHours()).padStart(2, "0")}.
                      {String(d.getMinutes()).padStart(2, "0")} · {e.method}
                    </p>
                    <p className="mt-1 text-xs text-sand-500">
                      {e.durationSec ? `${Math.round(e.durationSec / 60)} menit` : "durasi tidak dicatat"}
                      {e.edging !== "tidak" && ` · edging ${e.edging}`}
                      {e.trigger && ` · ${e.trigger}`}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        meta.medical
                          ? "bg-signal-500/12 text-signal-500"
                          : meta.valence > 0
                            ? "bg-teal-500/12 text-teal-500"
                            : "bg-ink-700 text-sand-300"
                      }`}
                    >
                      {e.afterfeel}
                    </span>
                    <button
                      onClick={() => remove(e.id)}
                      className="text-xs text-sand-500 hover:text-sand-100"
                      aria-label="Hapus catatan ini"
                    >
                      hapus
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Pressable
            onClick={seed}
            className="rounded-full border hairline px-5 py-2.5 text-sm text-sand-300 hover:bg-ink-800"
          >
            Ganti dengan data contoh
          </Pressable>
          <Pressable
            onClick={() => {
              if (confirm("Hapus semua catatan di perangkat ini? Tidak ada salinan lain.")) wipe();
            }}
            className="rounded-full border border-signal-500/40 px-5 py-2.5 text-sm text-signal-500 hover:bg-signal-500/10"
          >
            Hapus semua
          </Pressable>
        </div>
      </main>
    </div>
  );
}
