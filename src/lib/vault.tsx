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
  type CycleProfile,
  type Draft,
  type Entry,
  type Mode,
} from "./types";
import { buildSample } from "./sample";
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

export type Profile = { mode: Mode; cycle: CycleProfile };
export type VaultData = { entries: Entry[]; profile: Profile; rev: number };
export type User = { id: string; username: string; email: string; mode: Mode };

export type SyncState =
  | { kind: "lokal" }
  | { kind: "menyiapkan" }
  | { kind: "tersimpan"; at: number }
  | { kind: "menyimpan" }
  | { kind: "terkunci" }
  | { kind: "gagal"; message: string };

const EMPTY: VaultData = { entries: [], profile: { mode: "pria", cycle: DEFAULT_CYCLE }, rev: 0 };

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

/** Menggabung dua salinan berdasarkan id. Perangkat yang lama menyala tidak menimpa yang baru. */
function merge(a: Entry[], b: Entry[]): Entry[] {
  const map = new Map<string, Entry>();
  for (const e of [...a, ...b]) map.set(e.id, e);
  return [...map.values()].sort((x, y) => +new Date(x.at) - +new Date(y.at));
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
  seed: () => void;
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

  const push = useCallback(async () => {
    if (!dek.current) return;
    try {
      const ciphertext = await sealVault(dek.current, latest.current);
      const res = await fetch("/api/vault", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ciphertext, revision: latest.current.rev }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Gagal menyimpan.");
      setSync({ kind: "tersimpan", at: Date.now() });
    } catch (e) {
      setSync({ kind: "gagal", message: e instanceof Error ? e.message : "Gagal menyimpan." });
    }
  }, []);

  const pull = useCallback(async (key: CryptoKey) => {
    setSync({ kind: "menyiapkan" });
    const res = await fetch("/api/vault");
    if (!res.ok) throw new Error("Brankas tidak bisa diambil.");
    const { ciphertext } = (await res.json()) as { ciphertext: string | null };

    const local = latest.current;
    let next = local;
    if (ciphertext) {
      const remote = await openVault<VaultData>(key, ciphertext);
      next = {
        entries: merge(local.entries, remote.entries ?? []),
        profile: { ...remote.profile, ...(local.rev > (remote.rev ?? 0) ? local.profile : {}) },
        rev: Math.max(local.rev, remote.rev ?? 0),
      };
    }
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
            await pull(key);
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
    (id: string) => commit({ ...latest.current, entries: latest.current.entries.filter((e) => e.id !== id) }),
    [commit],
  );

  const wipe = useCallback(() => commit({ ...latest.current, entries: [] }), [commit]);

  const seed = useCallback(
    () => commit({ ...latest.current, entries: buildSample(new Date(), latest.current.profile.mode) }),
    [commit],
  );

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
      const next = { ...latest.current, profile: { ...latest.current.profile, mode } };
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
      await pull(key);
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
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    forgetDek();
    dek.current = null;
    setUser(null);
    setNeedsUnlock(false);
    setSync({ kind: "lokal" });
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
      const merged = merge(latest.current.entries, incoming);
      commit({
        ...latest.current,
        entries: merged,
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
      seed,
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
    [data, ready, user, sync, add, update, remove, wipe, seed, setProfile, register, login, unlockWithRecovery, logout, changePassword, deleteAccount, exportFile, importFile, needsUnlock],
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
