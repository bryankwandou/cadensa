"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Nav } from "@/components/Nav";
import { Pressable, Reveal } from "@/components/Motion";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewModeration } from "@/components/ReviewModeration";
import { useVault } from "@/lib/vault";
import { useT } from "@/lib/i18n";
import { daysUntilNextPeriod } from "@/lib/cycle";
import { ACCENTS, MOTION_LEVELS, type Mode } from "@/lib/types";

const input =
  "w-full rounded-field border hairline bg-ink-975/60 px-4 py-3 text-sm text-sand-100 outline-none transition-colors focus:border-teal-600";

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <section className="surface rounded-panel p-7">
        <h2 className="display-sm text-xl text-sand-100">{title}</h2>
        {note && <p className="mt-2 text-sm leading-relaxed text-sand-300">{note}</p>}
        <div className="mt-5">{children}</div>
      </section>
    </Reveal>
  );
}

/**
 * Bagian peninjauan hanya menampakkan dirinya kalau rutenya menjawab. Bagi akun
 * lain, tidak ada judul, tidak ada bingkai, tidak ada petunjuk bahwa panel ini
 * ada sama sekali.
 */
function ModerationSection() {
  const { t } = useT();
  const [ada, setAda] = useState(false);

  useEffect(() => {
    void fetch("/api/reviews/tinjau", { cache: "no-store" }).then((r) => setAda(r.ok));
  }, []);

  if (!ada) return null;
  return (
    <Section
      title={t("Tinjau ulasan")}
      note={t(
        "Ulasan masuk dalam keadaan menunggu. Yang kamu tayangkan langsung ikut menghitung angka penilaian di halaman depan — jadi angka itu selalu bisa ditelusuri kembali ke barisnya.",
      )}
    >
      <ReviewModeration />
    </Section>
  );
}

