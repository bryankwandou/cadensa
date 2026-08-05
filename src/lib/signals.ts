import {
  bandState,
  cadenceIndex,
  edgingLoad,
  lastDays,
  lateNightShare,
  longestGapDays,
  medianDurationSec,
  medicalFlagCount,
  monthProjection,
  positiveShare,
  startOfMonth,
  triggerCount,
  within,
} from "./metrics";
import { afterfeelMeta, deviceMeta, type Entry } from "./types";
import { PHASE_NOTE, cycleCoupling, daysUntilNextPeriod, peakPhase, phaseDensity, phaseOf } from "./cycle";
import type { Profile } from "./vault";

export type ReadingKind = "ritme" | "sinyal" | "praktik" | "medis";

export type Reading = {
  id: string;
  kind: ReadingKind;
  /** 0..1 — seberapa kuat pola ini terbaca. Dipakai untuk urutan. */
  strength: number;
  title: string;
  /** Pengamatan. Deskriptif, tanpa vonis. */
  body: string;
  /** Tepat satu saran konkret. Bukan tiga. */
  action: string;
};

const pct = (x: number) => `${Math.round(x * 100)}%`;
const mins = (sec: number) => `${Math.round(sec / 60)} menit`;

/**
 * Mesin bacaan Cadensa. Berjalan sepenuhnya di perangkat — tidak ada catatan
 * yang meninggalkan browser untuk menghasilkan halaman ini.
 *
 * Aturan keras yang ditegakkan di sini:
 *  1. Angka 21 tidak pernah disebut sebagai kewajiban, hanya sebagai wilayah.
 *  2. Tidak ada kata bermuatan moral.
 *  3. Satu saran per bacaan.
 *  4. Dugaan masalah medis keluar sebagai jalur terpisah, tidak dicampur saran kebiasaan.
 */
/**
 * Alasan kenapa kemerataan itu penting berbeda menurut mode, dan perbedaannya
 * bukan kehalusan bahasa.
 *
 * Pita 21 berasal dari penelitian tentang prostat. Menyebut prostat kepada
 * pengguna yang tidak punya prostat bukan sekadar janggal — itu klaim kesehatan
 * yang salah alamat, dan satu kalimat seperti itu cukup untuk membatalkan
 * kepercayaan pada seluruh bacaan lainnya.
 */
function alasanKemerataan(mode: Mode): string {
  return mode === "wanita"
    ? "Ritme yang merata lebih mudah dibaca sebagai pola, dan pola itulah yang membuat pergeseran suasana hati bisa terlihat sejak awal."
    : "Yang berhubungan dengan kesehatan prostat adalah keteraturannya, bukan totalnya.";
}

