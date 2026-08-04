"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { TARGET_BAND } from "@/lib/metrics";

/**
 * Peragaan langsung: dua bulan dengan jumlah sama bisa punya kadens sangat
 * berbeda. Geser sebarannya dan lihat indeksnya bergerak.
 */
export function CadenceBand() {
  const [count, setCount] = useState(21);
  const [spread, setSpread] = useState(85);

  const days = useMemo(() => {
    const slots = Array.from({ length: 30 }, () => 0);
    const evenness = spread / 100;
    for (let i = 0; i < count; i++) {
      const even = (i + 0.5) * (30 / count);
      // Semakin rendah sebarannya, semakin menumpuk ke akhir bulan.
      const clumped = 18 + (i / Math.max(1, count - 1)) * 11;
      const pos = even * evenness + clumped * (1 - evenness);
      const idx = Math.max(0, Math.min(29, Math.round(pos)));
      slots[idx] += 1;
    }
    return slots;
  }, [count, spread]);

  const index = useMemo(() => {
    const positions: number[] = [];
    days.forEach((n, i) => {
      for (let k = 0; k < n; k++) positions.push(i);
    });
    if (positions.length < 3) return null;
    const gaps: number[] = [];
    for (let i = 1; i < positions.length; i++) gaps.push(positions[i] - positions[i - 1]);
    const m = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    if (m <= 0) return 0;
    const sd = Math.sqrt(gaps.reduce((a, g) => a + (g - m) ** 2, 0) / gaps.length);
    return Math.round(Math.max(0, Math.min(100, (1 - sd / m / 1.4) * 100)));
  }, [days]);

  const inBand = count >= TARGET_BAND.low && count <= TARGET_BAND.high;
  const max = Math.max(1, ...days);

  return (
    <div className="surface rounded-panel p-7 sm:p-9">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow">Cadence Index</p>
          <div className="mt-2 flex items-baseline gap-2.5">
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="num text-[3.5rem] leading-none text-teal-400"
            >
              {index ?? "—"}
            </motion.span>
            <span className="num text-sm text-sand-500">/ 100</span>
          </div>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-sand-300">
          Jumlah yang sama, sebaran berbeda. Yang berhubungan dengan kesehatan prostat adalah
          keteraturannya, dan hanya angka ini yang menangkapnya.
        </p>
      </div>

      <div className="mt-7 flex h-32 items-end gap-[3px]" aria-hidden>
        {days.map((n, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-full"
            style={{
              background:
                n === 0
                  ? "rgba(207,198,184,0.07)"
                  : "linear-gradient(180deg, var(--color-teal-500), var(--color-teal-700))",
            }}
            animate={{ height: `${n === 0 ? 6 : 18 + (n / max) * 82}%` }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          />
        ))}
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="flex justify-between text-sm text-sand-300">
            Jumlah bulan ini
            <span className={`font-mono ${inBand ? "text-teal-500" : "text-amber-400"}`}>{count}</span>
          </span>
          <input
            type="range"
            min={6}
            max={34}
            value={count}
            onChange={(e) => setCount(+e.target.value)}
            className="mt-2 w-full accent-[var(--color-teal-500)]"
          />
          <span className="mt-1 block text-xs text-sand-500">
            {inBand ? "Di dalam pita 18–24" : "Di luar pita 18–24"}
          </span>
        </label>
        <label className="block">
          <span className="flex justify-between text-sm text-sand-300">
            Kemerataan sebaran
            <span className="font-mono text-sand-100">{spread}%</span>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={spread}
            onChange={(e) => setSpread(+e.target.value)}
            className="mt-2 w-full accent-[var(--color-teal-500)]"
          />
          <span className="mt-1 block text-xs text-sand-500">
            Turunkan sampai nol, jumlahnya tetap tapi indeksnya runtuh.
          </span>
        </label>
      </div>
    </div>
  );
}
