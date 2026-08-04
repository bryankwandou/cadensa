import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Motion";

const POINTS = [
  {
    t: "Tanpa akun, tidak ada apa pun yang dikirim",
    d: "Kalau kamu memakai Cadensa tanpa mendaftar, catatanmu hanya ada di penyimpanan peramban perangkat ini. Tidak ada permintaan jaringan yang membawa isinya keluar.",
  },
  {
    t: "Dengan akun, yang terkirim sudah terkunci lebih dulu",
    d: "Catatanmu dienkripsi di perangkat ini dengan AES-GCM sebelum menyentuh jaringan. Kuncinya diturunkan dari kata sandimu lewat PBKDF2, dan penurunan itu terjadi di perambanmu — bukan di server.",
  },
  {
    t: "Kata sandimu tidak pernah sampai ke server",
    d: "Yang dikirim saat masuk bukan kata sandimu, melainkan turunan PBKDF2-nya. Server meng-hash lagi nilai itu dengan scrypt sebelum menyimpannya. Dua lapis, dan lapis pertama sudah membuat kata sandi aslinya tidak pernah meninggalkan perangkatmu.",
  },
  {
    t: "Kalau seluruh basis data ini bocor, isinya tidak terbaca",
    d: "Yang tersimpan di kolom brankas adalah teks acak. Tanpa kata sandi pemiliknya, tidak ada yang bisa dikembalikan darinya — termasuk oleh kami. Ini konsekuensi yang kami pilih dengan sadar: kami menukar kemampuan memulihkan akun dengan jaminan bahwa tidak ada yang bisa dibaca.",
  },
  {
    t: "Bacaan tetap dihitung di tempat",
    d: "Halaman bacaan berjalan sepenuhnya di perangkatmu. Pola, sinyal, dan sarannya lahir dari data yang sudah ada di sini, bukan dari analisis di server.",
  },
  {
    t: "Tidak ada pelacak di halaman aplikasi",
    d: "Halaman catat, ritme, bacaan, dan pengaturan bebas dari alat analitik pihak ketiga. Kalau nanti halaman pemasaran memakainya, halaman aplikasi tetap tidak.",
  },
  {
    t: "Menghapus berarti hilang",
    d: "Tombol hapus akun menghapus baris penggunanya, dan brankasnya ikut terhapus karena terikat langsung ke baris itu. Tidak ada masa tunggu, tidak ada arsip.",
  },
  {
    t: "Tidak dijual, tidak melatih model",
    d: "Catatanmu tidak diperjualbelikan dalam bentuk apa pun dan tidak dipakai melatih model siapa pun. Secara teknis kami memang tidak bisa — bentuknya di server tidak terbaca. Tapi ini tetap janji, bukan sekadar akibat.",
  },
  {
    t: "Namanya sengaja samar",
    d: "Cadensa terdengar seperti aplikasi musik atau kebugaran, dan tampilannya tidak memuat gambar apa pun. Ikon alat digambar sebagai garis abstrak, bukan berkas gambar — jadi tidak ada apa pun yang singgah di riwayat unduhan.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="aurora min-h-screen">
      <Nav />
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-12">
        <Reveal>
          <p className="eyebrow">Yang disimpan, dan di mana</p>
          <h1 className="display mt-2.5 text-[3rem]">Privasi</h1>
          <p className="mt-6 max-w-2xl leading-relaxed text-sand-300">
            Data seperti ini termasuk yang paling sensitif yang bisa dimiliki seseorang. Satu
            kebocoran berarti kematian merek yang permanen, dan itulah alasan kebanyakan orang
            tidak mau membangun produk di kategori ini. Cadensa memikulnya dengan cara yang paling
            bisa diperiksa: server memang menyimpan sesuatu, tapi yang disimpannya tidak bisa
            dibaca oleh siapa pun yang menjalankannya.
          </p>
        </Reveal>

        <div className="mt-12 space-y-4">
          {POINTS.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.04}>
              <div className="surface rounded-card p-7">
                <h2 className="display-sm text-xl text-sand-100">{p.t}</h2>
                <p className="mt-3 text-sm leading-relaxed text-sand-300">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 rounded-panel border border-amber-500/25 bg-amber-500/[0.04] p-8">
            <h2 className="display-sm text-xl text-amber-400">Harga dari janji ini</h2>
            <p className="mt-3 text-sm leading-relaxed text-sand-300">
              Karena kunci tidak pernah kami pegang, tidak ada tombol &ldquo;lupa kata sandi&rdquo;
              yang bisa mengembalikan catatanmu. Yang ada adalah kunci pemulihan yang kami tunjukkan
              sekali saat kamu mendaftar. Simpan kunci itu, dan unduh cadangan sesekali lewat{" "}
              <Link href="/pengaturan" className="text-teal-500 underline underline-offset-4">
                halaman pengaturan
              </Link>
              . Kami memilih menyebut kelemahan ini terang-terangan daripada menyembunyikannya di
              balik alur pemulihan yang sebenarnya berarti kami bisa membaca isinya.
            </p>
          </div>
        </Reveal>
      </main>
    </div>
  );
}
