"use client";

import { motion, useReducedMotion } from "motion/react";
import { Glyph, type GlyphSet } from "./Glyph";

/**
 * Ubin pilihan. Menggantikan chip teks polos di alur catat.
 *
 * Ikonnya bukan hiasan. Di layar sekecil ponsel, bentuk terbaca lebih cepat
 * daripada kata — dan alur ini punya anggaran waktu dua belas detik. Ubin yang
 * terpilih terangkat sedikit di sumbu Z supaya pilihannya terasa, bukan hanya
 * terlihat.
 */
export function OptionTile({
  set,
  name,
  label,
  hint,
  active,
  onClick,
  tone = "teal",
  size = "md",
}: {
  set: GlyphSet;
  name: string;
  label: string;
  hint?: string;
  active: boolean;
  onClick: () => void;
  tone?: "teal" | "signal";
  size?: "sm" | "md";
}) {
  const reduce = useReducedMotion();
  const ring =
    tone === "signal" ? "border-signal-500/60 bg-signal-500/10" : "border-teal-600 bg-teal-600/10";
  const ink = tone === "signal" ? "text-signal-500" : "text-teal-500";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={reduce ? undefined : { y: -3, rotateX: 6, rotateY: -4 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
      style={{ transformStyle: "preserve-3d", perspective: 600 }}
      className={`relative flex flex-col items-center gap-2 rounded-field border text-center transition-colors ${
        size === "sm" ? "px-2 py-3" : "px-3 py-4"
      } ${active ? ring : "hairline hover:border-sand-500/30"}`}
    >
      {active && (
        <motion.span
          layoutId={`tile-${set}`}
          className={`absolute inset-0 rounded-field ring-1 ${
            tone === "signal" ? "ring-signal-500/40" : "ring-teal-500/40"
          }`}
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      )}
      <span className={`relative ${active ? ink : "text-sand-500"}`}>
        <Glyph set={set} name={name} active={active} size={size === "sm" ? 26 : 30} />
      </span>
      <span className={`relative text-xs leading-tight ${active ? "text-sand-100" : "text-sand-300"}`}>
        {label}
      </span>
      {hint && <span className="relative text-[10px] leading-tight text-sand-500">{hint}</span>}
    </motion.button>
  );
}
