export const MODES = ["pria", "wanita"] as const;
export type Mode = (typeof MODES)[number];

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
  "susah tidur",
  "kesepian",
] as const;
export type Trigger = (typeof TRIGGERS)[number];

/**
 * Katalog alat bantu.
 *
 * Ada dua alasan rinciannya sampai sejauh ini. Pertama, gesekan dan tekanan tiap
 * jenis berbeda jauh, dan itu satu-satunya cara menjelaskan kenapa keluhan fisik
 * muncul pada sebagian orang saja. Kedua, penyebutan yang tepat menghilangkan rasa
 * canggung — orang berhenti mencari kata pengganti untuk barang yang dia punya.
 *
 * `intensity` memperkirakan beban gesekan/tekanan relatif (0–1), dipakai mesin
 * sinyal untuk memisahkan keluhan yang berasal dari alat dari keluhan yang berasal
 * dari pola. `care` adalah pengingat perawatan yang tidak diberikan sebagai ceramah.
 */
export type DeviceGroup = "getar" | "isap" | "sarung" | "boneka" | "mesin" | "cincin" | "dalam" | "lain";

export type Device = {
  key: string;
  label: string;
  group: DeviceGroup;
  /** Untuk mode mana alat ini ditawarkan lebih dulu. */
  modes: Mode[];
  hint: string;
  intensity: number;
  care: string;
};

