/**
 * Terjemahan Inggris, berkunci kalimat Indonesia aslinya.
 *
 * Dua aturan yang dipegang saat menulis isinya, dan keduanya berasal dari
 * pendirian produk ini, bukan dari selera:
 *
 *  1. Nada yang sama. Bahasa Indonesia di aplikasi ini sengaja tidak menghakimi
 *     dan tidak memakai kata bermuatan moral. Inggris yang licin dan penuh
 *     semangat pemasaran akan mengkhianati itu, sekalipun artinya tepat.
 *     "Sesimu hampir selalu singkat" menjadi "Your sessions are almost always
 *     short", bukan "Speed up your results!".
 *
 *  2. Istilah medis tidak dilembutkan. "Ngilu, perih, atau nyeri" tetap keluar
 *     sebagai "aching, stinging, or pain". Melembutkannya di bahasa kedua akan
 *     membuat jalur medis kehilangan gunanya justru bagi pembaca yang paling
 *     mungkin melewatkan tanda itu.
 *
 * `{...}` adalah tempat nilai disisipkan dan harus tetap ada. Nama di dalamnya
 * tidak boleh diterjemahkan.
 */
export const EN: Record<string, string> = {
  /* ── Navigasi & status ─────────────────────────────────────────────────── */
  Catat: "Log",
  Ritme: "Rhythm",
  Bacaan: "Readings",
  Pengaturan: "Settings",
  Masuk: "Sign in",
  Keluar: "Sign out",
  "Buka brankas": "Unlock vault",
  "Menu akun": "Account menu",
  "Cadensa, beranda": "Cadensa, home",
  "Masuk sebagai {nama}": "Signed in as {nama}",
  "Pengaturan & cadangan": "Settings & backup",
  "Kuncinya hilang saat tab ditutup": "The key is discarded when the tab closes",
  "Tersimpan di perangkat": "Saved on this device",
  "Menyiapkan brankas": "Preparing vault",
  Menyimpan: "Saving",
  "Tersimpan & tersinkron": "Saved & synced",
  "Brankas terkunci": "Vault locked",
  "Gagal menyimpan": "Save failed",
  "Ganti bahasa": "Change language",

  /* ── Halaman masuk ─────────────────────────────────────────────────────── */
  Brankas: "Vault",
  "Buat akun": "Create account",
  "Buka dengan kunci pemulihan": "Unlock with recovery key",
  masuk: "sign in",
  daftar: "register",
  pemulihan: "recovery",
  "Akun dipakai untuk satu hal saja: memindahkan catatanmu antar perangkat tanpa kehilangan. Isinya dikunci di sini dulu, jadi yang tersimpan di server adalah teks acak.":
    "An account does exactly one thing: it moves your entries between devices without losing any. The contents are locked here first, so what the server stores is random text.",
  "Sesi kriptografismu berakhir saat tab ditutup. Masukkan kata sandi lagi untuk membuka brankas.":
    "Your cryptographic session ended when the tab closed. Enter your password again to unlock the vault.",
  "Nama pengguna atau email": "Username or email",
  "Kata sandi": "Password",
  "Nama pengguna": "Username",
  Email: "Email",
  "Kata sandi (minimal 10 karakter)": "Password (at least 10 characters)",
  "Ulangi kata sandi": "Repeat password",
  "Mode pencatatan — bisa diubah kapan saja": "Logging mode — changeable at any time",
  pria: "male",
  wanita: "female",
  "{n} catatan yang sudah ada di perangkat ini ikut terangkat ke akun barumu.":
    "{n} entries already on this device will be carried into your new account.",
  "Tempel kunci pemulihan yang kamu simpan saat mendaftar. Ini membuka brankas tanpa kata sandi.":
    "Paste the recovery key you saved when you registered. It unlocks the vault without a password.",
  "Kunci pemulihan": "Recovery key",
  "Sebentar…": "One moment…",
  "Ada yang tidak beres.": "Something went wrong.",
  "Kata sandi minimal 10 karakter. Ini kunci satu-satunya.":
    "Password must be at least 10 characters. It is the only key there is.",
  "Ulangan kata sandi belum sama.": "The repeated password does not match yet.",
  "Masuk dengan Google": "Sign in with Google",
  Segera: "Soon",
  "Belum tersedia": "Not available yet",
  "Google tidak memberi kami kata sandi, padahal kunci brankasmu diturunkan dari kata sandi. Jadi masuk lewat Google tetap butuh satu kata sandi terpisah untuk membuka brankas — dan kami belum mau memasangnya sebelum alurnya tidak membingungkan.":
    "Google never hands us a password, and your vault key is derived from one. So signing in through Google would still require a separate password to unlock the vault — and we would rather not ship that until the flow stops being confusing.",

  /* ── Kunci pemulihan ───────────────────────────────────────────────────── */
  "Sekali tampil": "Shown once",
  "Simpan kunci pemulihan": "Save your recovery key",
  "Catatanmu dikunci di perangkat ini sebelum dikirim, dan kuncinya diturunkan dari kata sandimu. Itu berarti kami tidak bisa membukanya untukmu — termasuk kalau kata sandinya lupa. Baris di bawah ini adalah satu-satunya jalan masuk cadangan.":
    "Your entries are locked on this device before they are sent, and the key is derived from your password. That means we cannot open them for you — not even if you forget it. The line below is the only backup way in.",
  Salin: "Copy",
  "Unduh berkas": "Download file",
  "Sudah saya simpan": "I have saved it",
  "Kamu sudah masuk sebagai {nama}": "You are signed in as {nama}",
  "Brankasmu terbuka dan catatanmu tersinkron.": "Your vault is open and your entries are synced.",
  "Lihat ritme": "View rhythm",

  /* ── Halaman bacaan ────────────────────────────────────────────────────── */
  "Dihitung di perangkat ini": "Computed on this device",
  "Semua di halaman ini dihitung dari catatan yang tersimpan di peramban ini. Tidak ada satu pun permintaan jaringan yang membawa isinya keluar.":
    "Everything on this page is computed from entries stored in this browser. Not one network request carries their contents out.",
  "Perlu diperiksa": "Worth checking",
  "Yang tubuhmu tunjukkan": "What your body is showing",
  Praktik: "Practice",
  "Satu langkah": "One step",
  "Keterikatan siklus": "Cycle coupling",
  "Fase puncak": "Peak phase",
  "Bulan ini": "This month",
  "Rasa positif": "Positive feeling",
  "Kekosongan terpanjang": "Longest gap",
  "Durasi tengah": "Median duration",
  catatan: "entries",
  hari: "days",
  "Pola baru muncul setelah beberapa catatan. Tiga adalah batas paling awal di mana angka apa pun masih berarti sesuatu.":
    "Patterns only appear after a few entries. Three is the earliest point at which any number still means anything.",
  "Belum ada pola yang cukup jelas untuk dituliskan. Itu bukan kabar buruk — artinya tidak ada yang menonjol dari ritmemu belakangan ini.":
    "No pattern is clear enough to write down yet. That is not bad news — it means nothing stands out in your rhythm lately.",
  "Muat data contoh": "Load sample data",
  "Cadensa bukan alat diagnosis dan tidak menggantikan pemeriksaan. Kalau ada nyeri berulang, darah, atau keluhan yang menetap, temui dokter.":
    "Cadensa is not a diagnostic tool and does not replace an examination. If there is recurring pain, blood, or a complaint that persists, see a doctor.",

  /* ── Fase siklus ───────────────────────────────────────────────────────── */
  haid: "menstruation",
  folikular: "follicular",
  ovulasi: "ovulation",
  luteal: "luteal",
  "Hari-hari haid. Sebagian orang justru merasa lebih lega, sebagian lain tidak berminat sama sekali. Keduanya lumrah.":
    "The menstrual days. Some people feel more relief than usual, others have no interest at all. Both are ordinary.",
  "Setelah haid selesai. Tenaga biasanya naik pelan-pelan.":
    "After menstruation ends. Energy usually rises slowly.",
  "Sekitar pelepasan sel telur. Di banyak catatan, ini titik dorongan tertinggi.":
    "Around ovulation. In many records, this is the point of strongest drive.",
  "Menjelang haid berikutnya. Suasana hati lebih mudah bergeser, dan dorongan bisa ikut bergeser.":
    "Ahead of the next period. Mood shifts more easily, and drive can shift with it.",

  /* ── Mesin bacaan: jalur medis ─────────────────────────────────────────── */
  "Keluhan fisik berulang": "Recurring physical complaints",
  "Dalam 30 hari terakhir kamu mencatat rasa ngilu, perih, atau nyeri sebanyak {n} kali. Rasa sesekali setelah sesi panjang itu wajar; yang berulang seperti ini tidak masuk kategori itu.":
    "Over the last 30 days you logged aching, stinging, or pain {n} times. The occasional soreness after a long session is normal; something this recurrent is not in that category.",
  "Bawa ringkasan ini ke dokter atau urolog. Ini bukan hal yang diselesaikan dengan mengubah teknik.":
    "Take this summary to a doctor or urologist. This is not something a change of technique resolves.",

  /* ── Mesin bacaan: ritme ───────────────────────────────────────────────── */
  "Bulan ini berjalan lebih lambat": "This month is running slower",
  "Sampai hari ini ada {n} catatan, dan dengan laju yang sama bulan ini akan berhenti di sekitar {proyeksi}. Itu di bawah pita yang biasanya dikaitkan dengan kesehatan prostat yang lebih baik.":
    "So far there are {n} entries, and at the same pace this month would land near {proyeksi}. That is below the band usually associated with better prostate health.",
  "Tidak perlu mengejar angka. Cukup perhatikan apakah penurunannya datang dari lelah, stres, atau memang tidak ada dorongan.":
    "There is no number to chase. Just notice whether the drop comes from tiredness, stress, or simply no drive.",
  "Bulan ini lebih padat dari biasanya": "This month is busier than usual",
  "Laju saat ini mengarah ke sekitar {proyeksi} kejadian bulan ini, di atas pita biasa. Padat sendiri bukan masalah selama rasa sesudahnya tetap enak.":
    "The current pace points to about {proyeksi} occurrences this month, above the usual band. Being busy is not itself a problem as long as how you feel afterwards stays good.",
  "Cek halaman ritme: kalau rasa sesudahnya mulai bergeser ke netral atau hampa, itu penanda yang lebih berarti daripada jumlahnya.":
    "Check the rhythm page: if the after-feeling starts drifting toward neutral or hollow, that matters more than the count.",
  "Jaraknya tidak merata": "The spacing is uneven",
  "Indeks kadensmu {ci} dari 100. Jumlahnya mungkin sudah cukup, tapi tersebar tidak rata — sebagian menumpuk, sebagian kosong panjang. {alasan}":
    "Your cadence index is {ci} out of 100. The count may well be enough, but it is spread unevenly — some of it clustered, some of it long and empty. {alasan}",
  "Ambil satu hari tetap dalam seminggu yang biasanya kosong, dan biarkan itu jadi jangkar ritmemu.":
    "Pick one fixed day a week that is usually empty, and let it become the anchor of your rhythm.",
  "Kekosongan {n} hari": "A {n}-day gap",
  "Ini rentang terpanjang dalam sebulan terakhir. Kalau penyebabnya sakit atau bepergian, tidak ada yang perlu dibaca dari sini.":
    "This is the longest stretch in the past month. If the cause was illness or travel, there is nothing to read into it.",
  "Kalau bukan keduanya, biasanya yang menahan bukan tubuh tapi beban pikiran. Catat satu alasan di entri berikutnya.":
    "If it was neither, what holds it back is usually not the body but what is on your mind. Note one reason in your next entry.",
  "Ritme yang merata lebih mudah dibaca sebagai pola, dan pola itulah yang membuat pergeseran suasana hati bisa terlihat sejak awal.":
    "An even rhythm is easier to read as a pattern, and it is the pattern that makes a shift in mood visible early.",
  "Yang berhubungan dengan kesehatan prostat adalah keteraturannya, bukan totalnya.":
    "What relates to prostate health is the regularity, not the total.",

  /* ── Mesin bacaan: sinyal ──────────────────────────────────────────────── */
  "Yang tubuhmu tunjukkan dua minggu ini": "What your body has shown these two weeks",
  "Frekuensimu naik dibanding dua minggu sebelumnya, tapi durasinya justru memendek — dari sekitar {sebelum} ke {sekarang} — dan beberapa kali kamu menandai alasannya stres atau bosan. Pola cepat dan sering seperti ini biasanya bukan soal gairah, tapi cara tubuh menurunkan tekanan.":
    "Your frequency rose compared with the two weeks before, but the duration shortened — from around {sebelum} to {sekarang} — and several times you marked the reason as stress or boredom. A fast, frequent pattern like this is usually not about desire but about the body lowering pressure.",
  "Lihat ke belakang dua minggu ini: ada satu hal yang sedang menekan. Itu yang perlu diurus, bukan kebiasaannya.":
    "Look back over these two weeks: something is pressing. That is what needs attention, not the habit.",
  "Rasa sesudahnya mendatar": "The after-feeling has flattened",
  "Hanya {sekarang} catatan bulan ini yang kamu tandai lega atau nikmat{turun}, dan ada kekosongan {jeda} hari di dalamnya. Kombinasi jarang dan datar biasanya bukan soal libido.":
    "Only {sekarang} of this month's entries were marked relieved or pleasurable{turun}, and there is a {jeda}-day gap inside it. Infrequent and flat together is usually not about libido.",
  ", turun dari {sebelum} pada periode sebelumnya": ", down from {sebelum} in the prior period",
  "Perhatikan apakah hal lain yang biasanya kamu nikmati juga terasa tawar belakangan ini. Kalau iya, itu layak dibicarakan dengan seseorang.":
    "Notice whether other things you normally enjoy have also gone bland lately. If so, that is worth talking through with someone.",
  "Jamnya bergeser ke dini hari": "The hours have shifted into the small hours",
  "{bagian} kejadian dua minggu ini jatuh antara pukul 23.00 dan 04.00{naik}. Pola larut malam yang menetap lebih sering berhubungan dengan susah tidur daripada dengan dorongan seksual.":
    "{bagian} of the past two weeks' occurrences fell between 11pm and 4am{naik}. A late-night pattern that settles in relates more often to trouble sleeping than to sexual drive.",
  ", naik jelas dibanding dua minggu sebelumnya": ", clearly up from the two weeks before",
  "Coba geser satu sesi ke sore atau pagi minggu ini, lalu lihat apakah tidurmu ikut berubah.":
    "Try moving one session to the afternoon or morning this week, then see whether your sleep moves with it.",
  "Sering, tapi jarang terasa lega": "Frequent, but rarely a relief",
  "Ada {n} catatan dalam 30 hari, dan hanya {bagian} yang kamu tandai lega atau nikmat. Yang menarik di sini bukan jumlahnya — jumlah tinggi yang tetap terasa enak bukan masalah. Yang terbaca adalah jaraknya dengan rasa lega.":
    "There are {n} entries across 30 days, and only {bagian} were marked relieved or pleasurable. What stands out is not the count — a high count that still feels good is not a problem. What reads here is the distance from relief.",
  "Kalau pola ini bertahan beberapa minggu lagi, satu sesi bicara dengan psikolog akan lebih menjawab daripada mengubah teknik.":
    "If this holds for a few more weeks, one conversation with a psychologist will answer more than any change of technique.",

  /* ── Mesin bacaan: praktik ─────────────────────────────────────────────── */
  "Edging panjang berujung ngilu": "Long edging ends in aching",
  "Dari {n} sesi dengan edging lama bulan ini, {sakit} berakhir dengan ngilu, perih, atau nyeri. Sesi pendek dan sedangmu hampir tidak pernah begitu.":
    "Of {n} sessions with long edging this month, {sakit} ended in aching, stinging, or pain. Your short and moderate sessions almost never do.",
  "Potong siklus edging di tiga, bukan lima. Kebanyakan keluhan hilang di angka itu.":
    "Cut the edging cycles at three rather than five. Most complaints disappear at that number.",
  "Perih yang datang dari gesekan": "Stinging that comes from friction",
  "Rasa perih muncul di {sakit} dari {n} sesi tanpa pelumas bulan ini, dan hampir tidak pernah di sesi yang memakai pelumas.":
    "Stinging appeared in {sakit} of {n} unlubricated sessions this month, and almost never in sessions that used lubricant.",
  "Pakai pelumas berbahan air untuk beberapa sesi berikutnya, lalu bandingkan catatannya.":
    "Use a water-based lubricant for the next few sessions, then compare the entries.",
  "Beban edging bulan ini tinggi": "Edging load is high this month",
  "Akumulasi edgingmu bulan ini ada di angka {beban} dan sejauh ini tubuhmu masih menerimanya tanpa keluhan.":
    "Your accumulated edging this month sits at {beban}, and so far your body has taken it without complaint.",
  "Simpan saja sebagai catatan: kalau mulai muncul ngilu, angka inilah yang pertama diturunkan.":
    "Just keep it in mind: if aching starts to appear, this is the first number to bring down.",
  "Sesimu hampir selalu singkat": "Your sessions are almost always short",
  "Durasi tengahmu bulan ini sekitar {durasi}. Cepat tidak selalu berarti buruk, tapi kalau yang kamu cari rasa lega, tempo seperti ini jarang sampai ke sana.":
    "Your median duration this month is about {durasi}. Fast is not automatically worse, but if relief is what you are after, this tempo rarely gets there.",
  "Sekali minggu ini, tunda sepuluh menit sebelum mulai dan lihat apakah rasa sesudahnya berbeda.":
    "Once this week, wait ten minutes before starting and see whether the after-feeling differs.",

  /* ── Mesin bacaan: alat bantu ──────────────────────────────────────────── */
  "{alat} lebih sering berujung keluhan": "{alat} more often ends in complaints",
  "Dari {n} sesi dengan {alat} dalam dua bulan terakhir, {sakit} berakhir dengan ngilu, perih, nyeri, atau kebas. Alat lain yang kamu pakai tidak menunjukkan pola yang sama.":
    "Of {n} sessions with {alat} over the last two months, {sakit} ended in aching, stinging, pain, or numbness. The other devices you use do not show the same pattern.",
  "Hampir semuanya lewat {alat}": "Almost everything goes through {alat}",
  "{bagian}% sesi beralatmu memakai satu alat yang rangsangannya termasuk kuat. Tubuh menyesuaikan diri dengan rangsangan yang selalu sama, dan yang lebih lembut lama-lama terasa kurang.":
    "{bagian}% of your device sessions use one device whose stimulation is on the strong side. The body adapts to stimulation that never varies, and gentler things gradually start to feel like less.",
  "Selingi dengan cara yang lebih pelan beberapa kali, supaya rentang kepekaannya tidak menyempit ke satu titik.":
    "Alternate with something slower a few times, so the range of sensitivity does not narrow to a single point.",
  "{alat} tanpa pelumas": "{alat} without lubricant",
  "Sebagian besar sesimu dengan alat ini tercatat tanpa pelumas, dan keluhan fisik muncul di {bagian}% di antaranya.":
    "Most of your sessions with this device are logged without lubricant, and physical complaints appear in {bagian}% of them.",
  "Pakai pelumas berbasis air. Bahan silikon dan minyak bisa merusak permukaan alat berbahan silikon atau TPE.":
    "Use a water-based lubricant. Silicone and oil bases can damage the surface of silicone or TPE devices.",

  /* ── Mesin bacaan: siklus ──────────────────────────────────────────────── */
  "Siklusnya belum diketahui": "The cycle is not known yet",
  "Tanpa tanggal haid terakhir, catatanmu hanya bisa dibaca sebagai deret tanggal biasa. Dengan tanggal itu, pola yang berulang tiap bulan mulai kelihatan.":
    "Without the date of your last period, your entries can only be read as a plain series of dates. With it, the pattern that repeats each month starts to become visible.",
  "Isi tanggal hari pertama haid terakhir di halaman pengaturan. Satu isian, sekali saja.":
    "Enter the first day of your last period on the settings page. One field, once.",
  "Doronganmu memuncak di fase {fase}": "Your drive peaks in the {fase} phase",
  "Keterikatan siklusmu {n} dari 100, dan puncaknya jatuh di fase {fase}. {catatan}":
    "Your cycle coupling is {n} out of 100, and the peak falls in the {fase} phase. {catatan}",
  "Kalau ada minggu yang bisa kamu atur sendiri, letakkan yang menuntut tenaga di luar fase ini.":
    "If there is a week you get to arrange yourself, put the demanding things outside this phase.",
  "Polamu hampir tidak mengikuti siklus": "Your pattern barely follows the cycle",
  "Keterikatan siklusmu hanya {n} dari 100 — sebarannya cukup rata di semua fase. Ini bukan kelainan; pada sebagian orang dorongan memang lebih ditentukan keadaan sehari-hari daripada hormon.":
    "Your cycle coupling is only {n} out of 100 — the spread is fairly even across every phase. This is not a disorder; for some people drive really is set more by daily circumstances than by hormones.",
  "Coba lihat pemicu yang kamu catat. Untuk pola seperti ini, itu biasanya lebih menjelaskan daripada tanggal.":
    "Look at the triggers you logged. For a pattern like this, they usually explain more than the dates do.",
  "Fase luteal terasa berbeda": "The luteal phase feels different",
  "Di minggu-minggu menjelang haid, hanya {luteal} catatanmu terasa lega atau nikmat, dibanding {lain} di fase lain. Pergeseran suasana hati di fase ini lumrah, dan catatanmu menunjukkannya dengan jelas.":
    "In the weeks before your period, only {luteal} of your entries felt relieved or pleasurable, against {lain} in the other phases. A shift in mood during this phase is ordinary, and your entries show it clearly.",
  "Perlakukan minggu itu sebagai minggu yang butuh lebih banyak istirahat, bukan sebagai minggu yang gagal.":
    "Treat that week as one that needs more rest, not as one that failed.",
  "Haid diperkirakan mulai besok": "Your period is expected to start tomorrow",
  "Perkiraan haid {n} hari lagi": "Period expected in {n} days",
  "Perkiraan ini dihitung dari panjang siklus yang kamu isi, bukan dari pengamatan tubuh. Meleset beberapa hari itu biasa.":
    "This estimate is calculated from the cycle length you entered, not from anything observed in your body. Being off by a few days is normal.",
  "Perbarui tanggal haid terakhir begitu mulai, supaya perkiraan berikutnya ikut membaik.":
    "Update the last period date as soon as it starts, so the next estimate improves with it.",

  /* ── Satuan ────────────────────────────────────────────────────────────── */
  "{n} menit": "{n} min",

  /* ── Halaman ritme ─────────────────────────────────────────────────────── */
  "Sebulan digambar melingkar karena deret lurus punya garis akhir, dan garis akhir membuat orang mengejar angka. Yang penting bukan totalnya, melainkan jaraknya — dan jarak paling mudah dilihat sebagai celah. {alasan}":
    "A month is drawn as a circle because a straight line has a finish, and a finish makes people chase a number. What matters is not the total but the spacing — and spacing is easiest to see as a gap. {alasan}",
  "Terasa lega atau nikmat": "Felt relieved or pleasurable",
  Netral: "Neutral",
  "Hampa, menyesal, atau lelah": "Hollow, regretful, or tired",
  "Tidak ada catatan": "No entry",
  "{n} catatan · laju saat ini mengarah ke sekitar {proyeksi}":
    "{n} entries · current pace points to about {proyeksi}",
  "{n} catatan": "{n} entries",
  Sebelumnya: "Previous",
  Berikutnya: "Next",
  "{n} bulan ini": "{n} this month",
  "catatan di hari ke-{hari}": "entries on day {hari}",
  "Belum ada apa-apa di sini": "Nothing here yet",
  "Ritme baru terbaca setelah beberapa catatan. Kalau ingin melihat bentuk halaman ini lebih dulu, muat data contoh — semuanya tetap tinggal di perangkat ini dan bisa dihapus kapan saja.":
    "A rhythm only becomes readable after a few entries. If you want to see the shape of this page first, load the sample data — all of it stays on this device and can be deleted at any time.",
  "Catat yang pertama": "Log your first",
  pita: "band",
  "arahkan kursor ke satu jari-jari": "hover a spoke",
  "Urutan harian": "Daily sequence",
  "{n} hari": "{n} days",
  "Kemerataan jarak antar kejadian 30 hari terakhir. Bukan jumlah.":
    "How evenly spaced the last 30 days are. Not the count.",
  "Butuh tanggal haid terakhir dan minimal delapan catatan.":
    "Needs a last period date and at least eight entries.",
  "Seberapa terpusat doronganmu di satu fase. Puncaknya di fase {fase}.":
    "How concentrated your drive is in one phase. It peaks in the {fase} phase.",
  "Pita bulan ini": "Band this month",
  dalam: "inside",
  sepi: "quiet",
  padat: "busy",
  "Wilayah {rendah}–{tinggi}, digambar sebagai koridor bukan garis.":
    "The {rendah}–{tinggi} region, drawn as a corridor rather than a line.",
  "Rentang terpanjang tanpa catatan dalam sebulan terakhir.":
    "The longest stretch without an entry in the past month.",
  "Rasa yang enak": "Felt good",
  "Bagian catatan bulan ini yang ditandai lega atau nikmat.":
    "The share of this month's entries marked relieved or pleasurable.",
  "Sebaran per fase siklus": "Spread across cycle phases",
  "Dihitung per hari fase, bukan per total, karena panjang tiap fase berbeda.":
    "Counted per day of each phase rather than per total, because the phases differ in length.",
  "Isi tanggal haid terakhir di": "Enter your last period date in",
  pengaturan: "settings",
  "supaya catatanmu bisa dibaca terhadap fase siklus, bukan sekadar terhadap tanggal.":
    "so your entries can be read against cycle phases rather than merely against dates.",
  "Beban edging bulan ini:": "Edging load this month:",
  "Baca apa yang terbaca dari pola ini": "Read what this pattern shows",
  "Terakhir dicatat": "Recently logged",
  "durasi tidak dicatat": "duration not logged",
  edging: "edging",
  "Hapus catatan ini": "Delete this entry",
  hapus: "delete",
  "Ganti dengan data contoh": "Replace with sample data",
  "Ganti {n} catatanmu dengan data contoh? Catatan aslinya tidak bisa dikembalikan.":
    "Replace your {n} entries with sample data? The originals cannot be brought back.",
  "Hapus semua catatan di perangkat ini? Tidak ada salinan lain.":
    "Delete every entry on this device? There is no other copy.",
  "Hapus semua": "Delete all",

  /* ── Bulan ─────────────────────────────────────────────────────────────── */
  Januari: "January",
  Februari: "February",
  Maret: "March",
  April: "April",
  Mei: "May",
  Juni: "June",
  Juli: "July",
  Agustus: "August",
  September: "September",
  Oktober: "October",
  November: "November",
  Desember: "December",

  /* ── Kosakata catatan ──────────────────────────────────────────────────── */
  tangan: "hand",
  pelumas: "lubricant",
  "alat bantu": "device",
  "hubungan seksual": "sex",
  tidak: "none",
  ringan: "light",
  lama: "long",
  "dorongan alami": "natural drive",
  stres: "stress",
  bosan: "boredom",
  "kebiasaan jam segini": "habit at this hour",
  "rangsangan visual": "visual stimulation",
  "keintiman pasangan": "intimacy with a partner",
  "susah tidur": "trouble sleeping",
  kesepian: "loneliness",
  "tidak pakai": "none used",
  "berbasis air": "water-based",
  "berbasis silikon": "silicone-based",
  "berbasis minyak": "oil-based",
  hibrida: "hybrid",
  lega: "relieved",
  nikmat: "pleasurable",
  tenang: "calm",
  netral: "neutral",
  lelah: "tired",
  hampa: "hollow",
  menyesal: "regretful",
  ngilu: "aching",
  perih: "stinging",
  nyeri: "pain",
  kebas: "numb",

  /* ── Nama alat ─────────────────────────────────────────────────────────── */
  "Vibrator batang": "Wand vibrator",
  "Vibrator peluru": "Bullet vibrator",
  "Vibrator klitoris": "Clitoral vibrator",
  Rabbit: "Rabbit",
  "Wand / massager": "Wand / massager",
  "Pemijat prostat": "Prostate massager",
  Plug: "Plug",
  "Sucker / penyedot": "Suction toy",
  "Air-pulse klitoris": "Clitoral air-pulse",
  "Stroker otomatis": "Automatic stroker",
  "Pompa vakum": "Vacuum pump",
  Onahole: "Onahole",
  "Sleeve ujung terbuka": "Open-ended sleeve",
  "Sleeve ujung tertutup": "Closed-ended sleeve",
  "Sleeve bergetar": "Vibrating sleeve",
  "Hip / half body": "Hip / half body",
  "Full body silikon": "Full-body silicone",
  "Full body TPE": "Full-body TPE",
  Torso: "Torso",
  "Cincin penis": "Cock ring",
  "Cincin bergetar": "Vibrating ring",
  Dildo: "Dildo",
  "Bola kegel": "Kegel balls",
  "Pancuran / air": "Shower / water",
  Lainnya: "Other",

  /*
    Anjuran perawatan. Ini keluar sebagai `action` pada bacaan alat, jadi
    kalimatnya harus tetap berupa instruksi yang bisa dikerjakan — bukan
    keterangan. Batas waktu dan larangan bahan tidak dilembutkan: itu bagian
    yang paling menentukan aman-tidaknya, dan justru paling mudah hilang kalau
    diterjemahkan seadanya.
  */
  "Cuci air hangat sabun lembut, keringkan sebelum disimpan.":
    "Wash with warm water and mild soap, and dry it before storing.",
  "Lepas baterai kalau lama tidak dipakai.": "Take the batteries out if it goes unused for a while.",
  "Bersihkan tiap pakai, hindari rendam kalau tidak tahan air.":
    "Clean after every use, and do not submerge it unless it is waterproof.",
  "Silikon: jangan dipasangkan dengan pelumas silikon.":
    "Silicone: do not pair it with a silicone lubricant.",
  "Intensitas tinggi — beri jeda kalau area mulai kebas.":
    "High intensity — pause if the area starts going numb.",
  "Wajib pelumas berbasis air dan alas melebar. Jangan tanpa pelumas.":
    "A water-based lubricant and a flared base are required. Never without lubricant.",
  "Hanya yang beralas lebar. Naikkan ukuran perlahan.":
    "Only ones with a wide base. Increase the size gradually.",
  "Bersihkan corongnya — bagian ini paling sering terlewat.":
    "Clean the mouth of it — that is the part most often missed.",
  "Kalau terasa kebas, turunkan tingkat dan beri jeda.":
    "If it starts feeling numb, lower the setting and take a break.",
  "Kecepatan tetap bisa menumpulkan sensasi — selingi manual.":
    "A constant speed can dull sensation — alternate with manual.",
  "Batasi durasi. Tekanan berlebih bisa memecah pembuluh halus.":
    "Limit how long you use it. Too much pressure can rupture small blood vessels.",
  "Balik dan keringkan penuh. Bedak jagung agar tidak lengket.":
    "Turn it inside out and dry it fully. Cornstarch keeps it from getting tacky.",
  "Lebih cepat kering karena kedua sisi terbuka.": "It dries faster because both ends are open.",
  "Vakumnya menambah tarikan — kurangi kalau ada rasa perih.":
    "The vacuum adds pull — ease off if there is any stinging.",
  "Pisahkan modul elektroniknya sebelum dicuci.":
    "Separate the electronics before washing it.",
  "Berat — angkat dari rangka, bukan dari bahan lunaknya.":
    "It is heavy — lift it by the frame, not by the soft material.",
  "Sendi perlu dilemaskan berkala. Simpan berbaring atau tergantung.":
    "The joints need loosening periodically. Store it lying down or hanging.",
  "Berpori — hanya pelumas berbasis air, keringkan sampai benar-benar kering.":
    "Porous — water-based lubricant only, and dry it until it is genuinely dry.",
  "Lipatan bagian dalam paling lama kering — beri waktu.":
    "The inner folds take longest to dry — give them time.",
  "Batas aman 20 menit. Lepas segera kalau warna berubah atau kebas.":
    "20 minutes is the safe limit. Remove it at once if colour changes or it goes numb.",
  "Aturan 20 menit tetap berlaku.": "The 20-minute rule still applies.",
  "Silikon padat aman direbus; bahan lain cukup sabun lembut.":
    "Solid silicone is safe to boil; anything else needs only mild soap.",
  "Pakai bertahap, jangan seharian.": "Build up gradually, not all day.",
  "Jangan disemprotkan ke dalam. Jaga suhunya hangat, bukan panas.":
    "Do not direct it inside. Keep it warm, not hot.",
  "Pastikan bahannya tidak berpori dan tidak bertepi tajam.":
    "Make sure the material is non-porous and has no sharp edges.",

  /* ── Halaman catat ─────────────────────────────────────────────────────── */
  "Halo, {nama}": "Hello, {nama}",
  "Dua pilihan sudah cukup. Sisanya hanya kalau kamu memang ingin tahu lebih banyak nanti.":
    "Two choices are enough. The rest is only there if you genuinely want to know more later.",
  Durasi: "Duration",
  Jeda: "Pause",
  Lanjut: "Resume",
  Mulai: "Start",
  Nol: "Reset",
  Cara: "Method",
  Alat: "Device",
  Perawatan: "Care",
  "Rasanya sesudah": "How it felt afterwards",
  "Empat yang terakhir bertanda merah karena berhubungan dengan tubuh, bukan suasana hati — dan dijawab lewat jalur yang berbeda.":
    "The last four are marked red because they concern the body rather than mood — and they are answered through a different path.",
  "Sembunyikan detail": "Hide details",
  "Tambah detail (opsional)": "Add details (optional)",
  Pelumas: "Lubricant",
  "Pelumas silikon bisa merusak permukaan alat berbahan silikon. Untuk alat, yang berbasis air lebih aman.":
    "Silicone lubricant can damage the surface of silicone devices. For devices, a water-based one is safer.",
  Edging: "Edging",
  "Berapa siklus?": "How many cycles?",
  "Yang memicu": "What prompted it",
  Catatan: "Note",
  "Apa pun yang ingin kamu ingat nanti.": "Anything you want to remember later.",
  Simpan: "Save",
  "Tersimpan.": "Saved.",
  "{n} catatan tersimpan.": "{n} entries stored.",
  "Atur cadangan": "Set up a backup",

  /* ── Halaman pengaturan ────────────────────────────────────────────────── */
  "Mode, cadangan, akun": "Mode, backup, account",
  "Masuk sebagai {nama}. Catatanmu tersimpan di perangkat ini sekaligus tersalin terenkripsi ke server.":
    "Signed in as {nama}. Your entries live on this device and are also copied to the server in encrypted form.",
  "Belum masuk. Catatanmu hanya ada di perangkat ini — kalau penyimpanan peramban dibersihkan, catatannya ikut hilang.":
    "Not signed in. Your entries exist only on this device — if browser storage is cleared, they go with it.",
  "Catatanmu belum punya cadangan": "Your entries have no backup",
  "Penyimpanan peramban bisa dibersihkan sistem tanpa memberi tahu, terutama saat ruang penyimpanan menipis. Buat akun, atau unduh cadangan secara berkala.":
    "The system can clear browser storage without telling you, especially when space runs low. Create an account, or download a backup regularly.",
  "Milikmu sendiri": "Yours",
  "Warna, nama panggilan, dan seberapa banyak yang bergerak. Semuanya ikut terenkripsi bersama catatan, jadi bahkan warna kesukaanmu pun tidak terbaca server.":
    "Colour, the name we call you, and how much moves. All of it is encrypted along with your entries, so not even your favourite colour is readable by the server.",
  Warna: "Colour",
  "Nama panggilan": "What we call you",
  "Kosongkan kalau tidak mau disapa": "Leave empty to not be greeted",
  "Dipakai hanya di halaman catat. Tidak pernah muncul di judul tab maupun notifikasi, supaya layarmu tetap aman dilihat orang lain.":
    "Used only on the log page. It never appears in the tab title or in notifications, so your screen stays safe for other people to see.",
  Gerakan: "Motion",
  "Mode tenang menghentikan semua gerakan yang berjalan terus. Umpan balik saat kamu menyentuh sesuatu tetap ada, karena tanpa itu antarmuka terasa rusak, bukan tenang.":
    "Calm mode stops everything that moves on its own. Feedback when you touch something stays, because without it the interface feels broken rather than calm.",
  "Mode pencatatan": "Logging mode",
  "Mode menentukan daftar alat yang ditawarkan dan cara catatanmu dibaca. Mode pria dibaca terhadap pita bulanan; mode wanita dibaca terhadap fase siklus, karena temuan yang mendasari pita itu berasal dari penelitian prostat dan tidak bisa dipindahkan begitu saja.":
    "The mode decides which devices are offered and how your entries are read. Male mode is read against a monthly band; female mode is read against cycle phases, because the finding behind that band comes from prostate research and cannot simply be carried over.",
  Siklus: "Cycle",
  "Tiga angka ini yang membuat catatanmu bisa dibaca sebagai pola berulang, bukan sekadar deret tanggal.":
    "These three numbers are what let your entries be read as a repeating pattern rather than a plain series of dates.",
  "Hari pertama haid terakhir": "First day of your last period",
  "Panjang siklus (hari)": "Cycle length (days)",
  "Lama haid (hari)": "Period length (days)",
  "Perkiraan haid berikutnya besok. Perkiraan, bukan kepastian.":
    "Your next period is estimated for tomorrow. An estimate, not a certainty.",
  "Perkiraan haid berikutnya {n} hari lagi. Perkiraan, bukan kepastian.":
    "Your next period is estimated in {n} days. An estimate, not a certainty.",
  "Tinjau ulasan": "Review submissions",
  "Ulasan masuk dalam keadaan menunggu. Yang kamu tayangkan langsung ikut menghitung angka penilaian di halaman depan — jadi angka itu selalu bisa ditelusuri kembali ke barisnya.":
    "Reviews arrive in a pending state. Whatever you publish counts immediately toward the rating on the front page — so that number can always be traced back to its rows.",
  "Tulis ulasan": "Write a review",
  "Satu akun satu ulasan, dan menulis lagi berarti mengganti yang lama. Ulasanmu ditinjau dulu sebelum tayang, dan angka penilaian di halaman depan dihitung langsung dari ulasan yang masuk — bukan ditulis tangan.":
    "One account, one review, and writing again replaces the old one. Your review is checked before it appears, and the rating on the front page is computed directly from the reviews received — not typed by hand.",
  Cadangan: "Backup",
  "Berkas cadangan berisi catatanmu apa adanya, tanpa enkripsi, supaya bisa kamu buka sendiri kapan pun. Simpan di tempat yang kamu percaya.":
    "The backup file holds your entries as they are, unencrypted, so you can open them yourself whenever you want. Keep it somewhere you trust.",
  "Unduh cadangan ({n} catatan)": "Download backup ({n} entries)",
  "Pulihkan dari berkas": "Restore from file",
  "{n} catatan baru ditambahkan.": "{n} new entries added.",
  "Semua catatan di berkas itu sudah ada.": "Every entry in that file is already here.",
  "Berkas tidak terbaca.": "The file could not be read.",
  "Memulihkan menggabungkan, tidak menimpa. Catatan yang sudah ada tidak akan berganda.":
    "Restoring merges rather than overwrites. Entries you already have will not be duplicated.",
  "Mengganti kata sandi hanya membungkus ulang kuncinya. Catatanmu tidak disentuh, jadi tidak ada risiko rusak di tengah jalan.":
    "Changing your password only rewraps the key. Your entries are untouched, so there is no risk of corruption partway through.",
  "Kata sandi sekarang": "Current password",
  "Kata sandi baru": "New password",
  "Ulangi yang baru": "Repeat the new one",
  "Kata sandi baru minimal 10 karakter.": "The new password must be at least 10 characters.",
  "Ulangannya belum sama.": "The repeat does not match yet.",
  "Kata sandi diganti.": "Password changed.",
  "Ganti kata sandi": "Change password",
  "Kunci pemulihanmu tetap sama. Ini salinannya:":
    "Your recovery key is unchanged. Here is a copy of it:",
  Menghapus: "Deleting",
  "Tidak ada masa tunggu dan tidak ada salinan yang tertinggal. Unduh cadangan dulu kalau masih ragu.":
    "There is no waiting period and no copy left behind. Download a backup first if you are unsure.",
  "Hapus {n} catatan dari perangkat ini? Tidak bisa dibatalkan.":
    "Delete {n} entries from this device? This cannot be undone.",
  "Catatan dihapus.": "Entries deleted.",
  "Hapus semua catatan": "Delete all entries",
  "Hapus akun berikut seluruh brankasnya? Ini permanen.":
    "Delete the account and its entire vault? This is permanent.",
  "Akun dihapus sepenuhnya.": "Account fully deleted.",
  "Hapus akun": "Delete account",
  "Gagal.": "Failed.",
  "Sinkronisasi terakhir gagal: {pesan}. Catatanmu tetap aman di perangkat ini.":
    "The last sync failed: {pesan}. Your entries are still safe on this device.",
  "Cara kerja penyimpanannya dijelaskan penuh di": "How the storage works is explained in full on the",
  "halaman privasi": "privacy page",

  /* ── Halaman privasi ───────────────────────────────────────────────────── */
  "Yang disimpan, dan di mana": "What is stored, and where",
  Privasi: "Privacy",
  "Data seperti ini termasuk yang paling sensitif yang bisa dimiliki seseorang. Satu kebocoran berarti kematian merek yang permanen, dan itulah alasan kebanyakan orang tidak mau membangun produk di kategori ini. Cadensa memikulnya dengan cara yang paling bisa diperiksa: server memang menyimpan sesuatu, tapi yang disimpannya tidak bisa dibaca oleh siapa pun yang menjalankannya.":
    "Data like this is among the most sensitive a person can hold. One breach means permanent death for the brand, and that is why most people will not build in this category at all. Cadensa carries it in the way that can be checked most easily: the server does store something, but what it stores cannot be read by anyone running it.",
  "Tanpa akun, tidak ada apa pun yang dikirim": "Without an account, nothing is sent",
  "Kalau kamu memakai Cadensa tanpa mendaftar, catatanmu hanya ada di penyimpanan peramban perangkat ini. Tidak ada permintaan jaringan yang membawa isinya keluar.":
    "If you use Cadensa without registering, your entries exist only in this device's browser storage. No network request carries their contents out.",
  "Dengan akun, yang terkirim sudah terkunci lebih dulu":
    "With an account, what is sent has already been locked",
  "Catatanmu dienkripsi di perangkat ini dengan AES-GCM sebelum menyentuh jaringan. Kuncinya diturunkan dari kata sandimu lewat PBKDF2, dan penurunan itu terjadi di perambanmu — bukan di server.":
    "Your entries are encrypted on this device with AES-GCM before they touch the network. The key is derived from your password via PBKDF2, and that derivation happens in your browser — not on the server.",
  "Kata sandimu tidak pernah sampai ke server": "Your password never reaches the server",
  "Yang dikirim saat masuk bukan kata sandimu, melainkan turunan PBKDF2-nya. Server meng-hash lagi nilai itu dengan scrypt sebelum menyimpannya. Dua lapis, dan lapis pertama sudah membuat kata sandi aslinya tidak pernah meninggalkan perangkatmu.":
    "What is sent at sign-in is not your password but its PBKDF2 derivation. The server hashes that value again with scrypt before storing it. Two layers, and the first already means the password itself never leaves your device.",
  "Kalau seluruh basis data ini bocor, isinya tidak terbaca":
    "If this entire database leaked, its contents would be unreadable",
  "Yang tersimpan di kolom brankas adalah teks acak. Tanpa kata sandi pemiliknya, tidak ada yang bisa dikembalikan darinya — termasuk oleh kami. Ini konsekuensi yang kami pilih dengan sadar: kami menukar kemampuan memulihkan akun dengan jaminan bahwa tidak ada yang bisa dibaca.":
    "What sits in the vault column is random text. Without the owner's password, nothing can be recovered from it — including by us. This is a consequence we chose deliberately: we traded the ability to recover accounts for the guarantee that nothing can be read.",
  "Bacaan tetap dihitung di tempat": "Readings are still computed in place",
  "Halaman bacaan berjalan sepenuhnya di perangkatmu. Pola, sinyal, dan sarannya lahir dari data yang sudah ada di sini, bukan dari analisis di server.":
    "The readings page runs entirely on your device. Its patterns, signals, and suggestions come from data already here, not from analysis on a server.",
  "Tidak ada pelacak di halaman aplikasi": "No trackers on the app pages",
  "Halaman catat, ritme, bacaan, dan pengaturan bebas dari alat analitik pihak ketiga. Kalau nanti halaman pemasaran memakainya, halaman aplikasi tetap tidak.":
    "The log, rhythm, readings, and settings pages are free of third-party analytics. If the marketing pages ever adopt them, the app pages still will not.",
  "Menghapus berarti hilang": "Deleting means gone",
  "Tombol hapus akun menghapus baris penggunanya, dan brankasnya ikut terhapus karena terikat langsung ke baris itu. Tidak ada masa tunggu, tidak ada arsip.":
    "The delete-account button removes the user row, and the vault goes with it because it is tied directly to that row. No waiting period, no archive.",
  "Tidak dijual, tidak melatih model": "Not sold, not used to train models",
  "Catatanmu tidak diperjualbelikan dalam bentuk apa pun dan tidak dipakai melatih model siapa pun. Secara teknis kami memang tidak bisa — bentuknya di server tidak terbaca. Tapi ini tetap janji, bukan sekadar akibat.":
    "Your entries are not traded in any form and are not used to train anyone's model. Technically we could not — their form on the server is unreadable. But this remains a promise, not merely a consequence.",
  "Namanya sengaja samar": "The name is deliberately vague",
  "Cadensa terdengar seperti aplikasi musik atau kebugaran, dan tampilannya tidak memuat gambar apa pun. Ikon alat digambar sebagai garis abstrak, bukan berkas gambar — jadi tidak ada apa pun yang singgah di riwayat unduhan.":
    "Cadensa sounds like a music or fitness app, and its interface contains no imagery at all. Device icons are drawn as abstract lines rather than image files — so nothing ever passes through your download history.",
  "Harga dari janji ini": "What this promise costs",
  "Karena kunci tidak pernah kami pegang, tidak ada tombol “lupa kata sandi” yang bisa mengembalikan catatanmu. Yang ada adalah kunci pemulihan yang kami tunjukkan sekali saat kamu mendaftar. Simpan kunci itu, dan unduh cadangan sesekali lewat":
    "Because we never hold the key, there is no “forgot password” button that can bring your entries back. What exists instead is the recovery key we show you once when you register. Keep that key, and download a backup now and then from the",
  ". Kami memilih menyebut kelemahan ini terang-terangan daripada menyembunyikannya di balik alur pemulihan yang sebenarnya berarti kami bisa membaca isinya.":
    ". We would rather state this weakness plainly than hide it behind a recovery flow that would actually mean we can read your contents.",
  "halaman pengaturan": "settings page",

  /* ── Halaman depan ─────────────────────────────────────────────────────── */
  "Kesehatan reproduksi, dibaca dari ritme": "Reproductive health, read from rhythm",
  "Ritme,": "Rhythm,",
  "bukan skor.": "not a score.",
  "Pria yang berejakulasi sekitar dua puluh satu kali sebulan menunjukkan angka kejadian kanker prostat yang lebih rendah dibanding yang hanya empat sampai tujuh kali. Cadensa mengubah temuan itu menjadi kebiasaan yang bisa dilihat dan dijaga, dan mengunci catatannya di perangkatmu sebelum apa pun terkirim.":
    "Men who ejaculate around twenty-one times a month show a lower rate of prostate cancer than those who do so only four to seven times. Cadensa turns that finding into a habit you can see and keep, and locks the entries on your device before anything is sent.",
  "Mulai mencatat": "Start logging",
  "Buat akun dan amankan": "Create an account and secure it",
  "Perlu disebut jujur: temuan itu korelasi, bukan sebab-akibat. Cadensa memperlakukannya sebagai penanda ritme sehat, bukan sebagai janji.":
    "This has to be said plainly: the finding is a correlation, not causation. Cadensa treats it as a marker of a healthy rhythm, not as a promise.",
  "kali sebulan, digambar sebagai wilayah bukan garis":
    "times a month, drawn as a region rather than a line",
  "jenis alat, tiap satu dengan catatan perawatannya":
    "kinds of device, each with its own care note",
  "baris terbaca yang tersimpan di server kami": "readable rows stored on our server",
  "Dasar bukti": "The evidence",
  "Angkanya bisa kamu periksa sendiri": "You can check the numbers yourself",
  "Seluruh produk ini berdiri di atas satu penelitian, jadi penelitian itu ditampilkan apa adanya — lengkap dengan selang kepercayaannya, dan lengkap dengan bagian yang melemahkannya.":
    "This entire product rests on a single study, so that study is shown as it is — confidence interval included, and the parts that weaken it included too.",
  "Keberatan terhadap angka ini": "Objections to this number",
  "Ditulis sendiri, bukan menunggu orang lain menemukannya. Produk yang menyembunyikan kelemahan buktinya tidak layak dipercaya soal hal lain.":
    "Written by us rather than left for someone else to find. A product that hides the weaknesses in its evidence has not earned trust on anything else.",
  Posisi: "Position",
  "Yang sudah ada berdiri di premis sebaliknya": "What already exists rests on the opposite premise",
  "Aplikasi pantang": "Abstinence apps",
  "Menghitung hari menahan diri, memberi lencana, dan membangun rasa bersalah saat hitungannya patah.":
    "They count days of restraint, hand out badges, and build guilt the moment the streak breaks.",
  "Hitungan yang patah membuat orang berhenti memakai aplikasinya. Di kategori ini kepergiannya permanen, karena bercampur rasa malu.":
    "A broken streak makes people stop using the app. In this category they leave for good, because shame is mixed into it.",
  "Tidak menghitung hari pantang, dan tidak punya hitungan yang bisa patah. Yang ditampilkan pita ritme yang melebar dan menyempit.":
    "No count of abstinent days, and no streak that can break. What it shows is a rhythm band that widens and narrows.",
  "Dua puluh satu digambar sebagai wilayah, bukan garis. Tidak ada papan peringkat, dan tidak ada yang bisa gagal.":
    "Twenty-one is drawn as a region, not a line. There is no leaderboard, and nothing that can be failed.",
  Peragaan: "Demonstration",
  "Jumlah bukan ukuran yang tepat": "The count is not the right measure",
  "Dua orang dengan dua puluh satu catatan bisa sangat berbeda: satu tersebar rata, satu menumpuk di minggu terakhir. Geser sendiri, dan lihat indeksnya runtuh sementara jumlahnya tidak berubah.":
    "Two people with twenty-one entries can be very different: one evenly spread, one piled into the final week. Drag it yourself and watch the index collapse while the count never moves.",
  Katalog: "Catalogue",
  "Alatnya disebut dengan nama yang tepat": "Devices are called by their proper names",
  "{n} jenis, dikelompokkan, masing-masing dengan ikon dan catatan perawatan. Rinciannya sejauh ini karena gesekan dan tekanan tiap jenis berbeda jauh, dan itu satu-satunya cara menjelaskan kenapa keluhan fisik muncul pada sebagian orang saja.":
    "{n} kinds, grouped, each with an icon and a care note. The detail goes this far because friction and pressure differ sharply between them, and that is the only way to explain why physical complaints appear for some people and not others.",
  "Ikonnya digambar sebagai garis vektor, bukan berkas gambar. Tajam di layar mana pun tanpa menambah unduhan, ikut warna tema, dan yang paling menentukan, tidak ada berkas gambar yang singgah di riwayat unduhan. Bentuknya cukup untuk dikenali pemakainya, tidak cukup untuk dipahami orang yang melirik dari samping.":
    "The icons are drawn as vector lines rather than image files. Sharp on any screen without adding to the download, they follow the theme colour, and — most decisively — no image file ever passes through your download history. The shapes are enough for the person using them to recognise, and not enough for someone glancing over your shoulder to understand.",
  Kosakata: "Vocabulary",
  "Setiap pilihan punya rupanya sendiri": "Every option has a shape of its own",
  "Alur catat punya anggaran dua belas detik, dan di layar sekecil ponsel bentuk terbaca lebih cepat daripada kata. Karena itu tidak ada satu pun pilihan yang hanya berupa teks.":
    "The logging flow has a twelve-second budget, and on a screen as small as a phone a shape reads faster than a word. That is why not one option here is text alone.",
  "Empat rupa terakhir di baris pertama bertanda merah karena berhubungan dengan tubuh, bukan suasana hati. Warna itu dicadangkan untuk satu makna saja di seluruh aplikasi, dan memilih salah satunya membawa catatanmu ke jalur yang tidak pernah dijawab dengan saran mengubah teknik.":
    "The last four shapes in the first row are marked red because they concern the body, not mood. That colour is reserved for one meaning across the entire app, and choosing one of them sends your entry down a path that is never answered with advice about technique.",
  Sinyal: "Signals",
  "Catatan yang dibuat tanpa penonton adalah data batin yang paling jujur":
    "Entries made with no audience are the most honest inner data there is",
  "Empat pola terbaca tanpa Cadensa perlu bertanya apa pun. Semuanya disajikan sebagai yang tubuhmu tunjukkan minggu ini, bukan sebagai label klinis.":
    "Four patterns become readable without Cadensa asking anything. All of them are presented as what your body has shown this week, never as a clinical label.",
  Stres: "Stress",
  "Frekuensi naik, durasi memendek, alasan bergeser ke stres atau bosan.":
    "Frequency rises, duration shortens, and the reason shifts to stress or boredom.",
  "Pola cepat dan sering seperti ini adalah cara tubuh menurunkan tekanan, bukan tanda gairah. Biasanya terbaca beberapa hari sebelum orangnya sendiri sadar.":
    "A fast, frequent pattern like this is the body lowering pressure, not a sign of desire. It usually becomes readable a few days before the person notices it themselves.",
  "Rasa yang mendatar": "A flattened feeling",
  "Kekosongan panjang bersamaan dengan label rasa yang bergeser ke netral atau hampa.":
    "Long gaps alongside feeling labels drifting toward neutral or hollow.",
  "Kuesioner suasana hati mudah dijawab seadanya. Catatan yang dibuat tanpa penonton jauh lebih jujur.":
    "Mood questionnaires are easy to answer carelessly. Entries made with no audience are far more honest.",
  Tidur: "Sleep",
  "Jam kejadian bergeser konsisten ke rentang dini hari.":
    "The hour shifts consistently into the small hours.",
  "Kalau pergeserannya menetap, yang berubah biasanya jam tidur, bukan dorongan seksual.":
    "If the shift settles in, what changed is usually the sleep schedule, not sexual drive.",
  Kompulsivitas: "Compulsivity",
  "Sering, tapi hampir tidak pernah diikuti rasa lega.":
    "Frequent, but almost never followed by relief.",
  "Jumlah tinggi yang tetap terasa enak bukan masalah. Yang membedakan adalah jaraknya dengan rasa lega, dan hanya kombinasi ini yang menangkapnya.":
    "A high count that still feels good is not a problem. What distinguishes it is the distance from relief, and only this combination catches that.",
  "Mode perempuan": "Female mode",
  "Bukan aplikasi yang sama dengan kata ganti yang diganti":
    "Not the same app with the pronouns swapped",
  "Angka dua puluh satu tidak dipindahkan ke sini. Dasarnya penelitian tentang prostat, organ yang tidak ada di tubuh perempuan, jadi memakai ulang angkanya akan jadi klaim kesehatan tanpa dasar. Produk yang mengarang satu angka kehilangan hak dipercaya soal angka lainnya.":
    "The number twenty-one was not carried over. It rests on research into the prostate, an organ women do not have, so reusing it would be a health claim with no basis. A product that invents one number forfeits the right to be believed about any other.",
  "Yang dipakai sebagai gantinya adalah pertanyaan yang memang punya jawaban: apakah dorongan naik dan turun mengikuti siklus, dan apakah polanya berulang.":
    "What is used instead is a question that does have an answer: does drive rise and fall with the cycle, and does the pattern repeat.",
  "Ganti mode": "Switch mode",
  "Menggantikan pita bulanan. Seberapa terpusat doronganmu di satu fase, 0 sampai 100.":
    "Replaces the monthly band. How concentrated your drive is in one phase, 0 to 100.",
  "Sebaran per fase": "Spread per phase",
  "Haid, folikular, ovulasi, luteal. Dihitung per hari fase, karena panjang tiap fase berbeda.":
    "Menstrual, follicular, ovulatory, luteal. Counted per day of each phase, because the phases differ in length.",
  "Katalog sendiri": "Its own catalogue",
  "Daftar alat menyesuaikan mode: yang khusus muncul, yang tidak relevan hilang.":
    "The device list follows the mode: the specific ones appear, the irrelevant ones drop away.",
  Alur: "Flow",
  "Tiga langkah, dan tidak ada yang keempat": "Three steps, and there is no fourth",
  "Dua ketukan untuk yang wajib, sisanya opsional. Targetnya di bawah dua belas detik, dan itu angka mati.":
    "Two taps for what is required, the rest optional. The target is under twelve seconds, and that number is fixed.",
  "Lihat ritmemu": "See your rhythm",
  "Kalender yang tidak terlihat seperti kalender. Kepadatan menunjukkan frekuensi, ketinggian menunjukkan rasa.":
    "A calendar that does not look like a calendar. Density shows frequency, height shows feeling.",
  Baca: "Read",
  "Satu pengamatan, satu saran. Tidak pernah tiga, tidak pernah menghakimi.":
    "One observation, one suggestion. Never three, never judging.",
  Penyimpanan: "Storage",
  "Catatanmu tidak akan hilang, dan tetap tidak terbaca siapa pun":
    "Your entries will not be lost, and stay unreadable to anyone",
  "Penyimpanan peramban bisa dibersihkan sistem tanpa memberi tahu, dan catatan yang hilang begitu saja adalah cacat, bukan fitur. Karena itu ada akun. Tapi sebelum apa pun terkirim, catatanmu dikunci dulu di perangkat ini dengan AES-GCM, memakai kunci yang diturunkan dari kata sandimu di perambanmu sendiri.":
    "The system can clear browser storage without telling you, and entries that simply vanish are a defect, not a feature. That is why accounts exist. But before anything is sent, your entries are locked on this device with AES-GCM, using a key derived from your password inside your own browser.",
  "Terkunci sebelum dikirim": "Locked before it is sent",
  "Enkripsi terjadi di perangkatmu, bukan di server.":
    "Encryption happens on your device, not on a server.",
  "Kata sandi tidak dikirim": "The password is not sent",
  "Yang dikirim turunan PBKDF2-nya. Kata sandi aslinya tidak pernah keluar dari peramban.":
    "What is sent is its PBKDF2 derivation. The password itself never leaves the browser.",
  "Bocor pun tidak terbaca": "Unreadable even if leaked",
  "Kalau seluruh basis datanya dicuri, isinya tetap teks acak.":
    "If the entire database were stolen, its contents would still be random text.",
  "Karena kunci tidak pernah kami pegang, tidak ada tombol lupa kata sandi yang bisa mengembalikan catatanmu. Yang ada kunci pemulihan sekali tampil, dan cadangan yang bisa kamu unduh sendiri kapan saja.":
    "Because we never hold the key, there is no forgot-password button that can bring your entries back. What exists is a recovery key shown once, and a backup you can download yourself at any time.",
  "Kami memilih menyebut kelemahan ini terang-terangan daripada menyembunyikannya di balik alur pemulihan yang sebenarnya berarti kami bisa membaca isinya.":
    "We would rather state this weakness plainly than hide it behind a recovery flow that would actually mean we can read your contents.",
  "Cara kerjanya": "How it works",
  "Suara pengguna": "What users say",
  "Apa yang benar-benar ditulis orang": "What people actually wrote",
  "Isinya diambil langsung dari basis data, dan angka penilaiannya dihitung dari baris yang ada di sana. Tidak ada tempat di mana pun untuk mengetik angka itu sendiri.":
    "The contents come straight from the database, and the rating is computed from the rows in it. There is nowhere at all to type that number by hand.",
  "Mulai dari satu catatan": "Start with a single entry",
  "Tidak perlu akun untuk mencoba. Cadensa berguna sebelum kamu mendaftar apa pun. Akun hanya menjaga supaya yang sudah kamu catat tidak hilang.":
    "No account is needed to try it. Cadensa is useful before you register anything. An account only keeps what you have logged from being lost.",
  "Buka pencatat": "Open the logger",
  "Cadensa, ritme bukan skor.": "Cadensa — rhythm, not a score.",
  "Bukan alat diagnosis. Kalau ada nyeri berulang, darah, atau keluhan yang menetap, periksakan ke dokter.":
    "Not a diagnostic tool. If there is recurring pain, blood, or a complaint that persists, see a doctor.",

  /* ── Gambar bukti ──────────────────────────────────────────────────────── */
  "Rasio hazard kanker prostat": "Prostate cancer hazard ratio",
  "31.925 pria · tindak lanjut 18 tahun": "31,925 men · 18 years of follow-up",
  "4–7 kali per bulan": "4–7 times per month",
  "8–12 kali per bulan": "8–12 times per month",
  "13–20 kali per bulan": "13–20 times per month",
  "21 kali atau lebih": "21 times or more",
  "kelompok pembanding": "reference group",
  "wilayah yang dipakai Cadensa": "the region Cadensa uses",
  /*
    Angka desimal ikut kamus karena pemisahnya berbeda menurut bahasa: koma di
    Indonesia, titik di Inggris. Membiarkannya apa adanya membuat sumbu grafik
    membaca "0,60" di halaman berbahasa Inggris, dan pembaca Inggris akan
    mengiranya ribuan.
  */
  "0,60": "0.60",
  "1,00 — tanpa perbedaan": "1.00 — no difference",
  "1,15": "1.15",
  "European Urology, 2016;70(6):974–982. Angka di atas adalah frekuensi pada usia 40–49 tahun. Temuan awalnya terbit di JAMA 2004 dari kohort yang sama.":
    "European Urology, 2016;70(6):974–982. The figures above are for frequency at ages 40–49. The original finding appeared in JAMA 2004 from the same cohort.",
  "Ini pengamatan, bukan percobaan": "This is observation, not an experiment",
  "Tidak ada yang diacak dan tidak ada yang diperintahkan berbuat apa pun. Yang diamati adalah kebiasaan yang sudah ada, lalu dilihat siapa yang kemudian sakit. Rancangan seperti ini tidak bisa membuktikan sebab-akibat, apa pun besar angkanya.":
    "Nothing was randomised and no one was told to do anything. What was observed were habits that already existed, followed by who later fell ill. A design like this cannot prove causation, however large the numbers.",
  "Arahnya bisa terbalik": "The direction could be reversed",
  "Bisa jadi bukan frekuensi yang menurunkan risiko, melainkan tubuh yang sudah bermasalah menurunkan frekuensi bertahun-tahun sebelum terdiagnosis. Penelitiannya berusaha menyingkirkan kemungkinan ini, tapi tidak bisa menutupnya sepenuhnya.":
    "It may not be frequency lowering the risk, but a body already in trouble lowering the frequency years before diagnosis. The study tried to rule this out, but could not close it off entirely.",
  "Orang yang rajin mencatat cenderung lebih sehat":
    "People who diligently keep records tend to be healthier",
  "Pesertanya tenaga kesehatan yang bersedia mengisi kuesioner selama puluhan tahun. Kelompok seperti ini lebih sering berolahraga dan lebih jarang merokok, dan sebagian dari perbedaannya mungkin datang dari sana.":
    "The participants were health professionals willing to fill in questionnaires for decades. A group like that exercises more and smokes less, and part of the difference may come from there.",
  "Datanya dari ingatan sendiri": "The data comes from memory",
  "Frekuensinya dilaporkan sendiri lewat kuesioner, bukan dicatat saat kejadian. Justru celah inilah yang Cadensa tutup — dan itu satu-satunya alasan teknis kenapa aplikasi ini layak ada.":
    "Frequency was self-reported through questionnaires rather than logged as it happened. That gap is precisely what Cadensa closes — and it is the one technical reason this app deserves to exist.",

  /* ── Peragaan kadens ───────────────────────────────────────────────────── */
  "Jumlah yang sama, sebaran berbeda. Yang berhubungan dengan kesehatan prostat adalah keteraturannya, dan hanya angka ini yang menangkapnya.":
    "Same count, different spread. What relates to prostate health is the regularity, and only this number captures it.",
  "Jumlah bulan ini": "Count this month",
  "Di dalam pita 18–24": "Inside the 18–24 band",
  "Di luar pita 18–24": "Outside the 18–24 band",
  "Kemerataan sebaran": "Evenness of spread",
  "Turunkan sampai nol, jumlahnya tetap tapi indeksnya runtuh.":
    "Drag it to zero: the count holds but the index collapses.",

  /* ── Ulasan ────────────────────────────────────────────────────────────── */
  "Belum ada ulasan": "No reviews yet",
  "Tidak ada yang ditulis di sini sampai ada pengguna sungguhan yang menulisnya. Halaman yang memuat keberatan terhadap penelitiannya sendiri tidak bisa sekaligus mengarang kalimat pujian.":
    "Nothing is written here until a real user writes it. A page that lists objections to its own research cannot also invent sentences of praise.",
  "Kalau kamu sudah memakainya, tulis yang pertama — termasuk bagian yang tidak berhasil.":
    "If you have been using it, write the first one — including the parts that did not work.",
  "{n} dari 5": "{n} out of 5",
  "Penilaian saat ini": "Current rating",
  "dari {n} ulasan tertulis": "from {n} written reviews",
  "Angka ini dihitung langsung dari ulasan yang masuk, dan tidak bisa diketik oleh siapa pun — termasuk oleh kami. Naik dan turunnya mengikuti apa yang benar-benar ditulis orang.":
    "This number is computed directly from the reviews received and cannot be typed by anyone — us included. It rises and falls with what people actually write.",
  "Tulis ulasanmu": "Write your review",
  Penilaian: "Rating",
  "Nama yang ditampilkan": "Display name",
  "Kosongkan untuk tampil sebagai pengguna anonim": "Leave empty to appear as an anonymous user",
  Ulasanmu: "Your review",
  "Apa yang berubah sejak kamu mulai mencatat? Sebutkan yang tidak berhasil juga.":
    "What changed since you started logging? Mention what did not work too.",
  "{n} karakter lagi": "{n} more characters",
  "{n} tersisa": "{n} left",
  "Mengirim…": "Sending…",
  "Kirim ulasan": "Send review",
  "Gagal mengirim.": "Sending failed.",
  "Terkirim. Ulasanmu tayang setelah ditinjau.": "Sent. Your review appears once it is checked.",
  "Ulasanmu tayang di halaman depan.": "Your review is live on the front page.",
  "Ulasanmu tersimpan dan sedang menunggu ditinjau.":
    "Your review is saved and waiting to be checked.",
};
