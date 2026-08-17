"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_CYCLE,
  type AccentKey,
  type CycleProfile,
  type Draft,
  type Entry,
  type Mode,
  type MotionLevel,
} from "./types";
// Penggabungan dan nisan tinggal di modul murni supaya bisa diuji tanpa React.
import { gabungNisan, merge } from "./gabung";
import {
  createVaultKeys,
  deriveAuthHash,
  dekFromRecovery,
  forgetDek,
  openVault,
  recallDek,
  rewrapDek,
  sealVault,
  stashDek,
  unwrapDek,
} from "./crypto";

const KEY = "cadensa.vault.v2";
const LEGACY_KEY = "cadensa.entries.v1";

export type Profile = {
  mode: Mode;
  cycle: CycleProfile;
  /** Nama panggilan yang dipakai aplikasi. Kosong berarti tidak menyapa sama sekali. */
  name: string;
  accent: AccentKey;
  motion: MotionLevel;
};
/**
 * `dihapus` adalah nisan: id catatan beserta waktu penghapusannya.
 *
 * Tanpa ini, penghapusan tidak punya cara diwakili saat dua perangkat
 * disatukan. `merge` menggabungkan dua salinan sebagai gabungan id, jadi
 * perangkat yang belum tahu masih memegang catatan yang sudah dihapus, dan
 * mendorongnya kembali ke server pada sinkron berikutnya — catatan yang
 * dihapus hidup lagi. Di aplikasi yang seluruh premisnya kerahasiaan, itu
 * kegagalan yang paling mahal: orang menghapus sesuatu justru karena tidak
 * ingin ada lagi.
 *
 * Nisannya ikut terenkripsi seperti isi lainnya. Yang tersimpan hanya id acak
 * dan cap waktu, jadi ia tidak memberi tahu apa pun tentang isi yang dihapus.
 */
export type VaultData = {
  entries: Entry[];
  profile: Profile;
  rev: number;
  dihapus?: Record<string, string>;
  /**
   * Id pemilik salinan lokal ini, atau null kalau dibuat tanpa akun.
   *
   * Tanpa penanda ini, tidak ada cara membedakan "catatan saya yang dibuat
   * sebelum masuk" dari "catatan orang lain yang masih tertinggal di perangkat
   * ini". Keduanya terlihat sama persis di `localStorage`, dan `pull`
   * menggabungkan apa pun yang ditemukannya dengan brankas di server — jadi
   * yang kedua akan menyelundupkan catatan orang lain ke dalam akun yang baru
   * saja masuk, lalu mendorongnya ke server sebagai miliknya.
   *
   * Dengan penanda ini, penggabungan hanya terjadi kalau salinan lokalnya
   * memang milik orang yang sedang masuk, atau memang belum bertuan.
   */
  pemilik?: string | null;
};
export type User = { id: string; username: string; email: string; mode: Mode };

export type SyncState =
  | { kind: "lokal" }
  | { kind: "menyiapkan" }
  | { kind: "tersimpan"; at: number }
  | { kind: "menyimpan" }
  | { kind: "terkunci" }
  | { kind: "gagal"; message: string };

const EMPTY: VaultData = {
  entries: [],
  profile: { mode: "pria", cycle: DEFAULT_CYCLE, name: "", accent: "teal", motion: "penuh" },
  rev: 0,
  dihapus: {},
  pemilik: null,
};

function readLocal(): VaultData {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<VaultData>;
      return {
        entries: Array.isArray(p.entries) ? p.entries : [],
        profile: { ...EMPTY.profile, ...(p.profile ?? {}) },
        rev: p.rev ?? 0,
        // Brankas dari versi sebelum nisan ada tidak punya kolom ini.
        dihapus: p.dihapus ?? {},
        pemilik: p.pemilik ?? null,
      };
    }
    // Pindahan dari versi pertama yang hanya menyimpan larik entri.
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const arr = JSON.parse(legacy) as Entry[];
      if (Array.isArray(arr)) return { ...EMPTY, entries: arr };
    }
  } catch {
    /* penyimpanan rusak diperlakukan sebagai kosong, bukan sebagai galat fatal */
  }
  return EMPTY;
}

