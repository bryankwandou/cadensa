"use client";

import { motion } from "motion/react";

/**
 * Ikon alat bantu.
 *
 * Digambar sebagai garis vektor, bukan berkas PNG, karena tiga alasan yang saling
 * menguatkan: tajam di layar mana pun tanpa menambah unduhan, bisa ikut warna tema,
 * dan yang paling menentukan — tidak ada berkas gambar yang tersimpan di perangkat
 * maupun singgah di riwayat unduhan. Bentuknya sengaja abstrak: cukup untuk dikenali
 * pemakainya, tidak cukup untuk dipahami orang yang melirik dari samping.
 */

const S = {
  fill: "none",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Waves({ x = 17 }: { x?: number }) {
  return (
    <g opacity={0.55}>
      <path d={`M${x} 8c1.6 2.4 1.6 8 0 10.4`} {...S} />
      <path d={`M${x + 3} 5.5c2.6 3.8 2.6 12 0 15.4`} {...S} opacity={0.6} />
    </g>
  );
}

const SHAPES: Record<string, React.ReactNode> = {
  "vibrator-batang": (
    <>
      <rect x="8.5" y="3" width="7" height="18" rx="3.5" {...S} />
      <path d="M12 6.5v5" {...S} />
      <Waves />
    </>
  ),
  "vibrator-peluru": (
    <>
      <rect x="9" y="7" width="6" height="10" rx="3" {...S} />
      <path d="M12 17v3.5" {...S} />
      <Waves x={16} />
    </>
  ),
  "vibrator-klitoris": (
    <>
      <path d="M7 12a5 5 0 0 1 10 0v3a5 5 0 0 1-10 0z" {...S} />
      <circle cx="12" cy="12" r="1.6" {...S} />
      <Waves x={18} />
    </>
  ),
  "vibrator-rabbit": (
    <>
      <rect x="9" y="3" width="6" height="18" rx="3" {...S} />
      <path d="M9 9c-3.2 1-4 4-2.4 6.4" {...S} />
      <path d="M6.6 15.4c1.2.6 2.4 0 2.4-1.4" {...S} opacity={0.6} />
    </>
  ),
  wand: (
    <>
      <circle cx="12" cy="6.5" r="3.5" {...S} />
      <rect x="10.4" y="10" width="3.2" height="11" rx="1.6" {...S} />
      <path d="M5.5 6.5a6.5 6.5 0 0 1 0-.2M18.5 6.5a6.5 6.5 0 0 0 0-.2" {...S} />
      <circle cx="12" cy="6.5" r="6" {...S} opacity={0.3} strokeDasharray="2 3" />
    </>
  ),
  prostat: (
    <>
      <path d="M12 4c2.6 0 3.4 3 2.2 5.6-1 2.2-1.2 3.6.4 5.2" {...S} />
      <path d="M8.5 18.5h7" {...S} />
      <path d="M12 15v3.5" {...S} />
      <ellipse cx="12" cy="19.6" rx="4.4" ry="1.4" {...S} opacity={0.6} />
    </>
  ),
  plug: (
    <>
      <path d="M12 4c2.4 2 3.4 5 2.6 8.4-.3 1.4-.3 2.2.4 3.1" {...S} />
      <path d="M12 4c-2.4 2-3.4 5-2.6 8.4.3 1.4.3 2.2-.4 3.1" {...S} />
      <ellipse cx="12" cy="19" rx="4.6" ry="1.5" {...S} />
      <path d="M9 15.5v2M15 15.5v2" {...S} opacity={0.6} />
    </>
  ),
  sucker: (
    <>
      <path d="M8 4h8l-1 6a4 4 0 0 1-6 0z" {...S} />
      <rect x="9.5" y="10" width="5" height="10" rx="2.5" {...S} />
      <path d="M12 3v-1" {...S} opacity={0.5} />
      <circle cx="12" cy="6" r="1.4" {...S} opacity={0.6} />
    </>
  ),
  "air-pulse": (
    <>
      <path d="M9 5h6l-1 5a3 3 0 0 1-4 0z" {...S} />
      <rect x="9.8" y="10" width="4.4" height="9" rx="2.2" {...S} />
      <path d="M12 7.5c0 0 0 0 0 0" {...S} />
      <circle cx="12" cy="7" r="2.4" {...S} opacity={0.35} strokeDasharray="1.5 2" />
    </>
  ),
  "stroker-otomatis": (
    <>
      <rect x="7" y="4" width="10" height="16" rx="4" {...S} />
      <path d="M7.5 9h9M7.5 12h9M7.5 15h9" {...S} opacity={0.5} />
      <path d="M19.5 8v8" {...S} />
      <path d="M18 10l1.5-2 1.5 2M18 14l1.5 2 1.5-2" {...S} opacity={0.7} />
    </>
  ),
  pompa: (
    <>
      <rect x="8" y="3" width="8" height="14" rx="1.5" {...S} />
      <path d="M8 17h8l-1.5 3h-5z" {...S} />
      <path d="M12 3V1.5" {...S} />
      <path d="M16 7h3a2 2 0 0 1 0 4" {...S} opacity={0.7} />
    </>
  ),
  onahole: (
    <>
      <rect x="7" y="5" width="10" height="14" rx="4.5" {...S} />
      <ellipse cx="12" cy="8" rx="2.4" ry="1.6" {...S} />
      <path d="M8.5 12.5c2.4 1 4.6 1 7 0M8.5 15.5c2.4 1 4.6 1 7 0" {...S} opacity={0.5} />
    </>
  ),
  "sleeve-terbuka": (
    <>
      <rect x="7.5" y="4" width="9" height="16" rx="4.5" {...S} />
      <ellipse cx="12" cy="5.6" rx="2.6" ry="1.4" {...S} />
      <ellipse cx="12" cy="18.4" rx="2.6" ry="1.4" {...S} />
    </>
  ),
  "sleeve-tertutup": (
    <>
      <path d="M7.5 8.5a4.5 4.5 0 0 1 9 0v7a4.5 4.5 0 0 1-9 0z" {...S} />
      <ellipse cx="12" cy="8.5" rx="2.6" ry="1.4" {...S} />
      <path d="M10 18.5h4" {...S} opacity={0.5} />
    </>
  ),
  "sleeve-getar": (
    <>
      <rect x="8" y="4" width="8" height="16" rx="4" {...S} />
      <ellipse cx="12" cy="5.6" rx="2.2" ry="1.2" {...S} />
      <Waves x={17.5} />
    </>
  ),
  "onahole-berat": (
    <>
      <path d="M6 9c0-2.8 2.7-4 6-4s6 1.2 6 4v6c0 2.8-2.7 4-6 4s-6-1.2-6-4z" {...S} />
      <path d="M9.5 5.5v13M14.5 5.5v13" {...S} opacity={0.4} />
    </>
  ),
  "doll-silikon-penuh": (
    <>
      <circle cx="12" cy="4.6" r="2.4" {...S} />
      <path d="M12 7v6" {...S} />
      <path d="M8 9.5h8" {...S} />
      <path d="M12 13l-2.6 7M12 13l2.6 7" {...S} />
    </>
  ),
  "doll-tpe": (
    <>
      <circle cx="12" cy="4.6" r="2.4" {...S} />
      <path d="M12 7v6" {...S} />
      <path d="M8 9.5h8" {...S} />
      <path d="M12 13l-2.6 7M12 13l2.6 7" {...S} />
      <path d="M4.5 12h1.5M18 12h1.5" {...S} opacity={0.4} />
    </>
  ),
  torso: (
    <>
      <path d="M8.5 5h7l-.8 5.5.8 8.5h-7l.8-8.5z" {...S} />
      <path d="M8.5 5L6 7M15.5 5L18 7" {...S} opacity={0.6} />
    </>
  ),
  cincin: (
    <>
      <circle cx="12" cy="12" r="6.5" {...S} />
      <circle cx="12" cy="12" r="3.5" {...S} opacity={0.6} />
    </>
  ),
  "cincin-getar": (
    <>
      <circle cx="12" cy="12.5" r="6" {...S} />
      <circle cx="12" cy="12.5" r="3.2" {...S} opacity={0.6} />
      <rect x="10" y="3.5" width="4" height="3" rx="1.5" {...S} />
    </>
  ),
  dildo: (
    <>
      <path d="M9 7.5a3 3 0 0 1 6 0v8a3 3 0 0 1-6 0z" {...S} />
      <ellipse cx="12" cy="19.4" rx="4" ry="1.4" {...S} />
      <path d="M12 18.2v-1.5" {...S} opacity={0.6} />
    </>
  ),
  kegel: (
    <>
      <circle cx="9.5" cy="9" r="3.5" {...S} />
      <circle cx="13.5" cy="15" r="3.5" {...S} />
      <path d="M9.5 5.5V3.5" {...S} opacity={0.6} />
    </>
  ),
  air: (
    <>
      <path d="M12 3.5c3 4 4.5 6.4 4.5 8.8a4.5 4.5 0 0 1-9 0c0-2.4 1.5-4.8 4.5-8.8z" {...S} />
      <path d="M10 13a2 2 0 0 0 2 2" {...S} opacity={0.6} />
    </>
  ),
  lain: (
    <>
      <circle cx="12" cy="12" r="7.5" {...S} strokeDasharray="3 3" />
      <path d="M12 8.5v4M12 15.5v.4" {...S} />
    </>
  ),
};

const FALLBACK = SHAPES.lain;

export function DeviceIcon({
  device,
  size = 26,
  className = "",
  animate = false,
}: {
  device: string | null;
  size?: number;
  className?: string;
  animate?: boolean;
}) {
  const shape = (device && SHAPES[device]) || FALLBACK;
  return (
    <motion.svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      stroke="currentColor"
      aria-hidden="true"
      animate={animate ? { rotateY: [0, 14, 0, -14, 0] } : undefined}
      transition={animate ? { duration: 7, repeat: Infinity, ease: "easeInOut" } : undefined}
      style={{ transformStyle: "preserve-3d" }}
    >
      {shape}
    </motion.svg>
  );
}
