import type { Metadata } from "next";
import { Archivo, Space_Grotesk } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zekeriya AKBURAK – Développeur Fullstack & IA",
  description:
    "Portfolio de Zekeriya AKBURAK, Développeur Fullstack & IA. Diplômé d'un BUT Informatique, élève ingénieur à l'UTT (Troyes), branche Informatique et Systèmes d'Information.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${archivo.variable} ${spaceGrotesk.variable} font-body bg-bg text-text antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
