import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const sans = Geist({ variable: "--font-sans-var", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono-var", subsets: ["latin"] });

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
  themeColor: "#06100f",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${sans.variable} ${mono.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
