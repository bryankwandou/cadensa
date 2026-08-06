"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pressable } from "./Motion";

type Item = { id: string; name: string; rating: number; body: string; approved: boolean; at: string };

/**
 * Panel peninjauan ulasan.
 *
 * Hanya muncul untuk akun pemilik, dan tidak muncul sama sekali bagi yang lain —
 * bukan tampil lalu menolak. Panel yang berkata "kamu bukan pemilik" sudah
 * memberi tahu bahwa panelnya ada.
 */
export function ReviewModeration() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [sibuk, setSibuk] = useState<string | null>(null);

  const muat = useCallback(async () => {
    try {
      const res = await fetch("/api/reviews/tinjau", { cache: "no-store" });
      if (!res.ok) return setItems(null);
      const data = (await res.json()) as { reviews: Item[] };
      setItems(data.reviews);
    } catch {
      setItems(null);
    }
  }, []);

  useEffect(() => {
    void muat();
  }, [muat]);

  if (!items) return null;

  async function ubah(id: string, approved: boolean) {
    setSibuk(id);
    await fetch("/api/reviews/tinjau", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, approved }),
    });
    await muat();
    setSibuk(null);
  }

  async function hapus(id: string) {
    if (!confirm("Hapus ulasan ini? Tidak bisa dibatalkan.")) return;
    setSibuk(id);
    await fetch("/api/reviews/tinjau", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await muat();
    setSibuk(null);
  }

  const menunggu = items.filter((i) => !i.approved).length;

  return (
    <div>
      <p className="mb-5 text-sm text-sand-300">
        {items.length === 0
          ? "Belum ada ulasan yang masuk."
          : `${items.length} ulasan, ${menunggu} menunggu ditinjau. Yang ditayangkan langsung ikut menghitung angka penilaian di halaman depan.`}
      </p>

      <div className="space-y-2.5">
        <AnimatePresence initial={false}>
          {items.map((it) => (
            <motion.div
              key={it.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: sibuk === it.id ? 0.5 : 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className={`rounded-card border p-5 ${
                it.approved ? "border-teal-600/35 bg-teal-600/[0.05]" : "hairline"
              }`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="num text-sm text-teal-400">{it.rating}/5</span>
                <span className="text-sm text-sand-100">{it.name}</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] ${
                    it.approved ? "bg-teal-500/12 text-teal-400" : "bg-amber-500/12 text-amber-400"
                  }`}
                >
                  {it.approved ? "tayang" : "menunggu"}
                </span>
                <span className="num ml-auto text-[11px] text-sand-500">{it.at.slice(0, 10)}</span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-sand-300">{it.body}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Pressable
                  onClick={() => ubah(it.id, !it.approved)}
                  disabled={sibuk === it.id}
                  className="rounded-full border hairline px-4 py-2 text-xs text-sand-200 disabled:opacity-40"
                >
                  {it.approved ? "Turunkan" : "Tayangkan"}
                </Pressable>
                <Pressable
                  onClick={() => hapus(it.id)}
                  disabled={sibuk === it.id}
                  className="rounded-full border border-signal-500/40 px-4 py-2 text-xs text-signal-500 disabled:opacity-40"
                >
                  Hapus
                </Pressable>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
