"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CadenceBand } from "@/components/CadenceBand";
import { Mark } from "@/components/Logo";
import {
  Counter,
  Magnetic,
  Parallax,
  PulseRing,
  Reveal,
  Stagger,
  StaggerItem,
  Tilt3D,
} from "@/components/Motion";
import { SectionHead } from "@/components/Section";
import { DeviceMarquee } from "@/components/DeviceMarquee";
import { Glyph } from "@/components/Glyph";
import { AFTERFEELS, DEVICES, METHODS, TRIGGERS } from "@/lib/types";
import { Nav } from "@/components/Nav";

const SIGNALS = [
  {
    name: "Stres",
    read: "Frekuensi naik, durasi memendek, alasan bergeser ke stres atau bosan.",
    why: "Pola cepat dan sering seperti ini adalah cara tubuh menurunkan tekanan, bukan tanda gairah. Biasanya terbaca beberapa hari sebelum orangnya sendiri sadar.",
  },
  {
    name: "Rasa yang mendatar",
    read: "Kekosongan panjang bersamaan dengan label rasa yang bergeser ke netral atau hampa.",
    why: "Kuesioner suasana hati mudah dijawab seadanya. Catatan yang dibuat tanpa penonton jauh lebih jujur.",
  },
  {
    name: "Tidur",
    read: "Jam kejadian bergeser konsisten ke rentang dini hari.",
    why: "Kalau pergeserannya menetap, yang berubah biasanya jam tidur, bukan dorongan seksual.",
  },
  {
    name: "Kompulsivitas",
    read: "Sering, tapi hampir tidak pernah diikuti rasa lega.",
    why: "Jumlah tinggi yang tetap terasa enak bukan masalah. Yang membedakan adalah jaraknya dengan rasa lega, dan hanya kombinasi ini yang menangkapnya.",
  },
];

const STEPS = [
  {
    n: "01",
    t: "Catat",
    d: "Dua ketukan untuk yang wajib, sisanya opsional. Targetnya di bawah dua belas detik, dan itu angka mati.",
  },
  {
    n: "02",
    t: "Lihat ritmemu",
    d: "Kalender yang tidak terlihat seperti kalender. Kepadatan menunjukkan frekuensi, ketinggian menunjukkan rasa.",
  },
  {
    n: "03",
    t: "Baca",
    d: "Satu pengamatan, satu saran. Tidak pernah tiga, tidak pernah menghakimi.",
  },
];

const CTA =
  "inline-block rounded-full bg-teal-500 px-6 py-3 text-sm font-medium text-ink-975 transition-colors hover:bg-teal-400";
const CTA_GHOST =
  "inline-block rounded-full border hairline px-6 py-3 text-sm text-sand-100 transition-colors hover:bg-ink-800";

