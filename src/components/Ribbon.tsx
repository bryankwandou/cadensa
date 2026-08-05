"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Pita yang tergambar mengikuti gulir.
 *
 * Bentuknya bukan hiasan acak: gelombangnya adalah gambar dari gagasan produk
 * ini — jarak yang merata terasa sebagai gelombang tenang, dan bagian yang
 * menumpuk terlihat sebagai riak yang berdesakan. Garisnya tergambar seiring
 * halaman digulir, jadi pembaca menyaksikan ritmenya terbentuk, bukan
 * menemukannya sudah jadi.
 */
export function ScrollRibbon() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const draw = useSpring(useTransform(scrollYProgress, [0.05, 0.75], [0, 1]), {
    stiffness: 90,
    damping: 30,
  });

  // 1200 lebar, gelombang merapat di sepertiga terakhir.
  const path = (() => {
    const pts: string[] = ["M0 60"];
    for (let x = 0; x <= 1200; x += 20) {
      const t = x / 1200;
      const freq = 0.018 + t * t * 0.055;
      const amp = 34 - t * 12;
      pts.push(`L${x} ${60 - Math.sin(x * freq) * amp}`);
    }
    return pts.join(" ");
  })();

  return (
    <div ref={ref} aria-hidden className="pointer-events-none overflow-hidden py-6">
      <svg viewBox="0 0 1200 120" className="h-24 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ribbon" x1="0" x2="1">
            <stop offset="0%" stopColor="var(--color-teal-700)" stopOpacity="0" />
            <stop offset="18%" stopColor="var(--color-teal-600)" stopOpacity="0.75" />
            <stop offset="72%" stopColor="var(--color-teal-400)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--color-amber-400)" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <motion.path
          d={path}
          fill="none"
          stroke="url(#ribbon)"
          strokeWidth={1.6}
          strokeLinecap="round"
          style={{ pathLength: reduce ? 1 : draw }}
        />
        <motion.path
          d={path}
          fill="none"
          stroke="url(#ribbon)"
          strokeWidth={7}
          strokeLinecap="round"
          opacity={0.12}
          style={{ pathLength: reduce ? 1 : draw }}
        />
      </svg>
    </div>
  );
}

/**
 * Penanda bagian yang menempel di tepi kiri. Hanya di layar lebar, karena di
 * ponsel ruang itu lebih berguna untuk isinya.
 */
export function SectionIndex({ items }: { items: { id: string; n: string; label: string }[] }) {
  const [active, setActive] = useState(0);

  // Bagian yang aktif ditentukan oleh apa yang benar-benar terlihat, bukan oleh
  // perkiraan dari posisi gulir — halaman ini tingginya tidak seragam.
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting);
        if (!seen.length) return;
        const top = seen.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
        const i = items.findIndex((it) => it.id === top.target.id);
        if (i >= 0) setActive(i);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const it of items) {
      const el = document.getElementById(it.id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, [items]);

  return (
    /*
     * Ambang lebarnya bukan `xl`.
     *
     * Isi halaman lebarnya 1152px dan rata tengah, jadi di 1280px hanya tersisa
     * 64px di tiap sisi — penanda ini akan menempel bahkan menimpa tulisannya.
     * Ruang yang benar-benar cukup baru ada di atas 1500px. Ambang tingginya
     * juga perlu, karena di jendela pendek daftar sepuluh butir ini terpotong
     * dan yang terlihat justru deretan angka menggantung tanpa awal.
     */
    <nav
      aria-label="Bagian halaman"
      className="pointer-events-none fixed left-8 top-1/2 z-30 hidden max-h-[70vh] -translate-y-1/2 overflow-hidden min-[1500px]:[@media(min-height:760px)]:block"
    >
      <ul className="space-y-3.5">
        {items.map((it, i) => {
          const on = i === active;
          return (
            <li key={it.id}>
              <a href={`#${it.id}`} className="pointer-events-auto group flex items-center gap-3">
                <motion.span
                  className="h-px bg-sand-500/40"
                  animate={{ width: on ? 22 : 10 }}
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                />
                <span
                  className={`num text-[10px] tracking-widest transition-opacity duration-300 ${
                    on ? "text-teal-400 opacity-100" : "text-sand-500 opacity-40"
                  }`}
                >
                  {it.n}
                </span>
                <span className="max-w-0 overflow-hidden whitespace-nowrap text-[11px] text-sand-500 opacity-0 transition-all duration-300 group-hover:max-w-32 group-hover:opacity-100">
                  {it.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
