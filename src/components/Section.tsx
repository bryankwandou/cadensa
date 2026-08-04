"use client";

import type { ReactNode } from "react";
import { Reveal } from "./Motion";

/**
 * Penanda bagian bergaya editorial.
 *
 * Nomornya bukan hiasan. Halaman ini panjang dan setiap bagian membawa satu
 * gagasan; penomoran membuat pembaca tahu di mana dia berada tanpa perlu
 * menggulir balik. Judul memakai serif display, isi memakai sans — pemisahan
 * itu yang membuat halaman terbaca sebagai tulisan, bukan sebagai antarmuka.
 */
export function SectionHead({
  n,
  eyebrow,
  title,
  lead,
  align = "left",
  width = "max-w-2xl",
}: {
  n: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "wide";
  width?: string;
}) {
  return (
    <Reveal>
      <div className={align === "wide" ? "" : "max-w-3xl"}>
        <p className="eyebrow flex items-center gap-3">
          <span className="text-teal-600">{n}</span>
          <span className="h-px w-8 bg-sand-500/30" />
          {eyebrow}
        </p>
        <h2 className="display mt-5 text-[2.1rem] sm:text-[2.9rem]">{title}</h2>
        {lead && <p className={`mt-5 text-[1.0625rem] leading-relaxed text-sand-300 ${width}`}>{lead}</p>}
      </div>
    </Reveal>
  );
}