export default function Home() {
  return (
    <div className="aurora min-h-screen">
      <Nav />

      {/* Hero. Sengaja tidak rata tengah: teks bertumpu di kiri, tanda melewati tepi kanan. */}
      <section className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="inline-flex items-center gap-2.5 rounded-full border hairline px-3.5 py-1.5 text-xs text-sand-300">
                <motion.span
                  className="size-1.5 rounded-full bg-teal-500"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                Kesehatan reproduksi, dibaca dari ritme
              </span>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="display mt-7 text-[3.4rem] sm:text-[4.6rem]">
                Ritme,
                <br />
                <span className="text-teal-400">bukan skor.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-sand-300">
                Pria yang berejakulasi sekitar dua puluh satu kali sebulan menunjukkan angka
                kejadian kanker prostat yang lebih rendah dibanding yang hanya empat sampai tujuh
                kali. Cadensa mengubah temuan itu menjadi kebiasaan yang bisa dilihat dan dijaga,
                dan mengunci catatannya di perangkatmu sebelum apa pun terkirim.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <Link href="/log" className={CTA}>
                    Mulai mencatat
                  </Link>
                </Magnetic>
                <Link
                  href="/masuk"
                  className="text-sm text-sand-300 underline decoration-sand-500/40 underline-offset-[6px] transition-colors hover:text-sand-100"
                >
                  Buat akun dan amankan
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <p className="mt-8 max-w-md border-l border-sand-500/20 pl-4 text-sm leading-relaxed text-sand-500">
                Perlu disebut jujur: temuan itu korelasi, bukan sebab-akibat. Cadensa
                memperlakukannya sebagai penanda ritme sehat, bukan sebagai janji.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.1} y={28}>
              <Parallax depth={30}>
                <div className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center lg:-mr-16 lg:max-w-md">
                  <div className="absolute inset-10 rounded-full bg-teal-700/12 blur-3xl" />
                  <PulseRing size={290} className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                  <motion.div
                    animate={{ rotateZ: [0, 1.6, 0, -1.6, 0], rotateY: [0, 5, 0, -5, 0] }}
                    transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <Mark size={330} />
                  </motion.div>
                </div>
              </Parallax>
            </Reveal>
          </div>
        </div>

        {/* Tiga angka dibaca sebagai satu baris, bukan tiga kartu sejajar. */}
        <Reveal delay={0.1}>
          <div className="mt-20 grid gap-px overflow-hidden rounded-panel border hairline sm:grid-cols-3">
            {[
              { n: 21, t: "kali sebulan, digambar sebagai wilayah bukan garis" },
              { n: DEVICES.length, t: "jenis alat, tiap satu dengan catatan perawatannya" },
              { n: 0, t: "baris terbaca yang tersimpan di server kami" },
            ].map((x, i) => (
              <div
                key={x.t}
                className={`surface px-7 py-8 ${i === 1 ? "sm:border-x sm:border-[rgba(207,198,184,0.085)]" : ""}`}
              >
                <p className="num text-[2.75rem] leading-none text-teal-400">
                  <Counter to={x.n} />
                </p>
                <p className="mt-4 text-sm leading-relaxed text-sand-500">{x.t}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <div className="mx-auto max-w-6xl px-5">
        <hr className="rule" />
      </div>

      {/* 01 Posisi */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <SectionHead
          n="01"
          eyebrow="Posisi"
          title={
            <>
              Yang sudah ada berdiri
              <br className="hidden sm:block" /> di premis sebaliknya
            </>
          }
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow">Aplikasi pantang</p>
            <p className="display-sm mt-4 text-2xl text-sand-300">
              Menghitung hari menahan diri, memberi lencana, dan membangun rasa bersalah saat
              hitungannya patah.
            </p>
            <p className="mt-5 text-sm leading-relaxed text-sand-500">
              Hitungan yang patah membuat orang berhenti memakai aplikasinya. Di kategori ini
              kepergiannya permanen, karena bercampur rasa malu.
            </p>
          </Reveal>

          <div className="hidden lg:col-span-1 lg:flex lg:justify-center">
            <span className="h-full w-px bg-gradient-to-b from-transparent via-sand-500/20 to-transparent" />
          </div>

          <Reveal delay={0.08} className="lg:col-span-6">
            <p className="eyebrow text-teal-500">Cadensa</p>
            <p className="display-sm mt-4 text-2xl text-sand-100">
              Tidak menghitung hari pantang, dan tidak punya hitungan yang bisa patah. Yang
              ditampilkan pita ritme yang melebar dan menyempit.
            </p>
            <p className="mt-5 text-sm leading-relaxed text-sand-500">
              Dua puluh satu digambar sebagai wilayah, bukan garis. Tidak ada papan peringkat, dan
              tidak ada yang bisa gagal.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 02 Peragaan */}
      <section className="mx-auto max-w-4xl px-5 py-20">
        <SectionHead
          n="02"
          eyebrow="Peragaan"
          title="Jumlah bukan ukuran yang tepat"
          lead="Dua orang dengan dua puluh satu catatan bisa sangat berbeda: satu tersebar rata, satu menumpuk di minggu terakhir. Geser sendiri, dan lihat indeksnya runtuh sementara jumlahnya tidak berubah."
        />
        <Reveal delay={0.1} className="mt-10">
          <CadenceBand />
        </Reveal>
      </section>

      {/* 03 Katalog */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHead
            n="03"
            eyebrow="Katalog"
            title="Alatnya disebut dengan nama yang tepat"
            lead={
              <>
                {DEVICES.length} jenis, dikelompokkan, masing-masing dengan ikon dan catatan
                perawatan. Rinciannya sejauh ini karena gesekan dan tekanan tiap jenis berbeda jauh,
                dan itu satu-satunya cara menjelaskan kenapa keluhan fisik muncul pada sebagian
                orang saja.
              </>
            }
          />
        </div>
        <Reveal delay={0.08} className="mt-12">
          <DeviceMarquee />
        </Reveal>
        <div className="mx-auto mt-8 max-w-6xl px-5">
          <Reveal delay={0.12}>
            <p className="max-w-xl text-sm leading-relaxed text-sand-500">
              Ikonnya digambar sebagai garis vektor, bukan berkas gambar. Tajam di layar mana pun
              tanpa menambah unduhan, ikut warna tema, dan yang paling menentukan, tidak ada berkas
              gambar yang singgah di riwayat unduhan. Bentuknya cukup untuk dikenali pemakainya,
              tidak cukup untuk dipahami orang yang melirik dari samping.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 04 Kosakata rupa */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <SectionHead
          n="04"
          eyebrow="Kosakata"
          title="Setiap pilihan punya rupanya sendiri"
          lead="Alur catat punya anggaran dua belas detik, dan di layar sekecil ponsel bentuk terbaca lebih cepat daripada kata. Karena itu tidak ada satu pun pilihan yang hanya berupa teks."
        />

        <div className="mt-12 space-y-9">
          {[
            {
              t: "Rasanya sesudah",
              set: "feel" as const,
              items: AFTERFEELS.map((a) => ({ n: a.key, medis: a.medical })),
            },
            {
              t: "Cara",
              set: "method" as const,
              items: METHODS.map((m) => ({ n: m, medis: false })),
            },
            {
              t: "Yang memicu",
              set: "trigger" as const,
              items: TRIGGERS.map((t) => ({ n: t, medis: false })),
            },
          ].map((row, ri) => (
            <Reveal key={row.t} delay={ri * 0.06}>
              <p className="eyebrow mb-4">{row.t}</p>
              <Stagger className="grid grid-cols-4 gap-2.5 sm:grid-cols-6 lg:grid-cols-8" gap={0.035}>
                {row.items.map((it) => (
                  <StaggerItem key={it.n}>
                    <motion.div
                      whileHover={{ y: -5, rotateX: 12, rotateY: -8 }}
                      transition={{ type: "spring", stiffness: 340, damping: 20 }}
                      style={{ transformStyle: "preserve-3d", perspective: 600 }}
                      className={`surface-sunken flex h-full flex-col items-center gap-2.5 rounded-field p-3.5 text-center ${
                        it.medis ? "border-signal-500/25" : ""
                      }`}
                    >
                      <span className={it.medis ? "text-signal-500" : "text-teal-500"}>
                        <Glyph set={row.set} name={it.n} size={30} active />
                      </span>
                      <span className="text-[11px] leading-tight text-sand-300">{it.n}</span>
                    </motion.div>
                  </StaggerItem>
                ))}
              </Stagger>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-9 max-w-xl text-sm leading-relaxed text-sand-500">
            Empat rupa terakhir di baris pertama bertanda merah karena berhubungan dengan tubuh,
            bukan suasana hati. Warna itu dicadangkan untuk satu makna saja di seluruh aplikasi, dan
            memilih salah satunya membawa catatanmu ke jalur yang tidak pernah dijawab dengan saran
            mengubah teknik.
          </p>
        </Reveal>
      </section>

      <div className="mx-auto max-w-6xl px-5">
        <hr className="rule" />
      </div>

      {/* 05 Sinyal. Daftar bernomor, bukan grid kartu. */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <SectionHead
          n="05"
          eyebrow="Sinyal"
          title={
            <>
              Catatan yang dibuat tanpa penonton
              <br className="hidden sm:block" /> adalah data batin yang paling jujur
            </>
          }
          lead="Empat pola terbaca tanpa Cadensa perlu bertanya apa pun. Semuanya disajikan sebagai yang tubuhmu tunjukkan minggu ini, bukan sebagai label klinis."
        />

        <div className="mt-14 divide-y divide-[rgba(207,198,184,0.08)] border-y border-[rgba(207,198,184,0.08)]">
          {SIGNALS.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.05}>
              <div className="grid gap-4 py-8 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-3">
                  <span className="num text-xs text-teal-600">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="display-sm mt-2 text-xl text-sand-100">{s.name}</h3>
                </div>
                <p className="text-[0.9375rem] leading-relaxed text-teal-500/90 lg:col-span-4">
                  {s.read}
                </p>
                <p className="text-[0.9375rem] leading-relaxed text-sand-500 lg:col-span-5">{s.why}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 06 Mode perempuan */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <Reveal>
          <div className="surface-raised overflow-hidden rounded-panel">
            <div className="grid lg:grid-cols-12">
              <div className="p-8 sm:p-12 lg:col-span-7">
                <p className="eyebrow flex items-center gap-3">
                  <span className="text-teal-600">06</span>
                  <span className="h-px w-8 bg-sand-500/30" />
                  Mode perempuan
                </p>
                <h2 className="display mt-5 text-[2.1rem] sm:text-[2.6rem]">
                  Bukan aplikasi yang sama dengan kata ganti yang diganti
                </h2>
                <p className="mt-6 leading-relaxed text-sand-300">
                  Angka dua puluh satu tidak dipindahkan ke sini. Dasarnya penelitian tentang
                  prostat, organ yang tidak ada di tubuh perempuan, jadi memakai ulang angkanya akan
                  jadi klaim kesehatan tanpa dasar. Produk yang mengarang satu angka kehilangan hak
                  dipercaya soal angka lainnya.
                </p>
                <p className="mt-4 leading-relaxed text-sand-500">
                  Yang dipakai sebagai gantinya adalah pertanyaan yang memang punya jawaban: apakah
                  dorongan naik dan turun mengikuti siklus, dan apakah polanya berulang.
                </p>
                <Magnetic className="mt-8 inline-block">
                  <Link href="/pengaturan" className={CTA_GHOST}>
                    Ganti mode
                  </Link>
                </Magnetic>
              </div>

              <div className="surface-sunken lg:col-span-5">
                <dl className="divide-y divide-[rgba(207,198,184,0.07)]">
                  {[
                    [
                      "Keterikatan siklus",
                      "Menggantikan pita bulanan. Seberapa terpusat doronganmu di satu fase, 0 sampai 100.",
                    ],
                    [
                      "Sebaran per fase",
                      "Haid, folikular, ovulasi, luteal. Dihitung per hari fase, karena panjang tiap fase berbeda.",
                    ],
                    [
                      "Katalog sendiri",
                      "Daftar alat menyesuaikan mode: yang khusus muncul, yang tidak relevan hilang.",
                    ],
                  ].map(([t, d]) => (
                    <div key={t} className="px-8 py-7">
                      <dt className="text-sm font-medium text-sand-100">{t}</dt>
                      <dd className="mt-2 text-sm leading-relaxed text-sand-500">{d}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 07 Alur. Tiga langkah sebagai baris, bukan tiga kartu. */}
      <section className="mx-auto max-w-4xl px-5 py-20">
        <SectionHead n="07" eyebrow="Alur" title="Tiga langkah, dan tidak ada yang keempat" />
        <div className="mt-12 space-y-1">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <div className="flex items-baseline gap-6 border-b border-[rgba(207,198,184,0.07)] py-7">
                <span className="num shrink-0 text-sm text-teal-600">{s.n}</span>
                <div>
                  <h3 className="display-sm text-2xl text-sand-100">{s.t}</h3>
                  <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-sand-500">{s.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 08 Penyimpanan */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <SectionHead
          n="08"
          eyebrow="Penyimpanan"
          title={
            <>
              Catatanmu tidak akan hilang,
              <br className="hidden sm:block" /> dan tetap tidak terbaca siapa pun
            </>
          }
          lead="Penyimpanan peramban bisa dibersihkan sistem tanpa memberi tahu, dan catatan yang hilang begitu saja adalah cacat, bukan fitur. Karena itu ada akun. Tapi sebelum apa pun terkirim, catatanmu dikunci dulu di perangkat ini dengan AES-GCM, memakai kunci yang diturunkan dari kata sandimu di perambanmu sendiri."
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <Stagger className="space-y-2.5 lg:col-span-7">
            {[
              ["Terkunci sebelum dikirim", "Enkripsi terjadi di perangkatmu, bukan di server."],
              [
                "Kata sandi tidak dikirim",
                "Yang dikirim turunan PBKDF2-nya. Kata sandi aslinya tidak pernah keluar dari peramban.",
              ],
              ["Bocor pun tidak terbaca", "Kalau seluruh basis datanya dicuri, isinya tetap teks acak."],
            ].map(([t, d], i) => (
              <StaggerItem key={t}>
                <Tilt3D max={4} className="relative">
                  <div className="surface flex items-start gap-5 rounded-card px-7 py-6">
                    <span className="num mt-0.5 text-xs text-teal-600">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-medium text-sand-100">{t}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-sand-500">{d}</p>
                    </div>
                  </div>
                </Tilt3D>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.08} className="lg:col-span-5">
            <div className="border-l-2 border-amber-400/40 pl-6">
              <p className="display-sm text-lg text-amber-400">Harga dari janji ini</p>
              <p className="mt-4 text-sm leading-relaxed text-sand-300">
                Karena kunci tidak pernah kami pegang, tidak ada tombol lupa kata sandi yang bisa
                mengembalikan catatanmu. Yang ada kunci pemulihan sekali tampil, dan cadangan yang
                bisa kamu unduh sendiri kapan saja.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-sand-500">
                Kami memilih menyebut kelemahan ini terang-terangan daripada menyembunyikannya di
                balik alur pemulihan yang sebenarnya berarti kami bisa membaca isinya.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Magnetic>
                  <Link href="/masuk" className={CTA}>
                    Buat akun
                  </Link>
                </Magnetic>
                <Link
                  href="/privacy"
                  className="text-sm text-sand-300 underline decoration-sand-500/40 underline-offset-[6px] hover:text-sand-100"
                >
                  Cara kerjanya
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Penutup */}
      <section className="mx-auto max-w-3xl px-5 pb-32 pt-16">
        <Reveal>
          <h2 className="display text-[2.6rem] sm:text-[3.4rem]">Mulai dari satu catatan</h2>
          <p className="mt-6 max-w-lg leading-relaxed text-sand-300">
            Tidak perlu akun untuk mencoba. Cadensa berguna sebelum kamu mendaftar apa pun. Akun
            hanya menjaga supaya yang sudah kamu catat tidak hilang.
          </p>
          <Magnetic className="mt-9 inline-block">
            <Link href="/log" className={`${CTA} px-8 py-4`}>
              Buka pencatat
            </Link>
          </Magnetic>
        </Reveal>
      </section>

      <footer className="border-t hairline py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 text-xs leading-relaxed text-sand-500 sm:flex-row sm:items-start sm:justify-between">
          <p className="display-sm text-base text-sand-300">Cadensa, ritme bukan skor.</p>
          <p className="max-w-sm">
            Bukan alat diagnosis. Kalau ada nyeri berulang, darah, atau keluhan yang menetap,
            periksakan ke dokter.
          </p>
        </div>
      </footer>
    </div>
  );
}
