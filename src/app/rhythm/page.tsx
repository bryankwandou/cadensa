"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Nav } from "@/components/Nav";
import { Pressable, Tilt3D } from "@/components/Motion";
import { DeviceIcon } from "@/components/DeviceIcon";
import { Glyph } from "@/components/Glyph";
import { CadenceRing } from "@/components/CadenceRing";
import { useVault } from "@/lib/vault";
import { useT } from "@/lib/i18n";
import { PHASE_NOTE, cycleCoupling, peakPhase, phaseDensity } from "@/lib/cycle";
import {
  TARGET_BAND,
  bandState,
  cadenceIndex,
  daysInMonth,
  densityByDay,
  edgingLoad,
  lastDays,
  longestGapDays,
  monthProjection,
  positiveShare,
  startOfMonth,
  within,
} from "@/lib/metrics";
import { alasanKemerataan } from "@/lib/signals";
import { afterfeelMeta } from "@/lib/types";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function Stat({
  label,
  value,
  hint,
  tone = "netral",
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "netral" | "baik" | "perhatian";
}) {
  const color =
    tone === "baik" ? "text-teal-500" : tone === "perhatian" ? "text-amber-400" : "text-sand-100";
  return (
    <Tilt3D max={6} className="relative h-full rounded-card">
      <div className="surface h-full rounded-card px-6 py-6">
        <p className="eyebrow">{label}</p>
        <p className={`num mt-3.5 text-[2rem] leading-none ${color}`}>{value}</p>
        <p className="mt-3 text-xs leading-relaxed text-sand-500">{hint}</p>
      </div>
    </Tilt3D>
  );
}