export default function PengaturanPage() {
  const {
    user,
    profile,
    entries,
    setProfile,
    exportFile,
    importFile,
    wipe,
    deleteAccount,
    changePassword,
    sync,
  } = useVault();
  const { t } = useT();

  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [newRecovery, setNewRecovery] = useState<string | null>(null);

  const until = daysUntilNextPeriod(profile.cycle);

  return (
    <div className="aurora min-h-screen">
      <Nav />
      <main className="mx-auto max-w-3xl space-y-5 px-5 pb-24 pt-12">
        <Reveal>
          <p className="eyebrow">{t("Mode, cadangan, akun")}</p>
          <h1 className="display mt-2.5 text-[3rem]">{t("Pengaturan")}</h1>
          <p className="mt-6 max-w-xl leading-relaxed text-sand-300">
            {user
              ? t(
                  "Masuk sebagai {nama}. Catatanmu tersimpan di perangkat ini sekaligus tersalin terenkripsi ke server.",
                  { nama: user.username },
                )
              : t(
                  "Belum masuk. Catatanmu hanya ada di perangkat ini — kalau penyimpanan peramban dibersihkan, catatannya ikut hilang.",
                )}
          </p>
        </Reveal>

        {!user && (
          <Reveal delay={0.04}>
            <div className="rounded-panel border border-amber-500/25 bg-amber-500/[0.04] p-7">
              <h2 className="display-sm text-xl text-amber-400">
                {t("Catatanmu belum punya cadangan")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-sand-300">
                {t(
                  "Penyimpanan peramban bisa dibersihkan sistem tanpa memberi tahu, terutama saat ruang penyimpanan menipis. Buat akun, atau unduh cadangan secara berkala.",
                )}
              </p>
              <Link
                href="/masuk"
                className="mt-4 inline-block rounded-full bg-teal-600 px-5 py-2.5 text-sm font-medium text-ink-950"
              >
                {t("Buat akun")}
              </Link>
            </div>
          </Reveal>
        )}

        <Section
          title={t("Milikmu sendiri")}
          note={t(
            "Warna, nama panggilan, dan seberapa banyak yang bergerak. Semuanya ikut terenkripsi bersama catatan, jadi bahkan warna kesukaanmu pun tidak terbaca server.",
          )}
        >
          <div className="space-y-7">
            <div>
              <p className="eyebrow mb-3">{t("Warna")}</p>
              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                {ACCENTS.map((a) => {
                  const on = profile.accent === a.key;
                  return (
                    <motion.button
                      key={a.key}
                      type="button"
                      onClick={() => setProfile({ accent: a.key })}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 380, damping: 24 }}
                      className={`flex flex-col items-center gap-2.5 rounded-field border px-2 py-3.5 ${
                        on ? "border-teal-600 bg-teal-600/10" : "hairline hover:border-sand-500/30"
                      }`}
                      aria-pressed={on}
                    >
                      <span
                        className="size-7 rounded-full"
                        style={{ background: `linear-gradient(140deg, ${a.c400}, ${a.c700})` }}
                      />
                      <span className={`text-[11px] ${on ? "text-sand-100" : "text-sand-500"}`}>
                        {t(a.label)}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="eyebrow mb-3">{t("Nama panggilan")}</p>
              <input
                className={`${input} max-w-xs`}
                placeholder={t("Kosongkan kalau tidak mau disapa")}
                maxLength={24}
                value={profile.name}
                onChange={(e) => setProfile({ name: e.target.value })}
              />
              <p className="mt-2.5 text-xs text-sand-500">
                {t(
                  "Dipakai hanya di halaman catat. Tidak pernah muncul di judul tab maupun notifikasi, supaya layarmu tetap aman dilihat orang lain.",
                )}
              </p>
            </div>

            <div>
              <p className="eyebrow mb-3">{t("Gerakan")}</p>
              <div className="flex max-w-sm gap-2">
                {MOTION_LEVELS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setProfile({ motion: m })}
                    className={`relative flex-1 rounded-field border px-4 py-3 text-sm capitalize transition-colors ${
                      profile.motion === m ? "border-teal-600 text-sand-100" : "hairline text-sand-300"
                    }`}
                  >
                    {profile.motion === m && (
                      <motion.span
                        layoutId="motion-pill"
                        className="absolute inset-0 rounded-field bg-teal-600/10"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{t(m)}</span>
                  </button>
                ))}
              </div>
              <p className="mt-2.5 text-xs text-sand-500">
                {t(
                  "Mode tenang menghentikan semua gerakan yang berjalan terus. Umpan balik saat kamu menyentuh sesuatu tetap ada, karena tanpa itu antarmuka terasa rusak, bukan tenang.",
                )}
              </p>
            </div>
          </div>
        </Section>

        <Section
          title={t("Mode pencatatan")}
          note={t(
            "Mode menentukan daftar alat yang ditawarkan dan cara catatanmu dibaca. Mode pria dibaca terhadap pita bulanan; mode wanita dibaca terhadap fase siklus, karena temuan yang mendasari pita itu berasal dari penelitian prostat dan tidak bisa dipindahkan begitu saja.",
          )}
        >
          <div className="flex gap-2">
            {(["pria", "wanita"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setProfile({ mode: m })}
                className={`relative flex-1 rounded-2xl border px-4 py-3.5 text-sm capitalize transition-colors ${
                  profile.mode === m ? "border-teal-600 text-sand-100" : "hairline text-sand-300"
                }`}
              >
                {profile.mode === m && (
                  <motion.span
                    layoutId="mode-pill"
                    className="absolute inset-0 rounded-2xl bg-teal-600/10"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{t(m)}</span>
              </button>
            ))}
          </div>
        </Section>

        {profile.mode === "wanita" && (
          <Section
            title={t("Siklus")}
            note={t(
              "Tiga angka ini yang membuat catatanmu bisa dibaca sebagai pola berulang, bukan sekadar deret tanggal.",
            )}
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-xs text-sand-500">{t("Hari pertama haid terakhir")}</span>
                <input
                  type="date"
                  className={input}
                  value={profile.cycle.lastPeriodStart ?? ""}
                  onChange={(e) =>
                    setProfile({ cycle: { ...profile.cycle, lastPeriodStart: e.target.value || null } })
                  }
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs text-sand-500">{t("Panjang siklus (hari)")}</span>
                <input
                  type="number"
                  min={20}
                  max={45}
                  className={input}
                  value={profile.cycle.cycleLengthDays}
                  onChange={(e) =>
                    setProfile({ cycle: { ...profile.cycle, cycleLengthDays: Number(e.target.value) } })
                  }
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs text-sand-500">{t("Lama haid (hari)")}</span>
                <input
                  type="number"
                  min={1}
                  max={10}
                  className={input}
                  value={profile.cycle.periodLengthDays}
                  onChange={(e) =>
                    setProfile({ cycle: { ...profile.cycle, periodLengthDays: Number(e.target.value) } })
                  }
                />
              </label>
            </div>
            {until != null && (
              <p className="mt-4 text-sm text-teal-500">
                {until <= 1
                  ? t("Perkiraan haid berikutnya besok. Perkiraan, bukan kepastian.")
                  : t("Perkiraan haid berikutnya {n} hari lagi. Perkiraan, bukan kepastian.", {
                      n: until,
                    })}
              </p>
            )}
          </Section>
        )}

        {user && <ModerationSection />}

        {user && (
          <Section
            title={t("Tulis ulasan")}
            note={t(
              "Satu akun satu ulasan, dan menulis lagi berarti mengganti yang lama. Ulasanmu ditinjau dulu sebelum tayang, dan angka penilaian di halaman depan dihitung langsung dari ulasan yang masuk — bukan ditulis tangan.",
            )}
          >
            <ReviewForm nama={profile.name || user.username} />
          </Section>
        )}

        <Section
          title={t("Cadangan")}
          note={t(
            "Berkas cadangan berisi catatanmu apa adanya, tanpa enkripsi, supaya bisa kamu buka sendiri kapan pun. Simpan di tempat yang kamu percaya.",
          )}
        >
          <div className="flex flex-wrap gap-3">
            <Pressable
              onClick={exportFile}
              className="rounded-full border hairline px-5 py-2.5 text-sm text-sand-200"
            >
              {t("Unduh cadangan ({n} catatan)", { n: entries.length })}
            </Pressable>
            <Pressable
              onClick={() => fileRef.current?.click()}
              className="rounded-full border hairline px-5 py-2.5 text-sm text-sand-200"
            >
              {t("Pulihkan dari berkas")}
            </Pressable>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                try {
                  const added = await importFile(f);
                  setMsg({
                    kind: "ok",
                    text: added
                      ? t("{n} catatan baru ditambahkan.", { n: added })
                      : t("Semua catatan di berkas itu sudah ada."),
                  });
                } catch (err) {
                  setMsg({ kind: "err", text: err instanceof Error ? err.message : t("Berkas tidak terbaca.") });
                }
                e.target.value = "";
              }}
            />
          </div>
          <p className="mt-3 text-xs text-sand-500">
            {t("Memulihkan menggabungkan, tidak menimpa. Catatan yang sudah ada tidak akan berganda.")}
          </p>
        </Section>

        {user && (
          <Section
            title={t("Kata sandi")}
            note={t(
              "Mengganti kata sandi hanya membungkus ulang kuncinya. Catatanmu tidak disentuh, jadi tidak ada risiko rusak di tengah jalan.",
            )}
          >
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                className={input}
                type="password"
                placeholder={t("Kata sandi sekarang")}
                value={pw.current}
                onChange={(e) => setPw({ ...pw, current: e.target.value })}
              />
              <input
                className={input}
                type="password"
                placeholder={t("Kata sandi baru")}
                value={pw.next}
                onChange={(e) => setPw({ ...pw, next: e.target.value })}
              />
              <input
                className={input}
                type="password"
                placeholder={t("Ulangi yang baru")}
                value={pw.confirm}
                onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
              />
            </div>
            <Pressable
              onClick={async () => {
                try {
                  if (pw.next.length < 10) throw new Error(t("Kata sandi baru minimal 10 karakter."));
                  if (pw.next !== pw.confirm) throw new Error(t("Ulangannya belum sama."));
                  const r = await changePassword({ current: pw.current, next: pw.next });
                  setNewRecovery(r.recoveryKey);
                  setPw({ current: "", next: "", confirm: "" });
                  setMsg({ kind: "ok", text: t("Kata sandi diganti.") });
                } catch (e) {
                  setMsg({ kind: "err", text: e instanceof Error ? e.message : t("Gagal.") });
                }
              }}
              className="mt-4 rounded-full border hairline px-5 py-2.5 text-sm text-sand-200"
            >
              {t("Ganti kata sandi")}
            </Pressable>
            {newRecovery && (
              <div className="mt-4 rounded-card border border-amber-500/25 bg-amber-500/[0.04] p-4">
                <p className="mb-2 text-xs text-amber-400">{t("Kunci pemulihanmu tetap sama. Ini salinannya:")}</p>
                <code className="block break-all font-mono text-xs text-amber-400">{newRecovery}</code>
              </div>
            )}
          </Section>
        )}

        <Section
          title={t("Menghapus")}
          note={t(
            "Tidak ada masa tunggu dan tidak ada salinan yang tertinggal. Unduh cadangan dulu kalau masih ragu.",
          )}
        >
          <div className="flex flex-wrap gap-3">
            <Pressable
              onClick={() => {
                if (
                  confirm(
                    t("Hapus {n} catatan dari perangkat ini? Tidak bisa dibatalkan.", {
                      n: entries.length,
                    }),
                  )
                ) {
                  wipe();
                  setMsg({ kind: "ok", text: t("Catatan dihapus.") });
                }
              }}
              className="rounded-full border border-signal-500/40 px-5 py-2.5 text-sm text-signal-500"
            >
              {t("Hapus semua catatan")}
            </Pressable>
            {user && (
              <Pressable
                onClick={async () => {
                  if (!confirm(t("Hapus akun berikut seluruh brankasnya? Ini permanen."))) return;
                  try {
                    await deleteAccount();
                    setMsg({ kind: "ok", text: t("Akun dihapus sepenuhnya.") });
                  } catch (e) {
                    setMsg({ kind: "err", text: e instanceof Error ? e.message : t("Gagal.") });
                  }
                }}
                className="rounded-full border border-signal-500/40 px-5 py-2.5 text-sm text-signal-500"
              >
                {t("Hapus akun")}
              </Pressable>
            )}
          </div>
        </Section>

        {msg && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-sm ${msg.kind === "ok" ? "text-teal-500" : "text-signal-500"}`}
          >
            {msg.text}
          </motion.p>
        )}

        {sync.kind === "gagal" && (
          <p className="text-sm text-signal-500">
            {t("Sinkronisasi terakhir gagal: {pesan}. Catatanmu tetap aman di perangkat ini.", {
              pesan: sync.message,
            })}
          </p>
        )}

        <Reveal>
          <p className="pt-4 text-sm text-sand-500">
            {t("Cara kerja penyimpanannya dijelaskan penuh di")}{" "}
            <Link href="/privacy" className="text-teal-500 underline underline-offset-4">
              {t("halaman privasi")}
            </Link>
            .
          </p>
        </Reveal>
      </main>
    </div>
  );
}
