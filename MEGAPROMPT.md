# CADENSA — MEGAPROMPT & FUNDAMENTAL PLANNING

> Dokumen ini murni perencanaan. Tidak ada satu baris kode pun di dalamnya — disengaja.
> Semua keputusan produk, logika, arsitektur, dan urutan eksekusi 0 → MVP ada di sini.

---

## 0. RINGKASAN SATU PARAGRAF

Cadensa adalah pencatat ritme kesehatan reproduksi pria yang bekerja diam-diam di latar
belakang hidup seseorang. Basisnya satu temuan epidemiologis yang jarang dibicarakan: pria
yang berejakulasi sekitar 21 kali per bulan menunjukkan angka kejadian kanker prostat yang
lebih rendah dibanding pria yang berejakulasi 4–7 kali per bulan. Angka itu bukan target
kompetisi, melainkan penanda ritme sehat. Cadensa mengubahnya menjadi kebiasaan yang bisa
dilihat, dijaga, dan dipahami — lengkap dengan lapisan analisis yang membaca pola tubuh dan
suasana batin penggunanya, tanpa satu byte pun data mentah keluar dari kendali pemilik akun.

---

## 1. KENAPA BELUM ADA YANG MEMBUATNYA

Pertanyaan pembuka pengguna — "kenapa belum ada satu pun orang yang membuat pengingat
kesehatan prostat pria?" — punya jawaban yang perlu dijawab jujur, karena jawabannya
menentukan strategi produk.

**Sebab pertama: rasa malu adalah pajak distribusi.** Kategori ini tidak bisa dipasarkan
lewat jalur normal. Meta, Google Ads, dan TikTok Ads punya kebijakan yang menolak iklan
bertema seksual eksplisit. App Store dan Play Store punya rating konten yang bisa mengubur
aplikasi. Founder yang rasional melihat CAC yang mahal dan pergi.

**Sebab kedua: tidak ada bahasa yang netral.** Produk kesehatan wanita punya kosakata
klinis yang sudah diterima publik — siklus, ovulasi, fase luteal. Produk pria di area ini
belum punya kosakata setara. Yang tersedia hanya dua ekstrem: bahasa klinis urologi yang
dingin, atau bahasa pornografi yang membuat pengguna menutup aplikasi saat ada orang lewat.
Celah kosakata inilah yang justru jadi peluang: siapa yang menciptakan bahasanya, memiliki
kategorinya.

**Sebab ketiga: pasar terlihat kecil dari luar.** Padahal populasi pria dewasa dunia sekitar
2,8 miliar. Yang terjadi bukan pasar kecil, melainkan pasar bisu.

**Sebab keempat: soal privasi terlalu berat.** Data ini termasuk yang paling sensitif yang
bisa dimiliki seseorang. Satu kebocoran berarti kematian merek permanen. Kebanyakan tim
tidak mau memikul risiko itu. Cadensa memilih memikulnya dan menjadikannya fitur utama.

**Sebab kelima — yang paling penting: sebenarnya sudah ada, tapi salah semua.**
Yang ada di pasar hari ini adalah aplikasi "NoFap"/rebooting yang berdiri di atas premis
berlawanan: menahan diri total. Mereka menghitung hari pantang, memberi lencana, dan
membangun rasa bersalah. Cadensa berdiri di kutub sebaliknya dengan dukungan bukti: bukan
menahan, tapi menjaga ritme. Ini bukan produk baru di pasar kosong — ini posisi berlawanan
di pasar yang sudah punya jutaan pengguna dan sedang tidak bahagia.

---

## 2. TESIS PRODUK

Tiga kalimat yang harus dipegang setiap keputusan desain:

1. **Ritme, bukan skor.** Tidak ada leaderboard, tidak ada streak yang patah dan membuat
   pengguna berhenti memakai aplikasi. Yang ditampilkan adalah pita ritme yang melebar dan
   menyempit — deskriptif, bukan menghakimi.