export function readEntries(entries: Entry[], now = new Date(), mode: Mode = "pria"): Reading[] {
  const out: Reading[] = [];
  if (entries.length < 3) return out;

  const d30 = lastDays(entries, 30, now);
  const d14 = lastDays(entries, 14, now);
  const prior14 = within(entries, new Date(+now - 28 * 86_400_000), new Date(+now - 14 * 86_400_000));
  const month = within(entries, startOfMonth(now), new Date(+now + 1000));

  /* ---------- Jalur medis. Selalu pertama, selalu terpisah. ---------- */
  const flags = medicalFlagCount(d30);
  if (flags >= 3) {
    out.push({
      id: "medis-berulang",
      kind: "medis",
      strength: 1,
      title: "Keluhan fisik berulang",
      body: `Dalam 30 hari terakhir kamu mencatat rasa ngilu, perih, atau nyeri sebanyak ${flags} kali. Rasa sesekali setelah sesi panjang itu wajar; yang berulang seperti ini tidak masuk kategori itu.`,
      action: "Bawa ringkasan ini ke dokter atau urolog. Ini bukan hal yang diselesaikan dengan mengubah teknik.",
    });
  }

  /* ---------- Ritme ---------- */
  const proj = monthProjection(entries, now);
  const band = bandState(proj.projected);
  const ci = cadenceIndex(d30);

  if (band === "sepi") {
    out.push({
      id: "ritme-sepi",
      kind: "ritme",
      strength: 0.6,
      title: "Bulan ini berjalan lebih lambat",
      body: `Sampai hari ini ada ${proj.soFar} catatan, dan dengan laju yang sama bulan ini akan berhenti di sekitar ${proj.projected}. Itu di bawah pita yang biasanya dikaitkan dengan kesehatan prostat yang lebih baik.`,
      action: "Tidak perlu mengejar angka. Cukup perhatikan apakah penurunannya datang dari lelah, stres, atau memang tidak ada dorongan.",
    });
  } else if (band === "padat") {
    out.push({
      id: "ritme-padat",
      kind: "ritme",
      strength: 0.5,
      title: "Bulan ini lebih padat dari biasanya",
      body: `Laju saat ini mengarah ke sekitar ${proj.projected} kejadian bulan ini, di atas pita biasa. Padat sendiri bukan masalah selama rasa sesudahnya tetap enak.`,
      action: "Cek halaman ritme: kalau rasa sesudahnya mulai bergeser ke netral atau hampa, itu penanda yang lebih berarti daripada jumlahnya.",
    });
  }

  if (ci != null && ci < 45) {
    out.push({
      id: "ritme-menumpuk",
      kind: "ritme",
      strength: 0.7,
      title: "Jaraknya tidak merata",
      body: `Indeks kadensmu ${ci} dari 100. Jumlahnya mungkin sudah cukup, tapi tersebar tidak rata — sebagian menumpuk, sebagian kosong panjang. ${alasanKemerataan(mode)}`,
      action: "Ambil satu hari tetap dalam seminggu yang biasanya kosong, dan biarkan itu jadi jangkar ritmemu.",
    });
  }

  const gap = longestGapDays(d30, now);
  if (gap >= 9) {
    out.push({
      id: "ritme-kosong",
      kind: "ritme",
      strength: 0.55,
      title: `Kekosongan ${Math.round(gap)} hari`,
      body: `Ini rentang terpanjang dalam sebulan terakhir. Kalau penyebabnya sakit atau bepergian, tidak ada yang perlu dibaca dari sini.`,
      action: "Kalau bukan keduanya, biasanya yang menahan bukan tubuh tapi beban pikiran. Catat satu alasan di entri berikutnya.",
    });
  }

  /* ---------- Sinyal psikologis ---------- */

  // Stres: frekuensi naik + durasi memendek + pemicu regulasi diri.
  if (prior14.length >= 3 && d14.length >= 4) {
    const up = d14.length / Math.max(1, prior14.length);
    const nowMed = medianDurationSec(d14);
    const prevMed = medianDurationSec(prior14);
    const shorter = nowMed != null && prevMed != null && nowMed < prevMed * 0.75;
    const selfReg = triggerCount(d14, ["stres", "bosan"]);
    if (up >= 1.4 && shorter && selfReg >= 2) {
      out.push({
        id: "sinyal-stres",
        kind: "sinyal",
        strength: 0.85,
        title: "Yang tubuhmu tunjukkan dua minggu ini",
        body: `Frekuensimu naik dibanding dua minggu sebelumnya, tapi durasinya justru memendek — dari sekitar ${mins(prevMed!)} ke ${mins(nowMed!)} — dan beberapa kali kamu menandai alasannya stres atau bosan. Pola cepat dan sering seperti ini biasanya bukan soal gairah, tapi cara tubuh menurunkan tekanan.`,
        action: "Lihat ke belakang dua minggu ini: ada satu hal yang sedang menekan. Itu yang perlu diurus, bukan kebiasaannya.",
      });
    }
  }

  // Anhedonia: kekosongan panjang + rasa bergeser ke netral/hampa.
  const posNow = positiveShare(d30);
  const posBefore = positiveShare(
    within(entries, new Date(+now - 90 * 86_400_000), new Date(+now - 30 * 86_400_000)),
  );
  if (posNow != null && posNow < 0.4 && gap >= 7) {
    const dropped = posBefore != null && posBefore - posNow >= 0.2;
    out.push({
      id: "sinyal-datar",
      kind: "sinyal",
      strength: dropped ? 0.9 : 0.7,
      title: "Rasa sesudahnya mendatar",
      body: `Hanya ${pct(posNow)} catatan bulan ini yang kamu tandai lega atau nikmat${
        dropped ? `, turun dari ${pct(posBefore!)} pada periode sebelumnya` : ""
      }, dan ada kekosongan ${Math.round(gap)} hari di dalamnya. Kombinasi jarang dan datar biasanya bukan soal libido.`,
      action: "Perhatikan apakah hal lain yang biasanya kamu nikmati juga terasa tawar belakangan ini. Kalau iya, itu layak dibicarakan dengan seseorang.",
    });
  }

  // Tidur: pergeseran ke dini hari.
  const lateNow = lateNightShare(d14);
  const lateBefore = lateNightShare(prior14);
  if (lateNow != null && lateNow >= 0.5 && d14.length >= 4) {
    const shifted = lateBefore != null && lateNow - lateBefore >= 0.2;
    out.push({
      id: "sinyal-tidur",
      kind: "sinyal",
      strength: shifted ? 0.75 : 0.55,
      title: "Jamnya bergeser ke dini hari",
      body: `${pct(lateNow)} kejadian dua minggu ini jatuh antara pukul 23.00 dan 04.00${
        shifted ? ", naik jelas dibanding dua minggu sebelumnya" : ""
      }. Pola larut malam yang menetap lebih sering berhubungan dengan susah tidur daripada dengan dorongan seksual.`,
      action: "Coba geser satu sesi ke sore atau pagi minggu ini, lalu lihat apakah tidurmu ikut berubah.",
    });
  }

  // Kompulsivitas: sering tapi tidak lega. Kombinasi inilah yang membedakan.
  if (d30.length >= 28 && posNow != null && posNow < 0.35) {
    out.push({
      id: "sinyal-tanpa-lega",
      kind: "sinyal",
      strength: 0.8,
      title: "Sering, tapi jarang terasa lega",
      body: `Ada ${d30.length} catatan dalam 30 hari, dan hanya ${pct(posNow)} yang kamu tandai lega atau nikmat. Yang menarik di sini bukan jumlahnya — jumlah tinggi yang tetap terasa enak bukan masalah. Yang terbaca adalah jaraknya dengan rasa lega.`,
      action: "Kalau pola ini bertahan beberapa minggu lagi, satu sesi bicara dengan psikolog akan lebih menjawab daripada mengubah teknik.",
    });
  }

  /* ---------- Praktik ---------- */

  // Edging panjang → keluhan.
  const longEdge = d30.filter((e) => e.edging === "lama");
  if (longEdge.length >= 3) {
    const hurt = longEdge.filter((e) => afterfeelMeta(e.afterfeel).medical).length;
    if (hurt / longEdge.length >= 0.5) {
      out.push({
        id: "praktik-edging",
        kind: "praktik",
        strength: 0.8,
        title: "Edging panjang berujung ngilu",
        body: `Dari ${longEdge.length} sesi dengan edging lama bulan ini, ${hurt} berakhir dengan ngilu, perih, atau nyeri. Sesi pendek dan sedangmu hampir tidak pernah begitu.`,
        action: "Potong siklus edging di tiga, bukan lima. Kebanyakan keluhan hilang di angka itu.",
      });
    }
  }

  // Gesekan kering.
  const dry = d30.filter((e) => e.method === "tangan");
  if (dry.length >= 5) {
    const sore = dry.filter((e) => e.afterfeel === "perih").length;
    if (sore / dry.length >= 0.4) {
      out.push({
        id: "praktik-pelumas",
        kind: "praktik",
        strength: 0.65,
        title: "Perih yang datang dari gesekan",
        body: `Rasa perih muncul di ${sore} dari ${dry.length} sesi tanpa pelumas bulan ini, dan hampir tidak pernah di sesi yang memakai pelumas.`,
        action: "Pakai pelumas berbahan air untuk beberapa sesi berikutnya, lalu bandingkan catatannya.",
      });
    }
  }

  // Beban edging tinggi tanpa keluhan — peringatan lunak.
  const load = edgingLoad(month);
  if (load >= 20 && !out.some((r) => r.id === "praktik-edging")) {
    out.push({
      id: "praktik-beban",
      kind: "praktik",
      strength: 0.4,
      title: "Beban edging bulan ini tinggi",
      body: `Akumulasi edgingmu bulan ini ada di angka ${Math.round(load)} dan sejauh ini tubuhmu masih menerimanya tanpa keluhan.`,
      action: "Simpan saja sebagai catatan: kalau mulai muncul ngilu, angka inilah yang pertama diturunkan.",
    });
  }

  // Sesi sangat cepat berulang.
  const med = medianDurationSec(d30);
  if (med != null && med < 240 && d30.length >= 6) {
    out.push({
      id: "praktik-cepat",
      kind: "praktik",
      strength: 0.5,
      title: "Sesimu hampir selalu singkat",
      body: `Durasi tengahmu bulan ini sekitar ${mins(med)}. Cepat tidak selalu berarti buruk, tapi kalau yang kamu cari rasa lega, tempo seperti ini jarang sampai ke sana.`,
      action: "Sekali minggu ini, tunda sepuluh menit sebelum mulai dan lihat apakah rasa sesudahnya berbeda.",
    });
  }

  return sortReadings(out);
}