export default function RhythmPage() {
  // `wipe` tidak lagi diambil di sini: menghapus seluruh catatan sekarang hanya
  // ada di halaman pengaturan. `seed` tetap dipakai, tapi hanya oleh keadaan
  // kosong di bawah — saat belum ada apa pun yang bisa hilang.
  const { entries, ready, remove, profile } = useVault();
  const { t } = useT();
  const [offset, setOffset] = useState(0);
  const isWoman = profile.mode === "wanita";

  const anchor = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth() + offset, 1);
  }, [offset]);

  const now = new Date();
  const monthEntries = useMemo(
    () =>
      within(
        entries,
        startOfMonth(anchor),
        new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1),
      ),
    [entries, anchor],
  );

  const days = useMemo(() => densityByDay(entries, anchor), [entries, anchor]);
  const isThisMonth = offset === 0;
  const proj = monthProjection(entries, now);

  /*
    Indeks kadens dan kekosongan terpanjang mengikuti bulan yang sedang dilihat,
    bukan selalu tiga puluh hari terakhir.

    Sebelumnya keduanya dihitung dari `lastDays(entries, 30, now)` apa pun bulan
    yang dibuka, sementara judul, jumlah catatan, cincin, batang harian, rasa
    positif, dan beban edging semuanya mengikuti `anchor`. Menekan "Sebelumnya"
    lalu memajang "Juni 2026 · 28 catatan" bersebelahan dengan indeks yang
    berasal dari pertengahan Juli sampai Agustus membuat satu kartu memuat dua
    rentang waktu berbeda — dan tidak ada apa pun di layar yang memberi tahu.
    Angkanya bukan sekadar membingungkan, ia salah untuk bulan yang tertulis di
    atasnya.

    Ujung jendelanya ikut bergeser. `longestGapDays` menghitung juga jarak dari
    catatan terakhir sampai titik acuan; memakai hari ini sebagai acuan untuk
    bulan yang sudah lewat akan melaporkan kekosongan sepanjang jarak ke hari
    ini, bukan kekosongan di dalam bulan itu.
  */
  const akhirAnchor = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1);
  const jendela = isThisMonth ? lastDays(entries, 30, now) : monthEntries;
  const ujungJendela = isThisMonth ? now : akhirAnchor;
  const ci = cadenceIndex(jendela);
  const gap = longestGapDays(jendela, ujungJendela);
  const pos = positiveShare(monthEntries);
  const load = edgingLoad(monthEntries);
  const band = bandState(isThisMonth ? proj.projected : monthEntries.length);
  const maxCount = Math.max(1, ...days.map((d) => d.count));

  const recent = useMemo(
    () => [...entries].sort((a, b) => +new Date(b.at) - +new Date(a.at)).slice(0, 12),
    [entries],
  );

  const d90 = useMemo(() => lastDays(entries, 90, now), [entries]);
  const coupling = isWoman ? cycleCoupling(d90, profile.cycle) : null;
  const peak = isWoman ? peakPhase(d90, profile.cycle) : null;
  const phases = isWoman && profile.cycle.lastPeriodStart ? phaseDensity(d90, profile.cycle) : null;

  // Rangka, bukan layar kosong: jeda membuka brankas selalu ada, dan halaman
  // kosong selama jeda itu terbaca sebagai gagal memuat.
  if (!ready)
    return (
      <div className="aurora min-h-screen">
        <Nav />
        <main className="mx-auto max-w-4xl px-5 pb-24 pt-12" aria-busy>
          <div className="h-3 w-24 animate-pulse rounded-full bg-ink-700" />
          <div className="mt-5 h-10 w-56 animate-pulse rounded-full bg-ink-700" />
          <div className="surface mt-8 h-80 animate-pulse rounded-panel" />
          <div className="surface mt-5 h-44 animate-pulse rounded-panel" />
        </main>
      </div>
    );

  if (!entries.length) {
    return (
      <div className="aurora min-h-screen">
        <Nav />
        <main className="mx-auto max-w-2xl px-5 pt-24 text-center">
          <h1 className="display text-[2.6rem]">{t("Belum ada apa-apa di sini")}</h1>
          {/*
            Kalimat lamanya menawarkan memuat data contoh. Tawaran itu dicabut
            bersama fiturnya: aplikasi ini menghitung bacaan kesehatan dari
            catatan, dan begitu angka karangan masuk ke sebuah akun, tidak ada
            lagi cara membedakannya dari catatan sungguhan — termasuk oleh
            pemiliknya sendiri.
          */}
          <p className="mx-auto mt-5 max-w-md leading-relaxed text-sand-300">
            {t(
              "Ritme baru terbaca setelah beberapa catatan. Tiga sudah cukup untuk memunculkan bentuk pertamanya.",
            )}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/log"
              className="rounded-full bg-teal-500 px-6 py-3 text-sm font-medium text-ink-950"
            >
              {t("Catat yang pertama")}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="aurora min-h-screen">
      <Nav />
      <main className="mx-auto max-w-4xl px-5 pb-24 pt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{t("Ritme")}</p>
            <h1 className="display mt-2.5 text-[2.6rem]">
              {t(MONTHS[anchor.getMonth()])}{" "}
              <span className="text-sand-500">{anchor.getFullYear()}</span>
            </h1>
            <p className="mt-3 text-sm text-sand-500">
              {isThisMonth
                ? t("{n} catatan · laju saat ini mengarah ke sekitar {proyeksi}", {
                    n: monthEntries.length,
                    proyeksi: proj.projected,
                  })
                : t("{n} catatan", { n: monthEntries.length })}
            </p>
          </div>
          <div className="flex gap-2">
            <Pressable
              onClick={() => setOffset((o) => o - 1)}
              className="rounded-full border hairline px-4 py-2 text-sm text-sand-300 hover:bg-ink-800"
            >
              {t("Sebelumnya")}
            </Pressable>
            <Pressable
              onClick={() => setOffset((o) => Math.min(0, o + 1))}
              disabled={offset >= 0}
              className="rounded-full border hairline px-4 py-2 text-sm text-sand-300 disabled:opacity-40 hover:bg-ink-800"
            >
              {t("Berikutnya")}
            </Pressable>
          </div>
        </div>

        {/* Cincin kadens — sebulan sebagai lingkaran, bukan perlombaan menuju tanggal 30. */}
        <section className="surface mt-8 rounded-panel p-7 sm:p-9">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <CadenceRing
                days={days.map((d) => ({
                  day: d.day,
                  count: d.count,
                  valence: d.count ? d.valence / d.count : 0,
                  future: isThisMonth && d.day > now.getDate(),
                }))}
                index={ci}
                total={monthEntries.length}
                bandLow={TARGET_BAND.low}
                bandHigh={TARGET_BAND.high}
              />
            </div>

            <div className="lg:col-span-5">
              {/*
                Alasannya diambil dari `signals.ts`, bukan ditulis ulang di sini.
                Kalimat tetap yang dulu ada di tempat ini menyebut prostat kepada
                siapa pun yang membuka halaman — termasuk pengguna mode wanita,
                yang tidak punya organ itu. Mesin bacaan sudah lama menghindari
                hal tersebut lewat `alasanKemerataan`; yang tertinggal justru
                paragraf di sekelilingnya.
              */}
              <p className="text-sm leading-relaxed text-sand-300">
                {t(
                  "Sebulan digambar melingkar karena deret lurus punya garis akhir, dan garis akhir membuat orang mengejar angka. Yang penting bukan totalnya, melainkan jaraknya — dan jarak paling mudah dilihat sebagai celah. {alasan}",
                  { alasan: alasanKemerataan(profile.mode, t) },
                )}
              </p>
              {/*
                Daftar biasa, bukan daftar definisi.

                Sebelumnya ini `<dl>` berisi `<dt>` tanpa satu pun `<dd>`, dan
                itu bukan sekadar tidak rapi: `<dl>` menjanjikan pasangan istilah
                dan penjelasannya, jadi pembaca layar mengumumkan daftar
                definisi yang setengahnya hilang. Di sini tidak ada istilah yang
                dijelaskan — cuma empat warna dan artinya, yang memang sebuah
                daftar biasa.

                Ditemukan axe-core.
              */}
              <ul className="mt-6 space-y-3 border-t border-[rgba(207,198,184,0.08)] pt-5 text-xs">
                {[
                  ["var(--color-teal-400)", "Terasa lega atau nikmat"],
                  ["var(--color-sand-500)", "Netral"],
                  ["var(--color-amber-400)", "Hampa, menyesal, atau lelah"],
                  ["rgba(207,198,184,0.13)", "Tidak ada catatan"],
                ].map(([c, label]) => (
                  <li key={label} className="flex items-center gap-3">
                    {/* Warnanya sendiri tidak membawa makna bagi yang tidak
                        melihatnya; tulisannya yang membawa. Jadi petaknya
                        disembunyikan dari pembaca layar. */}
                    <span
                      aria-hidden
                      className="h-1 w-6 shrink-0 rounded-full"
                      style={{ background: c }}
                    />
                    <span className="text-sand-500">{t(label)}</span>
                  </li>
                ))}
              </ul>
              <p className="num mt-5 text-[11px] text-sand-500">
                {t("pita")} {TARGET_BAND.low}–{TARGET_BAND.high} · {t("arahkan kursor ke satu jari-jari")}
              </p>
            </div>
          </div>
        </section>

        {/* Deret harian, tetap dipertahankan karena membaca urutan tanggal
            memang lebih mudah lurus daripada melingkar. */}
        <section className="surface mt-5 rounded-panel p-7 sm:p-9">
          <div className="flex items-center justify-between text-xs text-sand-500">
            <span>{t("Urutan harian")}</span>
            <span className="num">
              {t("pita")} {TARGET_BAND.low}–{TARGET_BAND.high}
            </span>
          </div>
          <div className="mt-6 flex h-28 items-end gap-[2px]">
            {days.map((d) => {
              const future =
                isThisMonth && d.day > now.getDate();
              const height = d.count === 0 ? 5 : 22 + (d.count / maxCount) * 78;
              const avg = d.count ? d.valence / d.count : 0;
              const bg =
                d.count === 0
                  ? "rgba(214,205,190,0.07)"
                  : avg > 0.2
                    ? "linear-gradient(180deg, var(--color-teal-500), var(--color-teal-700))"
                    : avg < -0.2
                      ? "linear-gradient(180deg, var(--color-amber-400), var(--color-amber-500))"
                      : "linear-gradient(180deg, var(--color-sand-500), var(--color-ink-600))";
              return (
                <motion.div
                  key={d.day}
                  className="group relative flex-1 rounded-full"
                  style={{ background: bg, opacity: future ? 0.3 : 1 }}
                  initial={{ height: "5%" }}
                  animate={{ height: `${height}%` }}
                  transition={{
                    type: "spring",
                    stiffness: 240,
                    damping: 26,
                    delay: d.day * 0.012,
                  }}
                  title={`${d.day} — ${t("{n} catatan", { n: d.count })}`}
                />
              );
            })}
          </div>
          <div className="mt-3 flex justify-between font-mono text-[11px] text-sand-500">
            <span>1</span>
            <span>{Math.round(daysInMonth(anchor) / 2)}</span>
            <span>{daysInMonth(anchor)}</span>
          </div>
        </section>

        {/* Metrik */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Cadence Index"
            value={ci == null ? "—" : String(ci)}
            hint={
              isThisMonth
                ? t("Kemerataan jarak antar kejadian 30 hari terakhir. Bukan jumlah.")
                : t("Kemerataan jarak antar kejadian di bulan ini. Bukan jumlah.")
            }
            tone={ci == null ? "netral" : ci >= 60 ? "baik" : "perhatian"}
          />
          {isWoman ? (
            <Stat
              label={t("Keterikatan siklus")}
              value={coupling == null ? "—" : String(coupling)}
              hint={
                coupling == null
                  ? t("Butuh tanggal haid terakhir dan minimal delapan catatan.")
                  : t("Seberapa terpusat doronganmu di satu fase. Puncaknya di fase {fase}.", {
                      fase: t(peak ?? ""),
                    })
              }
              tone={coupling == null ? "netral" : "baik"}
            />
          ) : (
            <Stat
              label={t("Pita bulan ini")}
              value={t(band === "dalam-pita" ? "dalam" : band === "sepi" ? "sepi" : "padat")}
              hint={t("Wilayah {rendah}–{tinggi}, digambar sebagai koridor bukan garis.", {
                rendah: TARGET_BAND.low,
                tinggi: TARGET_BAND.high,
              })}
              tone={band === "dalam-pita" ? "baik" : "perhatian"}
            />
          )}
          <Stat
            label={t("Kekosongan terpanjang")}
            value={t("{n} hari", { n: Math.round(gap) })}
            hint={
              isThisMonth
                ? t("Rentang terpanjang tanpa catatan dalam sebulan terakhir.")
                : t("Rentang terpanjang tanpa catatan di bulan ini.")
            }
            tone={gap >= 9 ? "perhatian" : "netral"}
          />
          <Stat
            label={t("Rasa yang enak")}
            value={pos == null ? "—" : `${Math.round(pos * 100)}%`}
            hint={t("Bagian catatan bulan ini yang ditandai lega atau nikmat.")}
            tone={pos != null && pos < 0.4 ? "perhatian" : "baik"}
          />
        </section>

        {/* Sebaran per fase siklus — hanya berarti di mode wanita */}
        {phases && (
          <section className="surface mt-6 rounded-panel p-7 sm:p-9">
            <h2 className="eyebrow">{t("Sebaran per fase siklus")}</h2>
            <p className="mt-2 text-xs text-sand-500">
              {t("Dihitung per hari fase, bukan per total, karena panjang tiap fase berbeda.")}
            </p>
            <div className="mt-6 space-y-3">
              {phases.map((p, i) => {
                const max = Math.max(...phases.map((x) => x.perDay), 0.0001);
                const isPeak = p.phase === peak;
                return (
                  <div key={p.phase}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className={isPeak ? "text-teal-500" : "text-sand-300"}>
                        {t(p.phase)}
                      </span>
                      <span className="font-mono text-xs text-sand-500">
                        {t("{n} catatan", { n: p.count })} · {t("{n} hari", { n: p.days })}
                      </span>
                    </div>
                    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-ink-800">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: isPeak
                            ? "linear-gradient(90deg, var(--color-teal-500), var(--color-teal-700))"
                            : "rgba(214,205,190,0.22)",
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(p.perDay / max) * 100}%` }}
                        transition={{ type: "spring", stiffness: 200, damping: 28, delay: i * 0.08 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {peak && (
              <p className="mt-5 text-sm leading-relaxed text-sand-300">{t(PHASE_NOTE[peak])}</p>
            )}
          </section>
        )}

        {isWoman && !phases && (
          <div className="mt-6 rounded-panel border border-amber-500/25 bg-amber-500/[0.04] p-7">
            <p className="text-sm leading-relaxed text-sand-300">
              {t("Isi tanggal haid terakhir di")}{" "}
              <Link href="/pengaturan" className="text-teal-500 underline underline-offset-4">
                {t("pengaturan")}
              </Link>{" "}
              {t("supaya catatanmu bisa dibaca terhadap fase siklus, bukan sekadar terhadap tanggal.")}
            </p>
          </div>
        )}

        <p className="mt-4 text-xs text-sand-500">
          {t("Beban edging bulan ini:")} <span className="font-mono">{Math.round(load)}</span>
        </p>

        <div className="mt-8">
          <Link href="/insights" className="text-sm text-teal-500 hover:text-teal-600">
            {t("Baca apa yang terbaca dari pola ini")}
          </Link>
        </div>

        {/* Riwayat */}
        <section className="mt-14">
          <h2 className="eyebrow">{t("Terakhir dicatat")}</h2>
          <ul className="mt-4 divide-y divide-[rgba(214,205,190,0.08)]">
            {recent.map((e) => {
              const d = new Date(e.at);
              const meta = afterfeelMeta(e.afterfeel);
              return (
                <li key={e.id} className="flex items-center justify-between gap-4 py-3.5">
                  <span className="shrink-0 text-sand-500">
                    {e.device ? (
                      <DeviceIcon device={e.device} size={24} />
                    ) : (
                      <Glyph set="method" name={e.method} size={24} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-sand-100">
                      {d.getDate()} {t(MONTHS[d.getMonth()]).slice(0, 3)} ·{" "}
                      {String(d.getHours()).padStart(2, "0")}.
                      {String(d.getMinutes()).padStart(2, "0")} · {t(e.method)}
                    </p>
                    <p className="mt-1 text-xs text-sand-500">
                      {e.durationSec
                        ? t("{n} menit", { n: Math.round(e.durationSec / 60) })
                        : t("durasi tidak dicatat")}
                      {e.edging !== "tidak" && ` · ${t("edging")} ${t(e.edging)}`}
                      {e.trigger && ` · ${t(e.trigger)}`}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span
                      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ${
                        meta.medical
                          ? "bg-signal-500/12 text-signal-500"
                          : meta.valence > 0
                            ? "bg-teal-500/12 text-teal-500"
                            : "bg-ink-700 text-sand-300"
                      }`}
                    >
                      <Glyph set="feel" name={e.afterfeel} size={16} />
                      {t(e.afterfeel)}
                    </span>
                    <button
                      onClick={() => remove(e.id)}
                      className="text-xs text-sand-500 hover:text-sand-100"
                      aria-label={t("Hapus catatan ini")}
                    >
                      {t("hapus")}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/*
          Dua tombol pernah berdiri di sini: "Ganti dengan data contoh" dan
          "Hapus semua". Keduanya dicabut atas permintaan pemilik produk, dan
          pencabutannya tidak menghilangkan satu pun kemampuan.

          Menghapus seluruh catatan tetap bisa dilakukan, tempatnya di halaman
          pengaturan — bersama unduh cadangan dan hapus akun. Di sanalah orang
          datang ketika memang berniat membuang sesuatu, dan di sana tombol itu
          didahului tawaran mengunduh cadangan lebih dulu.

          Data contoh tetap tersedia bagi yang benar-benar membutuhkannya:
          pengguna baru yang catatannya masih nol, lewat keadaan kosong di
          halaman ini dan di halaman bacaan. Di sana tidak ada apa pun yang bisa
          hilang.

          Yang hilang justru satu-satunya hal yang memang berbahaya: tombol
          perusak di kaki halaman yang paling sering dibuka, jauh dari niat
          menghapus dan dekat dengan jari yang sekadar menggulir sampai bawah.
        */}
      </main>
    </div>
  );
}