2. **Tubuh dan pikiran satu paket.** Setiap catatan fisik selalu membawa satu penanda rasa.
   Dari sanalah lapisan psikologis lahir tanpa pengguna merasa sedang diinterogasi.
3. **Data pengguna tidak pernah menjadi bahan bakar orang lain.** Terenkripsi di sisi klien,
   dianalisis oleh model tertutup, tidak pernah dijual, tidak pernah dipakai melatih model.

---

## 3. LAPISAN PRODUK

### 3.1 Lapisan Catat (Log)
Inti aplikasi. Target waktu pencatatan: **di bawah 12 detik**. Ini angka mati; setiap fitur
yang membuatnya melewati 12 detik harus dipindah ke layar lanjutan yang opsional.

Dimensi yang dicatat:

| Dimensi | Bentuk masukan | Wajib? |
|---|---|---|
| Waktu kejadian | otomatis, bisa digeser | ya |
| Durasi mulai → ejakulasi | timer berjalan atau isi manual | ya (bisa "tidak tahu") |
| Metode | tangan / pelumas / alat bantu / hubungan seksual | ya |
| Edging | tidak / ringan / lama, plus jumlah siklus | tidak |
| Pemicu | dorongan alami / stres / bosan / kebiasaan jam tertentu / rangsangan visual / keintiman pasangan | tidak |
| Rasa sesudah | lega / nikmat / netral / hampa / ngilu / perih / nyeri | ya |
| Kualitas fisik | intensitas, volume relatif, kelancaran | tidak |
| Catatan bebas | teks pendek | tidak |

Prinsip: yang wajib hanya tiga. Sisanya muncul sebagai "mau tambah detail?" — pengguna yang
sedang ingin cepat tidak pernah dipaksa.

### 3.2 Lapisan Ritme (Rhythm)
Kalender bulanan yang tidak terlihat seperti kalender. Setiap hari adalah simpul pada pita
yang mengalir. Kepadatan warna menunjukkan frekuensi, ketinggian simpul menunjukkan kualitas
rasa. Di atasnya, satu pita target 21× per bulan digambar sebagai koridor, bukan garis —
karena 21 adalah wilayah, bukan angka pas.

Metrik yang dihitung:
- **Cadence Index** — seberapa merata jarak antar kejadian (bukan berapa banyak). Dua orang
  dengan 21 catatan bisa punya indeks sangat berbeda: satu tersebar rata, satu menumpuk di
  akhir bulan. Yang kedua bermasalah, dan hanya metrik ini yang menangkapnya.
- **Proyeksi bulan berjalan** — perkiraan total di akhir bulan berdasarkan laju saat ini.
- **Rentang kekosongan terpanjang** — penanda dini stres, sakit, atau penurunan libido.
- **Beban edging** — akumulasi durasi edging; berkorelasi dengan keluhan nyeri.

### 3.3 Lapisan Wawasan (Insight / AI)
Model tertutup membaca pola dan mengembalikan bacaan dalam bahasa manusia. Bukan diagnosis,
bukan resep — pengamatan dan saran praktik.

Contoh bentuk keluaran yang dituju:
- "Tiga minggu terakhir kejadianmu menumpuk antara pukul 23.00 dan 01.00, dan rasa sesudahnya
  lebih sering 'hampa' dibanding 'lega'. Pola larut malam biasanya bukan soal dorongan
  seksual, tapi soal susah tidur."
- "Setiap kali sesi lewat 25 menit dengan edging panjang, dua dari tiga kali kamu mencatat
  ngilu. Coba potong siklus edging di tiga, bukan lima."
- "Kekosongan sembilan hari ini adalah yang terpanjang sejak kamu mulai mencatat. Kalau ini
  bukan karena sakit atau bepergian, biasanya penyebabnya beban pikiran."

