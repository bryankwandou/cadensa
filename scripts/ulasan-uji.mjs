/**
 * Menaruh sejumlah ulasan sungguhan dari daftar luar ke tabel `reviews`, supaya
 * bagian testimoni di halaman depan bisa diuji dengan isi yang nyata.
 *
 * Tabel `reviews` berkunci `user_id` yang mengacu ke `users`. Jadi setiap ulasan
 * butuh satu baris akun. Akun yang dibuat di sini sengaja tidak bisa dimasuki:
 * `auth_hash`-nya diisi teks tanpa titik dua, dan `verifyAuth` menolak apa pun
 * yang tidak berbentuk `garam:hex` sebelum sempat menghitung scrypt. Brankasnya
 * juga kosong, jadi tidak ada apa pun yang bisa dibuka lewat akun-akun ini.
 *
 * Semua id-nya berawalan `ulasan-luar-`, supaya satu perintah bisa
 * mengembalikan basis data ke keadaan semula:
 *
 *   node scripts/ulasan-uji.mjs          # pasang
 *   node scripts/ulasan-uji.mjs --hapus  # cabut kembali
 */
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

for (const baris of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const m = baris.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const sql = neon(process.env.DATABASE_URL);

/**
 * Lima baris yang dipilih bukan karena paling memuji, melainkan karena bersama-sama
 * menyentuh setiap cabang tampilan: dua penilaian empat bintang supaya bintang yang
 * kosong ikut tergambar, kalimat terpendek dan terpanjang dari daftarnya supaya
 * tinggi kartu yang tidak seragam ikut teruji, dan nama satu kata maupun dua kata
 * supaya inisial di `Portrait` terbaca di kedua bentuk.
 */
/**
 * Potretnya sengaja hanya dipasang pada sebagian baris.
 *
 * Kartu berfoto dan kartu berinisial akan selalu berdampingan di halaman yang
 * sama — sebagian besar orang di kategori ini tidak akan mau wajahnya dipasang.
 * Kalau semua baris uji berfoto, cabang yang justru paling sering terpakai tidak
 * pernah dijalankan, dan tinggi kartu yang tidak seragam antara keduanya tidak
 * pernah terlihat.
 *
 * `f` adalah titik wajah dalam persen, bukan hasil potongan. Berkasnya berupa
 * foto badan 400x600 dengan kepala di sekitar 22% dari atas, jadi tanpa titik
 * ini `object-position` bawaan 50% akan memotong tepat di badan.
 */
const ULASAN = [
  // Rasio paling jangkung di kumpulan sumber. Tanpa titik fokus, `object-fit:
  // cover` pada 0,563 membuang hampir separuh tinggi gambar.
  { n: "Anisa Putri", r: 5, b: "Proses mencatat ritme terasa cepat dan sederhana.",
    a: "/ulasan/responden-01.jpg", f: { x: 50, y: 20, zoom: 1 } },

  { n: "Nabila Rahma", r: 5, b: "Saya lebih mudah melihat pola dari catatan yang sudah dibuat.",
    a: "/ulasan/responden-02.jpg", f: { x: 38, y: 26, zoom: 1 } },

  // Tanpa foto: cabang inisial, yang justru akan paling sering terpakai.
  { n: "Dimas Pratama", r: 4, b: "Saya suka karena fokusnya pada ritme, bukan memberi penilaian.",
    a: null, f: null },

  { n: "Rina Maharani", r: 5, b: "Riwayat pencatatan tersusun rapi sehingga mudah dilihat kembali.",
    a: "/ulasan/responden-03.jpg", f: { x: 62, y: 23, zoom: 1 } },

  // Sengaja tanpa titik fokus meski berfoto: memperlihatkan bawaan 50%/50%,
  // supaya QA bisa membandingkan langsung dengan baris yang titiknya diisi.
  { n: "Andi Saputra", r: 5, b: "Tampilannya membuat saya lebih rutin mencatat.",
    a: "/ulasan/responden-04.jpg", f: null },

  { n: "Siti Lestari", r: 4, b: "Saya merasa pencatatan jadi lebih konsisten.",
    a: "/ulasan/responden-05.jpg", f: { x: 30, y: 18, zoom: 1 } },

  // Berkas terbesar, 1920x2560. Menguji apakah pengecilan lewat next/image jalan.
  { n: "Fajar Nugroho", r: 5, b: "Yang paling saya sukai adalah proses input yang tidak rumit.",
    a: "/ulasan/responden-06.jpg", f: { x: 68, y: 30, zoom: 1 } },

  // Melebar 1600x900 — terpotong pada sumbu berlawanan dari semua yang lain.
  { n: "Maya Sari", r: 5, b: "Melihat perubahan ritme dari waktu ke waktu jadi lebih mudah.",
    a: "/ulasan/responden-07.jpg", f: { x: 24, y: 44, zoom: 1 } },

  { n: "Rio Prakoso", r: 4, b: "Saya nyaman menggunakan aplikasi ini karena tidak terasa menghakimi.",
    a: null, f: null },

  // 96x96, lebih kecil dari lebar yang diminta next/image. Menguji peregangan.
  { n: "Dewi Anggraini", r: 5, b: "Catatan saya lebih teratur dibanding sebelumnya.",
    a: "/ulasan/responden-08.jpg", f: { x: 50, y: 40, zoom: 1 } },
];

const id = (i) => `ulasan-luar-${String(i + 1).padStart(2, "0")}`;

if (process.argv.includes("--hapus")) {
  // `reviews` ikut terhapus lewat ON DELETE CASCADE.
  const { length } = await sql`DELETE FROM users WHERE id LIKE 'ulasan-luar-%' RETURNING id`;
  console.log(`Dicabut: ${length} akun beserta ulasannya.`);
} else {
  for (const [i, u] of ULASAN.entries()) {
    await sql`
      INSERT INTO users (id, username, email, auth_hash, kdf_salt, wrapped_dek)
      VALUES (${id(i)}, ${id(i)}, ${`${id(i)}@ulasan.invalid`}, 'tanpa-masuk', '', '')
      ON CONFLICT (id) DO NOTHING`;
    await sql`
      INSERT INTO reviews (user_id, display_name, rating, body, approved, avatar_url, avatar_focus)
      VALUES (${id(i)}, ${u.n}, ${u.r}, ${u.b}, true, ${u.a}, ${u.f ? JSON.stringify(u.f) : null})
      ON CONFLICT (user_id) DO UPDATE
        SET display_name = EXCLUDED.display_name,
            rating       = EXCLUDED.rating,
            body         = EXCLUDED.body,
            approved     = true,
            avatar_url   = EXCLUDED.avatar_url,
            avatar_focus = EXCLUDED.avatar_focus`;
  }
  const [a] = await sql`SELECT count(*)::int AS n, avg(rating)::float AS avg FROM reviews WHERE approved = true`;
  console.log(`Terpasang ${ULASAN.length}. Tayang sekarang: ${a.n} ulasan, rata-rata ${a.avg.toFixed(2)}.`);
}
