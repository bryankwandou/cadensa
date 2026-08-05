"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Potret untuk ulasan.
 *
 * Dibuat menerima dua keadaan sejak awal, karena keduanya sama-sama akan
 * terjadi: ada foto, dan belum ada foto. Yang kedua bukan keadaan darurat —
 * di kategori ini sebagian besar orang memang tidak akan pernah mau wajahnya
 * dipasang, dan bentuk pengganti yang dirancang dengan benar lebih baik
 * daripada foto stok yang terlihat dibeli.
 *
 * Penggantinya bukan siluet abu-abu, melainkan cincin berhuruf yang memakai
 * bahasa rupa yang sama dengan tanda mereknya.
 */
export function Portrait({
  src,
  name,
  size = 56,
  focus,
}: {
  src?: string | null;
  name: string;
  size?: number;
  /**
   * Titik wajah pada foto sumber dalam persen, plus perbesaran.
   *
   * Foto yang dikirim orang hampir tidak pernah berupa potret siap pakai —
   * biasanya seluruh badan, wajahnya kecil di sepertiga atas. Memotong lewat
   * gaya, bukan lewat berkas, membuat foto aslinya tetap utuh dan pemotongannya
   * bisa diperbaiki kapan saja tanpa mengunggah ulang apa pun.
   */
  focus?: { x: number; y: number; zoom: number };
}) {
  const reduce = useReducedMotion();
  const [broken, setBroken] = useState(false);
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  if (src && !broken) {
    const f = focus ?? { x: 50, y: 50, zoom: 1 };
    return (
      <span
        className="relative block shrink-0 overflow-hidden rounded-full ring-1 ring-[rgba(207,198,184,0.18)]"
        style={{ width: size, height: size }}
      >
        <Image
          src={src}
          alt={`Potret ${name}`}
          width={size * 4}
          height={size * 4}
          onError={() => setBroken(true)}
          className="h-full w-full object-cover"
          style={{ objectPosition: `${f.x}% ${f.y}%`, transform: `scale(${f.zoom})` }}
        />
      </span>
    );
  }

  return (
    <span
      className="relative flex shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        {/* Dua belas ketukan, sepotong sama seperti tanda mereknya. */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
          const r1 = 40;
          const r2 = 46 + Math.sin(i * 1.7) * 3;
          return (
            <motion.line
              key={i}
              x1={50 + Math.cos(a) * r1}
              y1={50 + Math.sin(a) * r1}
              x2={50 + Math.cos(a) * r2}
              y2={50 + Math.sin(a) * r2}
              stroke="var(--color-teal-500)"
              strokeWidth={2.4}
              strokeLinecap="round"
              opacity={0.55}
              initial={reduce ? undefined : { opacity: 0 }}
              animate={reduce ? undefined : { opacity: [0.25, 0.7, 0.25] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.16, ease: "easeInOut" }}
            />
          );
        })}
        <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(207,198,184,0.14)" strokeWidth="1.5" />
      </svg>
      <span className="display-sm relative text-lg text-teal-400">{initial}</span>
    </span>
  );
}
