"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Nav } from "@/components/Nav";
import { Magnetic, Pressable, Reveal } from "@/components/Motion";
import { DeviceIcon } from "@/components/DeviceIcon";
import { OptionTile } from "@/components/OptionTile";
import { useVault } from "@/lib/vault";
import {
  AFTERFEELS,
  DEVICE_GROUPS,
  EDGING,
  LUBES,
  METHODS,
  TRIGGERS,
  deviceMeta,
  devicesFor,
  type Afterfeel,
  type Draft,
  type Edging,
  type Lube,
  type Method,
  type Mode,
  type Trigger,
} from "@/lib/types";

function emptyDraft(mode: Mode): Draft {
  return {
    at: new Date().toISOString(),
    durationSec: null,
    method: "tangan",
    device: null,
    lube: null,
    edging: "tidak",
    edgeCycles: null,
    trigger: null,
    afterfeel: "lega",
    note: "",
    mode,
  };
}

export default function LogPage() {
  const { add, entries, profile, ready } = useVault();
  const [draft, setDraft] = useState<Draft>(() => emptyDraft("pria"));
  const [detail, setDetail] = useState(false);
  const [saved, setSaved] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const devices = useMemo(() => devicesFor(profile.mode), [profile.mode]);
  const chosen = deviceMeta(draft.device);

  useEffect(() => {
    setDraft((d) => ({ ...d, mode: profile.mode }));
  }, [profile.mode]);

  useEffect(() => {
    if (running) timer.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    else if (timer.current) clearInterval(timer.current);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [running]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  function save() {
    add({
      ...draft,
      at: new Date().toISOString(),
      durationSec: seconds > 0 ? seconds : draft.durationSec,
    });
    setDraft(emptyDraft(profile.mode));
    setSeconds(0);
    setRunning(false);
    setDetail(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  }

  return (
    <div className="aurora min-h-screen">
      <Nav />
      <main className="mx-auto max-w-2xl px-5 pb-24 pt-12">
        <Reveal>
          <h1 className="text-4xl font-semibold tracking-[-0.025em]">Catat</h1>
          <p className="mt-3 text-sm leading-relaxed text-sand-300">
            Dua pilihan sudah cukup. Sisanya hanya kalau kamu memang ingin tahu lebih banyak nanti.
          </p>
        </Reveal>

        {/* Timer — opsional, tidak pernah menghalangi tombol simpan */}
        <Reveal delay={0.05}>
          <div className="card mt-8 flex items-center justify-between rounded-3xl p-5">
            <div>
              <p className="text-xs text-sand-500">Durasi</p>
              <p className="font-mono text-2xl tabular-nums text-sand-100">
                {String(Math.floor(seconds / 60)).padStart(2, "0")}:
                {String(seconds % 60).padStart(2, "0")}
              </p>
            </div>
            <div className="flex gap-2">
              <Pressable
                onClick={() => setRunning((r) => !r)}
                className="rounded-full border hairline px-5 py-2.5 text-sm text-sand-200"
              >
                {running ? "Jeda" : seconds ? "Lanjut" : "Mulai"}
              </Pressable>
              {seconds > 0 && (
                <Pressable
                  onClick={() => {
                    setSeconds(0);
                    setRunning(false);
                  }}
                  className="rounded-full border hairline px-4 py-2.5 text-sm text-sand-500"
                >
                  Nol
                </Pressable>
              )}
            </div>
          </div>
        </Reveal>

        {/* Cara */}
        <Reveal delay={0.08}>
          <div className="mt-8">
            <p className="mb-3 text-xs uppercase tracking-widest text-sand-500">Cara</p>
            <div className="grid grid-cols-4 gap-2">
              {METHODS.map((m) => (
                <OptionTile
                  key={m}
                  set="method"
                  name={m}
                  label={m}
                  active={draft.method === m}
                  onClick={() => {
                    set("method", m as Method);
                    if (m !== "alat bantu") set("device", null);
                  }}
                />
              ))}
            </div>
          </div>
        </Reveal>

        {/* Alat bantu — muncul hanya kalau relevan */}
        <AnimatePresence>
          {draft.method === "alat bantu" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-8">
                <p className="mb-3 text-xs uppercase tracking-widest text-sand-500">Alat</p>
                <div className="space-y-5">
                  {DEVICE_GROUPS.map((g) => {
                    const items = devices.filter((d) => d.group === g.key);
                    if (!items.length) return null;
                    return (
                      <div key={g.key}>
                        <p className="mb-2 text-xs text-sand-500">{g.label}</p>
                        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                          {items.map((d) => {
                            const on = draft.device === d.key;
                            return (
                              <motion.button
                                key={d.key}
                                type="button"
                                onClick={() => set("device", d.key)}
                                whileHover={{ y: -4, rotateX: 8, rotateY: -6 }}
                                whileTap={{ scale: 0.96 }}
                                transition={{ type: "spring", stiffness: 380, damping: 24 }}
                                style={{ transformStyle: "preserve-3d", perspective: 700 }}
                                className={`flex flex-col gap-2 rounded-2xl border p-4 text-left transition-colors ${
                                  on ? "border-teal-600 bg-teal-600/10" : "hairline hover:border-sand-500/25"
                                }`}
                              >
                                <span className={on ? "text-teal-500" : "text-sand-500"}>
                                  <DeviceIcon device={d.key} size={38} animate={on} />
                                </span>
                                <span className="block text-sm leading-tight text-sand-100">{d.label}</span>
                                <span className="block text-[11px] leading-snug text-sand-500">{d.hint}</span>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {chosen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 rounded-2xl border hairline p-4"
                    >
                      <p className="text-xs text-sand-500">Perawatan</p>
                      <p className="mt-1 text-sm leading-relaxed text-sand-300">{chosen.care}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rasa sesudah */}
        <Reveal delay={0.1}>
          <div className="mt-8">
            <p className="mb-3 text-xs uppercase tracking-widest text-sand-500">Rasanya sesudah</p>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {AFTERFEELS.map((a) => (
                <OptionTile
                  key={a.key}
                  set="feel"
                  name={a.key}
                  label={a.key}
                  size="sm"
                  tone={a.medical ? "signal" : "teal"}
                  active={draft.afterfeel === a.key}
                  onClick={() => set("afterfeel", a.key as Afterfeel)}
                />
              ))}
            </div>
            <p className="mt-3 text-xs text-sand-500">
              Empat yang terakhir bertanda merah karena berhubungan dengan tubuh, bukan suasana
              hati — dan dijawab lewat jalur yang berbeda.
            </p>
          </div>
        </Reveal>

        {/* Detail opsional */}
        <Reveal delay={0.12}>
          <button
            onClick={() => setDetail((v) => !v)}
            className="mt-8 text-sm text-sand-500 underline underline-offset-4 hover:text-sand-300"
          >
            {detail ? "Sembunyikan detail" : "Tambah detail (opsional)"}
          </button>
        </Reveal>

        <AnimatePresence>
          {detail && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-6 space-y-7">
                <div>
                  <p className="mb-3 text-xs uppercase tracking-widest text-sand-500">Pelumas</p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {LUBES.map((l) => (
                      <OptionTile
                        key={l}
                        set="lube"
                        name={l}
                        label={l}
                        size="sm"
                        active={draft.lube === l}
                        onClick={() => set("lube", l as Lube)}
                      />
                    ))}
                  </div>
                  {draft.lube === "berbasis silikon" && chosen && (
                    <p className="mt-2 text-xs text-amber-400">
                      Pelumas silikon bisa merusak permukaan alat berbahan silikon. Untuk alat, yang
                      berbasis air lebih aman.
                    </p>
                  )}
                </div>

                <div>
                  <p className="mb-3 text-xs uppercase tracking-widest text-sand-500">Edging</p>
                  <div className="grid grid-cols-3 gap-2">
                    {EDGING.map((e) => (
                      <OptionTile
                        key={e}
                        set="edge"
                        name={e}
                        label={e}
                        active={draft.edging === e}
                        onClick={() => set("edging", e as Edging)}
                      />
                    ))}
                  </div>
                  {draft.edging !== "tidak" && (
                    <input
                      type="number"
                      min={1}
                      max={20}
                      placeholder="Berapa siklus?"
                      value={draft.edgeCycles ?? ""}
                      onChange={(e) => set("edgeCycles", e.target.value ? Number(e.target.value) : null)}
                      className="mt-3 w-40 rounded-2xl border hairline bg-ink-900/60 px-4 py-2.5 text-sm text-sand-100 outline-none focus:border-teal-600"
                    />
                  )}
                </div>

                <div>
                  <p className="mb-3 text-xs uppercase tracking-widest text-sand-500">Yang memicu</p>
                  <div className="grid grid-cols-4 gap-2">
                    {TRIGGERS.map((t) => (
                      <OptionTile
                        key={t}
                        set="trigger"
                        name={t}
                        label={t}
                        size="sm"
                        active={draft.trigger === t}
                        onClick={() => set("trigger", draft.trigger === t ? null : (t as Trigger))}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-xs uppercase tracking-widest text-sand-500">Catatan</p>
                  <textarea
                    value={draft.note}
                    onChange={(e) => set("note", e.target.value)}
                    rows={3}
                    placeholder="Apa pun yang ingin kamu ingat nanti."
                    className="w-full rounded-2xl border hairline bg-ink-900/60 px-4 py-3 text-sm text-sand-100 outline-none placeholder:text-sand-500 focus:border-teal-600"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Magnetic className="mt-10 inline-block">
          <Pressable
            onClick={save}
            className="rounded-full bg-teal-600 px-8 py-4 text-sm font-medium text-ink-950"
          >
            Simpan
          </Pressable>
        </Magnetic>

        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="card mt-6 flex items-center justify-between rounded-2xl p-4"
            >
              <span className="text-sm text-sand-200">Tersimpan.</span>
              <Link href="/rhythm" className="text-sm text-teal-500 underline underline-offset-4">
                Lihat ritme
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {ready && (
          <p className="mt-10 text-sm text-sand-500">
            {entries.length} catatan tersimpan.{" "}
            <Link href="/pengaturan" className="text-teal-500 underline underline-offset-4">
              Atur cadangan
            </Link>
          </p>
        )}
      </main>
    </div>
  );
}