Aturan keras untuk lapisan ini:
1. Tidak pernah menyebut angka 21 sebagai kewajiban.
2. Tidak pernah menggunakan kata bermuatan moral: kecanduan, dosa, gagal, kotor, lemah.
3. Selalu satu saran konkret, bukan tiga.
4. Jika sinyal menunjukkan kemungkinan masalah medis (nyeri berulang, darah, disfungsi
   menetap), keluarannya berhenti menjadi saran dan berubah menjadi anjuran periksa ke dokter.
   Ini jalur terpisah yang tidak boleh dicampur dengan saran kebiasaan.

### 3.4 Lapisan Sinyal Psikologis (usulan tambahan — inilah pembeda sesungguhnya)
Data yang dikumpulkan Cadensa secara kebetulan adalah salah satu proksi kesehatan mental
harian yang paling jujur yang bisa dimiliki sebuah aplikasi, karena dicatat tanpa performa
sosial. Empat sinyal turunan:

- **Sinyal stres.** Naiknya frekuensi mendadak yang disertai durasi memendek dan pemicu
  "stres/bosan" adalah pola regulasi diri, bukan pola gairah. Muncul 3–10 hari sebelum orang
  menyadari dirinya sedang tertekan.
- **Sinyal depresif / anhedonia.** Kekosongan panjang yang disertai perubahan label rasa dari
  "nikmat" menjadi "netral/hampa". Ini penanda anhedonia, gejala inti depresi. Aplikasi
  kesehatan mental lain menanyakannya lewat kuesioner yang mudah dibohongi; Cadensa
  membacanya dari perilaku.
- **Sinyal gangguan tidur.** Pergeseran jam kejadian ke arah dini hari secara konsisten.
- **Sinyal kompulsivitas.** Frekuensi tinggi yang **tidak** diikuti rasa lega — kombinasi
  yang membedakan kebiasaan sehat dari perilaku kompulsif. Ini satu-satunya kondisi di mana
  Cadensa menyarankan bicara dengan profesional, dan tetap tanpa nada menghakimi.

Semua sinyal ini disajikan sebagai "yang tubuhmu tunjukkan minggu ini", bukan sebagai label
klinis. Tidak ada kata "depresi" yang muncul di layar sebagai vonis.

### 3.5 Lapisan Panduan (Practice)
Perpustakaan praktik pendek yang dipanggil oleh wawasan, bukan dibaca dari daftar. Setiap
saran AI menautkan satu kartu praktik: cara mengatur siklus edging agar tidak nyeri, kenapa
pelumas mengurangi lecet, teknik pernapasan untuk memperlambat, cara memutus pola larut
malam, kapan nyeri berarti harus ke dokter.

### 3.6 Lapisan Pasangan (opsional, fase 2)
Berbagi ritme dengan pasangan dalam bentuk yang sudah diringkas — bukan catatan mentah.
Pasangan melihat "minggu ini ritmenya turun dan tidurnya berantakan", bukan detail per
kejadian. Ini mengubah produk dari kesehatan pribadi menjadi kesehatan relasi, dan
melipatgandakan retensi.

### 3.7 Mode Wanita (opsional, dijawab jujur)
Pertanyaan pengguna soal versi wanita perlu jawaban yang tidak mengarang bukti. Temuan 21×
adalah temuan spesifik prostat; **tidak ada padanan epidemiologisnya untuk wanita.** Yang ada
bukti wajar adalah manfaat pada kualitas tidur, nyeri haid, suasana hati, dan kesehatan dasar
panggul. Karena itu mode wanita di Cadensa tidak boleh meniru kerangka 21×. Bentuknya berbeda:
pelacakan ritme yang ditumpangkan pada siklus menstruasi, dengan fokus pada suasana hati dan
kualitas tidur, tanpa target angka apa pun. Ini ditempatkan di fase 3 agar tidak mengaburkan
posisi awal produk.

---

