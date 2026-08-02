export const METHODS = ["tangan", "pelumas", "alat bantu", "hubungan seksual"] as const;
export type Method = (typeof METHODS)[number];

export const EDGING = ["tidak", "ringan", "lama"] as const;
export type Edging = (typeof EDGING)[number];

export const TRIGGERS = [
  "dorongan alami",
  "stres",
  "bosan",
  "kebiasaan jam segini",
  "rangsangan visual",
  "keintiman pasangan",
] as const;
export type Trigger = (typeof TRIGGERS)[number];

/** Rasa sesudah. `valence` dipakai mesin sinyal; `medical` menandai keluhan fisik. */
export const AFTERFEELS = [
  { key: "lega", valence: 1, medical: false },
  { key: "nikmat", valence: 1, medical: false },
  { key: "netral", valence: 0, medical: false },
  { key: "hampa", valence: -1, medical: false },
  { key: "ngilu", valence: -1, medical: true },
  { key: "perih", valence: -1, medical: true },
  { key: "nyeri", valence: -1, medical: true },
] as const;
export type Afterfeel = (typeof AFTERFEELS)[number]["key"];

export type Entry = {
  id: string;
  /** ISO 8601 waktu kejadian. */
  at: string;
  /** Durasi mulai sampai ejakulasi, dalam detik. null = pengguna tidak tahu. */
  durationSec: number | null;
  method: Method;
  edging: Edging;
  /** Jumlah siklus edging, kalau dicatat. */
  edgeCycles: number | null;
  trigger: Trigger | null;
  afterfeel: Afterfeel;
  note: string;
};

export type Draft = Omit<Entry, "id">;

export function afterfeelMeta(key: Afterfeel) {
  return AFTERFEELS.find((a) => a.key === key) ?? AFTERFEELS[2];
}