export const DEVICES: Device[] = [
  // — Getar —
  { key: "vibrator-batang", label: "Vibrator batang", group: "getar", modes: ["pria", "wanita"], hint: "Getar merata sepanjang badan alat.", intensity: 0.5, care: "Cuci air hangat sabun lembut, keringkan sebelum disimpan." },
  { key: "vibrator-peluru", label: "Vibrator peluru", group: "getar", modes: ["pria", "wanita"], hint: "Kecil, getarnya terpusat di satu titik.", intensity: 0.45, care: "Lepas baterai kalau lama tidak dipakai." },
  { key: "vibrator-klitoris", label: "Vibrator klitoris", group: "getar", modes: ["wanita"], hint: "Menempel di luar, tidak masuk.", intensity: 0.5, care: "Bersihkan tiap pakai, hindari rendam kalau tidak tahan air." },
  { key: "vibrator-rabbit", label: "Rabbit", group: "getar", modes: ["wanita"], hint: "Dua titik sekaligus, dalam dan luar.", intensity: 0.65, care: "Silikon: jangan dipasangkan dengan pelumas silikon." },
  { key: "wand", label: "Wand / massager", group: "getar", modes: ["pria", "wanita"], hint: "Kepala besar, getaran paling kuat.", intensity: 0.85, care: "Intensitas tinggi — beri jeda kalau area mulai kebas." },
  { key: "prostat", label: "Pemijat prostat", group: "dalam", modes: ["pria"], hint: "Melengkung, untuk rangsang dari dalam.", intensity: 0.6, care: "Wajib pelumas berbasis air dan alas melebar. Jangan tanpa pelumas." },
  { key: "plug", label: "Plug", group: "dalam", modes: ["pria", "wanita"], hint: "Diam di tempat, tidak bergerak.", intensity: 0.4, care: "Hanya yang beralas lebar. Naikkan ukuran perlahan." },

  // — Isap / tekanan —
  { key: "sucker", label: "Sucker / penyedot", group: "isap", modes: ["pria", "wanita"], hint: "Tekanan udara berdenyut, bukan gesekan.", intensity: 0.7, care: "Bersihkan corongnya — bagian ini paling sering terlewat." },
  { key: "air-pulse", label: "Air-pulse klitoris", group: "isap", modes: ["wanita"], hint: "Gelombang udara tanpa sentuhan langsung.", intensity: 0.6, care: "Kalau terasa kebas, turunkan tingkat dan beri jeda." },
  { key: "stroker-otomatis", label: "Stroker otomatis", group: "mesin", modes: ["pria"], hint: "Bergerak naik-turun sendiri.", intensity: 0.8, care: "Kecepatan tetap bisa menumpulkan sensasi — selingi manual." },
  { key: "pompa", label: "Pompa vakum", group: "mesin", modes: ["pria"], hint: "Menarik dengan tekanan negatif.", intensity: 0.75, care: "Batasi durasi. Tekanan berlebih bisa memecah pembuluh halus." },

  // — Sarung / sleeve —
  { key: "onahole", label: "Onahole", group: "sarung", modes: ["pria"], hint: "Sarung genggam bertekstur, ukuran saku.", intensity: 0.55, care: "Balik dan keringkan penuh. Bedak jagung agar tidak lengket." },
  { key: "sleeve-terbuka", label: "Sleeve ujung terbuka", group: "sarung", modes: ["pria"], hint: "Kedua ujung terbuka, isapannya ringan.", intensity: 0.45, care: "Lebih cepat kering karena kedua sisi terbuka." },
  { key: "sleeve-tertutup", label: "Sleeve ujung tertutup", group: "sarung", modes: ["pria"], hint: "Satu ujung buntu, ada efek vakum.", intensity: 0.65, care: "Vakumnya menambah tarikan — kurangi kalau ada rasa perih." },
  { key: "sleeve-getar", label: "Sleeve bergetar", group: "sarung", modes: ["pria"], hint: "Sarung dengan modul getar di dalamnya.", intensity: 0.7, care: "Pisahkan modul elektroniknya sebelum dicuci." },

  // — Boneka —
  { key: "onahole-berat", label: "Hip / half body", group: "boneka", modes: ["pria"], hint: "Bagian pinggul saja, biasanya 2–10 kg.", intensity: 0.6, care: "Berat — angkat dari rangka, bukan dari bahan lunaknya." },
  { key: "doll-silikon-penuh", label: "Full body silikon", group: "boneka", modes: ["pria", "wanita"], hint: "Seukuran tubuh, rangka logam di dalam.", intensity: 0.6, care: "Sendi perlu dilemaskan berkala. Simpan berbaring atau tergantung." },
  { key: "doll-tpe", label: "Full body TPE", group: "boneka", modes: ["pria", "wanita"], hint: "Bahan lebih lunak dan lebih berpori.", intensity: 0.6, care: "Berpori — hanya pelumas berbasis air, keringkan sampai benar-benar kering." },
  { key: "torso", label: "Torso", group: "boneka", modes: ["pria", "wanita"], hint: "Batang tubuh tanpa kepala dan kaki.", intensity: 0.6, care: "Lipatan bagian dalam paling lama kering — beri waktu." },

  // — Cincin dan penahan —
  { key: "cincin", label: "Cincin penis", group: "cincin", modes: ["pria"], hint: "Menahan aliran agar lebih tegang.", intensity: 0.5, care: "Batas aman 20 menit. Lepas segera kalau warna berubah atau kebas." },
  { key: "cincin-getar", label: "Cincin bergetar", group: "cincin", modes: ["pria"], hint: "Cincin dengan modul getar kecil.", intensity: 0.55, care: "Aturan 20 menit tetap berlaku." },

  // — Lain —
  { key: "dildo", label: "Dildo", group: "dalam", modes: ["wanita", "pria"], hint: "Tanpa getar, gerakan sepenuhnya manual.", intensity: 0.5, care: "Silikon padat aman direbus; bahan lain cukup sabun lembut." },
  { key: "kegel", label: "Bola kegel", group: "dalam", modes: ["wanita"], hint: "Untuk latihan otot dasar panggul.", intensity: 0.3, care: "Pakai bertahap, jangan seharian." },
  { key: "air", label: "Pancuran / air", group: "lain", modes: ["wanita", "pria"], hint: "Aliran air sebagai rangsangan.", intensity: 0.5, care: "Jangan disemprotkan ke dalam. Jaga suhunya hangat, bukan panas." },
  { key: "lain", label: "Lainnya", group: "lain", modes: ["pria", "wanita"], hint: "Tidak ada di daftar — tulis di catatan.", intensity: 0.5, care: "Pastikan bahannya tidak berpori dan tidak bertepi tajam." },
];

export const DEVICE_GROUPS: { key: DeviceGroup; label: string }[] = [
  { key: "getar", label: "Getar" },
  { key: "isap", label: "Isap & tekanan" },
  { key: "sarung", label: "Sarung" },
  { key: "boneka", label: "Boneka" },
  { key: "mesin", label: "Mesin" },
  { key: "cincin", label: "Cincin" },
  { key: "dalam", label: "Penetrasi" },
  { key: "lain", label: "Lain" },
];

export function deviceMeta(key: string | null): Device | null {
  return DEVICES.find((d) => d.key === key) ?? null;
}

export function devicesFor(mode: Mode): Device[] {
  return DEVICES.filter((d) => d.modes.includes(mode));
}

