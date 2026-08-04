"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Stagger, StaggerItem, Pressable } from "@/components/Motion";
import { useVault } from "@/lib/vault";
import { readAll, type ReadingKind } from "@/lib/signals";

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

export default function InsightsPage() {
  const { entries, ready, seed, profile } = useVault();
  const readings = useMemo(() => readAll(entries, profile), [entries, profile]);

  if (!ready) return <div className="aurora min-h-screen"><Nav /></div>;

  return (
    <div className="aurora min-h-screen">
      <Nav />
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-12">
        <p className="eyebrow">Di perangkat ini</p>
        <h1 className="display mt-2.5 text-[2.75rem]">Bacaan</h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-sand-500">
          Semua di halaman ini dihitung di perangkatmu, dari catatan yang tersimpan di browser
          ini. Tidak ada permintaan jaringan yang membawa isinya keluar.
        </p>

        {readings.length === 0 ? (
          <div className="surface mt-10 rounded-panel p-8">
            <p className="leading-relaxed text-sand-300">
              {entries.length < 3
                ? "Pola baru muncul setelah beberapa catatan. Tiga adalah batas paling awal di mana angka apa pun masih berarti sesuatu."
                : "Belum ada pola yang cukup jelas untuk dituliskan. Itu bukan kabar buruk — artinya tidak ada yang menonjol dari ritmemu belakangan ini."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/log"
                className="rounded-full bg-teal-500 px-5 py-2.5 text-sm font-medium text-ink-950"
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
        ) : (
          <Stagger className="mt-10 space-y-4">
            {readings.map((r) => (
              <StaggerItem
                key={r.id}
                className={`surface rounded-panel p-8 ${
                  r.kind === "medis" ? "ring-1 ring-signal-500/25" : ""
                }`}
              >
                <span
                  className={`inline-block rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] ${KIND_STYLE[r.kind]}`}
                >
                  {KIND_LABEL[r.kind]}
                </span>
                <h2 className="display-sm mt-5 text-2xl text-sand-100">{r.title}</h2>
                <p className="mt-4 leading-relaxed text-sand-300">{r.body}</p>
                <div className="surface-sunken mt-6 rounded-card p-5">
                  <p className="eyebrow">Satu langkah</p>
                  <p className="mt-2.5 text-sm leading-relaxed text-sand-100">{r.action}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        )}

        <p className="mt-12 text-xs leading-relaxed text-sand-500">
          Cadensa bukan alat diagnosis dan tidak menggantikan pemeriksaan. Kalau ada nyeri
          berulang, darah, atau keluhan yang menetap, temui dokter.
        </p>
      </main>
    </div>
  );
}