## 4. PRIVASI SEBAGAI ARSITEKTUR

Ini bukan bab kepatuhan. Ini bab arsitektur, dan menentukan urutan kerja teknis.

- Catatan dienkripsi di perangkat sebelum dikirim. Kunci diturunkan dari kata sandi pengguna.
  Server menyimpan sesuatu yang, jika dicuri seluruhnya, tidak berarti apa-apa.
- Analisis AI berjalan pada agregat dan pola yang sudah dilepas dari identitas.
- Tidak ada pihak ketiga analitik di halaman-halaman yang berisi data. Halaman pemasaran
  boleh punya; halaman aplikasi tidak.
- Kunci hapus akun yang benar-benar menghapus, terlihat jelas, tanpa alur penahan.
- Mode samar: ikon dan nama aplikasi netral, kunci biometrik, layar tidak bisa di-screenshot.
- Janji tertulis dan permanen: data tidak dijual, tidak dipakai melatih model apa pun.

---

## 5. MEREK

**Nama: Cadensa.** Dipilih karena empat alasan yang saling menguatkan. Pertama, artinya
langsung berhubungan dengan inti produk — kadens, ritme, jarak antar ketukan. Kedua, terdengar
seperti aplikasi musik atau kebugaran, sehingga aman terlihat di layar kunci di ruang publik;
untuk kategori ini, kesamaran adalah fitur. Ketiga, bisa diucapkan sama di Indonesia, Amerika,
dan Eropa. Keempat, tersedia bersih di GitHub dan Vercel.

**Logo.** Cincin yang tersusun dari 21 ketukan. Ketukan-ketukan itu tidak sama tinggi — naik
turun seperti gelombang tenang, dan sisi kirinya sengaja terbuka sehingga membentuk huruf C.
Bacaannya berlapis: bagi orang luar itu ikon musik atau kesehatan; bagi pengguna itu bulan
mereka sendiri. Tidak ada bentuk anatomis, tidak ada warna merah medis, tidak ada ikon
kesehatan pria yang biasa dipakai.

**Palet.** Malam dalam (latar), teal tenang (aksen utama, ritme), amber lembut (perhatian,
bukan bahaya), pasir hangat (teks). Tidak ada merah kecuali untuk anjuran medis.

**Nada suara.** Seperti pelatih yang sudah lama kenal, bukan dokter dan bukan motivator.
Kalimat pendek. Tidak pernah memuji berlebihan, tidak pernah menghakimi. Tidak ada tanda seru.

---

## 6. MODEL BISNIS

**Gratis:** pencatatan tanpa batas, kalender ritme, metrik dasar. Selamanya. Alasannya
strategis: data kategori ini hanya terkumpul kalau pencatatan bebas hambatan.

**Cadensa Plus (langganan bulanan):** lapisan wawasan AI, sinyal psikologis, riwayat penuh,
ekspor untuk dibawa ke dokter, mode samar lanjutan.

**Jalur ketiga — laporan untuk dokter.** Sekali bayar, menghasilkan ringkasan medis rapi
untuk dibawa ke urolog. Ini jalur pendapatan dengan kesediaan bayar tertinggi karena muncul
tepat saat orang sedang cemas dan butuh.

**Yang tidak akan pernah dilakukan:** iklan, penjualan data, kemitraan dengan penjual
suplemen. Tiga hal ini masing-masing akan menghancurkan satu-satunya aset produk ini,
yaitu kepercayaan.

---

## 7. DISTRIBUSI

Karena jalur iklan berbayar tertutup, distribusi harus dirancang, bukan dibeli.

1. **Konten pencarian.** Ribuan pria mengetik pertanyaan ini ke Google tengah malam dan tidak
   menemukan apa pun selain forum. Menjadi jawaban yang benar untuk pertanyaan-pertanyaan itu
   adalah saluran akuisisi termurah yang tersedia.
