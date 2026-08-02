"use client";

import { useCallback, useEffect, useState } from "react";
import { METHODS, TRIGGERS, type Draft, type Entry } from "./types";

const KEY = "cadensa.entries.v1";

/**
 * Penyimpanan lokal. Catatan tidak pernah meninggalkan perangkat di versi ini —
 * tidak ada endpoint yang menerimanya, jadi tidak ada yang bisa bocor dari server.
 */
function read(): Entry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Entry[]) : [];
  } catch {
    return [];
  }
}

function write(entries: Entry[]) {
  window.localStorage.setItem(KEY, JSON.stringify(entries));
  window.dispatchEvent(new Event("cadensa:changed"));
}

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setEntries(read());
    sync();
    setReady(true);
    window.addEventListener("cadensa:changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cadensa:changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = useCallback((draft: Draft) => {
    const next = [...read(), { ...draft, id: makeId() }];
    write(next);
    return next;
  }, []);

  const remove = useCallback((id: string) => {
    write(read().filter((e) => e.id !== id));
  }, []);

  const wipe = useCallback(() => write([]), []);

  const seed = useCallback(() => {
    write(buildSample());
  }, []);

  return { entries, ready, add, remove, wipe, seed };
}

/**
 * Data contoh untuk mencoba halaman ritme dan bacaan tanpa menunggu sebulan.
 * Sengaja dibentuk agar beberapa pola benar-benar terbaca: jam bergeser larut,
 * durasi memendek, dan edging panjang yang berujung ngilu.
 */
export function buildSample(now = new Date()): Entry[] {
  const out: Entry[] = [];
  let seedNum = 20260802;
  const rnd = () => {
    seedNum = (seedNum * 1103515245 + 12345) % 2147483648;
    return seedNum / 2147483648;
  };
  const pick = <T,>(xs: readonly T[]) => xs[Math.floor(rnd() * xs.length)];

  for (let dayAgo = 74; dayAgo >= 0; dayAgo--) {
    const recent = dayAgo <= 14;
    const chance = recent ? 0.72 : 0.5;
    if (rnd() > chance) continue;

    const d = new Date(+now - dayAgo * 86_400_000);
    const hour = recent ? (rnd() < 0.6 ? 23 + Math.floor(rnd() * 2) : 14 + Math.floor(rnd() * 6)) : 9 + Math.floor(rnd() * 12);
    d.setHours(hour % 24, Math.floor(rnd() * 60), 0, 0);

    const edging = rnd() < 0.2 ? "lama" : rnd() < 0.45 ? "ringan" : "tidak";
    const durationSec = Math.round((recent ? 3 + rnd() * 6 : 9 + rnd() * 18) * 60);
    const method = pick(METHODS);

    let afterfeel: Entry["afterfeel"];
    if (edging === "lama" && rnd() < 0.6) afterfeel = "ngilu";
    else if (method === "tangan" && rnd() < 0.25) afterfeel = "perih";
    else if (recent && rnd() < 0.55) afterfeel = rnd() < 0.5 ? "netral" : "hampa";
    else afterfeel = rnd() < 0.6 ? "lega" : "nikmat";

    out.push({
      id: makeId() + dayAgo,
      at: d.toISOString(),
      durationSec,
      method,
      edging,
      edgeCycles: edging === "tidak" ? null : 1 + Math.floor(rnd() * 5),
      trigger: recent && rnd() < 0.5 ? (rnd() < 0.5 ? "stres" : "bosan") : pick(TRIGGERS),
      afterfeel,
      note: "",
    });
  }
  return out;
}
