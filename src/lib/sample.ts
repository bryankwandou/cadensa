import { LUBES, METHODS, TRIGGERS, devicesFor, type Entry, type Mode } from "./types";

/**
 * Data contoh untuk mencoba halaman ritme dan bacaan tanpa menunggu sebulan.
 * Sengaja dibentuk agar beberapa pola benar-benar terbaca: jam bergeser larut,
 * durasi memendek, dan edging panjang yang berujung ngilu.
 *
 * Untuk mode wanita, sebarannya dibuat menumpuk di sekitar hari ke-12 sampai ke-16
 * tiap siklus, supaya keterikatan siklus terlihat begitu halaman dibuka.
 */
export function buildSample(now = new Date(), mode: Mode = "pria"): Entry[] {
  const out: Entry[] = [];
  let seedNum = 20260802;
  const rnd = () => {
    seedNum = (seedNum * 1103515245 + 12345) % 2147483648;
    return seedNum / 2147483648;
  };
  const pick = <T,>(xs: readonly T[]) => xs[Math.floor(rnd() * xs.length)];
  const devices = devicesFor(mode);

  for (let dayAgo = 74; dayAgo >= 0; dayAgo--) {
    const recent = dayAgo <= 14;
    let chance = recent ? 0.72 : 0.5;

    if (mode === "wanita") {
      const dayOfCycle = (74 - dayAgo) % 28;
      const nearOvulation = dayOfCycle >= 11 && dayOfCycle <= 16;
      const bleeding = dayOfCycle < 4;
      chance = bleeding ? 0.12 : nearOvulation ? 0.78 : 0.34;
    }
    if (rnd() > chance) continue;

    const d = new Date(+now - dayAgo * 86_400_000);
    const hour =
      recent && mode === "pria"
        ? rnd() < 0.6
          ? 23 + Math.floor(rnd() * 2)
          : 14 + Math.floor(rnd() * 6)
        : 9 + Math.floor(rnd() * 13);
    d.setHours(hour % 24, Math.floor(rnd() * 60), 0, 0);

    const edging = rnd() < 0.2 ? "lama" : rnd() < 0.45 ? "ringan" : "tidak";
    const durationSec = Math.round((recent ? 3 + rnd() * 6 : 9 + rnd() * 18) * 60);
    const method = rnd() < 0.4 ? "alat bantu" : pick(METHODS);
    const device = method === "alat bantu" ? pick(devices).key : null;

    let afterfeel: Entry["afterfeel"];
    if (edging === "lama" && rnd() < 0.6) afterfeel = "ngilu";
    else if (method === "tangan" && rnd() < 0.22) afterfeel = "perih";
    else if (recent && mode === "pria" && rnd() < 0.5) afterfeel = rnd() < 0.5 ? "netral" : "hampa";
    else afterfeel = rnd() < 0.45 ? "lega" : rnd() < 0.75 ? "nikmat" : "tenang";

    out.push({
      id: `contoh-${dayAgo}-${Math.floor(rnd() * 1e6).toString(36)}`,
      at: d.toISOString(),
      durationSec,
      method,
      device,
      lube: method === "tangan" ? "tidak pakai" : pick(LUBES),
      edging,
      edgeCycles: edging === "tidak" ? null : 1 + Math.floor(rnd() * 5),
      trigger: recent && rnd() < 0.5 ? (rnd() < 0.5 ? "stres" : "bosan") : pick(TRIGGERS),
      afterfeel,
      note: "",
      mode,
    });
  }
  return out;
}