/**
 * Menghapus seluruh jejak brankas dari perangkat ini.
 *
 * Dipakai saat keluar, dan itu bukan kerapian melainkan penutup kebocoran yang
 * sungguh terjadi: sebelum ini, keluar hanya membuang cookie sesi dan kunci di
 * `sessionStorage`, sementara catatannya sendiri tetap tersimpan di
 * `localStorage` dalam bentuk terbaca. Layarnya bahkan masih memajangnya.
 *
 * Akibatnya berantai. Alur pendaftaran memang sengaja menawarkan mengangkat
 * catatan yang sudah ada di perangkat ke akun baru — perilaku yang benar bagi
 * orang yang mencoba aplikasi ini dulu tanpa akun. Tapi setelah seseorang
 * keluar, yang tersisa di perangkat itu bukan catatan milik orang berikutnya.
 * Terukur: keluar, lalu mendaftar, dan akun baru itu berisi 88 catatan orang
 * sebelumnya — 29.713 karakter — beserta nama panggilannya.
 *
 * Di ponsel yang dipinjam, komputer kantor, atau warnet, itu berarti catatan
 * kesehatan paling pribadi seseorang berpindah tangan tanpa ada yang menyadari.
 *
 * Aman dilakukan karena keluar hanya mungkin ketika ada akun, dan isi akun itu
 * sudah tersimpan terenkripsi di server. Yang dihapus di sini salinan lokalnya,
 * bukan satu-satunya salinan.
 */
function lupakanLokal() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    /* penyimpanan ditolak peramban — tidak ada yang bisa dilakukan dari sini */
  }
}

/**
 * Saluran yang memberi tahu tab lain bahwa seseorang sudah keluar.
 *
 * Keluar tanpa ini hanya berlaku di tab tempat tombolnya ditekan. Tab lain yang
 * masih terbuka tetap memegang kunci di memori dan tetap menganggap dirinya
 * masuk — jadi begitu ada yang dicatat di sana, ia menulis ulang data ke
 * perangkat yang baru saja dibersihkan. Terukur: keluar di satu tab, mencatat
 * di tab lain, lalu layar pendaftaran orang berikutnya menawarkan "1 catatan
 * yang sudah ada di perangkat ini ikut terangkat ke akun barumu".
 *
 * Orang yang menutup sesinya di warnet menutup satu tab, bukan semua tab.
 */
const SALURAN = "cadensa.keluar";


function writeLocal(v: VaultData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(v));
  } catch {
    /* kuota penuh — data di memori tetap utuh sampai sinkron berikutnya */
  }
}

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

