import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { VaultProvider } from "@/lib/vault";
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${sans.variable} ${mono.variable} ${display.variable} h-full`}>
      <body className="min-h-full antialiased">
        <VaultProvider>
          <Skin />
          {children}
        </VaultProvider>
      </body>
    </html>
  );
}
