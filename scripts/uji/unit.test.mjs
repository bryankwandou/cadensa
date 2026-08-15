/**
 * Uji unit untuk empat fungsi yang menentukan apakah catatan seseorang bertahan
 * atau hilang.
 *
 * Rangkaian ujung-ke-ujung menjalankan peramban sungguhan dan menangkap hal-hal
 * yang tidak terlihat dari kode — tapi ia lambat, dan hampir tidak bisa
 * menjangkau kasus tepi yang justru paling berbahaya di sini: nisan yang lebih
 * tua dari catatannya, cap waktu yang rusak, dua perangkat yang menghapus hal
 * berbeda, bulan yang hanya berisi tiga catatan.
 *
 * Berkas ini berlawanan sifatnya: cepat, murni, dan sengaja mencari keadaan yang
 * tidak akan pernah muncul secara kebetulan.
 *
 * Dijalankan lewat `npm run uji:unit`, memakai pelari uji bawaan Node — tanpa
 * kerangka kerja tambahan, karena satu-satunya yang dibutuhkan di sini adalah
 * `assert` dan cara mengelompokkan.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { UMUR_NISAN_MS, gabungNisan, merge, pangkasNisan } from "../../src/lib/gabung.ts";
import { cadenceIndex, longestGapDays, within } from "../../src/lib/metrics.ts";
import { dayInCycle, phaseOf, phaseOfDay } from "../../src/lib/cycle.ts";

const HARI = 86_400_000;
const catatan = (id, iso) => ({
  id,
  at: iso,
  durationSec: 300,
  method: "tangan",
  device: null,
  lube: null,
  edging: "tidak",
  edgeCycles: null,
  trigger: null,
  afterfeel: "lega",
  note: "",
  mode: "pria",
});

/* ══════════════════════════════════════════════════════════════════════════
   merge — penggabungan dua salinan brankas
   ══════════════════════════════════════════════════════════════════════════ */
describe("merge", () => {
  it("menyatukan dua salinan tanpa menggandakan id yang sama", () => {
    const a = [catatan("x", "2026-01-01T10:00:00Z"), catatan("y", "2026-01-02T10:00:00Z")];
    const b = [catatan("y", "2026-01-02T10:00:00Z"), catatan("z", "2026-01-03T10:00:00Z")];
    const hasil = merge(a, b);
    assert.deepEqual(
      hasil.map((e) => e.id),
      ["x", "y", "z"],
    );
  });

  it("mengurutkan menurut waktu, bukan menurut urutan masuk", () => {
    const a = [catatan("akhir", "2026-03-01T00:00:00Z")];
    const b = [catatan("awal", "2026-01-01T00:00:00Z"), catatan("tengah", "2026-02-01T00:00:00Z")];
    assert.deepEqual(
      merge(a, b).map((e) => e.id),
      ["awal", "tengah", "akhir"],
    );
  });

  it("membuang yang bernisan, dari salinan mana pun ia datang", () => {
    const a = [catatan("hidup", "2026-01-01T00:00:00Z"), catatan("mati", "2026-01-02T00:00:00Z")];
    const b = [catatan("mati", "2026-01-02T00:00:00Z")];
    const hasil = merge(a, b, { mati: "2026-01-03T00:00:00Z" });
    assert.deepEqual(
      hasil.map((e) => e.id),
      ["hidup"],
    );
  });

  /*
    Inti dari seluruh mekanisme nisan. Sebelum nisan ada, perangkat yang belum
    tahu akan mengembalikan catatan yang sudah dihapus lewat penggabungan —
    orang menghapus sesuatu di ponsel, lalu menemukannya lagi di laptop.
  */
  it("perangkat yang belum tahu tidak bisa menghidupkan kembali yang dihapus", () => {
    /*
      `sekarang` dioper, tidak dibiarkan memakai jam sungguhan.

      Versi pertama uji ini memakai nilai bawaan `Date.now()` dengan nisan
      bertanggal Februari. Ia lolos selama beberapa bulan, lalu mulai gagal
      begitu jarak ke hari ini melewati batas umur nisan — pada kode yang tidak
      berubah sedikit pun. Uji yang hasilnya bergantung pada tanggal
      menjalankannya lebih buruk daripada tidak ada uji: ia menuduh kode yang
      benar, dan yang membacanya akan belajar mengabaikannya.
    */
    const kini = Date.UTC(2026, 2, 1);
    const ponsel = { entries: [], dihapus: { rahasia: "2026-02-01T00:00:00.000Z" } };
    const laptop = { entries: [catatan("rahasia", "2026-01-01T00:00:00Z")], dihapus: {} };
    const dihapus = gabungNisan(ponsel.dihapus, laptop.dihapus, kini);
    assert.equal(merge(ponsel.entries, laptop.entries, dihapus).length, 0);
  });

  /*
    Sisi lain dari batas umur itu, dinyatakan terbuka sebagai perilaku yang
    disengaja: perangkat yang tidak menyala lebih lama daripada umur nisan akan
    menghidupkan kembali catatan yang sudah dihapus. Itu harga dari tidak
    menyimpan nisan selamanya, dan lebih baik tertulis di sini sebagai uji
    daripada ditemukan seseorang sebagai kejutan.
  */
  it("perangkat yang tertidur lebih lama dari umur nisan akan menghidupkan kembali", () => {
    const kini = Date.UTC(2026, 7, 16);
    const usang = { rahasia: new Date(kini - UMUR_NISAN_MS - 5 * HARI).toISOString() };
    const dihapus = gabungNisan(usang, {}, kini);
    const hasil = merge([], [catatan("rahasia", "2026-01-01T00:00:00Z")], dihapus);
    assert.equal(hasil.length, 1);
  });

  it("tidak mengubah larik yang dioper masuk", () => {
    const a = [catatan("x", "2026-01-01T00:00:00Z")];
    const b = [catatan("y", "2026-01-02T00:00:00Z")];
    merge(a, b, { x: "2026-01-03T00:00:00Z" });
    assert.equal(a.length, 1);
    assert.equal(b.length, 1);
  });

  it("dua larik kosong menghasilkan larik kosong, bukan galat", () => {
    assert.deepEqual(merge([], []), []);
  });
});

