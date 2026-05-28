import type { Metadata, Viewport } from "next";
import { Merriweather, Quicksand } from "next/font/google";
import "./globals.css";

const merriweather = Merriweather({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Helena — Um Aninho de Amor",
  description: "Celebrando o primeiro aniversário da Helena no estilo One Silly Goose.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Helena 1 Ano",
  },
  icons: {
    icon: "/images-person/4.png",
    apple: "/images-person/4.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#8fab87",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  interactiveWidget: "resizes-visual",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${merriweather.variable} ${quicksand.variable}`}
    >
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
