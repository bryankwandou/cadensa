"use client";

import { motion } from "motion/react";

/** 21 ketukan, sisi kiri terbuka membentuk huruf C. */
function ticks() {
  const cx = 128;
  const cy = 128;
  const N = 21;
  const r0 = 70;
  return Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    const deg = -150 + 300 * t;
    const a = ((deg - 90) * Math.PI) / 180;
    const wave = Math.sin(t * Math.PI * 2) * 0.5 + Math.sin(t * Math.PI * 4) * 0.22;
    const h = 16 + 14 * (0.5 + 0.5 * wave);
    return {
      i,
      t,
      x1: cx + Math.cos(a) * r0,
      y1: cy + Math.sin(a) * r0,
      x2: cx + Math.cos(a) * (r0 + h),
      y2: cy + Math.sin(a) * (r0 + h),
      opacity: 0.55 + 0.45 * t,
    };
  });
}

const MARKS = ticks();

export function Mark({ size = 40, animate = true }: { size?: number; animate?: boolean }) {
  const id = "cadensa-mark";
  return (
    <svg
      viewBox="0 0 256 256"
      width={size}
      height={size}
      role="img"
      aria-label="Cadensa"
      className="shrink-0"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-teal-700)" />
          <stop offset="55%" stopColor="var(--color-teal-500)" />
          <stop offset="100%" stopColor="var(--color-amber-400)" />
        </linearGradient>
      </defs>
      <g stroke={`url(#${id})`} strokeWidth={9} strokeLinecap="round">
        {MARKS.map((m) =>
          animate ? (
            <motion.line
              key={m.i}
              x1={m.x1}
              y1={m.y1}
              x2={m.x2}
              y2={m.y2}
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: m.opacity, pathLength: 1 }}
              transition={{ delay: 0.08 + m.t * 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          ) : (
            <line key={m.i} x1={m.x1} y1={m.y1} x2={m.x2} y2={m.y2} opacity={m.opacity} />
          ),
        )}
      </g>
      <circle cx={128} cy={128} r={13} fill={`url(#${id})`} />
    </svg>
  );
}

export function Wordmark({ size = 32 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Mark size={size} />
      <span className="text-[1.05rem] font-semibold tracking-[-0.02em] text-sand-100">
        Cadensa
      </span>
    </span>
  );
}
