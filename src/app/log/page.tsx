"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Nav } from "@/components/Nav";
import { Pressable } from "@/components/Motion";
import { useEntries } from "@/lib/store";
import {
  AFTERFEELS,
  EDGING,
  METHODS,
  TRIGGERS,
  type Afterfeel,
  type Edging,
  type Method,
  type Trigger,
} from "@/lib/types";

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Pressable
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-2.5 text-sm transition-colors ${
        active
          ? "border-teal-500 bg-teal-500/12 text-teal-500"
          : "hairline text-sand-300 hover:bg-ink-800"
      }`}
    >
      {children}
    </Pressable>
  );
}

function clock(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function LogPage() {
  const { add, entries } = useEntries();

  const [method, setMethod] = useState<Method | null>(null);
  const [afterfeel, setAfterfeel] = useState<Afterfeel | null>(null);
  const [edging, setEdging] = useState<Edging>("tidak");
  const [edgeCycles, setEdgeCycles] = useState<number | null>(null);
  const [trigger, setTrigger] = useState<Trigger | null>(null);
  const [note, setNote] = useState("");
  const [manualMin, setManualMin] = useState("");
  const [detail, setDetail] = useState(false);
  const [saved, setSaved] = useState(false);

  // Timer opsional.
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      tick.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } else if (tick.current) {
      clearInterval(tick.current);
      tick.current = null;
    }
    return () => {
      if (tick.current) clearInterval(tick.current);
    };
  }, [running]);

  const durationSec = useMemo(() => {
    if (elapsed > 0) return elapsed;
    const m = parseFloat(manualMin);
    return Number.isFinite(m) && m > 0 ? Math.round(m * 60) : null;
  }, [elapsed, manualMin]);

  const ready = method != null && afterfeel != null;

  function reset() {
    setMethod(null);
    setAfterfeel(null);
    setEdging("tidak");
    setEdgeCycles(null);
    setTrigger(null);
    setNote("");
    setManualMin("");
    setElapsed(0);
    setRunning(false);
    setDetail(false);
  }

  function save() {
    if (!ready) return;
    add({
      at: new Date().toISOString(),
      durationSec,
      method: method!,
      edging,
      edgeCycles,
      trigger,
      afterfeel: afterfeel!,
      note: note.trim(),
    });
    reset();
    setSaved(true);
    setTimeout(() => setSaved(false), 2600);
  }

  return (
    <div className="aurora min-h-screen">
      <Nav />
      <main className="mx-auto max-w-2xl px-5 pb-24 pt-12">
        <h1 className="text-3xl font-semibold tracking-[-0.02em]">Catat</h1>
        <p className="mt-3 text-sm leading-relaxed text-sand-500">
          Dua pilihan sudah cukup untuk menyimpan. Sisanya muncul kalau kamu memang sedang ingin
          menambah detail.
        </p>

        {/* Wajib */}
        <section className="mt-10">
          <h2 className="text-xs uppercase tracking-[0.18em] text-sand-500">Caranya</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {METHODS.map((m) => (
              <Chip key={m} active={method === m} onClick={() => setMethod(m)}>
                {m}
              </Chip>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xs uppercase tracking-[0.18em] text-sand-500">Rasanya sesudah</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {AFTERFEELS.map((a) => (
              <Chip key={a.key} active={afterfeel === a.key} onClick={() => setAfterfeel(a.key)}>
                {a.key}
              </Chip>
            ))}
          </div>
        </section>

        {/* Durasi */}
        <section className="mt-8 card rounded-3xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xs uppercase tracking-[0.18em] text-sand-500">Durasi</h2>
              <p className="mt-2 font-mono text-3xl text-sand-100">{clock(elapsed)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Pressable
                type="button"
                onClick={() => setRunning((r) => !r)}
                className="rounded-full border hairline px-5 py-2.5 text-sm text-sand-100 hover:bg-ink-800"
              >
                {running ? "Jeda" : elapsed > 0 ? "Lanjut" : "Mulai timer"}
              </Pressable>
              {elapsed > 0 && (
                <Pressable
                  type="button"
                  onClick={() => {
                    setElapsed(0);
                    setRunning(false);
                  }}
                  className="rounded-full px-3 py-2.5 text-sm text-sand-500 hover:text-sand-100"
                >
                  Nol
                </Pressable>
              )}
            </div>
          </div>
          {elapsed === 0 && (
            <label className="mt-5 flex items-center gap-3 text-sm text-sand-300">
              atau isi manual
              <input
                inputMode="decimal"
                value={manualMin}
                onChange={(e) => setManualMin(e.target.value)}
                placeholder="menit"
                className="w-28 rounded-xl border hairline bg-ink-900/60 px-3 py-2 font-mono text-sand-100 outline-none focus:border-teal-700"
              />
              <span className="text-sand-500">boleh dikosongkan</span>
            </label>
          )}
        </section>

        {/* Detail opsional */}
        <button
          type="button"
          onClick={() => setDetail((d) => !d)}
          className="mt-8 text-sm text-teal-500 hover:text-teal-600"
        >
          {detail ? "Sembunyikan detail" : "Mau tambah detail?"}
        </button>

        <AnimatePresence initial={false}>
          {detail && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-6">
                <h2 className="text-xs uppercase tracking-[0.18em] text-sand-500">Edging</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {EDGING.map((e) => (
                    <Chip
                      key={e}
                      active={edging === e}
                      onClick={() => {
                        setEdging(e);
                        if (e === "tidak") setEdgeCycles(null);
                      }}
                    >
                      {e}
                    </Chip>
                  ))}
                </div>
                {edging !== "tidak" && (
                  <label className="mt-4 flex items-center gap-3 text-sm text-sand-300">
                    Berapa siklus
                    <input
                      inputMode="numeric"
                      value={edgeCycles ?? ""}
                      onChange={(e) => setEdgeCycles(e.target.value ? +e.target.value : null)}
                      className="w-20 rounded-xl border hairline bg-ink-900/60 px-3 py-2 font-mono text-sand-100 outline-none focus:border-teal-700"
                    />
                  </label>
                )}
              </div>

              <div className="pt-6">
                <h2 className="text-xs uppercase tracking-[0.18em] text-sand-500">
                  Yang mendorong
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {TRIGGERS.map((t) => (
                    <Chip
                      key={t}
                      active={trigger === t}
                      onClick={() => setTrigger(trigger === t ? null : t)}
                    >
                      {t}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <h2 className="text-xs uppercase tracking-[0.18em] text-sand-500">Catatan</h2>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="mt-3 w-full resize-none rounded-2xl border hairline bg-ink-900/60 px-4 py-3 text-sm text-sand-100 outline-none focus:border-teal-700"
                  placeholder="Kalau ada yang ingin diingat nanti."
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Simpan */}
        <div className="sticky bottom-6 mt-10">
          <Pressable
            type="button"
            onClick={save}
            disabled={!ready}
            className={`w-full rounded-2xl px-6 py-4 text-sm font-medium transition-colors ${
              ready
                ? "bg-teal-500 text-ink-950"
                : "cursor-not-allowed bg-ink-700 text-sand-500"
            }`}
          >
            {ready ? "Simpan catatan" : "Pilih caranya dan rasanya"}
          </Pressable>
        </div>

        <AnimatePresence>
          {saved && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-center text-sm text-teal-500"
            >
              Tersimpan di perangkat ini. <Link href="/rhythm" className="underline">Lihat ritme</Link>
            </motion.p>
          )}
        </AnimatePresence>

        <p className="mt-10 text-center text-xs text-sand-500">
          {entries.length} catatan tersimpan di browser ini.
        </p>
      </main>
    </div>
  );
}
