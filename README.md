# Cadensa

**Ritme, bukan skor.**

Pencatat ritme kesehatan reproduksi. Basisnya satu temuan epidemiologis yang jarang
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
- **Server tidak bisa membaca apa pun.** Catatan dienkripsi di peramban sebelum dikirim.

## Penyimpanan

Tiga lapis, dan lapis pertama tetap bekerja tanpa akun.

1. **Perangkat.** Semua catatan ditulis ke penyimpanan peramban lebih dulu, selalu. Aplikasi
   tetap berfungsi penuh tanpa jaringan dan tanpa akun.
2. **Brankas terenkripsi.** Kalau ada akun, isi brankas dienkripsi AES-GCM di peramban lalu
   dikirim. Kunci datanya acak dan dibungkus kunci turunan PBKDF2 dari kata sandi — jadi
   ganti kata sandi cukup membungkus ulang bungkusnya, isi brankas tidak disentuh.
3. **Berkas cadangan.** Ekspor JSON yang bisa dipegang sendiri, tanpa bergantung akun.

Kata sandi asli tidak pernah dikirim: yang dikirim turunan PBKDF2-nya, yang di server
di-hash lagi dengan scrypt. Konsekuensinya disebut terang-terangan di dalam produk — tanpa
kata sandi, tidak ada yang bisa memulihkan brankas, termasuk kami. Karena itu ada kunci
pemulihan yang ditampilkan sekali saat mendaftar.

## Mode

| Mode | Yang diukur |
|---|---|
| Pria | Pita bulanan 18–24 dengan 21 di tengahnya, digambar sebagai wilayah bukan garis |
| Wanita | Fase siklus, keterikatan siklus 0–100, sebaran per hari fase |

Angka 21 sengaja **tidak** dipindahkan ke mode wanita. Temuan yang mendasarinya berasal dari
penelitian tentang prostat, jadi memakai ulang angkanya akan menjadi klaim kesehatan tanpa
dasar. Mode wanita punya metrik, katalog alat, dan mesin bacaannya sendiri.

## Halaman

| Rute | Isi |
|---|---|
| `/` | Tesis produk, peragaan Cadence Index yang bisa digeser langsung, katalog alat |
| `/log` | Alur catat — dua pilihan wajib, timer opsional, pemilih alat bergambar |
| `/rhythm` | Pita ritme bulanan, sebaran fase siklus, proyeksi, riwayat |
| `/insights` | Bacaan dari mesin sinyal on-device, termasuk sinyal per alat |
| `/masuk` | Daftar, masuk, dan buka brankas dengan kunci pemulihan |
| `/pengaturan` | Mode, profil siklus, cadangan, ganti kata sandi, hapus akun |
| `/privacy` | Apa yang disimpan, di mana, dan apa harganya |

## Menjalankan

```bash
npm install
# isi .env.local dengan DATABASE_URL (Neon Postgres) dan SESSION_SECRET
npm run dev
```

Tanpa `DATABASE_URL`, semua halaman tetap jalan — hanya rute akun yang tidak. Halaman ritme
dan bacaan punya tombol **muat data contoh**: data buatan yang sengaja dibentuk agar
polanya benar-benar terbaca, supaya mesin sinyalnya bisa dicoba tanpa menunggu sebulan.

## Tumpukan

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Motion · Neon Postgres · Web Crypto

## Catatan

Cadensa bukan alat diagnosis dan tidak menggantikan pemeriksaan. Kalau ada nyeri berulang,
darah, atau keluhan yang menetap, temui dokter.
