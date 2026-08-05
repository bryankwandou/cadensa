"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useMemo, useRef, useState } from "react";

/**
 * Cincin kadens.
 *
 * Sebulan digambar sebagai lingkaran, bukan deret batang, dan itu bukan pilihan
 * gaya. Deret batang punya awal dan akhir, jadi mata membacanya sebagai
 * perlombaan menuju tanggal 30. Lingkaran tidak punya garis akhir — yang
 * terlihat justru jaraknya, dan jarak itulah satu-satunya hal yang berhubungan
 * dengan kesehatan prostat.
 *
 * Kekosongan panjang muncul sebagai celah gelap yang langsung terlihat tanpa
 * perlu dihitung. Bulan yang merata terlihat sebagai mahkota yang rata.
 */

export type RingDay = {
  day: number;
  count: number;
  /** Rata-rata rasa sesudah, -1 sampai 1. */
  valence: number;
  future: boolean;
};

const R_IN = 74;
const R_OUT = 132;
const SIZE = 320;
const C = SIZE / 2;

export function CadenceRing({
  days,
  index,
  total,
  bandLow,
  bandHigh,
}: {
  days: RingDay[];
  index: number | null;
  total: number;
  bandLow: number;
  bandHigh: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<RingDay | null>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 150, damping: 20 };
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [14, -14]), spring);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-16, 16]), spring);

  const max = Math.max(1, ...days.map((d) => d.count));
  const inBand = total >= bandLow && total <= bandHigh;

  const spokes = useMemo(
    () =>
      days.map((d, i) => {
        const a = (i / days.length) * Math.PI * 2 - Math.PI / 2;
        const len = d.count === 0 ? 5 : 14 + (d.count / max) * (R_OUT - R_IN - 14);
        return {
          ...d,
          a,
          x1: C + Math.cos(a) * R_IN,
          y1: C + Math.sin(a) * R_IN,
          x2: C + Math.cos(a) * (R_IN + len),
          y2: C + Math.sin(a) * (R_IN + len),
        };
      }),
    [days, max],
  );

  const stroke = (d: RingDay) =>
    d.count === 0
      ? "rgba(207,198,184,0.13)"
      : d.valence > 0.2
        ? "var(--color-teal-400)"
        : d.valence < -0.2
          ? "var(--color-amber-400)"
          : "var(--color-sand-500)";

  return (
    <div
      ref={ref}
      className="relative mx-auto w-full max-w-[22rem]"
      style={{ perspective: 1100 }}
      onPointerMove={(e) => {
        if (reduce) return;
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
        setHover(null);
      }}
    >
      <motion.div style={{ rotateX: reduce ? 0 : rotX, rotateY: reduce ? 0 : rotY, transformStyle: "preserve-3d" }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full overflow-visible">
          <defs>
            <radialGradient id="ring-core">
              <stop offset="55%" stopColor="var(--color-teal-700)" stopOpacity="0.16" />
              <stop offset="100%" stopColor="var(--color-teal-700)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx={C} cy={C} r={R_OUT} fill="url(#ring-core)" />
          <circle cx={C} cy={C} r={R_IN - 8} fill="none" stroke="rgba(207,198,184,0.09)" strokeWidth="1" />
          <circle
            cx={C}
            cy={C}
            r={R_OUT}
            fill="none"
            stroke="rgba(207,198,184,0.07)"
            strokeWidth="1"
            strokeDasharray="2 5"
          />

          {spokes.map((s, i) => (
            <motion.line
              key={s.day}
              x1={s.x1}
              y1={s.y1}
              x2={s.x2}
              y2={s.y2}
              stroke={stroke(s)}
              strokeWidth={hover?.day === s.day ? 8 : 5.5}
              strokeLinecap="round"
              opacity={s.future ? 0.25 : hover && hover.day !== s.day ? 0.45 : 1}
              initial={reduce ? undefined : { pathLength: 0, opacity: 0 }}
              animate={reduce ? undefined : { pathLength: 1, opacity: s.future ? 0.25 : 1 }}
              transition={{ duration: 0.5, delay: i * 0.016, ease: [0.16, 1, 0.3, 1] }}
              onPointerEnter={() => setHover(s)}
              style={{ cursor: "pointer" }}
            />
          ))}

          {/* Penanda seperempat bulan, supaya mata punya pegangan. */}
          {[0, 0.25, 0.5, 0.75].map((f) => {
            const a = f * Math.PI * 2 - Math.PI / 2;
            return (
              <text
                key={f}
                x={C + Math.cos(a) * (R_OUT + 18)}
                y={C + Math.sin(a) * (R_OUT + 18) + 4}
                textAnchor="middle"
                className="num"
                fontSize="9"
                fill="rgba(143,157,152,0.75)"
              >
                {Math.max(1, Math.round(f * days.length))}
              </text>
            );
          })}
        </svg>
      </motion.div>

      {/* Inti cincin. Tidak ikut miring, supaya angkanya selalu terbaca lurus. */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        {hover ? (
          <>
            <p className="num text-[2.4rem] leading-none text-sand-100">{hover.count}</p>
            <p className="mt-1.5 text-xs text-sand-500">catatan di hari ke-{hover.day}</p>
          </>
        ) : (
          <>
            <p className="eyebrow">Cadence Index</p>
            <p className="num mt-1.5 text-[2.6rem] leading-none text-teal-400">{index ?? "—"}</p>
            <p className={`num mt-2 text-xs ${inBand ? "text-teal-500" : "text-amber-400"}`}>
              {total} bulan ini
            </p>
          </>
        )}
      </div>
    </div>
  );
}
