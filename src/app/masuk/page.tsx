"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Nav } from "@/components/Nav";
import { Pressable, Reveal, Tilt3D } from "@/components/Motion";
import { useVault } from "@/lib/vault";
import type { Mode } from "@/lib/types";

type Tab = "masuk" | "daftar" | "pemulihan";

const input =
  "w-full rounded-2xl border hairline bg-ink-900/60 px-4 py-3 text-sm text-sand-100 outline-none transition-colors placeholder:text-sand-500 focus:border-teal-600";

export default function MasukPage() {
  const router = useRouter();
  const { login, register, unlockWithRecovery, user, needsUnlock, entries } = useVault();

  const [tab, setTab] = useState<Tab>(needsUnlock ? "pemulihan" : "masuk");
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
      setError(e instanceof Error ? e.message : "Ada yang tidak beres.");
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
            <h1 className="text-3xl font-semibold tracking-[-0.025em]">Simpan kunci pemulihan</h1>
            <p className="mt-4 text-sm leading-relaxed text-sand-300">
              Catatanmu dikunci di perangkat ini sebelum dikirim, dan kuncinya diturunkan dari kata
              sandimu. Itu berarti kami tidak bisa membukanya untukmu — termasuk kalau kata sandinya
              lupa. Baris di bawah ini adalah satu-satunya jalan masuk cadangan.
            </p>
            <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
              <code className="block break-all font-mono text-xs leading-relaxed text-amber-400">
                {recovery}
              </code>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Pressable
                onClick={() => void navigator.clipboard.writeText(recovery)}
                className="rounded-full border hairline px-5 py-2.5 text-sm text-sand-200"
              >
                Salin
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
                Unduh berkas
              </Pressable>
              <Pressable
                onClick={() => router.push("/log")}
                className="rounded-full bg-teal-600 px-5 py-2.5 text-sm font-medium text-ink-950"
              >
                Sudah saya simpan
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
            <h1 className="text-2xl font-semibold">Kamu sudah masuk sebagai {user.username}</h1>
            <p className="mt-3 text-sm text-sand-300">
              Brankasmu terbuka dan catatanmu tersinkron.
            </p>
            <Pressable
              onClick={() => router.push("/rhythm")}
              className="mt-6 rounded-full bg-teal-600 px-6 py-3 text-sm font-medium text-ink-950"
            >
              Lihat ritme
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
          <h1 className="text-3xl font-semibold tracking-[-0.025em]">
            {tab === "daftar" ? "Buat akun" : tab === "pemulihan" ? "Buka dengan kunci pemulihan" : "Masuk"}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-sand-300">
            Akun dipakai untuk satu hal saja: memindahkan catatanmu antar perangkat tanpa
            kehilangan. Isinya dikunci di sini dulu, jadi yang tersimpan di server adalah teks acak.
          </p>
        </Reveal>

        {needsUnlock && tab !== "pemulihan" && (
          <Reveal delay={0.05}>
            <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-400">
              Sesi kriptografismu berakhir saat tab ditutup. Masukkan kata sandi lagi untuk membuka
              brankas.
            </div>
          </Reveal>
        )}

        <Reveal delay={0.08}>
          <div className="mt-8 flex gap-1 rounded-full border hairline p-1">
            {(["masuk", "daftar", "pemulihan"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setError(null);
                }}
                className="relative flex-1 rounded-full px-3 py-2 text-sm capitalize text-sand-300"
              >
                {tab === t && (
                  <motion.span
                    layoutId="auth-tab"
                    className="absolute inset-0 rounded-full bg-ink-700"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className={`relative ${tab === t ? "text-sand-100" : ""}`}>{t}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <Tilt3D max={4} className="relative mt-6 rounded-3xl">
          <div className="card rounded-3xl p-6">
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
                        throw new Error("Kata sandi minimal 10 karakter. Ini kunci satu-satunya.");
                      }
                      if (password !== confirm) throw new Error("Ulangan kata sandi belum sama.");
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
                      placeholder="Nama pengguna atau email"
                      autoComplete="username"
                      value={ident}
                      onChange={(e) => setIdent(e.target.value)}
                      required
                    />
                    <input
                      className={input}
                      type="password"
                      placeholder="Kata sandi"
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
                      placeholder="Nama pengguna"
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                    <input
                      className={input}
                      type="email"
                      placeholder="Email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <input
                      className={input}
                      type="password"
                      placeholder="Kata sandi (minimal 10 karakter)"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <input
                      className={input}
                      type="password"
                      placeholder="Ulangi kata sandi"
                      autoComplete="new-password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                    />
                    <div>
                      <p className="mb-2 text-xs text-sand-500">Mode pencatatan — bisa diubah kapan saja</p>
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
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                    {entries.length > 0 && (
                      <p className="text-xs leading-relaxed text-teal-500">
                        {entries.length} catatan yang sudah ada di perangkat ini ikut terangkat ke
                        akun barumu.
                      </p>
                    )}
                  </>
                )}

                {tab === "pemulihan" && (
                  <>
                    <p className="text-xs leading-relaxed text-sand-500">
                      Tempel kunci pemulihan yang kamu simpan saat mendaftar. Ini membuka brankas
                      tanpa kata sandi.
                    </p>
                    <textarea
                      className={`${input} min-h-24 font-mono`}
                      placeholder="Kunci pemulihan"
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
                  className="w-full rounded-2xl bg-teal-600 px-6 py-3.5 text-sm font-medium text-ink-950 disabled:opacity-50"
                >
                  {busy ? "Sebentar…" : tab === "daftar" ? "Buat akun" : tab === "pemulihan" ? "Buka brankas" : "Masuk"}
                </Pressable>
              </motion.form>
            </AnimatePresence>
          </div>
        </Tilt3D>

        <Reveal delay={0.12}>
          <div className="mt-6 rounded-2xl border hairline p-5 text-xs leading-relaxed text-sand-500">
            <p className="mb-2 text-sand-300">Masuk dengan Google — segera</p>
            Belum dipasang karena satu alasan teknis yang jujur: dengan Google, tidak ada kata sandi
            yang bisa dipakai menurunkan kunci enkripsi, sehingga brankas harus tetap dibuka dengan
            kata sandi terpisah. Kami sedang menyiapkan alurnya supaya tidak membingungkan.
          </div>
        </Reveal>
      </main>
    </div>
  );
}
