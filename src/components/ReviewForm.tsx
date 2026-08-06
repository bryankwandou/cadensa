"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Pressable } from "./Motion";

/**
 * Formulir ulasan.
 *
 * Hanya muncul untuk akun yang sudah masuk, dan itu bukan pembatasan tanpa
 * alasan: ulasan yang bisa dikirim siapa saja tanpa akun adalah kotak kosong
 * yang menunggu diisi angka palsu. Satu akun satu ulasan, ditulis ulang berarti
 * mengganti — bukan menambah baris.
 *
 * Ulasan yang masuk tidak langsung tayang. Itu disebut terus terang di sini,
 * karena mengejutkan orang dengan tulisannya sendiri di halaman depan lebih
 * buruk daripada memberitahunya sejak awal.
 */
export function ReviewForm({ nama }: { nama: string }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [body, setBody] = useState("");
  const [displayName, setDisplayName] = useState(nama);
  const [status, setStatus] = useState<{ kind: "ok" | "err" | "menunggu"; text: string } | null>(null);
  const [sedang, setSedang] = useState(false);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/reviews", { method: "POST" });
      if (!res.ok) return;
      const { review } = (await res.json()) as {
        review: { name: string; rating: number; body: string; approved: boolean } | null;
      };
      if (!review) return;
      setRating(review.rating);
      setBody(review.body);
      setDisplayName(review.name);
      setStatus(
        review.approved
          ? { kind: "ok", text: "Ulasanmu tayang di halaman depan." }
          : { kind: "menunggu", text: "Ulasanmu tersimpan dan sedang menunggu ditinjau." },
      );
    })();
  }, []);

  async function kirim() {
    setSedang(true);
    setStatus(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ rating, body, displayName }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Gagal mengirim.");
      setStatus({ kind: "menunggu", text: "Terkirim. Ulasanmu tayang setelah ditinjau." });
    } catch (e) {
      setStatus({ kind: "err", text: e instanceof Error ? e.message : "Gagal mengirim." });
    } finally {
      setSedang(false);
    }
  }

  const sisa = 600 - body.length;
  const bisa = rating >= 1 && body.trim().length >= 20 && !sedang;

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-3">Penilaian</p>
        <div className="flex gap-1.5" onPointerLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => {
            const on = n <= (hover || rating);
            return (
              <motion.button
                key={n}
                type="button"
                aria-label={`${n} dari 5`}
                onPointerEnter={() => setHover(n)}
                onClick={() => setRating(n)}
                whileTap={{ scale: 0.88 }}
                transition={{ type: "spring", stiffness: 420, damping: 24 }}
                className="p-1"
              >
                <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
                  <path
                    d="M12 3.4l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.8l6-.8z"
                    fill={on ? "var(--color-teal-500)" : "none"}
                    stroke={on ? "var(--color-teal-500)" : "rgba(207,198,184,0.28)"}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="eyebrow mb-3">Nama yang ditampilkan</p>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          maxLength={40}
          placeholder="Kosongkan untuk tampil sebagai pengguna anonim"
          className="w-full max-w-xs rounded-field border hairline bg-ink-975/60 px-4 py-3 text-sm text-sand-100 outline-none transition-colors placeholder:text-sand-500 focus:border-teal-600"
        />
      </div>

      <div>
        <p className="eyebrow mb-3">Ulasanmu</p>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value.slice(0, 600))}
          rows={4}
          placeholder="Apa yang berubah sejak kamu mulai mencatat? Sebutkan yang tidak berhasil juga."
          className="w-full rounded-field border hairline bg-ink-975/60 px-4 py-3 text-sm leading-relaxed text-sand-100 outline-none transition-colors placeholder:text-sand-500 focus:border-teal-600"
        />
        <p className="num mt-2 text-[11px] text-sand-500">
          {body.trim().length < 20 ? `${20 - body.trim().length} karakter lagi` : `${sisa} tersisa`}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Pressable
          onClick={kirim}
          disabled={!bisa}
          className="rounded-full bg-teal-500 px-6 py-2.5 text-sm font-medium text-ink-975 transition-colors hover:bg-teal-400 disabled:opacity-40"
        >
          {sedang ? "Mengirim…" : "Kirim ulasan"}
        </Pressable>
        {status && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-sm ${
              status.kind === "err"
                ? "text-signal-500"
                : status.kind === "menunggu"
                  ? "text-amber-400"
                  : "text-teal-500"
            }`}
          >
            {status.text}
          </motion.p>
        )}
      </div>
    </div>
  );
}
