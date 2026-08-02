import { afterfeelMeta, type Entry } from "./types";

export const DAY_MS = 86_400_000;

/** Wilayah target, bukan garis. 21 adalah tengahnya. */
export const TARGET_BAND = { low: 18, mid: 21, high: 24 } as const;

export function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

export function sortedByTime(entries: Entry[]) {
  return [...entries].sort((a, b) => +new Date(a.at) - +new Date(b.at));
}

export function within(entries: Entry[], from: Date, to: Date) {
  return entries.filter((e) => {
    const t = +new Date(e.at);
    return t >= +from && t < +to;
  });
}

export function lastDays(entries: Entry[], days: number, now = new Date()) {
  return within(entries, new Date(+now - days * DAY_MS), new Date(+now + 1000));
}

function median(xs: number[]) {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function mean(xs: number[]) {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

/** Jarak antar kejadian berurutan, dalam hari. */
export function gapsInDays(entries: Entry[]) {
  const s = sortedByTime(entries);
  const gaps: number[] = [];
  for (let i = 1; i < s.length; i++) {
    gaps.push((+new Date(s[i].at) - +new Date(s[i - 1].at)) / DAY_MS);
  }
  return gaps;
}

/**
 * Cadence Index — seberapa merata jarak antar kejadian, 0..100.
 * Sengaja tidak menghitung jumlah: dua orang dengan jumlah sama bisa punya
 * indeks sangat berbeda kalau yang satu menumpuk di akhir bulan.
 * Dihitung dari koefisien variasi jarak; CV 0 berarti sempurna merata.
 */
export function cadenceIndex(entries: Entry[]): number | null {
  const gaps = gapsInDays(entries);
  if (gaps.length < 3) return null;
  const m = mean(gaps);
  if (m <= 0) return null;
  const sd = Math.sqrt(mean(gaps.map((g) => (g - m) ** 2)));
  const cv = sd / m;
  return Math.round(Math.max(0, Math.min(100, (1 - cv / 1.4) * 100)));
}

/** Rentang kekosongan terpanjang dalam jendela waktu, dalam hari. */
export function longestGapDays(entries: Entry[], now = new Date()): number {
  const s = sortedByTime(entries);
  if (!s.length) return 0;
  const gaps = gapsInDays(s);
  const trailing = (+now - +new Date(s[s.length - 1].at)) / DAY_MS;
  return Math.max(0, ...gaps, trailing);
}

/** Perkiraan total akhir bulan berdasarkan laju sampai hari ini. */
export function monthProjection(entries: Entry[], now = new Date()) {
  const som = startOfMonth(now);
  const dim = daysInMonth(now);
  const soFar = within(entries, som, new Date(+now + 1000)).length;
  const elapsed = Math.max(0.5, (+now - +som) / DAY_MS);
  return {
    soFar,
    daysInMonth: dim,
    projected: Math.round((soFar / elapsed) * dim),
  };
}

/** Akumulasi beban edging bulan berjalan — berkorelasi dengan keluhan nyeri. */
export function edgingLoad(entries: Entry[]) {
  const weight = { tidak: 0, ringan: 1, lama: 2.5 } as const;
  return entries.reduce((sum, e) => sum + weight[e.edging], 0);
}

export function positiveShare(entries: Entry[]) {
  if (!entries.length) return null;
  const pos = entries.filter((e) => afterfeelMeta(e.afterfeel).valence > 0).length;
  return pos / entries.length;
}

export function medicalFlagCount(entries: Entry[]) {
  return entries.filter((e) => afterfeelMeta(e.afterfeel).medical).length;
}

export function medianDurationSec(entries: Entry[]) {
  return median(entries.map((e) => e.durationSec).filter((d): d is number => d != null));
}

/** Bagian kejadian yang jatuh antara 23.00 dan 04.00. */
export function lateNightShare(entries: Entry[]) {
  if (!entries.length) return null;
  const late = entries.filter((e) => {
    const h = new Date(e.at).getHours();
    return h >= 23 || h < 4;
  }).length;
  return late / entries.length;
}

export function triggerCount(entries: Entry[], keys: string[]) {
  return entries.filter((e) => e.trigger && keys.includes(e.trigger)).length;
}

export type BandState = "sepi" | "dalam-pita" | "padat";

export function bandState(projected: number): BandState {
  if (projected < TARGET_BAND.low) return "sepi";
  if (projected > TARGET_BAND.high) return "padat";
  return "dalam-pita";
}

/** Kepadatan per hari untuk kalender ritme. */
export function densityByDay(entries: Entry[], monthAnchor: Date) {
  const dim = daysInMonth(monthAnchor);
  const days = Array.from({ length: dim }, (_, i) => ({
    day: i + 1,
    count: 0,
    valence: 0,
  }));
  for (const e of entries) {
    const d = new Date(e.at);
    if (d.getMonth() !== monthAnchor.getMonth() || d.getFullYear() !== monthAnchor.getFullYear())
      continue;
    const slot = days[d.getDate() - 1];
    slot.count += 1;
    slot.valence += afterfeelMeta(e.afterfeel).valence;
  }
  return days;
}