function sortReadings(out: Reading[]) {
  return out.sort((a, b) => {
    const rank = { medis: 0, sinyal: 1, ritme: 2, praktik: 3 } as const;
    if (rank[a.kind] !== rank[b.kind]) return rank[a.kind] - rank[b.kind];
    return b.strength - a.strength;
  });
}

/**
 * Bacaan yang berasal dari alat bantu.
 *
 * Dipisahkan dari bacaan pola karena sebabnya berbeda jenis: kalau keluhan hanya
 * muncul pada satu alat dan tidak pada yang lain, itu soal perangkat, bukan soal
 * kebiasaan — dan menjawabnya dengan saran perilaku akan salah alamat.
 */
export function readDevices(entries: Entry[], now = new Date()): Reading[] {
  const out: Reading[] = [];
  const d60 = lastDays(entries, 60, now).filter((e) => e.device);
  if (d60.length < 4) return out;

  const byDevice = new Map<string, Entry[]>();
  for (const e of d60) {
    const list = byDevice.get(e.device!) ?? [];
    list.push(e);
    byDevice.set(e.device!, list);
  }

  for (const [key, list] of byDevice) {
    if (list.length < 3) continue;
    const meta = deviceMeta(key);
    if (!meta) continue;

    const hurt = list.filter((e) => afterfeelMeta(e.afterfeel).medical).length;
    const others = d60.filter((e) => e.device !== key);
    const otherHurt = others.length
      ? others.filter((e) => afterfeelMeta(e.afterfeel).medical).length / others.length
      : 0;
    const rate = hurt / list.length;

    if (rate >= 0.4 && rate > otherHurt + 0.2) {
      out.push({
        id: `alat-${key}`,
        kind: "praktik",
        strength: 0.75,
        title: `${meta.label} lebih sering berujung keluhan`,
        body: `Dari ${list.length} sesi dengan ${meta.label.toLowerCase()} dalam dua bulan terakhir, ${hurt} berakhir dengan ngilu, perih, nyeri, atau kebas. Alat lain yang kamu pakai tidak menunjukkan pola yang sama.`,
        action: meta.care,
      });
    }

    // Alat berintensitas tinggi yang dipakai hampir setiap kali — risiko penumpulan.
    if (meta.intensity >= 0.7 && list.length / d60.length >= 0.7) {
      out.push({
        id: `alat-dominan-${key}`,
        kind: "praktik",
        strength: 0.45,
        title: `Hampir semuanya lewat ${meta.label.toLowerCase()}`,
        body: `${Math.round((list.length / d60.length) * 100)}% sesi beralatmu memakai satu alat yang rangsangannya termasuk kuat. Tubuh menyesuaikan diri dengan rangsangan yang selalu sama, dan yang lebih lembut lama-lama terasa kurang.`,
        action: "Selingi dengan cara yang lebih pelan beberapa kali, supaya rentang kepekaannya tidak menyempit ke satu titik.",
      });
    }

    const noLube = list.filter((e) => e.lube === "tidak pakai").length;
    if (meta.group !== "getar" && meta.group !== "isap" && noLube / list.length >= 0.6 && rate >= 0.3) {
      out.push({
        id: `alat-pelumas-${key}`,
        kind: "praktik",
        strength: 0.6,
        title: `${meta.label} tanpa pelumas`,
        body: `Sebagian besar sesimu dengan alat ini tercatat tanpa pelumas, dan keluhan fisik muncul di ${Math.round(rate * 100)}% di antaranya.`,
        action: "Pakai pelumas berbasis air. Bahan silikon dan minyak bisa merusak permukaan alat berbahan silikon atau TPE.",
      });
    }
  }

  return sortReadings(out).slice(0, 3);
}

