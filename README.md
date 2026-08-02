# Cadensa

**Ritme, bukan skor.**

Pencatat ritme kesehatan reproduksi pria. Basisnya satu temuan epidemiologis yang jarang
dibicarakan: pria yang berejakulasi sekitar 21 kali per bulan menunjukkan angka kejadian
kanker prostat yang lebih rendah dibanding pria yang berejakulasi 4–7 kali per bulan. Angka
itu diperlakukan sebagai penanda ritme sehat, bukan target yang harus dikejar — dan disebut
jujur di dalam produk sebagai korelasi, bukan sebab-akibat.

Perencanaan penuhnya ada di [MEGAPROMPT.md](MEGAPROMPT.md), tanpa satu baris kode.

## Yang membedakannya

- **Tidak ada streak yang bisa patah.** Aplikasi sejenis berdiri di premis pantang total dan
  membangun rasa bersalah saat hitungannya putus. Cadensa berdiri di kutub sebaliknya.
- **Cadence Index** mengukur kemerataan jarak antar kejadian, bukan jumlahnya. Dua orang
  dengan 21 catatan bisa sangat berbeda kalau yang satu menumpuk di minggu terakhir.
- **Sinyal psikologis.** Catatan yang dibuat tanpa penonton adalah proksi suasana batin yang
  jauh lebih jujur daripada kuesioner. Empat pola terbaca tanpa perlu bertanya apa pun:
  stres, rasa yang mendatar, pergeseran jam tidur, dan kompulsivitas.
- **Jalur medis terpisah.** Keluhan fisik berulang tidak pernah dijawab dengan saran teknik.
- **Tidak ada server yang menyimpan apa pun.** Seluruh catatan dan seluruh mesin bacaan
  berjalan di perangkat pengguna.

## Halaman

| Rute | Isi |
|---|---|
| `/` | Tesis produk, peragaan Cadence Index yang bisa digeser langsung |
| `/log` | Alur catat — dua pilihan wajib, timer opsional, detail yang tidak memaksa |
| `/rhythm` | Pita ritme bulanan, proyeksi, kekosongan terpanjang, beban edging, riwayat |
| `/insights` | Bacaan dari mesin sinyal on-device |
| `/privacy` | Apa yang disimpan, di mana, dan apa yang berubah kalau nanti ada akun |

## Menjalankan

```bash
npm install
npm run dev
```

Halaman ritme dan bacaan punya tombol **muat data contoh** — data buatan yang sengaja
dibentuk agar beberapa pola benar-benar terbaca, supaya mesin sinyalnya bisa dicoba tanpa
menunggu sebulan.

## Tumpukan

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Motion

## Catatan

Cadensa bukan alat diagnosis dan tidak menggantikan pemeriksaan. Kalau ada nyeri berulang,
darah, atau keluhan yang menetap, temui dokter.
