/**
 * Kredensial akun demo untuk rangkaian uji.
 *
 * Nama penggunanya boleh terbaca siapa saja — ia tidak membuka apa pun sendiri.
 * Kata sandinya tidak: repositori ini publik, dan kata sandi yang ditulis di
 * dalam berkas akan tersimpan permanen di riwayat Git. Menghapusnya belakangan
 * tidak menghapusnya dari commit yang sudah beredar.
 *
 * Akun demo juga bukan akun kosong. Ia berisi enam bulan catatan yang dipakai
 * sebagai bahan pengujian, di aplikasi yang benar-benar tayang; siapa pun yang
 * bisa masuk juga bisa menghapus isinya, dan bersamanya hilang dasar dari
 * seluruh angka yang dilaporkan rangkaian ini.
 *
 * Isikan sebelum menjalankan uji:
 *
 *   SANDI_DEMO_PRIA=... SANDI_DEMO_WANITA=... npm run uji
 *
 * Bisa juga ditaruh di .env.local, yang sudah diabaikan Git.
 */
function sandi(nama) {
  const nilai = process.env[nama];
  if (!nilai) {
    console.error(
      `\n${nama} belum diisi.\n` +
        "Kata sandi akun demo sengaja tidak ditulis di dalam repositori ini.\n" +
        "  SANDI_DEMO_PRIA=... SANDI_DEMO_WANITA=... npm run uji\n",
    );
    process.exit(1);
  }
  return nilai;
}

export const PRIA = { nama: "nayrbryanGaming01", sandi: sandi("SANDI_DEMO_PRIA") };
export const WANITA = { nama: "nayrbryanGaming02", sandi: sandi("SANDI_DEMO_WANITA") };
