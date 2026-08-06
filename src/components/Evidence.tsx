"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

/**
 * Gambar bukti.
 *
 * Halaman ini butuh sesuatu yang membuat orang percaya, dan untuk produk
 * kesehatan yang paling meyakinkan bukan wajah tersenyum atau kutipan pengguna,
 * melainkan angka yang bisa diperiksa sendiri oleh pembacanya. Karena itu yang
 * digambar di sini adalah temuan aslinya, lengkap dengan selang kepercayaannya
 * — termasuk bagian yang melemahkan klaimnya.
 *
 * Batang digambar sebagai rasio hazard: 1,00 adalah pembanding, dan makin
 * pendek berarti makin rendah kejadiannya. Garis tipis di ujung adalah selang
 * kepercayaan 95%, dan itu justru bagian yang paling jujur dari gambar ini.
 */

type Row = {
  label: string;
  sub: string;
  hr: number;
  lo: number;
  hi: number;
  ref: boolean;
};

const ROWS: Row[] = [
  { label: "4–7 kali per bulan", sub: "kelompok pembanding", hr: 1.0, lo: 1, hi: 1, ref: true },
  { label: "8–12 kali per bulan", sub: "", hr: 0.91, lo: 0.82, hi: 1.01, ref: false },
  { label: "13–20 kali per bulan", sub: "", hr: 0.89, lo: 0.8, hi: 0.98, ref: false },
  { label: "21 kali atau lebih", sub: "wilayah yang dipakai Cadensa", hr: 0.81, lo: 0.72, hi: 0.92, ref: false },
];

const SCALE_MIN = 0.6;
const SCALE_MAX = 1.15;
const pos = (v: number) => ((v - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;

export function EvidenceChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();

  return (
    <div ref={ref} className="surface rounded-panel p-7 sm:p-9">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="eyebrow">Rasio hazard kanker prostat</p>
        <p className="num text-[10px] text-sand-500">31.925 pria · tindak lanjut 18 tahun</p>
      </div>

      <div className="mt-8 space-y-5">
        {ROWS.map((r, i) => (
          <div key={r.label}>
            <div className="flex items-baseline justify-between gap-3">
              {/* Keterangan pendamping turun ke baris sendiri di ponsel; dipaksa
                  sebaris, ia mendorong angka rasionya keluar layar. */}
              <span className={`min-w-0 text-sm ${r.ref ? "text-sand-500" : "text-sand-100"}`}>
                {r.label}
                {r.sub && (
                  <span className="block text-xs text-sand-500 sm:ml-2 sm:inline">{r.sub}</span>
                )}
              </span>
              <span
                className={`num shrink-0 text-right text-sm ${r.ref ? "text-sand-500" : "text-teal-400"}`}
              >
                {r.hr.toFixed(2)}
                {!r.ref && (
                  <span className="block text-[10px] text-sand-500 sm:ml-1.5 sm:inline">
                    {r.lo.toFixed(2)}–{r.hi.toFixed(2)}
                  </span>
                )}
              </span>
            </div>

            <div className="relative mt-2.5 h-7">
              {/* Garis acuan 1,00 */}
              <span
                className="absolute inset-y-0 w-px bg-sand-500/25"
                style={{ left: `${pos(1)}%` }}
                aria-hidden
              />
              {/* Batang */}
              <motion.span
                className={`absolute top-1.5 h-4 rounded-full ${
                  r.ref
                    ? "bg-sand-500/20"
                    : "bg-gradient-to-r from-teal-700 to-teal-400"
                }`}
                style={{ left: `${pos(SCALE_MIN)}%` }}
                initial={{ width: 0 }}
                animate={inView || reduce ? { width: `${pos(r.hr)}%` } : { width: 0 }}
                transition={{ duration: 0.9, delay: 0.12 * i, ease: [0.16, 1, 0.3, 1] }}
              />
              {/* Selang kepercayaan */}
              {!r.ref && (
                <motion.span
                  className="absolute top-[0.9rem] h-px bg-sand-100/45"
                  style={{ left: `${pos(r.lo)}%`, width: `${pos(r.hi) - pos(r.lo)}%` }}
                  initial={{ opacity: 0 }}
                  animate={inView || reduce ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.12 * i + 0.7 }}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="num mt-2 flex justify-between text-[10px] text-sand-500">
        <span>0,60</span>
        <span>1,00 — tanpa perbedaan</span>
        <span>1,15</span>
      </div>

      <p className="mt-7 border-t border-[rgba(207,198,184,0.08)] pt-5 text-xs leading-relaxed text-sand-500">
        Rider JR, Wilson KM, Sinnott JA, Kelly RS, Mucci LA, Giovannucci EL.{" "}
        <span className="text-sand-300">
          Ejaculation Frequency and Risk of Prostate Cancer: Updated Results with an Additional
          Decade of Follow-up.
        </span>{" "}
        European Urology, 2016;70(6):974–982. Angka di atas adalah frekuensi pada usia 40–49 tahun.
        Temuan awalnya terbit di JAMA 2004 dari kohort yang sama.
      </p>
    </div>
  );
}

/** Keberatan yang sengaja ditulis sendiri, bukan menunggu orang lain menemukannya. */
export const CAVEATS = [
  {
    t: "Ini pengamatan, bukan percobaan",
    d: "Tidak ada yang diacak dan tidak ada yang diperintahkan berbuat apa pun. Yang diamati adalah kebiasaan yang sudah ada, lalu dilihat siapa yang kemudian sakit. Rancangan seperti ini tidak bisa membuktikan sebab-akibat, apa pun besar angkanya.",
  },
  {
    t: "Arahnya bisa terbalik",
    d: "Bisa jadi bukan frekuensi yang menurunkan risiko, melainkan tubuh yang sudah bermasalah menurunkan frekuensi bertahun-tahun sebelum terdiagnosis. Penelitiannya berusaha menyingkirkan kemungkinan ini, tapi tidak bisa menutupnya sepenuhnya.",
  },
  {
    t: "Orang yang rajin mencatat cenderung lebih sehat",
    d: "Pesertanya tenaga kesehatan yang bersedia mengisi kuesioner selama puluhan tahun. Kelompok seperti ini lebih sering berolahraga dan lebih jarang merokok, dan sebagian dari perbedaannya mungkin datang dari sana.",
  },
  {
    t: "Datanya dari ingatan sendiri",
    d: "Frekuensinya dilaporkan sendiri lewat kuesioner, bukan dicatat saat kejadian. Justru celah inilah yang Cadensa tutup — dan itu satu-satunya alasan teknis kenapa aplikasi ini layak ada.",
  },
];
