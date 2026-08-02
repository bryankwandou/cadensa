import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Motion";

const POINTS = [
  {
    t: "Catatan tidak pernah dikirim",
    d: "Semua entri disimpan di penyimpanan browser perangkat ini. Cadensa tidak punya endpoint yang menerima isinya, jadi tidak ada server yang bisa kebobolan membawa datamu.",
  },
  {
    t: "Bacaan dihitung di tempat",
    d: "Halaman bacaan berjalan sepenuhnya di perangkatmu. Pola, sinyal, dan sarannya lahir dari data yang tidak pernah berpindah tempat.",
  },
  {
    t: "Tidak ada pelacak di halaman aplikasi",
    d: "Halaman catat, ritme, dan bacaan bebas dari alat analitik pihak ketiga. Kalau nanti halaman pemasaran memakainya, halaman aplikasi tetap tidak.",
  },
  {
    t: "Menghapus berarti hilang",
    d: "Tombol hapus semua di halaman ritme benar-benar menghapus, tanpa alur penahan dan tanpa masa tunggu. Tidak ada salinan di tempat lain yang bisa dipanggil kembali.",
  },
  {
    t: "Tidak dijual, tidak melatih model",
    d: "Catatanmu tidak diperjualbelikan dalam bentuk apa pun dan tidak dipakai melatih model siapa pun. Ini janji permanen, bukan pengaturan yang bisa berubah diam-diam.",
  },
  {
    t: "Namanya sengaja samar",
    d: "Cadensa terdengar seperti aplikasi musik atau kebugaran, dan tampilannya tidak memuat gambar apa pun. Aman terlihat orang lain di kereta.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="aurora min-h-screen">
      <Nav />
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-12">
        <Reveal>
          <h1 className="text-4xl font-semibold tracking-[-0.025em]">Privasi</h1>
          <p className="mt-5 max-w-2xl leading-relaxed text-sand-300">
            Data seperti ini termasuk yang paling sensitif yang bisa dimiliki seseorang. Satu
            kebocoran berarti kematian merek yang permanen, dan itulah alasan kebanyakan orang
            tidak mau membangun produk di kategori ini. Cadensa memilih memikulnya dengan cara
            paling sederhana yang tersedia: tidak menyimpan apa pun di luar perangkatmu.
          </p>
        </Reveal>

        <div className="mt-12 space-y-4">
          {POINTS.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.05}>
              <div className="card rounded-3xl p-7">
                <h2 className="text-lg font-medium text-sand-100">{p.t}</h2>
                <p className="mt-3 text-sm leading-relaxed text-sand-300">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 rounded-3xl border hairline p-7">
            <h2 className="text-lg font-medium">Yang berubah kalau nanti ada akun</h2>
            <p className="mt-3 text-sm leading-relaxed text-sand-300">
              Sinkronisasi antar perangkat akan datang dengan enkripsi di sisi klien: catatan
              dikunci di perangkatmu sebelum dikirim, dan kuncinya diturunkan dari kata sandimu.
              Yang tersimpan di server adalah sesuatu yang, kalau dicuri seluruhnya, tidak
              berarti apa-apa. Enkripsi itu dibangun sejak versi pertama fitur tersebut, bukan
              ditambahkan belakangan.
            </p>
          </div>
        </Reveal>
      </main>
    </div>
  );
}
