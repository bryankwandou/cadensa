# Cadensa — arah desain

Ditulis supaya keputusan di bawah ini tidak perlu diambil ulang setiap kali ada
halaman baru, dan supaya penyimpangan darinya menjadi terlihat.

## Arah

**Warm Monochrome × Gallery Editorial**, dibawa ke ranah kesehatan.

Bukan dashboard. Bukan aplikasi kebugaran. Yang ditiru adalah rasa membaca
sesuatu yang ditulis dengan hati-hati tentang tubuh sendiri — tenang, rapi, dan
tidak sedang menjual apa pun. Kategori ini penuh aplikasi yang berteriak: papan
peringkat, lencana, hitungan hari pantang. Ketenangan adalah pembeda yang paling
sulit ditiru.

## Warna

Satu aksen. Titik.

| Peran | Token | Aturan |
|---|---|---|
| Aksen tunggal | `teal-400/500/600` | Keadaan aktif, tautan, satu tombol utama per layar |
| Perhatian | `amber-400` | Hanya peringatan yang butuh tindakan. Bukan hiasan, bukan aksen kedua |
| Medis | `signal-500` | Satu makna saja di seluruh aplikasi: ini soal tubuh, bukan kebiasaan |
| Permukaan | `ink-950 → ink-700` | Elevasi lewat gradasi latar, bukan bayangan |
| Teks | `sand-100/300/500` | Tiga tingkat, tidak lebih |

Amber dan teal tidak boleh muncul sebagai dua aksen yang bersaing dalam satu
bagian. Kalau keduanya ada, salah satunya sedang salah tempat.

## Tipografi

| Peran | Huruf | Kenapa |
|---|---|---|
| Display | **Fraunces** | Serif dengan sumbu optik. Punya kehangatan yang tidak dimiliki sans, dan itu yang membedakan produk ini dari aplikasi kebugaran |
| Antarmuka | **Geist** | Netral, ketat, tidak menarik perhatian ke dirinya sendiri |
| Angka | **Geist Mono** | Selalu `tabular-nums`. Angka yang bergeser saat berubah membuat orang tidak percaya angkanya |

Tiga berat saja: 400, 500, 600. Tracking display `-0.03em`.

## Bentuk

Radius **berbeda menurut peran**, bukan seragam:

| Peran | Radius |
|---|---|
| Panel besar | 28px (`rounded-[1.75rem]`) |
| Kartu | 20px |
| Kolom isian & ubin | 14px |
| Pil & lencana | penuh |

## Ruang

Irama bagian dibuat tidak rata: 88px → 128px → 88px → 160px. Bagian yang
membawa satu gagasan besar mendapat ruang lebih. Ruang kosong adalah tanda
percaya diri; padat adalah tanda murah.

## Gerak

- Masuk 420ms, keluar 240ms. Tidak simetris, karena kepergian tidak perlu
  diperhatikan.
- Easing `cubic-bezier(0.16, 1, 0.3, 1)`, bukan `ease` bawaan.
- Tanpa pantulan. Pegas boleh, memantul tidak.
- Satu animasi yang berjalan terus per halaman, tidak lebih.

## Yang dilarang

- Grid tiga kolom berisi ikon + judul + paragraf yang diulang-ulang.
- Semua bagian dibungkus kartu dengan bayangan yang sama.
- Radius seragam di seluruh halaman.
- Judul bergradasi.
- `transition: all`.
- Hitam murni.
- Susunan rata tengah dari atas sampai bawah.
