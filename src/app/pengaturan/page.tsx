"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Nav } from "@/components/Nav";
import { Pressable, Reveal } from "@/components/Motion";
import { useVault } from "@/lib/vault";
import { daysUntilNextPeriod } from "@/lib/cycle";
import type { Mode } from "@/lib/types";

const input =
  "w-full rounded-2xl border hairline bg-ink-900/60 px-4 py-3 text-sm text-sand-100 outline-none transition-colors focus:border-teal-600";

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <section className="card rounded-3xl p-6">
        <h2 className="text-lg font-medium text-sand-100">{title}</h2>
        {note && <p className="mt-2 text-sm leading-relaxed text-sand-300">{note}</p>}
        <div className="mt-5">{children}</div>
      </section>
    </Reveal>
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
          <h1 className="text-4xl font-semibold tracking-[-0.025em]">Pengaturan</h1>
          <p className="mt-4 max-w-xl leading-relaxed text-sand-300">
            {user
              ? `Masuk sebagai ${user.username}. Catatanmu tersimpan di perangkat ini sekaligus tersalin terenkripsi ke server.`
              : "Belum masuk. Catatanmu hanya ada di perangkat ini — kalau penyimpanan peramban dibersihkan, catatannya ikut hilang."}
          </p>
        </Reveal>

        {!user && (
          <Reveal delay={0.04}>
            <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 p-6">
              <h2 className="text-lg font-medium text-amber-400">Catatanmu belum punya cadangan</h2>
              <p className="mt-2 text-sm leading-relaxed text-sand-300">
                Penyimpanan peramban bisa dibersihkan sistem tanpa memberi tahu, terutama saat ruang
                penyimpanan menipis. Buat akun, atau unduh cadangan secara berkala.
              </p>
              <Link
                href="/masuk"
                className="mt-4 inline-block rounded-full bg-teal-600 px-5 py-2.5 text-sm font-medium text-ink-950"
              >
                Buat akun
              </Link>
            </div>
          </Reveal>
        )}

        <Section
          title="Mode pencatatan"
          note="Mode menentukan daftar alat yang ditawarkan dan cara catatanmu dibaca. Mode pria dibaca terhadap pita bulanan; mode wanita dibaca terhadap fase siklus, karena temuan yang mendasari pita itu berasal dari penelitian prostat dan tidak bisa dipindahkan begitu saja."
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
                <span className="relative">{m}</span>
              </button>
            ))}
          </div>
        </Section>

        {profile.mode === "wanita" && (
          <Section
            title="Siklus"
            note="Tiga angka ini yang membuat catatanmu bisa dibaca sebagai pola berulang, bukan sekadar deret tanggal."
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-xs text-sand-500">Hari pertama haid terakhir</span>
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
                <span className="mb-2 block text-xs text-sand-500">Panjang siklus (hari)</span>
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
                <span className="mb-2 block text-xs text-sand-500">Lama haid (hari)</span>
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
                Perkiraan haid berikutnya {until <= 1 ? "besok" : `${until} hari lagi`}. Perkiraan,
                bukan kepastian.
              </p>
            )}
          </Section>
        )}

        <Section
          title="Cadangan"
          note="Berkas cadangan berisi catatanmu apa adanya, tanpa enkripsi, supaya bisa kamu buka sendiri kapan pun. Simpan di tempat yang kamu percaya."
        >
          <div className="flex flex-wrap gap-3">
            <Pressable
              onClick={exportFile}
              className="rounded-full border hairline px-5 py-2.5 text-sm text-sand-200"
            >
              Unduh cadangan ({entries.length} catatan)
            </Pressable>
            <Pressable
              onClick={() => fileRef.current?.click()}
              className="rounded-full border hairline px-5 py-2.5 text-sm text-sand-200"
            >
              Pulihkan dari berkas
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
                    text: added ? `${added} catatan baru ditambahkan.` : "Semua catatan di berkas itu sudah ada.",
                  });
                } catch (err) {
                  setMsg({ kind: "err", text: err instanceof Error ? err.message : "Berkas tidak terbaca." });
                }
                e.target.value = "";
              }}
            />
          </div>
          <p className="mt-3 text-xs text-sand-500">
            Memulihkan menggabungkan, tidak menimpa. Catatan yang sudah ada tidak akan berganda.
          </p>
        </Section>

        {user && (
          <Section title="Kata sandi" note="Mengganti kata sandi hanya membungkus ulang kuncinya. Catatanmu tidak disentuh, jadi tidak ada risiko rusak di tengah jalan.">
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                className={input}
                type="password"
                placeholder="Kata sandi sekarang"
                value={pw.current}
                onChange={(e) => setPw({ ...pw, current: e.target.value })}
              />
              <input
                className={input}
                type="password"
                placeholder="Kata sandi baru"
                value={pw.next}
                onChange={(e) => setPw({ ...pw, next: e.target.value })}
              />
              <input
                className={input}
                type="password"
                placeholder="Ulangi yang baru"
                value={pw.confirm}
                onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
              />
            </div>
            <Pressable
              onClick={async () => {
                try {
                  if (pw.next.length < 10) throw new Error("Kata sandi baru minimal 10 karakter.");
                  if (pw.next !== pw.confirm) throw new Error("Ulangannya belum sama.");
                  const r = await changePassword({ current: pw.current, next: pw.next });
                  setNewRecovery(r.recoveryKey);
                  setPw({ current: "", next: "", confirm: "" });
                  setMsg({ kind: "ok", text: "Kata sandi diganti." });
                } catch (e) {
                  setMsg({ kind: "err", text: e instanceof Error ? e.message : "Gagal." });
                }
              }}
              className="mt-4 rounded-full border hairline px-5 py-2.5 text-sm text-sand-200"
            >
              Ganti kata sandi
            </Pressable>
            {newRecovery && (
              <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
                <p className="mb-2 text-xs text-amber-400">Kunci pemulihanmu tetap sama. Ini salinannya:</p>
                <code className="block break-all font-mono text-xs text-amber-400">{newRecovery}</code>
              </div>
            )}
          </Section>
        )}

        <Section
          title="Menghapus"
          note="Tidak ada masa tunggu dan tidak ada salinan yang tertinggal. Unduh cadangan dulu kalau masih ragu."
        >
          <div className="flex flex-wrap gap-3">
            <Pressable
              onClick={() => {
                if (confirm(`Hapus ${entries.length} catatan dari perangkat ini? Tidak bisa dibatalkan.`)) {
                  wipe();
                  setMsg({ kind: "ok", text: "Catatan dihapus." });
                }
              }}
              className="rounded-full border border-signal-500/40 px-5 py-2.5 text-sm text-signal-500"
            >
              Hapus semua catatan
            </Pressable>
            {user && (
              <Pressable
                onClick={async () => {
                  if (!confirm("Hapus akun berikut seluruh brankasnya? Ini permanen.")) return;
                  try {
                    await deleteAccount();
                    setMsg({ kind: "ok", text: "Akun dihapus sepenuhnya." });
                  } catch (e) {
                    setMsg({ kind: "err", text: e instanceof Error ? e.message : "Gagal." });
                  }
                }}
                className="rounded-full border border-signal-500/40 px-5 py-2.5 text-sm text-signal-500"
              >
                Hapus akun
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
            Sinkronisasi terakhir gagal: {sync.message}. Catatanmu tetap aman di perangkat ini.
          </p>
        )}

        <Reveal>
          <p className="pt-4 text-sm text-sand-500">
            Cara kerja penyimpanannya dijelaskan penuh di{" "}
            <Link href="/privacy" className="text-teal-500 underline underline-offset-4">
              halaman privasi
            </Link>
            .
          </p>
        </Reveal>
      </main>
    </div>
  );
}