2. **Web, bukan toko aplikasi.** Menghindari sensor rating konten sekaligus menghilangkan
   hambatan pasang. Aplikasi berbasis web yang bisa dipasang ke layar utama.
3. **Komunitas yang sudah ada dan sedang kecewa.** Forum kesehatan pria dan komunitas
   rebooting berisi orang-orang yang lelah dengan pendekatan rasa bersalah. Masuk sebagai
   lawan tesis, bukan sebagai iklan.
4. **Jalur dokter.** Urolog membutuhkan data kepatuhan pasien dan tidak punya alatnya. Fitur
   laporan dokter membuat mereka merekomendasikan produk ini tanpa dibayar.
5. **Laporan data agregat tahunan.** Karena tidak ada yang punya data ini, laporan agregat
   anonim tentang ritme pria adalah bahan berita yang akan diambil media secara gratis.
6. **Jalur pasangan.** Fase 2 membuat satu pengguna membawa satu pengguna lagi.

---

## 8. RISIKO YANG DIAKUI TERBUKA

| Risiko | Seberapa nyata | Sikap |
|---|---|---|
| Bukti 21× sering disalahpahami sebagai kausal | tinggi | Dinyatakan jujur di produk sebagai korelasi, bukan janji |
| Retensi jangka panjang rendah setelah kebiasaan terbentuk | tinggi | Lapisan psikologis dan pasangan adalah jawabannya |
| Rasa malu menghambat penyebaran dari mulut ke mulut | tinggi | Nama dan tampilan yang samar; berbagi bukan mekanisme utama |
| Salah diklasifikasi sebagai konten dewasa | sedang | Tanpa gambar, tanpa bahasa eksplisit, nada klinis-hangat |
| Kebocoran data | rendah tapi fatal | Enkripsi sisi klien sejak versi pertama, bukan ditambahkan nanti |
| Pesaing besar meniru | rendah | Pemain besar menghindari kategori ini justru karena stigmanya |

---

## 9. URUTAN EKSEKUSI 0 → MVP

**Tahap 1 — Fondasi.** Kerangka aplikasi, sistem desain, token warna dan tipografi, logo,
kerangka halaman.

**Tahap 2 — Halaman depan.** Halaman yang menjelaskan tesis dalam sepuluh detik, dengan
gerakan yang halus dan tidak berlebihan. Ini juga aset pemasaran utama.

**Tahap 3 — Inti pencatatan.** Alur catat di bawah 12 detik. Penyimpanan lokal dulu; ini
membuat aplikasi berguna bahkan sebelum ada akun.

**Tahap 4 — Ritme.** Kalender, Cadence Index, proyeksi, rentang kekosongan.

**Tahap 5 — Wawasan.** Lapisan analisis, aturan keamanan keluaran, kartu praktik.

**Tahap 6 — Akun dan enkripsi.** Baru di sini data meninggalkan perangkat, dan hanya dalam
bentuk terenkripsi.

**Tahap 7 — Sinyal psikologis.** Dibangun di atas data yang sudah terkumpul dari tahap 3–5.

**Tahap 8 — Pengerasan.** Kunci biometrik, mode samar, ekspor, hapus akun, aksesibilitas.

Definisi selesai untuk MVP: seorang pria bisa mendaftar, mencatat dalam belasan detik,
melihat ritmenya sebulan, menerima satu bacaan yang terasa benar tentang dirinya, dan yakin
tidak ada orang lain yang bisa membaca datanya.

---

## 10. TIGA PULUH ATURAN TIDAK TERTULIS YANG DIPAKAI DI PROYEK INI

