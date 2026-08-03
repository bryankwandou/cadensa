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
import { DeviceMarquee } from "@/components/DeviceMarquee";
import { DEVICES } from "@/lib/types";
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
    why: "Jumlah tinggi yang tetap terasa enak bukan masalah. Yang membedakan adalah jaraknya dengan rasa lega — dan hanya kombinasi ini yang menangkapnya.",
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

const CTA = "rounded-full bg-teal-500 px-6 py-3 text-sm font-medium text-ink-950";
const CTA_GHOST = "rounded-full border hairline px-6 py-3 text-sm text-sand-100 hover:bg-ink-800";

export default function Home() {
  return (
    <div className="aurora min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-20 sm:pt-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border hairline px-3.5 py-1.5 text-xs tracking-wide text-sand-300">
                <motion.span
                  className="size-1.5 rounded-full bg-teal-500"
                  animate={{ opacity: [1, 0.35, 1] }}
                  transition={{ duration: 2.6, repeat: Infinity }}
                />
                Kesehatan reproduksi, dibaca dari ritme
              </span>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
                Ritme,
                <br />
                bukan skor.
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-sand-300">
                Pria yang berejakulasi sekitar dua puluh satu kali sebulan menunjukkan angka
                kejadian kanker prostat yang lebih rendah dibanding yang hanya empat sampai tujuh
                kali. Cadensa mengubah temuan itu menjadi kebiasaan yang bisa dilihat dan dijaga —
                dan mengunci catatannya di perangkatmu sebelum apa pun terkirim.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <Link href="/log" className={`${CTA} inline-block`}>
                    Mulai mencatat
                  </Link>
                </Magnetic>
                <Magnetic>
                  <Link href="/masuk" className={`${CTA_GHOST} inline-block`}>
                    Buat akun & amankan
                  </Link>
                </Magnetic>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-sand-500">
                Perlu disebut jujur: temuan itu adalah korelasi, bukan sebab-akibat. Cadensa
                memperlakukannya sebagai penanda ritme sehat, bukan sebagai janji.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} y={28}>
            <Parallax depth={26}>
              <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center">
                <div className="absolute inset-8 rounded-full bg-teal-700/10 blur-3xl" />
                <PulseRing size={300} className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                <motion.div
                  animate={{ rotateZ: [0, 2, 0, -2, 0], rotateY: [0, 6, 0, -6, 0] }}
                  transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Mark size={340} />
                </motion.div>
              </div>
            </Parallax>
          </Reveal>
        </div>

        {/* Angka yang naik ke nilainya */}
        <Stagger className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            { n: 21, s: "", t: "kali sebulan — wilayah, bukan garis" },
            { n: DEVICES.length, s: "", t: "jenis alat dengan ikon dan catatan perawatan" },
            { n: 0, s: "", t: "baris data terbaca yang tersimpan di server kami" },
          ].map((x) => (
            <StaggerItem key={x.t}>
              <Tilt3D max={7} className="relative rounded-3xl">
                <div className="card rounded-3xl p-6">
                  <p className="font-mono text-4xl text-teal-500">
                    <Counter to={x.n} suffix={x.s} />
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-sand-500">{x.t}</p>
                </div>
              </Tilt3D>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Kontras */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
            Yang sudah ada berdiri di premis sebaliknya
          </h2>
        </Reveal>
        <Stagger className="mt-10 grid gap-5 md:grid-cols-2">
          <StaggerItem>
            <Tilt3D max={6} className="relative h-full rounded-3xl">
              <div className="card h-full rounded-3xl p-7">
                <p className="text-xs uppercase tracking-[0.18em] text-sand-500">Aplikasi pantang</p>
                <p className="mt-3 text-lg leading-relaxed text-sand-100">
                  Menghitung hari menahan diri, memberi lencana, dan membangun rasa bersalah saat
                  hitungannya patah.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-sand-500">
                  Hitungan yang patah membuat orang berhenti memakai aplikasinya. Di kategori ini
                  kepergiannya permanen, karena bercampur rasa malu.
                </p>
              </div>
            </Tilt3D>
          </StaggerItem>
          <StaggerItem>
            <Tilt3D max={6} className="relative h-full rounded-3xl">
              <div className="card h-full rounded-3xl p-7 ring-1 ring-teal-700/40">
                <p className="text-xs uppercase tracking-[0.18em] text-teal-500">Cadensa</p>
                <p className="mt-3 text-lg leading-relaxed text-sand-100">
                  Tidak menghitung hari pantang dan tidak punya hitungan yang bisa patah. Yang
                  ditampilkan pita ritme yang melebar dan menyempit.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-sand-500">
                  Dua puluh satu digambar sebagai wilayah, bukan garis. Tidak ada papan peringkat,
                  tidak ada yang bisa gagal.
                </p>
              </div>
            </Tilt3D>
          </StaggerItem>
        </Stagger>
      </section>

      {/* Cadence Index — interaktif */}
      <section className="mx-auto max-w-4xl px-5 py-16">
        <Reveal>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
            Jumlah bukan ukuran yang tepat
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-sand-300">
            Dua orang dengan dua puluh satu catatan bisa sangat berbeda: satu tersebar rata, satu
            menumpuk di minggu terakhir. Geser sendiri dan lihat indeksnya runtuh sementara
            jumlahnya tidak berubah.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="mt-8">
          <CadenceBand />
        </Reveal>
      </section>

      {/* Katalog alat */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <h2 className="max-w-3xl text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
            Alatnya disebut dengan nama yang tepat
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-sand-300">
            {DEVICES.length} jenis, dikelompokkan, masing-masing dengan ikon dan catatan perawatan.
            Ada dua alasan rinciannya sampai sejauh ini. Gesekan dan tekanan tiap jenis berbeda
            jauh, dan itu satu-satunya cara menjelaskan kenapa keluhan fisik muncul pada sebagian
            orang saja. Yang kedua lebih sederhana: penyebutan yang tepat menghilangkan rasa
            canggung.
          </p>
        </Reveal>
        <Reveal delay={0.08} className="mt-10">
          <DeviceMarquee />
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-sand-500">
            Ikonnya digambar sebagai garis vektor, bukan berkas gambar. Tajam di layar mana pun
            tanpa menambah unduhan, ikut warna tema — dan yang paling menentukan, tidak ada berkas
            gambar yang tersimpan di perangkat atau singgah di riwayat unduhan. Bentuknya cukup
            untuk dikenali pemakainya, tidak cukup untuk dipahami orang yang melirik dari samping.
          </p>
        </Reveal>
      </section>

      {/* Sinyal psikologis */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <h2 className="max-w-3xl text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
            Catatan yang dibuat tanpa penonton adalah data suasana batin yang paling jujur
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-sand-300">
            Empat pola bisa terbaca tanpa Cadensa perlu bertanya apa pun. Semuanya disajikan
            sebagai yang tubuhmu tunjukkan minggu ini, bukan sebagai label klinis.
          </p>
        </Reveal>
        <Stagger className="mt-10 grid gap-5 sm:grid-cols-2">
          {SIGNALS.map((s) => (
            <StaggerItem key={s.name}>
              <Tilt3D max={6} className="relative h-full rounded-3xl">
                <div className="card h-full rounded-3xl p-7">
                  <h3 className="text-lg font-medium text-sand-100">{s.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-teal-500">{s.read}</p>
                  <p className="mt-3 text-sm leading-relaxed text-sand-500">{s.why}</p>
                </div>
              </Tilt3D>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Mode wanita */}
      <section className="mx-auto max-w-5xl px-5 py-20">
        <Reveal>
          <div className="card rounded-3xl p-8 sm:p-12">
            <p className="text-xs uppercase tracking-[0.18em] text-amber-400">Mode perempuan</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.02em]">
              Bukan aplikasi yang sama dengan kata ganti yang diganti
            </h2>
            <p className="mt-5 max-w-2xl leading-relaxed text-sand-300">
              Angka dua puluh satu tidak dipindahkan ke sini. Temuan yang mendasarinya berasal dari
              penelitian tentang prostat — organ yang tidak ada di tubuh perempuan — jadi memakai
              ulang angkanya akan jadi klaim kesehatan tanpa dasar. Yang dipakai sebagai gantinya
              adalah pertanyaan yang memang punya jawaban: apakah dorongan naik dan turun mengikuti
              siklus, dan apakah polanya berulang dari bulan ke bulan.
            </p>
            <Stagger className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["Keterikatan siklus", "Menggantikan pita bulanan. Mengukur seberapa terpusat doronganmu di satu fase, 0 sampai 100."],
                ["Sebaran per fase", "Haid, folikular, ovulasi, luteal — dihitung per hari fase, karena panjang tiap fase berbeda."],
                ["Katalog sendiri", "Daftar alat menyesuaikan mode, lengkap dengan yang khusus dan tanpa yang tidak relevan."],
              ].map(([t, d]) => (
                <StaggerItem key={t}>
                  <Tilt3D max={8} className="relative h-full rounded-2xl">
                    <div className="h-full rounded-2xl border hairline p-5">
                      <p className="text-sm font-medium text-sand-100">{t}</p>
                      <p className="mt-2 text-xs leading-relaxed text-sand-500">{d}</p>
                    </div>
                  </Tilt3D>
                </StaggerItem>
              ))}
            </Stagger>
            <Magnetic className="mt-8 inline-block">
              <Link href="/pengaturan" className={`${CTA_GHOST} inline-block`}>
                Ganti mode
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </section>

      {/* Alur */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <Stagger className="grid gap-5 md:grid-cols-3">
          {STEPS.map((s) => (
            <StaggerItem key={s.n}>
              <Tilt3D max={7} className="relative h-full rounded-3xl">
                <div className="h-full rounded-3xl border hairline p-7">
                  <span className="font-mono text-sm text-teal-500">{s.n}</span>
                  <h3 className="mt-4 text-xl font-medium">{s.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-sand-500">{s.d}</p>
                </div>
              </Tilt3D>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Penyimpanan & privasi */}
      <section className="mx-auto max-w-4xl px-5 py-20">
        <Reveal className="card rounded-3xl p-8 sm:p-12">
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.02em]">
            Catatanmu tidak akan hilang, dan tetap tidak bisa dibaca siapa pun
          </h2>
          <p className="mt-5 leading-relaxed text-sand-300">
            Penyimpanan peramban bisa dibersihkan sistem tanpa memberi tahu, terutama saat ruang
            penyimpanan menipis — dan catatan yang hilang begitu saja adalah cacat, bukan fitur.
            Karena itu ada akun. Tapi sebelum apa pun terkirim, catatanmu dikunci dulu di perangkat
            ini dengan AES-GCM, memakai kunci yang diturunkan dari kata sandimu di perambanmu
            sendiri. Yang sampai ke server adalah teks acak.
          </p>
          <Stagger className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["Terkunci sebelum dikirim", "Enkripsi terjadi di perangkatmu, bukan di server."],
              ["Kata sandi tidak dikirim", "Yang dikirim turunan PBKDF2-nya. Kata sandi aslinya tidak pernah keluar."],
              ["Bocor pun tidak terbaca", "Kalau seluruh basis datanya dicuri, isinya tetap teks acak."],
            ].map(([t, d]) => (
              <StaggerItem key={t}>
                <Tilt3D max={8} className="relative h-full rounded-2xl">
                  <div className="h-full rounded-2xl border hairline p-5">
                    <p className="text-sm font-medium text-sand-100">{t}</p>
                    <p className="mt-2 text-xs leading-relaxed text-sand-500">{d}</p>
                  </div>
                </Tilt3D>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mt-6 text-sm leading-relaxed text-sand-500">
            Harganya disebut terang-terangan: karena kunci tidak pernah kami pegang, tidak ada
            tombol lupa kata sandi yang bisa mengembalikan catatanmu. Yang ada kunci pemulihan
            sekali tampil, dan cadangan yang bisa kamu unduh sendiri kapan saja.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <Link href="/masuk" className={`${CTA} inline-block`}>
                Buat akun
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/privacy" className={`${CTA_GHOST} inline-block`}>
                Baca cara kerjanya
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </section>

      {/* Penutup */}
      <section className="mx-auto max-w-4xl px-5 pb-28 pt-10 text-center">
        <Reveal>
          <h2 className="text-balance text-4xl font-semibold tracking-[-0.025em]">
            Mulai dari satu catatan
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-sand-300">
            Tidak perlu akun untuk mencoba. Cadensa berguna sebelum kamu mendaftar apa pun — akun
            hanya menjaga supaya yang sudah kamu catat tidak hilang.
          </p>
          <Magnetic className="mt-9 inline-block">
            <Link href="/log" className={`${CTA} inline-block px-7 py-3.5`}>
              Buka pencatat
            </Link>
          </Magnetic>
        </Reveal>
      </section>

      <footer className="border-t hairline py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 text-xs text-sand-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Cadensa — ritme, bukan skor.</p>
          <p className="max-w-md">
            Bukan alat diagnosis. Kalau ada nyeri berulang, darah, atau keluhan yang menetap,
            periksakan ke dokter.
          </p>
        </div>
      </footer>
    </div>
  );
}