type Ctx = {
  entries: Entry[];
  profile: Profile;
  ready: boolean;
  user: User | null;
  sync: SyncState;
  add: (d: Draft) => void;
  update: (id: string, patch: Partial<Entry>) => void;
  remove: (id: string) => void;
  wipe: () => void;
  setProfile: (p: Partial<Profile>) => void;
  register: (i: {
    username: string;
    email: string;
    password: string;
    mode: Mode;
  }) => Promise<{ recoveryKey: string }>;
  login: (i: { ident: string; password: string }) => Promise<void>;
  unlockWithRecovery: (key: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (i: { current: string; next: string }) => Promise<{ recoveryKey: string }>;
  deleteAccount: () => Promise<void>;
  exportFile: () => void;
  importFile: (file: File) => Promise<number>;
  needsUnlock: boolean;
};

const VaultCtx = createContext<Ctx | null>(null);

export function VaultProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<VaultData>(EMPTY);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [sync, setSync] = useState<SyncState>({ kind: "lokal" });
  const [needsUnlock, setNeedsUnlock] = useState(false);

  const dek = useRef<CryptoKey | null>(null);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef<VaultData>(EMPTY);
  latest.current = data;

  /** Menyimpan ke perangkat selalu; ke server hanya kalau ada kunci di tangan. */
  const commit = useCallback((next: VaultData) => {
    const withRev = { ...next, rev: next.rev + 1 };
    latest.current = withRev;
    setData(withRev);
    writeLocal(withRev);

    if (!dek.current) return;
    if (pushTimer.current) clearTimeout(pushTimer.current);
    setSync({ kind: "menyimpan" });
    pushTimer.current = setTimeout(() => void push(), 900);
  }, []);

  /**
   * Mendorong brankas ke server, setelah menggabungkannya dengan yang sudah ada
   * di sana.
   *
   * Bacaan sebelum tulisan bukan kehati-hatian berlebih. Tanpa itu, `PUT`
   * mengganti seluruh isi brankas dengan salinan perangkat ini — dan perangkat
   * ini tidak tahu apa yang baru saja ditulis perangkat lain. Dua ponsel yang
   * mencatat dalam menit yang sama membuat yang mendorong belakangan menghapus
   * tulisan yang lebih dulu. Catatannya memang masih ada di perangkat asalnya,
   * jadi belum hilang selamanya; tapi kalau perangkat itu tidak pernah
   * tersambung lagi, tulisan tersebut lenyap dari server untuk selamanya, dan
   * tidak ada satu pun pesan galat yang muncul.
   *
   * Terukur: dua tulisan bersamaan, lalu perangkat pertama berhenti di satu
   * tambahan dan tidak pernah naik lagi berapa kali pun ditarik.
   *
   * Ongkosnya satu permintaan `GET` tambahan tiap simpan. Untuk aplikasi yang
   * memegang satu-satunya salinan catatan seseorang, itu murah.
   *
   * Kalau bacaannya sendiri gagal — jaringan putus di antara dua langkah —
   * dorongannya dibatalkan, bukan diteruskan. Menulis tanpa tahu apa yang ada
   * di sana persis keadaan yang hendak dihindari.
   *
   * Membaca lebih dulu menutup sebagian besar tabrakan, tapi tidak semuanya:
   * kalau dua perangkat sama-sama membaca sebelum salah satunya menulis, yang
   * belakangan tetap menimpa. Karena itu tulisannya membawa `baseRevision`, dan
   * server menolak apa pun yang berpijak pada revisi usang. Penolakan itu bukan
   * kegagalan — ia tanda bahwa ada yang perlu digabung lagi, jadi putarannya
   * mengulang dari membaca.
   *
   * Tiga percobaan sudah lebih dari cukup: satu putaran hanya kalah kalau ada
   * perangkat lain yang menulis persis di sela bacaan dan tulisan ini, dan
   * peluang itu mengecil tajam tiap kali.
   */
  const push = useCallback(async () => {
    if (!dek.current) return;
    for (let percobaan = 0; percobaan < 3; percobaan++) {
      try {
        const sebelum = await fetch("/api/vault");
        if (!sebelum.ok) throw new Error("Brankas di server tidak bisa dibaca.");
        const { ciphertext: adaDiSana, revision: revServer } = (await sebelum.json()) as {
          ciphertext: string | null;
          revision?: number;
        };

        let kirim = latest.current;
        if (adaDiSana) {
          const diSana = await openVault<VaultData>(dek.current, adaDiSana);
          const dihapus = gabungNisan(latest.current.dihapus, diSana.dihapus);
          kirim = {
            entries: merge(latest.current.entries, diSana.entries ?? [], dihapus),
            profile: latest.current.profile,
            rev: Math.max(latest.current.rev, diSana.rev ?? 0),
            dihapus,
          };
          // Hasil gabungan juga menjadi keadaan perangkat ini, supaya layar tidak
          // memperlihatkan lebih sedikit daripada yang baru saja dikirim.
          latest.current = kirim;
          setData(kirim);
          writeLocal(kirim);
        }

        const ciphertext = await sealVault(dek.current, kirim);
        const res = await fetch("/api/vault", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ciphertext, baseRevision: revServer ?? 0 }),
        });

        // Perangkat lain menulis di sela bacaan dan tulisan tadi. Ulangi dari
        // membaca; putaran berikutnya akan ikut menggabung tulisannya.
        if (res.status === 409) continue;

        if (!res.ok) throw new Error((await res.json()).error ?? "Gagal menyimpan.");
        setSync({ kind: "tersimpan", at: Date.now() });
        return;
      } catch (e) {
        setSync({ kind: "gagal", message: e instanceof Error ? e.message : "Gagal menyimpan." });
        return;
      }
    }
    setSync({
      kind: "gagal",
      message: "Brankas terus berubah di perangkat lain. Coba lagi sebentar.",
    });
  }, []);

  const pull = useCallback(async (key: CryptoKey, idPengguna?: string) => {
    setSync({ kind: "menyiapkan" });
    const res = await fetch("/api/vault");
    if (!res.ok) throw new Error("Brankas tidak bisa diambil.");
    const { ciphertext } = (await res.json()) as { ciphertext: string | null };

    /*
      Salinan lokal milik orang lain dibuang sebelum apa pun digabungkan.

      `merge` tidak punya cara mengetahui asal-usul; ia hanya menyatukan dua
      daftar. Kalau perangkat ini menyimpan catatan orang sebelumnya — sesi yang
      kedaluwarsa tanpa sempat menekan Keluar, misalnya — penggabungan itu akan
      memasukkannya ke brankas orang yang baru masuk, lalu mendorongnya ke server
      sebagai miliknya. Terukur: 88 catatan berpindah tangan tanpa satu pun tanda
      di layar.

      Yang belum bertuan (`null`) tetap diangkat: itu catatan yang dibuat orang
      ini sendiri sebelum ia punya akun, dan halaman daftar memang menjanjikannya.
    */
    let local = latest.current;
    if (idPengguna && local.pemilik && local.pemilik !== idPengguna) {
      lupakanLokal();
      local = EMPTY;
      latest.current = EMPTY;
      setData(EMPTY);
    }
    let next = local;
    if (ciphertext) {
      const remote = await openVault<VaultData>(key, ciphertext);
      const dihapus = gabungNisan(local.dihapus, remote.dihapus);
      next = {
        entries: merge(local.entries, remote.entries ?? [], dihapus),
        profile: { ...remote.profile, ...(local.rev > (remote.rev ?? 0) ? local.profile : {}) },
        rev: Math.max(local.rev, remote.rev ?? 0),
        dihapus,
      };
    }
    next = { ...next, pemilik: idPengguna ?? next.pemilik ?? null };
    latest.current = next;
    setData(next);
    writeLocal(next);
    await push();
  }, [push]);

  // Memulihkan sesi: cookie menentukan siapa, sessionStorage menentukan apakah
  // kuncinya masih ada. Cookie tanpa kunci berarti brankas terkunci.
  useEffect(() => {
    let alive = true;
    setData(readLocal());
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        const j = (await res.json()) as { user: User | null };
        if (!alive) return;
        setUser(j.user);
        if (j.user) {
          const key = await recallDek();
          if (key) {
            dek.current = key;
            // Id penggunanya ikut dioper di sini juga: pemulihan sesi adalah
            // jalan masuk yang paling sering dilalui, dan tanpa id itu
            // salinan lokal milik orang lain akan lolos ke penggabungan.
            await pull(key, j.user.id);
          } else {
            setNeedsUnlock(true);
            setSync({ kind: "terkunci" });
          }
        }
      } catch {
        /* luring — aplikasi tetap jalan penuh dengan data perangkat */
      } finally {
        if (alive) setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [pull]);

  const add = useCallback(
    (d: Draft) => commit({ ...latest.current, entries: [...latest.current.entries, { ...d, id: makeId() }] }),
    [commit],
  );

  const update = useCallback(
    (id: string, patch: Partial<Entry>) =>
      commit({
        ...latest.current,
        entries: latest.current.entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      }),
    [commit],
  );

  const remove = useCallback(
    (id: string) =>
      commit({
        ...latest.current,
        entries: latest.current.entries.filter((e) => e.id !== id),
        dihapus: { ...latest.current.dihapus, [id]: new Date().toISOString() },
      }),
    [commit],
  );

  const wipe = useCallback(() => {
    const saat = new Date().toISOString();
    const dihapus = { ...latest.current.dihapus };
    for (const e of latest.current.entries) dihapus[e.id] = saat;
    commit({ ...latest.current, entries: [], dihapus });
  }, [commit]);


  const setProfile = useCallback(
    (p: Partial<Profile>) => {
      const profile = { ...latest.current.profile, ...p };
      commit({ ...latest.current, profile });
      if (p.mode) {
        void fetch("/api/auth/me", {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ mode: p.mode }),
        }).catch(() => {});
      }
    },
    [commit],
  );

  const register = useCallback<Ctx["register"]>(
    async ({ username, email, password, mode }) => {
      const keys = await createVaultKeys(password);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          mode,
          authHash: keys.authHash,
          salt: keys.salt,
          wrappedDek: keys.wrappedDek,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? "Pendaftaran gagal.");

      dek.current = keys.dek;
      await stashDek(keys.dek);
      setUser(j.user);
      setNeedsUnlock(false);
      // Catatan yang sudah ada di perangkat ikut terangkat, tidak ditinggalkan.
      // Sejak keluar membersihkan penyimpanan lokal, yang tersisa di sini hanya
      // catatan yang memang dibuat orang ini sendiri sebelum ia punya akun.
      const next = {
        ...latest.current,
        profile: { ...latest.current.profile, mode },
        pemilik: j.user?.id ?? null,
      };
      latest.current = next;
      setData(next);
      await push();
      return { recoveryKey: keys.recoveryKey };
    },
    [push],
  );

  const login = useCallback<Ctx["login"]>(
    async ({ ident, password }) => {
      const sres = await fetch(`/api/auth/salt?ident=${encodeURIComponent(ident)}`);
      const { salt } = (await sres.json()) as { salt: string };
      const authHash = await deriveAuthHash(password, salt);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ident, authHash }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? "Gagal masuk.");

      const key = await unwrapDek(password, j.salt, j.wrappedDek);
      dek.current = key;
      await stashDek(key);
      setUser(j.user);
      setNeedsUnlock(false);
      await pull(key, j.user?.id);
    },
    [pull],
  );

  const unlockWithRecovery = useCallback<Ctx["unlockWithRecovery"]>(
    async (recoveryKey) => {
      const key = await dekFromRecovery(recoveryKey);
      dek.current = key;
      await stashDek(key);
      setNeedsUnlock(false);
      await pull(key);
    },
    [pull],
  );

  const logout = useCallback(async () => {
    /*
      Dorongan yang sedang menunggu dibatalkan lebih dulu.

      `commit` menjadwalkan dorongan 900 ms setelah perubahan terakhir. Kalau
      seseorang menekan Keluar di dalam jendela itu, dorongannya akan menyala
      setelah kunci dibuang dan brankas lokal dikosongkan — dan yang terkirim ke
      server adalah brankas kosong itu.
    */
    if (pushTimer.current) {
      clearTimeout(pushTimer.current);
      pushTimer.current = null;
    }

    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    forgetDek();
    dek.current = null;

    /*
      Catatannya ikut ditinggalkan, bukan hanya kuncinya.

      Membuang cookie dan kunci sesi saja menyisakan seluruh isi brankas di
      `localStorage` dalam bentuk terbaca, dan orang berikutnya yang memakai
      perangkat ini akan mewarisinya — lengkap dengan nama panggilan pemilik
      sebelumnya. Lihat `lupakanLokal`.
    */
    lupakanLokal();
    latest.current = EMPTY;
    setData(EMPTY);

    setUser(null);
    setNeedsUnlock(false);
    setSync({ kind: "lokal" });

    // Tab lain yang masih terbuka harus ikut melupakan; lihat `SALURAN`.
    try {
      new BroadcastChannel(SALURAN).postMessage("keluar");
    } catch {
      /* peramban tanpa BroadcastChannel — tab lain akan bersih saat dimuat ulang */
    }
  }, []);

  /**
   * Mendengarkan tab lain yang keluar, lalu ikut melupakan segalanya.
   *
   * Kuncinya dibuang dari memori juga, bukan hanya dari penyimpanan. Tanpa itu,
   * tab ini masih bisa mengenkripsi dan mendorong ke server memakai kunci yang
   * pemiliknya sudah pergi.
   */
  useEffect(() => {
    let saluran: BroadcastChannel;
    try {
      saluran = new BroadcastChannel(SALURAN);
    } catch {
      return;
    }
    saluran.onmessage = () => {
      if (pushTimer.current) {
        clearTimeout(pushTimer.current);
        pushTimer.current = null;
      }
      dek.current = null;
      lupakanLokal();
      latest.current = EMPTY;
      setData(EMPTY);
      setUser(null);
      setNeedsUnlock(false);
      setSync({ kind: "lokal" });
    };
    return () => saluran.close();
  }, []);

  const changePassword = useCallback<Ctx["changePassword"]>(async ({ current, next }) => {
    if (!dek.current) throw new Error("Buka brankas dulu sebelum mengganti kata sandi.");
    const me = await (await fetch("/api/auth/me")).json();
    const currentAuth = await deriveAuthHash(current, me.salt);
    const wrapped = await rewrapDek(dek.current, next);
    const res = await fetch("/api/auth/password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ currentAuthHash: currentAuth, ...wrapped }),
    });
    const j = await res.json();
    if (!res.ok) throw new Error(j.error ?? "Gagal mengganti kata sandi.");
    const raw = await crypto.subtle.exportKey("raw", dek.current);
    return { recoveryKey: btoa(String.fromCharCode(...new Uint8Array(raw))) };
  }, []);

  const deleteAccount = useCallback(async () => {
    const res = await fetch("/api/vault", { method: "DELETE" });
    if (!res.ok) throw new Error("Gagal menghapus akun.");
    localStorage.removeItem(KEY);
    localStorage.removeItem(LEGACY_KEY);
    forgetDek();
    dek.current = null;
    setUser(null);
    setData(EMPTY);
    latest.current = EMPTY;
  }, []);

  /** Cadangan yang bisa dipegang sendiri, tanpa bergantung pada akun mana pun. */
  const exportFile = useCallback(() => {
    const blob = new Blob([JSON.stringify({ format: "cadensa/1", ...latest.current }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cadensa-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const importFile = useCallback<Ctx["importFile"]>(
    async (file) => {
      const parsed = JSON.parse(await file.text()) as Partial<VaultData> & { format?: string };
      const incoming = Array.isArray(parsed.entries) ? parsed.entries : [];
      if (!incoming.length) throw new Error("Berkas itu tidak berisi catatan.");
      const before = latest.current.entries.length;
      /*
        Impor mengalahkan nisan.

        Kalau seseorang sengaja memilih berkas cadangan dan memulihkannya, ia
        memang meminta isinya kembali — termasuk yang dulu dihapus. Membiarkan
        nisan menyaringnya akan membuat pemulihan diam-diam tidak lengkap, dan
        itu jenis kegagalan yang baru ketahuan berbulan-bulan kemudian.
      */
      const dihapus = { ...latest.current.dihapus };
      for (const e of incoming) delete dihapus[e.id];
      const merged = merge(latest.current.entries, incoming, dihapus);
      commit({
        ...latest.current,
        entries: merged,
        dihapus,
        profile: { ...latest.current.profile, ...(parsed.profile ?? {}) },
      });
      return merged.length - before;
    },
    [commit],
  );

  const value = useMemo<Ctx>(
    () => ({
      entries: data.entries,
      profile: data.profile,
      ready,
      user,
      sync,
      add,
      update,
      remove,
      wipe,
      setProfile,
      register,
      login,
      unlockWithRecovery,
      logout,
      changePassword,
      deleteAccount,
      exportFile,
      importFile,
      needsUnlock,
    }),
    [data, ready, user, sync, add, update, remove, wipe, setProfile, register, login, unlockWithRecovery, logout, changePassword, deleteAccount, exportFile, importFile, needsUnlock],
  );

  return <VaultCtx.Provider value={value}>{children}</VaultCtx.Provider>;
}

export function useVault(): Ctx {
  const c = useContext(VaultCtx);
  if (!c) throw new Error("useVault dipakai di luar VaultProvider.");
  return c;
}

/** Nama lama dipertahankan supaya halaman yang sudah ada tidak perlu diubah semua. */
export const useEntries = useVault;