/* ══════════════════════════════════════════════════════════════════════════
   nisan — pemangkasan dan penggabungan
   ══════════════════════════════════════════════════════════════════════════ */
describe("nisan", () => {
  const kini = Date.UTC(2026, 5, 1);

  it("mempertahankan nisan yang masih dalam masa berlaku", () => {
    const baru = new Date(kini - 30 * HARI).toISOString();
    assert.deepEqual(pangkasNisan({ a: baru }, kini), { a: baru });
  });

  it("membuang nisan yang lebih tua dari batas umur", () => {
    const usang = new Date(kini - UMUR_NISAN_MS - HARI).toISOString();
    assert.deepEqual(pangkasNisan({ a: usang }, kini), {});
  });

  it("menahan nisan yang persis di ambang batas", () => {
    const tepat = new Date(kini - UMUR_NISAN_MS).toISOString();
    assert.deepEqual(pangkasNisan({ a: tepat }, kini), { a: tepat });
  });

  /*
    Cap waktu yang rusak pernah menjadi lubang diam-diam: `+new Date("rusak")`
    menghasilkan NaN, dan setiap perbandingan dengan NaN bernilai salah — jadi
    penyaringan `>= batas` akan membuang nisannya, dan catatan yang sudah
    dihapus hidup kembali tanpa ada yang tahu.
  */
  it("mempertahankan nisan yang cap waktunya tidak terbaca", () => {
    assert.deepEqual(pangkasNisan({ a: "bukan tanggal" }, kini), { a: "bukan tanggal" });
  });

  it("menyatukan nisan dari dua perangkat", () => {
    const a = { satu: "2026-05-01T00:00:00.000Z" };
    const b = { dua: "2026-05-02T00:00:00.000Z" };
    assert.deepEqual(Object.keys(gabungNisan(a, b, kini)).sort(), ["dua", "satu"]);
  });

  it("mempertahankan cap waktu yang lebih awal saat id-nya sama", () => {
    const awal = "2026-05-01T00:00:00.000Z";
    const lambat = "2026-05-09T00:00:00.000Z";
    assert.equal(gabungNisan({ x: lambat }, { x: awal }, kini).x, awal);
    assert.equal(gabungNisan({ x: awal }, { x: lambat }, kini).x, awal);
  });

  it("menerima argumen yang tidak diisi", () => {
    assert.deepEqual(gabungNisan(undefined, undefined, kini), {});
  });
});

