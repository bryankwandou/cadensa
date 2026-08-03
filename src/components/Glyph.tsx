"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Ikon untuk setiap pilihan di alur catat.
 *
 * Layar pertama yang dilihat orang tidak boleh berupa deret teks polos. Tapi
 * gambar di kategori ini punya syarat yang tidak biasa: harus cukup jelas untuk
 * dikenali pemakainya, dan tidak boleh terbaca oleh orang yang melirik dari
 * samping. Karena itu semuanya digambar sebagai garis abstrak dan bergerak halus
 * saat dipilih — gerakan memberi umpan balik yang tidak bisa diberikan teks,
 * tanpa menambah satu pun berkas gambar ke perangkat pengguna.
 */

const S = {
  fill: "none",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* ---------- Cara ---------- */

const METHOD: Record<string, React.ReactNode> = {
  tangan: (
    <>
      <path d="M8.5 12V6.2a1.4 1.4 0 0 1 2.8 0V11" {...S} />
      <path d="M11.3 10.6V5.4a1.4 1.4 0 0 1 2.8 0v5.2" {...S} />
      <path d="M14.1 10.8V7a1.4 1.4 0 0 1 2.8 0v6.4c0 3.4-2 6.1-5 6.1s-5-2.4-5-5.4v-2.6a1.3 1.3 0 0 1 2.6 0" {...S} />
    </>
  ),
  pelumas: (
    <>
      <path d="M12 3.6c3 4 4.6 6.5 4.6 8.9a4.6 4.6 0 1 1-9.2 0c0-2.4 1.6-4.9 4.6-8.9z" {...S} />
      <path d="M10 13a2 2 0 0 0 2 2" {...S} opacity={0.6} />
    </>
  ),
  "alat bantu": (
    <>
      <rect x="9" y="3.5" width="6" height="17" rx="3" {...S} />
      <path d="M12 7v4" {...S} opacity={0.7} />
      <path d="M18 8.5c1.5 2.2 1.5 4.8 0 7M6 8.5c-1.5 2.2-1.5 4.8 0 7" {...S} opacity={0.5} />
    </>
  ),
  "hubungan seksual": (
    <>
      <circle cx="9.2" cy="12" r="4.6" {...S} />
      <circle cx="14.8" cy="12" r="4.6" {...S} opacity={0.75} />
    </>
  ),
};

/* ---------- Rasa sesudah ---------- */
/* Wajah paling ringkas: satu garis mulut menentukan seluruh maknanya. */

function Face({ mouth, extra, eyes = "open" }: { mouth: string; extra?: React.ReactNode; eyes?: "open" | "shut" | "squint" }) {
  return (
    <>
      <circle cx="12" cy="12" r="8.4" {...S} />
      {eyes === "open" && (
        <>
          <circle cx="9.3" cy="10.2" r="0.85" fill="currentColor" stroke="none" />
          <circle cx="14.7" cy="10.2" r="0.85" fill="currentColor" stroke="none" />
        </>
      )}
      {eyes === "shut" && <path d="M7.9 10.2c.9-.9 1.9-.9 2.8 0M13.3 10.2c.9-.9 1.9-.9 2.8 0" {...S} />}
      {eyes === "squint" && <path d="M7.9 10.4l2.8-.9M16.1 10.4l-2.8-.9" {...S} />}
      <path d={mouth} {...S} />
      {extra}
    </>
  );
}

const FEEL: Record<string, React.ReactNode> = {
  lega: <Face mouth="M8.6 14c1.9 2.1 4.9 2.1 6.8 0" eyes="shut" />,
  nikmat: <Face mouth="M8.4 13.6c2.1 2.6 5.1 2.6 7.2 0" eyes="squint" />,
  tenang: (
    <Face
      mouth="M9.4 14.4c1.6 1 3.6 1 5.2 0"
      eyes="shut"
      extra={<path d="M12 2.6v1.4" {...S} opacity={0.45} />}
    />
  ),
  netral: <Face mouth="M9.2 14.4h5.6" />,
  lelah: (
    <Face
      mouth="M9.6 14.8h4.8"
      eyes="shut"
      extra={<path d="M16.6 5.4h3l-3 3h3" {...S} opacity={0.55} />}
    />
  ),
  hampa: (
    <>
      <circle cx="12" cy="12" r="8.4" {...S} />
      <path d="M8.3 10.2h2M13.7 10.2h2" {...S} />
      <path d="M9.2 15h5.6" {...S} opacity={0.5} strokeDasharray="1.6 2" />
    </>
  ),
  menyesal: <Face mouth="M8.8 15.4c1.9-2 4.5-2 6.4 0" />,
  ngilu: (
    <Face
      mouth="M8.8 15.2l1.6-1.4 1.6 1.4 1.6-1.4 1.6 1.4"
      eyes="squint"
      extra={<path d="M19 5.6l2.2-1.4M20 8.6l2.4-.3" {...S} opacity={0.5} />}
    />
  ),
  perih: (
    <Face
      mouth="M9 15.2c1.9-1.8 4.2-1.8 6 0"
      eyes="squint"
      extra={<path d="M3.6 6.6l1.8 1.4M2.8 10.4h2.2" {...S} opacity={0.5} />}
    />
  ),
  nyeri: (
    <>
      <circle cx="12" cy="12" r="8.4" {...S} />
      <path d="M8 9l2.6 1.8M16 9l-2.6 1.8" {...S} />
      <circle cx="12" cy="15" r="1.7" {...S} />
      <path d="M12 1.6l1.6 2.6h-3.2z" {...S} opacity={0.55} />
    </>
  ),
  kebas: (
    <>
      <circle cx="12" cy="12" r="8.4" {...S} strokeDasharray="2.4 2.6" />
      <path d="M8.4 10.4h2.2M13.4 10.4h2.2" {...S} opacity={0.6} />
      <path d="M9.2 14.6h5.6" {...S} opacity={0.4} strokeDasharray="1.6 2" />
    </>
  ),
};

/* ---------- Pemicu ---------- */

const TRIGGER: Record<string, React.ReactNode> = {
  "dorongan alami": (
    <>
      <path d="M12 20.4C7.6 17 4.4 14.2 4.4 10.6A3.9 3.9 0 0 1 12 8.9a3.9 3.9 0 0 1 7.6 1.7c0 3.6-3.2 6.4-7.6 9.8z" {...S} />
    </>
  ),
  stres: (
    <>
      <path d="M13.4 2.6L6.8 13h4.6l-1.2 8.4L17 11h-4.6z" {...S} />
    </>
  ),
  bosan: (
    <>
      <circle cx="12" cy="12" r="8.4" {...S} />
      <path d="M12 7.4V12l3 1.8" {...S} />
    </>
  ),
  "kebiasaan jam segini": (
    <>
      <circle cx="12" cy="12" r="8.4" {...S} strokeDasharray="3 2.4" />
      <path d="M12 7.6V12l2.8 1.6" {...S} />
    </>
  ),
  "rangsangan visual": (
    <>
      <path d="M2.6 12s3.6-5.6 9.4-5.6S21.4 12 21.4 12s-3.6 5.6-9.4 5.6S2.6 12 2.6 12z" {...S} />
      <circle cx="12" cy="12" r="2.4" {...S} />
    </>
  ),
  "keintiman pasangan": (
    <>
      <circle cx="8.8" cy="8.4" r="2.8" {...S} />
      <circle cx="15.2" cy="8.4" r="2.8" {...S} />
      <path d="M4 20c0-2.9 2.1-5 4.8-5M20 20c0-2.9-2.1-5-4.8-5" {...S} />
      <path d="M12 15.8l-1.3-1.3a1.3 1.3 0 0 1 1.3-2 1.3 1.3 0 0 1 1.3 2z" {...S} opacity={0.7} />
    </>
  ),
  "susah tidur": (
    <>
      <path d="M20 14.4A8.4 8.4 0 0 1 9.6 4a8.4 8.4 0 1 0 10.4 10.4z" {...S} />
      <path d="M14.4 3.4h3l-3 3.4h3" {...S} opacity={0.55} />
    </>
  ),
  kesepian: (
    <>
      <circle cx="12" cy="8.2" r="3" {...S} />
      <path d="M6.2 20c0-3.2 2.6-5.4 5.8-5.4s5.8 2.2 5.8 5.4" {...S} />
      <path d="M2.4 12.6h2.2M19.4 12.6h2.2" {...S} opacity={0.4} strokeDasharray="1.5 2" />
    </>
  ),
};

/* ---------- Pelumas ---------- */

function Drop({ dots = 0, dash = false }: { dots?: number; dash?: boolean }) {
  return (
    <>
      <path
        d="M12 3.8c2.9 3.9 4.4 6.3 4.4 8.6a4.4 4.4 0 1 1-8.8 0c0-2.3 1.5-4.7 4.4-8.6z"
        {...S}
        strokeDasharray={dash ? "2.4 2.4" : undefined}
      />
      {Array.from({ length: dots }).map((_, i) => (
        <circle key={i} cx={12} cy={11 + i * 2.4} r={0.75} fill="currentColor" stroke="none" opacity={0.7} />
      ))}
    </>
  );
}

const LUBE: Record<string, React.ReactNode> = {
  "tidak pakai": (
    <>
      <Drop dash />
      <path d="M4.6 19.6L19.4 4.8" {...S} opacity={0.6} />
    </>
  ),
  "berbasis air": <Drop />,
  "berbasis silikon": <Drop dots={2} />,
  "berbasis minyak": (
    <>
      <Drop dots={1} />
      <path d="M8.2 16.6c2.4 1.2 5.2 1.2 7.6 0" {...S} opacity={0.5} />
    </>
  ),
  hibrida: (
    <>
      <path d="M10.6 4.6c2.4 3.3 3.6 5.3 3.6 7.2a3.6 3.6 0 1 1-7.2 0c0-1.9 1.2-3.9 3.6-7.2z" {...S} />
      <path d="M15.6 9.6c1.8 2.5 2.7 4 2.7 5.4a2.7 2.7 0 1 1-5.4 0" {...S} opacity={0.6} />
    </>
  ),
};

/* ---------- Edging ---------- */

const EDGE: Record<string, React.ReactNode> = {
  tidak: <path d="M3.4 12h17.2" {...S} />,
  ringan: <path d="M3.4 12c2.8-4 5.6-4 8.6 0s5.8 4 8.6 0" {...S} />,
  lama: <path d="M3 12c1.7-4.6 3.4-4.6 5.1 0s3.4 4.6 5.1 0 3.4-4.6 5.1 0 1.7 4.6 2.7 0" {...S} />,
};

const SETS: Record<string, Record<string, React.ReactNode>> = {
  method: METHOD,
  feel: FEEL,
  trigger: TRIGGER,
  lube: LUBE,
  edge: EDGE,
};

export type GlyphSet = keyof typeof SETS;

/** Gerakan berbeda per kelompok, supaya umpan baliknya terasa spesifik. */
const MOTION: Record<GlyphSet, Record<string, number[]>> = {
  method: { rotate: [0, -6, 0, 6, 0] },
  feel: { scale: [1, 1.12, 1] },
  trigger: { y: [0, -2.5, 0] },
  lube: { scale: [1, 1.1, 1] },
  edge: { x: [0, 2, 0, -2, 0] },
};

export function Glyph({
  set,
  name,
  size = 30,
  active = false,
  className = "",
}: {
  set: GlyphSet;
  name: string;
  size?: number;
  active?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const shape = SETS[set]?.[name];
  if (!shape) return null;

  return (
    <motion.svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      stroke="currentColor"
      aria-hidden="true"
      animate={active && !reduce ? MOTION[set] : {}}
      transition={{ duration: 2.8, repeat: active ? Infinity : 0, repeatDelay: 1.2, ease: "easeInOut" }}
    >
      {shape}
    </motion.svg>
  );
}
