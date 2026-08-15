"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Nav } from "@/components/Nav";
import { Pressable, Reveal } from "@/components/Motion";
import { useVault } from "@/lib/vault";
import { useT } from "@/lib/i18n";
import type { Mode } from "@/lib/types";

type Tab = "masuk" | "daftar" | "pemulihan";

const input =
  "w-full rounded-field border hairline bg-ink-975/60 px-4 py-3 text-sm text-sand-100 outline-none transition-colors placeholder:text-sand-500 focus:border-teal-600";

export default function MasukPage() {
  const router = useRouter();
  const { login, register, unlockWithRecovery, user, needsUnlock, entries } = useVault();
  const { t } = useT();

  /**
   * Selalu mulai dari "masuk", termasuk saat brankas terkunci.
   *
   * Sebelumnya di sini ada `needsUnlock ? "pemulihan" : "masuk"`, dan cabang itu
   * tidak pernah sekali pun berjalan: `needsUnlock` baru menjadi benar setelah
   * `/api/auth/me` menjawab, sedangkan nilai awal `useState` hanya dibaca pada
   * render pertama. Cabang itu juga bertentangan dengan spanduknya sendiri, yang
   * menyuruh memasukkan kata sandi — bukan kunci pemulihan.
   */
  const [tab, setTab] = useState<Tab>("masuk");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recovery, setRecovery] = useState<string | null>(null);

  const [ident, setIdent] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [mode, setMode] = useState<Mode>("pria");
  const [recoveryInput, setRecoveryInput] = useState("");

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("Ada yang tidak beres."));
    } finally {
      setBusy(false);
    }
  }

  // Kunci pemulihan ditampilkan sekali, dan tidak bisa dibuat ulang tanpa kata sandi.
  if (recovery) {
    return (
      <div className="aurora min-h-screen">
        <Nav />
        <main className="mx-auto max-w-lg px-5 pb-24 pt-16">
          <Reveal>
            <p className="eyebrow">{t("Sekali tampil")}</p>
            <h1 className="display mt-2.5 text-[2.6rem]">{t("Simpan kunci pemulihan")}</h1>
            <p className="mt-5 text-sm leading-relaxed text-sand-300">
              {t(
                "Catatanmu dikunci di perangkat ini sebelum dikirim, dan kuncinya diturunkan dari kata sandimu. Itu berarti kami tidak bisa membukanya untukmu — termasuk kalau kata sandinya lupa. Baris di bawah ini adalah satu-satunya jalan masuk cadangan.",
              )}
            </p>
            <div className="mt-6 rounded-card border border-amber-500/25 bg-amber-500/[0.04] p-5">
              <code className="block break-all font-mono text-xs leading-relaxed text-amber-400">
                {recovery}
              </code>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Pressable
                onClick={() => void navigator.clipboard.writeText(recovery)}
                className="rounded-full border hairline px-5 py-2.5 text-sm text-sand-200"
              >
                {t("Salin")}
              </Pressable>
              <Pressable
                onClick={() => {
                  const b = new Blob([recovery], { type: "text/plain" });
                  const a = document.createElement("a");
                  a.href = URL.createObjectURL(b);
                  a.download = "cadensa-kunci-pemulihan.txt";
                  a.click();
                }}
                className="rounded-full border hairline px-5 py-2.5 text-sm text-sand-200"
              >
                {t("Unduh berkas")}
              </Pressable>
              <Pressable
                onClick={() => router.push("/log")}
                className="rounded-full bg-teal-600 px-5 py-2.5 text-sm font-medium text-ink-950"
              >
                {t("Sudah saya simpan")}
              </Pressable>
            </div>
          </Reveal>
        </main>
      </div>
    );
  }

  if (user && !needsUnlock) {
    return (
      <div className="aurora min-h-screen">
        <Nav />
        <main className="mx-auto max-w-lg px-5 pb-24 pt-20 text-center">
          <Reveal>
            <h1 className="text-2xl font-semibold">
              {t("Kamu sudah masuk sebagai {nama}", { nama: user.username })}
            </h1>
            <p className="mt-3 text-sm text-sand-300">
              {t("Brankasmu terbuka dan catatanmu tersinkron.")}
            </p>
            <Pressable
              onClick={() => router.push("/rhythm")}
              className="mt-6 rounded-full bg-teal-600 px-6 py-3 text-sm font-medium text-ink-950"
            >
              {t("Lihat ritme")}
            </Pressable>
          </Reveal>
        </main>
      </div>
    );
  }

  return (
    <div className="aurora min-h-screen">
      <Nav />
      <main className="mx-auto max-w-lg px-5 pb-24 pt-12">
        <Reveal>
          <p className="eyebrow">{t("Brankas")}</p>
          <h1 className="display mt-2.5 text-[2.6rem]">
            {tab === "daftar"
              ? t("Buat akun")
              : tab === "pemulihan"
                ? t("Buka dengan kunci pemulihan")
                : t("Masuk")}
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-sand-300">
            {t(
              "Akun dipakai untuk satu hal saja: memindahkan catatanmu antar perangkat tanpa kehilangan. Isinya dikunci di sini dulu, jadi yang tersimpan di server adalah teks acak.",
            )}
          </p>
        </Reveal>

        {needsUnlock && tab !== "pemulihan" && (
          <Reveal delay={0.05}>
            <div className="mt-6 rounded-card border border-amber-500/25 bg-amber-500/[0.04] p-4 text-sm text-amber-400">
              {t(
                "Sesi kriptografismu berakhir saat tab ditutup. Masukkan kata sandi lagi untuk membuka brankas.",
              )}
            </div>
          </Reveal>
        )}

        <Reveal delay={0.08}>
          <div className="mt-8 flex gap-1 rounded-full border hairline p-1">
            {/* `nama`, bukan `t`: `t` sekarang fungsi penerjemah, dan nama lama
                akan menutupinya di dalam blok ini. */}
            {(["masuk", "daftar", "pemulihan"] as Tab[]).map((nama) => (
              <button
                key={nama}
                onClick={() => {
                  setTab(nama);
                  setError(null);
                }}
                className="relative flex-1 rounded-full px-3 py-2 text-sm capitalize text-sand-300"
              >
                {tab === nama && (
                  <motion.span
                    layoutId="auth-tab"
                    className="absolute inset-0 rounded-full bg-ink-700"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className={`relative ${tab === nama ? "text-sand-100" : ""}`}>{t(nama)}</span>
              </button>
            ))}
          </div>
        </Reveal>

        {/*
          Kartu ini sengaja tidak dimiringkan, walau kartu lain di aplikasi ini
          dimiringkan.

          `Tilt3D` memutar isinya mengikuti kursor, dan putaran itu tetap
          tertinggal setelah pointer pergi. Untuk kartu hiasan itu tidak apa-apa.
          Untuk formulir, akibatnya serius: kotak tata letak tombol berhenti
          berimpit dengan tempat tombol sungguh-sungguh bisa ditekan, karena
          uji-tumbukan mengikuti posisi setelah transformasi tiga dimensi
          sedangkan `getBoundingClientRect` tidak. Terbukti terukur — sesudah
          satu geseran di atas tombol, `elementFromPoint` di titik tengahnya
          mengembalikan `<form>`, bukan tombolnya, dan klik berikutnya tidak
          pernah sampai. Tidak ada galat, tidak ada apa pun di Console; tombolnya
          hanya berhenti bekerja.

          Halaman masuk adalah satu-satunya halaman yang wajib berhasil sebelum
          apa pun yang lain bisa dipakai. Kemiringan yang manis tidak sebanding
          dengan risiko itu.
        */}
        <div className="relative mt-6 rounded-panel">
          <div className="surface rounded-panel p-7">
            <AnimatePresence mode="wait">
              <motion.form
                key={tab}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (tab === "masuk") {
                    void run(async () => {
                      await login({ ident, password });
                      router.push("/rhythm");
                    });
                  } else if (tab === "pemulihan") {
                    void run(async () => {
                      await unlockWithRecovery(recoveryInput);
                      router.push("/rhythm");
                    });
                  } else {
                    void run(async () => {
                      if (password.length < 10) {
                        throw new Error(t("Kata sandi minimal 10 karakter. Ini kunci satu-satunya."));
                      }
                      if (password !== confirm) throw new Error(t("Ulangan kata sandi belum sama."));
                      const r = await register({ username, email, password, mode });
                      setRecovery(r.recoveryKey);
                    });
                  }
                }}
              >
                {tab === "masuk" && (
                  <>
                    <input
                      className={input}
                      placeholder={t("Nama pengguna atau email")}
                      autoComplete="username"
                      value={ident}
                      onChange={(e) => setIdent(e.target.value)}
                      required
                    />
                    <input
                      className={input}
                      type="password"
                      placeholder={t("Kata sandi")}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </>
                )}

                {tab === "daftar" && (
                  <>
                    <input
                      className={input}
                      placeholder={t("Nama pengguna")}
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                    <input
                      className={input}
                      type="email"
                      placeholder={t("Email")}
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <input
                      className={input}
                      type="password"
                      placeholder={t("Kata sandi (minimal 10 karakter)")}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <input
                      className={input}
                      type="password"
                      placeholder={t("Ulangi kata sandi")}
                      autoComplete="new-password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                    />
                    <div>
                      <p className="mb-2 text-xs text-sand-500">{t("Mode pencatatan — bisa diubah kapan saja")}</p>
                      <div className="flex gap-2">
                        {(["pria", "wanita"] as Mode[]).map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setMode(m)}
                            className={`flex-1 rounded-2xl border px-4 py-3 text-sm capitalize transition-colors ${
                              mode === m
                                ? "border-teal-600 bg-teal-600/10 text-sand-100"
                                : "hairline text-sand-300"
                            }`}
                          >
                            {t(m)}
                          </button>
                        ))}
                      </div>
                    </div>
                    {entries.length > 0 && (
                      <p className="text-xs leading-relaxed text-teal-500">
                        {t("{n} catatan yang sudah ada di perangkat ini ikut terangkat ke akun barumu.", {
                          n: entries.length,
                        })}
                      </p>
                    )}
                  </>
                )}

                {tab === "pemulihan" && (
                  <>
                    <p className="text-xs leading-relaxed text-sand-500">
                      {t(
                        "Tempel kunci pemulihan yang kamu simpan saat mendaftar. Ini membuka brankas tanpa kata sandi.",
                      )}
                    </p>
                    <textarea
                      className={`${input} min-h-24 font-mono`}
                      placeholder={t("Kunci pemulihan")}
                      value={recoveryInput}
                      onChange={(e) => setRecoveryInput(e.target.value)}
                      required
                    />
                  </>
                )}

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-signal-500"
                  >
                    {error}
                  </motion.p>
                )}

                <Pressable
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-field bg-teal-500 px-6 py-3.5 text-sm font-medium text-ink-975 transition-colors hover:bg-teal-400 disabled:opacity-50"
                >
                  {busy
                    ? t("Sebentar…")
                    : tab === "daftar"
                      ? t("Buat akun")
                      : tab === "pemulihan"
                        ? t("Buka brankas")
                        : t("Masuk")}
                </Pressable>
              </motion.form>
            </AnimatePresence>
          </div>
        </div>

        {/*
          Tombolnya digambar utuh berikut lambang Google, tapi dimatikan.
          Sebelumnya bagian ini hanya paragraf tanpa tombol, dan itu menyisakan
          pertanyaan yang wajar: mana tombolnya? Bentuk yang benar untuk fitur
          yang belum ada adalah tombol yang terlihat persis seperti nanti, dalam
          keadaan mati — bukan tulisan yang menjelaskan tombol yang tidak ada.

          `disabled` dan `aria-disabled` dipasang keduanya: yang pertama menahan
          klik, yang kedua memberi tahu pembaca layar alasannya lewat `title`.
        */}
        <Reveal delay={0.12}>
          <div className="mt-6">
            <button
              type="button"
              disabled
              aria-disabled
              title={t("Belum tersedia")}
              className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-field border hairline bg-ink-975/40 px-6 py-3.5 text-sm text-sand-500 opacity-70"
            >
              <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden className="shrink-0">
                <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-2.7-.4-4H24v7.3h12.1c-.2 2-1.6 5-4.5 7l6.9 5.3c4.1-3.8 6.6-9.4 6.6-15.6z" />
                <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.9-5.3c-1.9 1.3-4.4 2.2-7.6 2.2-5.8 0-10.7-3.8-12.5-9.700000000000001l-7.1 5.4C8 41 15.4 46 24 46z" />
                <path fill="#FBBC05" d="M11.5 27.9c-.5-1.4-.8-2.9-.8-4.4s.3-3 .7-4.4l-7-5.5C2.9 16.7 2 20.2 2 23.9s.9 7.2 2.4 10.3l7.1-6.3z" />
                <path fill="#EA4335" d="M24 10.2c4.1 0 6.9 1.8 8.5 3.3l6.2-6C34.9 4 29.9 2 24 2 15.4 2 8 7 4.4 14.2l7 5.4C13.3 14 18.2 10.2 24 10.2z" />
              </svg>
              {t("Masuk dengan Google")}
              <span className="rounded-full border hairline px-2 py-0.5 text-[0.65rem] uppercase tracking-wider">
                {t("Segera")}
              </span>
            </button>
            <p className="mt-3 px-1 text-xs leading-relaxed text-sand-500">
              {t(
                "Google tidak memberi kami kata sandi, padahal kunci brankasmu diturunkan dari kata sandi. Jadi masuk lewat Google tetap butuh satu kata sandi terpisah untuk membuka brankas — dan kami belum mau memasangnya sebelum alurnya tidak membingungkan.",
              )}
            </p>
          </div>
        </Reveal>
      </main>
    </div>
  );
}