/* ══════════════════════════════════════════════════════════════════════════
   cadenceIndex — kemerataan jarak, bukan jumlah
   ══════════════════════════════════════════════════════════════════════════ */
describe("cadenceIndex", () => {
  const setiap = (n, jarakHari, mulai = Date.UTC(2026, 0, 1)) =>
    Array.from({ length: n }, (_, i) =>
      catatan(`e${i}`, new Date(mulai + i * jarakHari * HARI).toISOString()),
    );

  it("kembali null di bawah empat catatan, karena tiga jarak belum cukup", () => {
    assert.equal(cadenceIndex(setiap(3, 3)), null);
    assert.notEqual(cadenceIndex(setiap(4, 3)), null);
  });

  it("memberi nilai penuh untuk jarak yang persis sama", () => {
    assert.equal(cadenceIndex(setiap(10, 3)), 100);
  });

  /*
    Sifat yang membuat angka ini ada sama sekali: dua orang dengan jumlah
    catatan identik bisa mendapat nilai sangat berbeda. Kalau tidak, halaman
    depan yang menjanjikan "ritme, bukan skor" kehilangan dasarnya.
  */
  it("jumlah sama, sebaran berbeda, nilai berbeda", () => {
    const rata = setiap(9, 3);
    const menumpuk = [
      ...Array.from({ length: 8 }, (_, i) =>
        catatan(`t${i}`, new Date(Date.UTC(2026, 0, 1) + i * 0.4 * HARI).toISOString()),
      ),
      catatan("jauh", new Date(Date.UTC(2026, 0, 28)).toISOString()),
    ];
    assert.equal(rata.length, menumpuk.length);
    assert.ok(
      cadenceIndex(rata) > cadenceIndex(menumpuk) + 30,
      `rata ${cadenceIndex(rata)} harus jauh di atas menumpuk ${cadenceIndex(menumpuk)}`,
    );
  });

  it("tidak pernah keluar dari rentang 0..100", () => {
    const kacau = [
      catatan("a", "2026-01-01T00:00:00Z"),
      catatan("b", "2026-01-01T00:01:00Z"),
      catatan("c", "2026-01-01T00:02:00Z"),
      catatan("d", "2026-12-31T00:00:00Z"),
    ];
    const n = cadenceIndex(kacau);
    assert.ok(n >= 0 && n <= 100, `di luar rentang: ${n}`);
  });

  it("urutan masukan tidak mengubah hasilnya", () => {
    const urut = setiap(8, 4);
    const acak = [...urut].reverse();
    assert.equal(cadenceIndex(acak), cadenceIndex(urut));
  });
});

/* ══════════════════════════════════════════════════════════════════════════
   longestGapDays — kekosongan terpanjang
   ══════════════════════════════════════════════════════════════════════════ */
describe("longestGapDays", () => {
  it("menghitung juga jarak dari catatan terakhir ke titik acuan", () => {
    const e = [catatan("a", "2026-01-01T00:00:00Z")];
    const acuan = new Date(Date.UTC(2026, 0, 11));
    assert.equal(Math.round(longestGapDays(e, acuan)), 10);
  });

  /*
    Persis bug yang ditemukan di halaman ritme: memakai hari ini sebagai acuan
    untuk bulan yang sudah lewat melaporkan kekosongan sepanjang jarak ke hari
    ini, bukan kekosongan di dalam bulan itu.
  */
  it("acuan yang berbeda menghasilkan angka yang berbeda", () => {
    const e = [catatan("a", "2026-01-01T00:00:00Z"), catatan("b", "2026-01-05T00:00:00Z")];
    const diBulanItu = longestGapDays(e, new Date(Date.UTC(2026, 0, 6)));
    const hariIni = longestGapDays(e, new Date(Date.UTC(2026, 5, 1)));
    assert.equal(Math.round(diBulanItu), 4);
    assert.ok(hariIni > 140, `acuan jauh harus melaporkan kekosongan besar: ${hariIni}`);
  });

  it("larik kosong menghasilkan nol, bukan galat", () => {
    assert.equal(longestGapDays([], new Date()), 0);
  });
});