1. Rasa malu adalah biaya nyata; setiap layar harus aman dilihat orang lain.
2. Waktu pencatatan adalah metrik produk, bukan detail teknis.
3. Streak yang patah membuat orang berhenti; jangan pakai streak.
4. Angka target hanya boleh muncul sebagai wilayah, tidak pernah sebagai garis.
5. Bahasa yang menghakimi mengusir pengguna yang paling membutuhkan.
6. Satu saran lebih berguna daripada tiga.
7. Aplikasi harus berguna sebelum pengguna membuat akun.
8. Fitur privasi yang tidak terlihat sama saja tidak ada; tunjukkan.
9. Tombol hapus akun tidak boleh punya alur penahan.
10. Kalau tidak yakin apakah suatu bukti kuat, tulis ketidakpastiannya.
11. Jangan pernah mengarang manfaat untuk melengkapi simetri produk.
12. Jalur medis dan jalur kebiasaan tidak boleh bercampur dalam satu pesan.
13. Nada suara adalah fitur, dan harus punya pemiliknya.
14. Animasi yang menarik perhatian ke dirinya sendiri adalah animasi yang gagal.
15. Setiap gerakan harus punya alasan; kalau tidak ada, hapus.
16. Kepadatan informasi kalah penting dibanding rasa aman.
17. Warna merah dicadangkan untuk satu makna saja.
18. Kosakata baru yang dipakai konsisten akan menjadi milik merek.
19. Kategori bisu dimenangkan oleh yang pertama berani menamai.
20. Distribusi harus dirancang sejak hari pertama kalau iklan tertutup.
21. Pendapatan tertinggi datang saat orang sedang cemas dan butuh, bukan saat sedang senang.
22. Menjual data di kategori ini adalah bunuh diri, bukan pilihan strategis.
23. Pengguna yang tidak percaya tidak akan mencatat jujur, dan data tidak jujur tidak berguna.
24. Ukur kejujuran pencatatan, bukan hanya jumlah pencatatan.
25. Pesaing sesungguhnya bukan aplikasi lain, tapi tidak mencatat sama sekali.
26. Produk yang menuduh penggunanya akan ditinggalkan diam-diam, tanpa keluhan.
27. Retensi datang dari wawasan yang terasa personal, bukan dari notifikasi.
28. Notifikasi di kategori ini harus bisa dimatikan total tanpa mengurangi nilai produk.
29. Kalau sebuah fitur hanya bisa dijelaskan dengan istilah teknis, fitur itu belum selesai.
30. Yang membuat produk ini bertahan bukan idenya, tapi kesabaran menjaga nadanya.

---

## 11. UKURAN KEBERHASILAN

- Waktu pencatatan rata-rata di bawah 12 detik.
- Lebih dari separuh pengguna baru mencatat kedua kalinya dalam tujuh hari.
- Kelengkapan isian opsional di atas 40 persen — penanda kepercayaan.
- Lebih dari sepertiga pengguna aktif membuka halaman wawasan mingguan.
- Nol kejadian keamanan. Ini bukan target, ini syarat hidup.

---

## 12. KEPUTUSAN YANG DIAMBIL SETELAH MVP PERTAMA BERJALAN

Bagian ini ditulis belakangan, setelah versi pertama dipakai orang. Isinya keputusan yang
tidak terlihat dari perencanaan awal dan baru muncul karena ada yang memakainya.

### 12.1 Penyimpanan lokal saja adalah cacat, bukan kemurnian

Laporan pertama yang masuk bukan tentang fitur, melainkan tentang catatan yang hilang. Itu
bukan kejadian langka: penyimpanan peramban dibersihkan sistem saat ruang menipis, dihapus
bersama riwayat, dan hilang total di mode penyamaran. Untuk aplikasi kebiasaan yang nilainya
justru tumbuh dari riwayat panjang, kehilangan riwayat berarti kehilangan produknya.

Jawabannya bukan memilih antara privasi dan keandalan, karena keduanya bisa dipenuhi
sekaligus. Yang dipilih adalah **brankas terenkripsi ujung-ke-ujung**:

