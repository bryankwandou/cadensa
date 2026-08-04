"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Masuk sekali saat terlihat. Halus, tidak menarik perhatian ke dirinya sendiri. */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Wadah untuk anak-anak yang masuk berurutan. */
export function Stagger({
  children,
  className,
  gap = 0.07,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  ...rest
}: { children: ReactNode; className?: string } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 16 },
        shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * Garis kemajuan gulir. Setipis mungkin, di tepi paling atas.
 *
 * Halaman ini panjang dan isinya berurutan; tanpa penanda, pembaca tidak punya
 * cara tahu seberapa jauh lagi. Ketebalan dua piksel adalah batas di mana
 * penanda ini membantu tanpa ikut minta diperhatikan.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-teal-700 via-teal-400 to-teal-600"
      style={{ scaleX }}
    />
  );
}

/**
 * Judul yang tersingkap kata demi kata dari balik topeng.
 *
 * Serif display punya bentuk yang layak diperhatikan, dan penyingkapan bertahap
 * memberi mata waktu untuk melihatnya. Dipakai hanya untuk judul utama —
 * dipakai di mana-mana, efeknya berubah jadi gangguan.
 */
export function RevealWords({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>{text}</span>;

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.055, delayChildren: delay } } }}
      aria-label={text}
    >
      {text.split(" ").map((w, i) => (
        <span key={`${w}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "108%", opacity: 0 },
              shown: { y: "0%", opacity: 1, transition: { duration: 0.72, ease: EASE } },
            }}
          >
            {w}
            {i < text.split(" ").length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/**
 * Sorotan lembut yang mengikuti kursor di dalam wadahnya. Memberi kesan bahwa
 * permukaannya punya bahan, bukan sekadar warna datar.
 */
export function Spotlight({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(-500);
  const my = useMotionValue(-500);
  const bg = useMotionTemplate`radial-gradient(26rem 26rem at ${mx}px ${my}px, rgba(46,211,192,0.07), transparent 65%)`;

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      onPointerLeave={() => {
        mx.set(-500);
        my.set(-500);
      }}
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: bg }} />
      <div className="relative">{children}</div>
    </div>
  );
}

/**
 * Kartu yang miring mengikuti kursor, dengan pantulan cahaya yang ikut bergerak.
 *
 * Kemiringannya sengaja ditahan di bawah 10 derajat. Lebih dari itu, tulisan di
 * dalamnya mulai sulit dibaca — dan yang dibaca orang di sini kebanyakan angka
 * tentang tubuhnya sendiri, jadi keterbacaan menang atas efek.
 */
export function Tilt3D({
  children,
  className = "",
  max = 8,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const spring = { stiffness: 220, damping: 24, mass: 0.4 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const glareX = useTransform(px, (v) => `${v * 100}%`);
  const glareY = useTransform(py, (v) => `${v * 100}%`);
  const glareBg = useMotionTemplate`radial-gradient(24rem 24rem at ${glareX} ${glareY}, rgba(244,239,230,0.10), transparent 60%)`;

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
    >
      <div style={{ transform: "translateZ(28px)", transformStyle: "preserve-3d" }}>{children}</div>
      {glare && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: glareBg }}
        />
      )}
    </motion.div>
  );
}

/** Lapisan yang bergerak lebih lambat dari gulungan halaman, memberi kesan kedalaman. */
export function Parallax({
  children,
  className,
  depth = 40,
}: {
  children: ReactNode;
  className?: string;
  depth?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [depth, -depth]), {
    stiffness: 90,
    damping: 26,
  });
  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}

/** Tombol yang sedikit tertarik ke arah kursor sebelum disentuh. */
export function Magnetic({
  children,
  className,
  strength = 8,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 20 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 20 });
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set(((e.clientX - r.left) / r.width - 0.5) * strength * 2);
        y.set(((e.clientY - r.top) / r.height - 0.5) * strength * 2);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Angka yang naik ke nilainya, bukan yang muncul begitu saja. */
export function Counter({
  to,
  duration = 1.1,
  className,
  suffix = "",
}: {
  to: number;
  duration?: number;
  className?: string;
  suffix?: string;
}) {
  const [n, setN] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      setN(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const from = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration, reduce]);

  return (
    <span className={className}>
      {n}
      {suffix}
    </span>
  );
}

/** Cincin denyut di belakang angka utama — satu-satunya animasi yang berjalan terus. */
export function PulseRing({ size = 220, className = "" }: { size?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className={`pointer-events-none absolute ${className}`} style={{ width: size, height: size }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute inset-0 rounded-full border border-teal-500/25"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={reduce ? { opacity: 0.2 } : { scale: [0.7, 1.15], opacity: [0.35, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, delay: i * 1.5, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/** Tombol dengan umpan balik sentuh yang terasa, bukan yang meloncat. */
export function Pressable({
  children,
  className,
  ...rest
}: { children: ReactNode; className?: string } & HTMLMotionProps<"button">) {
  return (
    <motion.button
      className={className}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.975 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