/* ══════════════════════════════════════════════════════════════════════════
   siklus — pemetaan tanggal ke fase
   ══════════════════════════════════════════════════════════════════════════ */
describe("siklus", () => {
  const p = { lastPeriodStart: "2026-01-01", cycleLengthDays: 28, periodLengthDays: 5 };

  it("hari pertama haid adalah hari ke-1, bukan ke-0", () => {
    assert.equal(dayInCycle("2026-01-01T08:00:00", p), 1);
  });

  it("berputar kembali setelah satu siklus penuh", () => {
    assert.equal(dayInCycle("2026-01-29T08:00:00", p), 1);
  });

  /*
    Catatan yang tanggalnya mendahului tanggal acuan tetap dipetakan, bukan
    dibuang. Orang yang baru mengisi tanggal haid hari ini punya berbulan-bulan
    catatan di belakangnya, dan membuangnya berarti mode wanita mulai dari nol
    bagi justru pengguna yang paling rajin mencatat.
  */
  it("tanggal sebelum acuan tetap dipetakan ke dalam siklus", () => {
    const hari = dayInCycle("2025-12-20T08:00:00", p);
    assert.ok(hari >= 1 && hari <= 28, `di luar siklus: ${hari}`);
  });

  it("mengembalikan null kalau tanggal haid belum diisi", () => {
    assert.equal(dayInCycle("2026-01-01", { ...p, lastPeriodStart: null }), null);
    assert.equal(phaseOf("2026-01-01", { ...p, lastPeriodStart: null }), null);
  });

  it("memetakan tiap hari ke fase yang benar", () => {
    assert.equal(phaseOfDay(1, p), "haid");
    assert.equal(phaseOfDay(5, p), "haid");
    assert.equal(phaseOfDay(6, p), "folikular");
    assert.equal(phaseOfDay(14, p), "ovulasi");
    assert.equal(phaseOfDay(16, p), "luteal");
    assert.equal(phaseOfDay(28, p), "luteal");
  });

  it("setiap hari dalam siklus punya tepat satu fase", () => {
    const sah = new Set(["haid", "folikular", "ovulasi", "luteal"]);
    for (let d = 1; d <= 28; d++) assert.ok(sah.has(phaseOfDay(d, p)), `hari ${d}`);
  });

  it("menjepit panjang siklus yang tidak masuk akal", () => {
    for (const panjang of [1, 0, -5, 999]) {
      const hari = dayInCycle("2026-02-15T00:00:00", { ...p, cycleLengthDays: panjang });
      assert.ok(hari >= 1 && hari <= 45, `panjang ${panjang} menghasilkan hari ${hari}`);
    }
  });
});

/* ══════════════════════════════════════════════════════════════════════════
   within — jendela waktu
   ══════════════════════════════════════════════════════════════════════════ */
describe("within", () => {
  const e = [
    catatan("sebelum", "2026-01-31T23:59:00Z"),
    catatan("awal", "2026-02-01T00:00:00Z"),
    catatan("tengah", "2026-02-15T12:00:00Z"),
    catatan("akhir", "2026-02-28T23:59:00Z"),
    catatan("sesudah", "2026-03-01T00:00:01Z"),
  ];

  it("memasukkan tepi awal dan mengecualikan tepi akhir", () => {
    const hasil = within(e, new Date("2026-02-01T00:00:00Z"), new Date("2026-03-01T00:00:00Z"));
    assert.deepEqual(
      hasil.map((x) => x.id),
      ["awal", "tengah", "akhir"],
    );
  });

  it("jendela terbalik menghasilkan kosong, bukan galat", () => {
    assert.deepEqual(within(e, new Date("2026-03-01Z"), new Date("2026-02-01Z")), []);
  });
});
