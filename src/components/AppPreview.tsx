"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Glyph } from "./Glyph";

/**
 * Pratinjau produk di dalam bingkai peramban.
 *
 * Sampai sekarang halaman depan hanya menceritakan aplikasinya tanpa pernah
 * menunjukkannya, dan itu kekosongan yang paling terasa. Yang digambar di sini
 * bukan tangkapan layar — tangkapan layar akan basi begitu antarmukanya berubah,
 * dan berupa berkas gambar yang harus diunduh. Ini komponen hidup memakai token
 * dan rupa yang sama persis dengan aplikasinya, jadi selalu ikut berubah.
 *
 * Datanya berputar sendiri supaya bingkainya terasa bernapas, bukan beku.
 */

const BARS = [
  0, 1, 0, 2, 1, 0, 1, 1, 0, 2, 1, 0, 1, 0, 2, 1, 1, 0, 1, 2, 0, 1, 1, 0, 2, 1, 0, 1, 1, 0,
];

const FEELS = ["lega", "nikmat", "tenang", "netral"] as const;

export function AppPreview() {
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setTick((t) => t + 1), 3400);
    return () => clearInterval(id);
  }, [reduce]);

  // Pergeseran kecil dan berulang — cukup untuk terasa hidup, tidak cukup untuk
  // mengalihkan perhatian dari tulisan di sebelahnya.
  const bars = useMemo(() => BARS.map((b, i) => (i === (tick * 7) % 30 ? (b + 1) % 3 : b)), [tick]);
  const ci = 74 + (tick % 5);

  return (
    <div className="surface-raised overflow-hidden rounded-panel shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
      {/* Kepala jendela. Tiga titik dibuat redup — ini bukan bagian yang penting. */}
      <div className="flex items-center gap-2 border-b border-[rgba(207,198,184,0.08)] px-4 py-3">
        <span className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2 rounded-full bg-sand-500/25" />
          ))}
        </span>
        <span className="num ml-2 truncate text-[10px] text-sand-500">cadensa.app / ritme</span>
      </div>

      <div className="p-5 sm:p-6">
        <p className="eyebrow">Agustus</p>

        {/* Pita ritme */}
        <div className="surface-sunken mt-3 rounded-card p-4">
          <div className="flex h-24 items-end gap-[2px]">
            {bars.map((n, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-full"
                style={{
                  background:
                    n === 0
                      ? "rgba(207,198,184,0.07)"
                      : "linear-gradient(180deg, var(--color-teal-400), var(--color-teal-700))",
                }}
                animate={{ height: `${n === 0 ? 7 : 26 + n * 30}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 24, delay: i * 0.008 }}
              />
            ))}
          </div>
          <div className="num mt-2.5 flex justify-between text-[9px] text-sand-500">
            <span>1</span>
            <span>15</span>
            <span>30</span>
          </div>
        </div>

        {/* Dua metrik */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          {[
            { l: "Cadence Index", v: String(ci), s: "/100" },
            { l: "Kekosongan", v: "4", s: "hari" },
          ].map((m) => (
            <div key={m.l} className="surface-sunken rounded-card px-4 py-3.5">
              <p className="eyebrow text-[9px]">{m.l}</p>
              <p className="num mt-1.5 text-xl text-teal-400">
                {m.v}
                <span className="ml-1 text-[10px] text-sand-500">{m.s}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Riwayat singkat */}
        <div className="mt-3 space-y-1.5">
          {[
            { d: "3 Agu", m: "tangan", f: FEELS[tick % 4] },
            { d: "1 Agu", m: "alat bantu", f: "tenang" as const },
          ].map((r) => (
            <div
              key={r.d}
              className="flex items-center gap-3 rounded-field border border-[rgba(207,198,184,0.06)] px-3.5 py-2.5"
            >
              <span className="text-sand-500">
                <Glyph set="method" name={r.m} size={17} />
              </span>
              <span className="num text-[10px] text-sand-500">{r.d}</span>
              <span className="flex-1 truncate text-[11px] text-sand-300">{r.m}</span>
              <span className="flex items-center gap-1.5 rounded-full bg-teal-500/10 px-2 py-0.5 text-[10px] text-teal-400">
                <Glyph set="feel" name={r.f} size={12} />
                {r.f}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