/** Pelumas ikut dicatat karena kecocokan bahan menentukan awet-tidaknya alat. */
export const LUBES = ["tidak pakai", "berbasis air", "berbasis silikon", "berbasis minyak", "hibrida"] as const;
export type Lube = (typeof LUBES)[number];

/** Rasa sesudah. `valence` dipakai mesin sinyal; `medical` menandai keluhan fisik. */
export const AFTERFEELS = [
  { key: "lega", valence: 1, medical: false },
  { key: "nikmat", valence: 1, medical: false },
  { key: "tenang", valence: 1, medical: false },
  { key: "netral", valence: 0, medical: false },
  { key: "lelah", valence: 0, medical: false },
  { key: "hampa", valence: -1, medical: false },
  { key: "menyesal", valence: -1, medical: false },
  { key: "ngilu", valence: -1, medical: true },
  { key: "perih", valence: -1, medical: true },
  { key: "nyeri", valence: -1, medical: true },
  { key: "kebas", valence: -1, medical: true },
] as const;
export type Afterfeel = (typeof AFTERFEELS)[number]["key"];

export type Entry = {
  id: string;
  /** ISO 8601 waktu kejadian. */
  at: string;
  /** Durasi mulai sampai selesai, dalam detik. null = pengguna tidak tahu. */
  durationSec: number | null;
  method: Method;
  /** Diisi kalau method = "alat bantu". Kunci dari DEVICES. */
  device: string | null;
  lube: Lube | null;
  edging: Edging;
  /** Jumlah siklus edging, kalau dicatat. */
  edgeCycles: number | null;
  trigger: Trigger | null;
  afterfeel: Afterfeel;
  note: string;
  /** Mode saat catatan dibuat, agar pindah mode tidak merusak riwayat. */
  mode?: Mode;
};

export type Draft = Omit<Entry, "id">;

export function afterfeelMeta(key: Afterfeel) {
  return AFTERFEELS.find((a) => a.key === key) ?? AFTERFEELS[3];
}

/** Profil siklus untuk mode wanita. Disimpan bersama catatan, ikut terenkripsi. */
export type CycleProfile = {
  /** ISO tanggal hari pertama haid terakhir. */
  lastPeriodStart: string | null;
  cycleLengthDays: number;
  periodLengthDays: number;
};

export const DEFAULT_CYCLE: CycleProfile = {
  lastPeriodStart: null,
  cycleLengthDays: 28,
  periodLengthDays: 5,
};

/**
 * Personalisasi.
 *
 * Keluhan yang paling sering muncul bukan soal fitur, melainkan bahwa
 * aplikasinya terasa dibuat untuk semua orang dan karena itu tidak untuk
 * siapa-siapa. Tiga hal di bawah ini yang paling murah diberikan dan paling
 * terasa: warna yang dipilih sendiri, nama panggilan yang dipakai aplikasi, dan
 * kendali atas seberapa banyak yang bergerak.
 *
 * Semuanya ikut terenkripsi bersama catatan, jadi bahkan preferensi warna pun
 * tidak terbaca server.
 */
export const ACCENTS = [
  { key: "teal", label: "Laut", c400: "#5ce4d3", c500: "#2ed3c0", c600: "#16b3a3", c700: "#0e7c86" },
  { key: "ember", label: "Bara", c400: "#ffb27a", c500: "#f5924f", c600: "#d9722f", c700: "#a34f1c" },
  { key: "iris", label: "Nila", c400: "#b9a6ff", c500: "#9a83f5", c600: "#7b62db", c700: "#5741a8" },
  { key: "moss", label: "Lumut", c400: "#a8dc86", c500: "#84c65e", c600: "#63a441", c700: "#42702c" },
  { key: "clay", label: "Tanah", c400: "#e8a9a0", c500: "#d4867c", c600: "#b2685e", c700: "#7e453e" },
  { key: "steel", label: "Baja", c400: "#9fc4e0", c500: "#78a6c9", c600: "#5885a8", c700: "#3a5b76" },
] as const;

export type AccentKey = (typeof ACCENTS)[number]["key"];

export function accentMeta(key: string) {
  return ACCENTS.find((a) => a.key === key) ?? ACCENTS[0];
}

export const MOTION_LEVELS = ["penuh", "tenang"] as const;
export type MotionLevel = (typeof MOTION_LEVELS)[number];
