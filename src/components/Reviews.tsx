"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Portrait } from "./Portrait";
import { Reveal } from "./Motion";

type Review = { name: string; rating: number; body: string; at: string };

/**
 * Ulasan yang tayang di halaman depan.
 *
 * Isinya diambil dari basis data, bukan dari daftar yang ditulis tangan di
 * berkas ini. Bedanya menentukan: pasal 9 dan 10 UU Perlindungan Konsumen
 * mengatur pernyataan jumlah dan penilaian produk, jadi satu-satunya angka yang
 * aman dipajang adalah angka yang bisa ditelusuri kembali ke barisnya. Tidak ada
 * jalan bagi siapa pun untuk mengetik angka penilaian di sini.
 *
 * Saat belum ada ulasan sama sekali, bagian ini tidak berpura-pura. Ia berkata
 * belum ada, dan mengajak menulis yang pertama.
 */
export function Reviews() {
  const [data, setData] = useState<{ reviews: Review[]; count: number; average: number | null } | null>(
    null,
  );

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/reviews", { cache: "no-store" });
        setData(await res.json());
      } catch {
        setData({ reviews: [], count: 0, average: null });
      }
    })();
  }, []);

  if (!data) {
    return (
      <div className="surface h-56 animate-pulse rounded-panel" aria-hidden />
    );
  }

  if (!data.count) {
    return (
      <Reveal>
        <div className="surface rounded-panel p-8 sm:p-10">
          <p className="display-sm text-xl text-sand-100">Belum ada ulasan</p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-sand-300">
            Tidak ada yang ditulis di sini sampai ada pengguna sungguhan yang menulisnya. Halaman
            yang memuat keberatan terhadap penelitiannya sendiri tidak bisa sekaligus mengarang
            kalimat pujian.
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-sand-500">
            Kalau kamu sudah memakainya, tulis yang pertama — termasuk bagian yang tidak berhasil.
          </p>
          <Link
            href="/pengaturan"
            className="mt-7 inline-block rounded-full border hairline px-6 py-3 text-sm text-sand-100 transition-colors hover:bg-ink-800"
          >
            Tulis ulasan
          </Link>
        </div>
      </Reveal>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <div className="space-y-3">
          {data.reviews.map((r, i) => (
            <Reveal key={`${r.name}-${r.at}`} delay={i * 0.05}>
              <figure className="surface rounded-card p-7">
                <div className="flex gap-1" aria-label={`${r.rating} dari 5`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <svg key={n} viewBox="0 0 24 24" width="14" height="14" aria-hidden>
                      <path
                        d="M12 3.4l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.8l6-.8z"
                        fill={n <= r.rating ? "var(--color-teal-500)" : "none"}
                        stroke={n <= r.rating ? "var(--color-teal-500)" : "rgba(207,198,184,0.25)"}
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-4 leading-relaxed text-sand-100">{r.body}</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-[rgba(207,198,184,0.08)] pt-4">
                  <Portrait name={r.name} size={34} />
                  <span className="text-xs text-sand-500">{r.name}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal delay={0.08} className="lg:col-span-5">
        <div className="surface-sunken rounded-panel p-8">
          <p className="eyebrow">Penilaian saat ini</p>
          <motion.p
            className="num mt-3 text-[3.5rem] leading-none text-teal-400"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {data.average?.toFixed(1).replace(".", ",")}
            <span className="ml-2 text-base text-sand-500">/ 5</span>
          </motion.p>
          <p className="mt-1 text-xs text-sand-500">
            dari {data.count} ulasan tertulis
          </p>

          <p className="mt-6 text-sm leading-relaxed text-sand-300">
            Angka ini dihitung langsung dari ulasan yang masuk, dan tidak bisa diketik oleh siapa
            pun — termasuk oleh kami. Naik dan turunnya mengikuti apa yang benar-benar ditulis
            orang.
          </p>
          <Link
            href="/pengaturan"
            className="mt-7 inline-block rounded-full border hairline px-5 py-2.5 text-sm text-sand-100 transition-colors hover:bg-ink-800"
          >
            Tulis ulasanmu
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
