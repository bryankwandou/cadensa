import Link from "next/link";
import { CadenceBand } from "@/components/CadenceBand";
import { Mark } from "@/components/Logo";
import { Reveal, Stagger, StaggerItem } from "@/components/Motion";
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
    d: "Tiga ketukan untuk yang wajib, sisanya opsional. Targetnya di bawah dua belas detik, dan itu angka mati.",
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

export default function Home() {
  return (
    <div className="aurora min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pt-20 pb-16 sm:pt-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border hairline px-3.5 py-1.5 text-xs tracking-wide text-sand-300">
                <span className="size-1.5 rounded-full bg-teal-500" />
                Kesehatan prostat, dibaca dari ritme
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
                kejadian kanker prostat yang lebih rendah dibanding yang hanya empat sampai
                tujuh kali. Cadensa mengubah temuan itu menjadi kebiasaan yang bisa dilihat dan
                dijaga — tanpa satu pun catatan meninggalkan perangkatmu.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/log"
                  className="rounded-full bg-teal-500 px-6 py-3 text-sm font-medium text-ink-950 transition-transform hover:-translate-y-0.5"
                >
                  Mulai mencatat
                </Link>
                <Link
                  href="/rhythm"
                  className="rounded-full border hairline px-6 py-3 text-sm text-sand-100 transition-colors hover:bg-ink-800"
                >
                  Lihat contoh sebulan
                </Link>
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
            <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center">
              <div className="absolute inset-8 rounded-full bg-teal-700/10 blur-3xl" />
              <Mark size={340} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Kontras */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
            Yang sudah ada berdiri di premis sebaliknya
          </h2>
        </Reveal>
        <Stagger className="mt-10 grid gap-5 md:grid-cols-2">
          <StaggerItem className="card rounded-3xl p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-sand-500">Aplikasi pantang</p>
            <p className="mt-3 text-lg leading-relaxed text-sand-100">
              Menghitung hari menahan diri, memberi lencana, dan membangun rasa bersalah saat
              hitungannya patah.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-sand-500">
              Hitungan yang patah membuat orang berhenti memakai aplikasinya. Di kategori ini
              kepergiannya permanen, karena bercampur rasa malu.
            </p>
          </StaggerItem>
          <StaggerItem className="card rounded-3xl p-7 ring-1 ring-teal-700/40">
            <p className="text-xs uppercase tracking-[0.18em] text-teal-500">Cadensa</p>
            <p className="mt-3 text-lg leading-relaxed text-sand-100">
              Tidak menghitung hari pantang dan tidak punya hitungan yang bisa patah. Yang
              ditampilkan pita ritme yang melebar dan menyempit.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-sand-500">
              Dua puluh satu digambar sebagai wilayah, bukan garis. Tidak ada papan peringkat,
              tidak ada yang bisa gagal.
            </p>
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
            Dua orang dengan dua puluh satu catatan bisa sangat berbeda: satu tersebar rata,
            satu menumpuk di minggu terakhir. Coba sendiri.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="mt-8">
          <CadenceBand />
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
            <StaggerItem key={s.name} className="card rounded-3xl p-7">
              <h3 className="text-lg font-medium text-sand-100">{s.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-teal-500">{s.read}</p>
              <p className="mt-3 text-sm leading-relaxed text-sand-500">{s.why}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Alur */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <Stagger className="grid gap-5 md:grid-cols-3">
          {STEPS.map((s) => (
            <StaggerItem key={s.n} className="rounded-3xl border hairline p-7">
              <span className="font-mono text-sm text-teal-500">{s.n}</span>
              <h3 className="mt-4 text-xl font-medium">{s.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-sand-500">{s.d}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Privasi */}
      <section className="mx-auto max-w-4xl px-5 py-20">
        <Reveal className="card rounded-3xl p-8 sm:p-12">
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.02em]">
            Tidak ada server yang menyimpan ini
          </h2>
          <p className="mt-5 leading-relaxed text-sand-300">
            Catatanmu tinggal di penyimpanan browser perangkat ini. Bacaan di halaman wawasan
            dihitung di tempat yang sama — tidak ada permintaan jaringan yang membawa isinya
            keluar. Kalau kamu menutup tab ini dan menghapus datanya, tidak ada salinan di mana
            pun yang bisa dipanggil kembali.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["Tidak dikirim", "Tidak ada endpoint yang menerima catatanmu."],
              ["Tidak dijual", "Tidak sekarang, tidak nanti, tidak dalam bentuk apa pun."],
              ["Tidak melatih model", "Catatanmu bukan bahan bakar untuk siapa pun."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-2xl border hairline p-5">
                <p className="text-sm font-medium text-sand-100">{t}</p>
                <p className="mt-2 text-xs leading-relaxed text-sand-500">{d}</p>
              </div>
            ))}
          </div>
          <Link
            href="/privacy"
            className="mt-8 inline-block text-sm text-teal-500 hover:text-teal-600"
          >
            Baca selengkapnya
          </Link>
        </Reveal>
      </section>

      {/* Penutup */}
      <section className="mx-auto max-w-4xl px-5 pb-28 pt-10 text-center">
        <Reveal>
          <h2 className="text-balance text-4xl font-semibold tracking-[-0.025em]">
            Mulai dari satu catatan
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-sand-300">
            Tidak perlu akun, tidak perlu email. Cadensa berguna sebelum kamu mendaftar apa pun.
          </p>
          <Link
            href="/log"
            className="mt-9 inline-block rounded-full bg-teal-500 px-7 py-3.5 text-sm font-medium text-ink-950 transition-transform hover:-translate-y-0.5"
          >
            Buka pencatat
          </Link>
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
