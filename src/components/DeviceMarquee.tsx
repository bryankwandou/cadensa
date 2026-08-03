"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { DEVICES } from "@/lib/types";
import { DeviceIcon } from "./DeviceIcon";

/**
 * Barisan ikon yang berjalan pelan. Dipakai di landing sebagai bukti bahwa katalognya
 * memang serinci yang dijanjikan — bukan sebagai hiasan.
 *
 * Ikonnya berputar di sumbu Y saat disentuh, jadi kedalamannya terasa nyata tanpa
 * perlu memuat model tiga dimensi yang berat.
 */
export function DeviceMarquee() {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<string | null>(null);
  const row = [...DEVICES, ...DEVICES];

  return (
    <div
      className="relative overflow-hidden py-2"
      style={{
        maskImage: "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <motion.div
        className="flex w-max gap-3"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 64, repeat: Infinity, ease: "linear" }}
        style={{ perspective: 800 }}
      >
        {row.map((d, i) => {
          const on = hover === `${d.key}-${i}`;
          return (
            <motion.div
              key={`${d.key}-${i}`}
              onHoverStart={() => setHover(`${d.key}-${i}`)}
              onHoverEnd={() => setHover(null)}
              animate={on ? { rotateY: 18, rotateX: -8, z: 40 } : { rotateY: 0, rotateX: 0, z: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              style={{ transformStyle: "preserve-3d" }}
              className={`flex w-40 shrink-0 flex-col gap-2 rounded-2xl border p-4 ${
                on ? "border-teal-600 bg-teal-600/10" : "hairline bg-ink-900/30"
              }`}
            >
              <span className={on ? "text-teal-500" : "text-sand-500"}>
                <DeviceIcon device={d.key} size={30} />
              </span>
              <span className="truncate text-xs text-sand-200">{d.label}</span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
