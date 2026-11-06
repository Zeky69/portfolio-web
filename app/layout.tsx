import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SmoothScroll from "@/components/fx/SmoothScroll";
import Cursor from "@/components/fx/Cursor";
import { TransitionProvider } from "@/components/fx/PageTransition";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zekeriya Akburak — Développeur Fullstack & IA",
  description:
    "Portfolio de Zekeriya Akburak, développeur Fullstack & IA. Diplômé d'un BUT Informatique, élève ingénieur à l'UTT (Troyes), branche Informatique et Systèmes d'Information.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
  openGraph: {
    title: "Zekeriya Akburak — Développeur Fullstack & IA",
    description:
      "IA locale, temps réel, systèmes : les projets et le parcours de Zekeriya Akburak.",
    url: "https://codeky.fr",
    siteName: "Zekeriya Akburak",
    locale: "fr_FR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={`${geist.variable} ${geistMono.variable} bg-bg font-sans text-text antialiased`}
      >
        <noscript>
          <style>{`.preloader{display:none!important}`}</style>
        </noscript>
        <SmoothScroll />
        <Cursor />
        <TransitionProvider>{children}</TransitionProvider>
      </body>
    </html>
  );
}