- Kunci data dibuat acak sekali saat mendaftar, lalu dibungkus dengan kunci turunan PBKDF2
  dari kata sandi. Ganti kata sandi karena itu cukup membungkus ulang, bukan mengenkripsi
  ulang seluruh riwayat — dan itu menghapus satu kelas kegagalan yang biasanya merusak data
  di tengah proses.
- Kata sandi asli tidak pernah dikirim. Yang dikirim turunan PBKDF2 dengan info berbeda,
  yang di server di-hash lagi dengan scrypt.
- Kunci ditahan di `sessionStorage`, bukan `localStorage`. Menutup tab mengakhiri sesi
  kriptografisnya, sehingga perangkat yang dipinjam tidak membocorkan isi brankas.

**Harga yang diterima dengan sadar:** tidak ada pemulihan kata sandi. Ini disebut
terang-terangan di halaman privasi dan saat mendaftar, karena alur pemulihan yang benar-benar
bekerja berarti kami bisa membaca isinya — dan itu membatalkan seluruh premis produk.
Penggantinya kunci pemulihan sekali tampil dan berkas cadangan yang bisa dipegang sendiri.

Aturan tambahan yang lahir dari sini: **31. Data yang bisa hilang diam-diam sama saja dengan
data yang tidak pernah dicatat.**

### 12.2 Mode perempuan bukan mode pria dengan kata ganti yang diganti

Godaan terbesarnya adalah memakai ulang seluruh mesin dan hanya mengganti label. Itu ditolak
karena satu alasan yang tidak bisa ditawar: angka 21 berasal dari penelitian tentang prostat.
Memindahkannya ke tubuh yang tidak punya prostat akan menjadi klaim kesehatan tanpa dasar,
dan produk yang mengarang satu angka akan kehilangan hak untuk dipercaya soal angka lainnya.

Yang dipakai sebagai gantinya adalah pertanyaan yang memang punya jawaban: apakah dorongan
naik dan turun mengikuti siklus, dan apakah polanya berulang. Karena itu mode perempuan punya
metriknya sendiri — **keterikatan siklus** menggantikan pita bulanan, dan sebaran dihitung per
hari fase, bukan per total, karena panjang tiap fase berbeda dan membandingkan totalnya akan
menyesatkan. Katalog alat, mesin bacaan, dan halaman ritmenya ikut menyesuaikan.

Aturan tambahan: **32. Kalau sebuah angka tidak punya dasar untuk satu kelompok pengguna,
jangan pindahkan angkanya — pindahkan pertanyaannya.**

### 12.3 Katalog alat yang rinci adalah fitur medis, bukan fitur kelengkapan

Awalnya "alat bantu" hanyalah satu pilihan. Itu membuang informasi yang justru paling
menjelaskan: gesekan, tekanan, dan bahan tiap jenis berbeda jauh, dan perbedaan itulah yang
menjelaskan kenapa keluhan fisik muncul pada sebagian orang saja. Tanpa rincian, keluhan yang
sebenarnya berasal dari satu alat akan dijawab dengan saran mengubah kebiasaan — salah alamat,
dan merusak kepercayaan.

Karena itu katalognya dikelompokkan, tiap jenis membawa perkiraan intensitas dan catatan
perawatannya sendiri, dan mesin bacaan bisa memisahkan keluhan yang berasal dari alat dari
keluhan yang berasal dari pola.

**Ikonnya digambar sebagai garis vektor, bukan berkas gambar.** Alasannya berlapis: tajam di
layar mana pun tanpa menambah unduhan, ikut warna tema — dan yang paling menentukan, tidak ada
berkas gambar yang tersimpan di perangkat atau singgah di riwayat unduhan. Bentuknya sengaja
abstrak: cukup untuk dikenali pemakainya, tidak cukup untuk dipahami orang yang melirik dari
samping. Ini penerapan langsung dari aturan nomor 1.

Aturan tambahan: **33. Rincian yang tidak mengubah saran adalah beban; rincian yang mengubah
saran adalah kewajiban.**