/**
 * Bacaan mode wanita. Tidak memakai angka 21 dan tidak memakai pita target —
 * yang dibaca adalah hubungan antara dorongan dan fase siklus.
 */
export function readCycle(entries: Entry[], profile: Profile, now = new Date()): Reading[] {
  const out: Reading[] = [];
  const cycle = profile.cycle;

  if (!cycle.lastPeriodStart) {
    out.push({
      id: "siklus-belum-diisi",
      kind: "ritme",
      strength: 0.9,
      title: "Siklusnya belum diketahui",
      body: "Tanpa tanggal haid terakhir, catatanmu hanya bisa dibaca sebagai deret tanggal biasa. Dengan tanggal itu, pola yang berulang tiap bulan mulai kelihatan.",
      action: "Isi tanggal hari pertama haid terakhir di halaman pengaturan. Satu isian, sekali saja.",
    });
    return out;
  }

  const d90 = lastDays(entries, 90, now);
  const coupling = cycleCoupling(d90, cycle);
  const peak = peakPhase(d90, cycle);
  const until = daysUntilNextPeriod(cycle, now);

  if (coupling != null && peak) {
    if (coupling >= 45) {
      out.push({
        id: "siklus-terikat",
        kind: "ritme",
        strength: 0.85,
        title: `Doronganmu memuncak di fase ${peak}`,
        body: `Keterikatan siklusmu ${coupling} dari 100, dan puncaknya jatuh di fase ${peak}. ${PHASE_NOTE[peak]}`,
        action: "Kalau ada minggu yang bisa kamu atur sendiri, letakkan yang menuntut tenaga di luar fase ini.",
      });
    } else if (coupling <= 20 && d90.length >= 12) {
      out.push({
        id: "siklus-lepas",
        kind: "ritme",
        strength: 0.6,
        title: "Polamu hampir tidak mengikuti siklus",
        body: `Keterikatan siklusmu hanya ${coupling} dari 100 — sebarannya cukup rata di semua fase. Ini bukan kelainan; pada sebagian orang dorongan memang lebih ditentukan keadaan sehari-hari daripada hormon.`,
        action: "Coba lihat pemicu yang kamu catat. Untuk pola seperti ini, itu biasanya lebih menjelaskan daripada tanggal.",
      });
    }
  }

  const rows = phaseDensity(d90, cycle);
  const luteal = rows.find((r) => r.phase === "luteal");
  const lutealEntries = d90.filter((e) => phaseOf(e.at, cycle) === "luteal");
  if (luteal && lutealEntries.length >= 4) {
    const pos = positiveShare(lutealEntries);
    const rest = positiveShare(d90.filter((e) => !lutealEntries.includes(e)));
    if (pos != null && rest != null && rest - pos >= 0.25) {
      out.push({
        id: "siklus-luteal-datar",
        kind: "sinyal",
        strength: 0.7,
        title: "Fase luteal terasa berbeda",
        body: `Di minggu-minggu menjelang haid, hanya ${pct(pos)} catatanmu terasa lega atau nikmat, dibanding ${pct(rest)} di fase lain. Pergeseran suasana hati di fase ini lumrah, dan catatanmu menunjukkannya dengan jelas.`,
        action: "Perlakukan minggu itu sebagai minggu yang butuh lebih banyak istirahat, bukan sebagai minggu yang gagal.",
      });
    }
  }

  if (until != null && until <= 3) {
    out.push({
      id: "siklus-dekat-haid",
      kind: "ritme",
      strength: 0.3,
      title: until <= 1 ? "Haid diperkirakan mulai besok" : `Perkiraan haid ${until} hari lagi`,
      body: "Perkiraan ini dihitung dari panjang siklus yang kamu isi, bukan dari pengamatan tubuh. Meleset beberapa hari itu biasa.",
      action: "Perbarui tanggal haid terakhir begitu mulai, supaya perkiraan berikutnya ikut membaik.",
    });
  }

  return sortReadings(out);
}

/** Satu pintu masuk untuk halaman bacaan. */
export function readAll(entries: Entry[], profile: Profile, now = new Date()): Reading[] {
  const base = profile.mode === "wanita" ? readCycleMode(entries, profile, now) : readEntries(entries, now);
  return sortReadings([...base, ...readDevices(entries, now)]);
}

/** Mode wanita memakai bacaan bersama, dikurangi yang bersandar pada pita 21. */
function readCycleMode(entries: Entry[], profile: Profile, now: Date): Reading[] {
  const shared = readEntries(entries, now, "wanita").filter(
    (r) => !["ritme-sepi", "ritme-padat"].includes(r.id),
  );
  return [...readCycle(entries, profile, now), ...shared];
}
