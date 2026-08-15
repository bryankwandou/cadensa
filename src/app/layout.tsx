import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { VaultProvider } from "@/lib/vault";
import { I18nProvider, COOKIE_BAHASA } from "@/lib/i18n";
import { bacaBahasa } from "@/lib/terjemah";
import { Skin } from "@/components/Skin";

const sans = Geist({ variable: "--font-sans-var", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono-var", subsets: ["latin"] });

/**
 * Serif dengan sumbu optik. Dipilih, bukan diterima begitu saja: kategori ini
 * penuh sans netral yang membuat semua aplikasi kesehatan terlihat sama, dan
 * kehangatan huruf inilah yang memisahkan Cadensa dari aplikasi kebugaran.
 */
const display = Fraunces({
  variable: "--font-display-var",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  title: "Cadensa — ritme, bukan skor",
  description:
    "Pencatat ritme kesehatan reproduksi pria. Catat dalam belasan detik, lihat kadensmu sebulan, dan baca apa yang tubuhmu tunjukkan. Catatannya tidak pernah meninggalkan perangkatmu.",
  applicationName: "Cadensa",
  icons: { icon: "/logo.svg" },
  openGraph: {
    title: "Cadensa — ritme, bukan skor",
    description:
      "Pencatat ritme kesehatan reproduksi pria, dengan bacaan yang berjalan sepenuhnya di perangkatmu.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#040b0b",
};

/**
 * Bahasa dibaca dari cookie di server, bukan ditebak di klien.
 *
 * Kalau pilihannya baru dibaca setelah React hidup, pengguna Inggris melihat
 * satu halaman penuh berbahasa Indonesia berkedip lebih dulu setiap kali
 * membuka aplikasi — dan `lang` pada `<html>` sempat salah, yang berarti pembaca
 * layar melafalkan halaman Inggris dengan pelafalan Indonesia sampai
 * penggantinya jalan.
 *
 * Membaca cookie membuat seluruh dokumen ini dirender sesuai permintaan.
 * Itu memang harganya, dan halaman ini toh tidak punya isi yang bisa dicache
 * lintas pengguna.
 */
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const bahasa = bacaBahasa((await cookies()).get(COOKIE_BAHASA)?.value);

  return (
    <html lang={bahasa} className={`${sans.variable} ${mono.variable} ${display.variable} h-full`}>
      <body className="min-h-full antialiased">
        <I18nProvider awal={bahasa}>
          <VaultProvider>
            <Skin />
            {children}
          </VaultProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
