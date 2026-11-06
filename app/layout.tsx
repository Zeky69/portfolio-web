import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import SmoothScroll from "@/components/fx/SmoothScroll";
import Cursor from "@/components/fx/Cursor";
import Stage from "@/components/three/Stage";
import { TransitionProvider } from "@/components/fx/PageTransition";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["wdth", "opsz"],
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zekeriya Akburak — Développeur Fullstack & IA",
  description:
    "Portfolio de Zekeriya Akburak, élève ingénieur à l'UTT (Informatique et Systèmes d'Information). Pastille, 42 Rank, WallChange, IA locale : des projets complets, en ligne et open source.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
  openGraph: {
    title: "Zekeriya Akburak — Développeur Fullstack & IA",
    description: "Des outils qu'on utilise vraiment : apps macOS, sites en production, IA qui tourne en local.",
    url: "https://codeky.fr",
    siteName: "Zekeriya Akburak",
    locale: "fr_FR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0A10",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${serif.variable} ${mono.variable}`}>
      <body className="bg-bg font-sans text-text antialiased">
        <Stage />
        <SmoothScroll />
        <Cursor />
        <TransitionProvider>
          <div className="relative z-10">{children}</div>
        </TransitionProvider>
      </body>
    </html>
  );
}
