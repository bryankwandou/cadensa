import type { CycleProfile, Entry } from "./types";

/**
 * Mode wanita.
 *
 * Angka 21 tidak dipindahkan ke sini. Temuan yang mendasari mode pria berasal dari
 * penelitian tentang prostat — organ yang tidak ada di tubuh perempuan — jadi memakai
 * ulang angkanya akan menjadi klaim kesehatan yang tidak punya dasar. Yang dipakai
 * sebagai gantinya adalah pertanyaan yang memang punya jawaban: apakah dorongan naik
 * dan turun mengikuti siklus, dan apakah polanya berulang dari bulan ke bulan.
 *
 * Karena itu mode wanita membaca ritme terhadap fase siklus, bukan terhadap target.
 */

export const PHASES = ["haid", "folikular", "ovulasi", "luteal"] as const;
export type Phase = (typeof PHASES)[number];

export const PHASE_NOTE: Record<Phase, string> = {
  haid: "Hari-hari haid. Sebagian orang justru merasa lebih lega, sebagian lain tidak berminat sama sekali. Keduanya lumrah.",
  folikular: "Setelah haid selesai. Tenaga biasanya naik pelan-pelan.",
  ovulasi: "Sekitar pelepasan sel telur. Di banyak catatan, ini titik dorongan tertinggi.",
  luteal: "Menjelang haid berikutnya. Suasana hati lebih mudah bergeser, dan dorongan bisa ikut bergeser.",
};

export function dayInCycle(at: string | Date, p: CycleProfile): number | null {
  if (!p.lastPeriodStart) return null;
  const start = new Date(p.lastPeriodStart + "T00:00:00");
  const d = new Date(at);
  const len = Math.max(20, Math.min(45, p.cycleLengthDays));
  const diff = Math.floor((+d - +start) / 86_400_000);
  if (diff < 0) {
    // Catatan sebelum tanggal acuan tetap dipetakan, bukan dibuang.
    return ((diff % len) + len) % len + 1;
  }
  return (diff % len) + 1;
}

export function phaseOfDay(day: number, p: CycleProfile): Phase {
  const len = Math.max(20, Math.min(45, p.cycleLengthDays));
  const period = Math.max(1, Math.min(10, p.periodLengthDays));
  const ovulation = len - 14;
  if (day <= period) return "haid";
  if (day >= ovulation - 1 && day <= ovulation + 1) return "ovulasi";
  if (day < ovulation - 1) return "folikular";
  return "luteal";
}

export function phaseOf(at: string | Date, p: CycleProfile): Phase | null {
  const d = dayInCycle(at, p);
  return d === null ? null : phaseOfDay(d, p);
}

/** Sebaran catatan per fase, dinormalkan terhadap panjang tiap fase. */
export function phaseDensity(entries: Entry[], p: CycleProfile) {
  const len = Math.max(20, Math.min(45, p.cycleLengthDays));
  const spanDays: Record<Phase, number> = { haid: 0, folikular: 0, ovulasi: 0, luteal: 0 };
  for (let d = 1; d <= len; d++) spanDays[phaseOfDay(d, p)]++;

  const count: Record<Phase, number> = { haid: 0, folikular: 0, ovulasi: 0, luteal: 0 };
  let mapped = 0;
  for (const e of entries) {
    const ph = phaseOf(e.at, p);
    if (!ph) continue;
    count[ph]++;
    mapped++;
  }

  return PHASES.map((ph) => ({
    phase: ph,
    count: count[ph],
    days: spanDays[ph],
    /** Catatan per hari fase — satu-satunya cara membandingkan fase yang panjangnya beda. */
    perDay: spanDays[ph] ? count[ph] / spanDays[ph] : 0,
    share: mapped ? count[ph] / mapped : 0,
  }));
}

/**
 * Seberapa kuat dorongan terikat siklus. Membandingkan fase terpadat dengan rata-rata.
 * 0 = tersebar rata (tidak terikat siklus), 100 = sangat terpusat di satu fase.
 */
export function cycleCoupling(entries: Entry[], p: CycleProfile): number | null {
  if (!p.lastPeriodStart || entries.length < 8) return null;
  const rows = phaseDensity(entries, p);
  const rates = rows.map((r) => r.perDay);
  const mean = rates.reduce((a, b) => a + b, 0) / rates.length;
  if (mean <= 0) return null;
  const peak = Math.max(...rates);
  const lift = (peak - mean) / mean; // 0 kalau rata
  return Math.round(Math.max(0, Math.min(1, lift / 1.5)) * 100);
}

export function peakPhase(entries: Entry[], p: CycleProfile): Phase | null {
  if (!p.lastPeriodStart || entries.length < 8) return null;
  const rows = phaseDensity(entries, p);
  return rows.reduce((a, b) => (b.perDay > a.perDay ? b : a)).phase;
}

export function daysUntilNextPeriod(p: CycleProfile, now = new Date()): number | null {
  const d = dayInCycle(now, p);
  if (d === null) return null;
  const len = Math.max(20, Math.min(45, p.cycleLengthDays));
  return len - d + 1;
}
